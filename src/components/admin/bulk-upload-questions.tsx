"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle2, AlertTriangle, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface ExamOption { id: string; title: string; slug: string; }
interface ParsedQuestion { question: string; options: string[]; correctIdx: number; explanation?: string; marks?: number; }
const SAMPLE_CSV = `question,optionA,optionB,optionC,optionD,correctAnswer,explanation,marks
"What is the capital of Nepal?","Pokhara","Kathmandu","Lalitpur","Biratnagar","B","Kathmandu is the capital",1
"How many provinces?","5","6","7","8","C","Nepal has 7 provinces",1`;
export function BulkUploadQuestions({ groupedExams }: { groupedExams: Record<string, ExamOption[]> }) {
  const [examId, setExamId] = useState(""); const [content, setContent] = useState(""); const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]); const [err, setErr] = useState<string|null>(null);
  const [strategy, setStrategy] = useState<"skip"|"replace"|"add_all">("skip"); const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null); const fileRef = useRef<HTMLInputElement>(null);
  const parseCsv = (csv: string) => {
    try { const lines = csv.trim().split("\n"); if(lines.length<2){setErr("Need header + 1 row");setParsed([]);return;}
      const h = lines[0].split(",").map(x=>x.trim().toLowerCase().replace(/"/g,""));
      const qi=h.indexOf("question");const aI=h.findIndex(x=>x.match(/option[_a]?a/i));const bI=h.findIndex(x=>x.match(/option[_a]?b/i));
      const cI=h.findIndex(x=>x.match(/option[_a]?c/i));const dI=h.findIndex(x=>x.match(/option[_a]?d/i));
      const ci=h.findIndex(x=>x.match(/correct/i));const ei=h.findIndex(x=>x.match(/explain/i));const mi=h.indexOf("marks");
      if(qi<0||aI<0||bI<0||cI<0||dI<0||ci<0){setErr("Missing columns");setParsed([]);return;}
      const qs:ParsedQuestion[]=[];
      for(let i=1;i<lines.length;i++){if(!lines[i].trim())continue;const c=lines[i].split(",").map(x=>x.trim().replace(/^"|"$/g,""));
        const ans=c[ci].toUpperCase();const idx=ans==="A"?0:ans==="B"?1:ans==="C"?2:ans==="D"?3:parseInt(ans)-1;
        if(isNaN(idx)||idx<0||idx>3){setErr(`Row ${i}: answer A-D`);setParsed([]);return;}
        qs.push({question:c[qi],options:[c[aI],c[bI],c[cI],c[dI]],correctIdx:idx,explanation:ei>=0?c[ei]:undefined,marks:mi>=0?parseInt(c[mi])||1:1});}
      setParsed(qs);setErr(null);toast.success(`Parsed ${qs.length} questions`);
    } catch { setErr("Parse failed"); setParsed([]); }
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => { const f=e.target.files?.[0]; if(!f)return; setFileName(f.name); setResult(null);
    const r=new FileReader(); r.onload=(ev)=>{const c=ev.target?.result as string;setContent(c);if(f.name.endsWith(".json")){try{setParsed(JSON.parse(c));setErr(null);toast.success("JSON parsed");}catch{setErr("Invalid JSON");}}else parseCsv(c);}; r.readAsText(f); };
  const upload = async () => { if(!examId){toast.error("Select exam");return;} if(!parsed.length){toast.error("No questions");return;}
    setUploading(true); try{const r=await fetch("/api/admin/bulk-upload-questions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({examId,questions:parsed,duplicateStrategy:strategy})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error); setResult(d); toast.success(`Added:${d.summary.added} Replaced:${d.summary.replaced} Skipped:${d.summary.skipped}`);
    } catch(e){toast.error(e instanceof Error?e.message:"Failed");} finally{setUploading(false);} };
  const dl = () => { const b=new Blob([SAMPLE_CSV],{type:"text/csv"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download="khojney-template.csv"; a.click(); URL.revokeObjectURL(u); };
  return (<div className="space-y-6">
    <Card><CardHeader><CardTitle className="text-lg">Step 1: Select Exam</CardTitle></CardHeader><CardContent>
      <Select value={examId} onValueChange={setExamId}><SelectTrigger><SelectValue placeholder="Select exam..." /></SelectTrigger><SelectContent>
        {Object.entries(groupedExams).map(([p,exams])=>(<SelectGroup key={p}><SelectLabel>{p}</SelectLabel>{exams.map(e=><SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}</SelectGroup>))}
      </SelectContent></Select>
    </CardContent></Card>
    <Card><CardHeader><CardTitle className="text-lg">Step 2: Upload</CardTitle></CardHeader><CardContent className="space-y-4">
      <Button variant="outline" size="sm" onClick={dl}><Download className="h-4 w-4 mr-2" />Download Template</Button>
      <div className="flex items-center gap-3"><input ref={fileRef} type="file" accept=".csv,.json" onChange={handleFile} className="hidden" /><Button variant="outline" onClick={()=>fileRef.current?.click()}><Upload className="h-4 w-4 mr-2" />Choose File</Button>{fileName&&<span className="text-sm text-muted-foreground">{fileName}</span>}</div>
      <div className="space-y-2"><Label>Or paste CSV:</Label><Textarea value={content} onChange={e=>{setContent(e.target.value);setResult(null);}} placeholder="Paste CSV..." rows={5} className="font-mono text-xs" /></div>
      {err&&<div className="flex items-center gap-2 text-sm text-destructive"><AlertTriangle className="h-4 w-4" />{err}</div>}
      {parsed.length>0&&<div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-sm font-medium">{parsed.length} parsed</span></div>}
    </CardContent></Card>
    {parsed.length>0&&(<Card><CardHeader><CardTitle className="text-lg">Step 3: Duplicates</CardTitle></CardHeader><CardContent>
      <RadioGroup value={strategy} onValueChange={(v)=>setStrategy(v as any)} className="space-y-2">
        {[{v:"skip",l:"Skip duplicates"},{v:"replace",l:"Replace"},{v:"add_all",l:"Add all"}].map(o=>(
          <label key={o.v} className={cn("flex items-center gap-3 rounded-lg border p-3 cursor-pointer",strategy===o.v&&"border-primary bg-primary/5")}><RadioGroupItem value={o.v} /><span className="text-sm">{o.l}</span></label>
        ))}
      </RadioGroup>
    </CardContent></Card>)}
    {parsed.length>0&&examId&&(<Card><CardContent className="py-4 flex items-center justify-between">
      <p className="text-sm">Upload <strong>{parsed.length}</strong> questions</p>
      <Button onClick={upload} disabled={uploading}>{uploading?<Loader2 className="h-4 w-4 animate-spin mr-2" />:""}Upload</Button>
    </CardContent></Card>)}
    {result&&(<Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" />Complete</CardTitle></CardHeader><CardContent>
      <div className="grid grid-cols-4 gap-3">{[{l:"Added",v:result.summary.added,c:"emerald"},{l:"Replaced",v:result.summary.replaced,c:"amber"},{l:"Skipped",v:result.summary.skipped,c:"blue"},{l:"Total",v:result.summary.total,c:"gray"}].map(s=>(<div key={s.l} className="rounded-lg border p-3 text-center"><div className="text-xl font-bold">{s.v}</div><div className="text-xs">{s.l}</div></div>))}</div>
    </CardContent></Card>)}
  </div>);
}
