import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const {error} = await requireAdmin(); if(error) return error;
  const {examId,questions,duplicateStrategy} = await req.json();
  if(!examId||!Array.isArray(questions)||!questions.length) return NextResponse.json({error:"Required"},{status:400});
  if(!["skip","replace","add_all"].includes(duplicateStrategy)) return NextResponse.json({error:"Invalid strategy"},{status:400});
  const exam = await db.exam.findUnique({where:{id:examId}}); if(!exam) return NextResponse.json({error:"Exam not found"},{status:404});
  for(let i=0;i<questions.length;i++){const q=questions[i];if(!q.question||q.question.trim().length<5)return NextResponse.json({error:`Row ${i+1}: Question too short`},{status:400});if(!Array.isArray(q.options)||q.options.length!==4)return NextResponse.json({error:`Row ${i+1}: Need 4 options`},{status:400});if(q.correctIdx===undefined||q.correctIdx<0||q.correctIdx>3)return NextResponse.json({error:`Row ${i+1}: correctIdx 0-3`},{status:400});}
  const existing = await db.examQuestion.findMany({where:{examId},select:{id:true,question:true,order:true},orderBy:{order:"desc"}});
  const exMap = new Map(existing.map(e=>[e.question.trim().toLowerCase(),{id:e.id,order:e.order}]));
  let next = existing.length>0?existing[0].order+1:0; let added=0,replaced=0,skipped=0;
  for(const q of questions){const dup=exMap.get(q.question.trim().toLowerCase());if(dup&&duplicateStrategy==="skip"){skipped++;continue;}if(dup&&duplicateStrategy==="replace"){await db.examQuestion.delete({where:{id:dup.id}});await db.examQuestion.create({data:{examId,type:"MCQ",question:q.question.trim(),options:JSON.stringify(q.options.map((o:string)=>o.trim())),correctIdx:q.correctIdx,explanation:q.explanation?.trim()||null,marks:q.marks??1,order:dup.order}});replaced++;continue;}await db.examQuestion.create({data:{examId,type:"MCQ",question:q.question.trim(),options:JSON.stringify(q.options.map((o:string)=>o.trim())),correctIdx:q.correctIdx,explanation:q.explanation?.trim()||null,marks:q.marks??1,order:next++}});added++;}
  const cnt = await db.examQuestion.count({where:{examId}}); await db.exam.update({where:{id:examId},data:{totalMarks:cnt}});
  return NextResponse.json({ok:true,summary:{added,replaced,skipped,total:questions.length}});
}
export async function GET() { const {error} = await requireAdmin(); if(error) return error; return NextResponse.json({csvTemplate:"question,optionA,optionB,optionC,optionD,correctAnswer,explanation,marks\n\"Test?\",\"A\",\"B\",\"C\",\"D\",\"B\",\"Explain\",1"}); }
