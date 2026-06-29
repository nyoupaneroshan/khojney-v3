import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const u = new URL(req.url); const f = u.searchParams.get("filter")??"approved"; const s = await getSession();
  if(f==="mine"){if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const i=await db.communityQuestion.findMany({where:{submitterId:s.id},orderBy:{createdAt:"desc"}});return NextResponse.json({items:i});}
  const w = f==="approved"?{status:"APPROVED"}:{status:"PENDING"};
  const i = await db.communityQuestion.findMany({where:w,orderBy:{upvotes:"desc"},take:50,include:{exam:{select:{title:true,slug:true}},category:{select:{name:true}}}});
  return NextResponse.json({items:i});
}
export async function POST(req: NextRequest) {
  const s = await getSession(); if(!s) return NextResponse.json({error:"Login required"},{status:401});
  const {question,optionA,optionB,optionC,optionD,correctAnswer,explanation,examId,categoryId} = await req.json();
  if(!question||!optionA||!optionB||!optionC||!optionD||!correctAnswer) return NextResponse.json({error:"Required"},{status:400});
  if(!["A","B","C","D"].includes(correctAnswer)) return NextResponse.json({error:"Invalid answer"},{status:400});
  const i = await db.communityQuestion.create({data:{question,optionA,optionB,optionC,optionD,correctAnswer,explanation:explanation||null,examId:examId||null,categoryId:categoryId||null,submitterId:s.id,submitterName:s.name??s.email,status:"PENDING"}});
  return NextResponse.json({ok:true,item:i},{status:201});
}
