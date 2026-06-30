"use client";
import { useState } from "react";
import { PenLine, HelpCircle, MessageSquare, TrendingUp, Loader2, Send, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
export function CommunityHub({ isLoggedIn, userName }: { isLoggedIn: boolean; userName: string | null }) {
  return (<div className="container-app py-8 md:py-12">
    <div className="text-center mb-8"><h1 className="text-2xl md:text-3xl font-bold tracking-tight">Khojney <span className="text-gradient-red">Community</span></h1><p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">Contribute knowledge, help students, build Nepal's largest education community.</p></div>
    <div className="grid gap-3 sm:grid-cols-3 mb-8"><Card className="text-center"><CardContent className="pt-4"><PenLine className="h-7 w-7 text-primary mx-auto mb-1"/><h3 className="font-semibold text-sm">Guest Blogs</h3><p className="text-xs text-muted-foreground">Share your expertise</p></CardContent></Card><Card className="text-center"><CardContent className="pt-4"><HelpCircle className="h-7 w-7 text-primary mx-auto mb-1"/><h3 className="font-semibold text-sm">Suggest Questions</h3><p className="text-xs text-muted-foreground">Help others practice</p></CardContent></Card><Card className="text-center"><CardContent className="pt-4"><MessageSquare className="h-7 w-7 text-primary mx-auto mb-1"/><h3 className="font-semibold text-sm">Discussions</h3><p className="text-xs text-muted-foreground">Comment on exams</p></CardContent></Card></div>
    <Tabs defaultValue="guest-post"><TabsList className="w-full justify-start"><TabsTrigger value="guest-post" className="gap-1.5 text-xs"><PenLine className="h-3.5 w-3.5"/>Guest Blog</TabsTrigger><TabsTrigger value="question" className="gap-1.5 text-xs"><HelpCircle className="h-3.5 w-3.5"/>Submit Question</TabsTrigger><TabsTrigger value="mine" className="gap-1.5 text-xs"><TrendingUp className="h-3.5 w-3.5"/>My Submissions</TabsTrigger></TabsList>
      <TabsContent value="guest-post" className="mt-4"><GuestPostForm isLoggedIn={isLoggedIn}/></TabsContent>
      <TabsContent value="question" className="mt-4"><QuestionForm isLoggedIn={isLoggedIn}/></TabsContent>
      <TabsContent value="mine" className="mt-4"><MySubmissions isLoggedIn={isLoggedIn}/></TabsContent>
    </Tabs>
  </div>);
}
function LoginPrompt({m}:{m:string}){return<Card className="border-dashed"><CardContent className="py-8 text-center text-sm text-muted-foreground">Please <a href="/login" className="text-primary underline">{m}</a>.</CardContent></Card>}
function GuestPostForm({isLoggedIn}:{isLoggedIn:boolean}){const[t,setT]=useState("");const[c,setC]=useState("");const[saving,setSaving]=useState(false);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!t||c.length<200){toast.error("Title + 200 chars min");return;}setSaving(true);try{const r=await fetch("/api/community/guest-posts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:t,content:c})});if(!r.ok)throw new Error();toast.success("Submitted for review!");setT("");setC("");}catch{toast.error("Failed");}finally{setSaving(false);}};
  if(!isLoggedIn)return<LoginPrompt m="log in to submit a guest post"/>;
  return<Card><CardHeader><CardTitle className="text-base">Submit Guest Blog</CardTitle><CardDescription className="text-xs">Write an article. Admin will review.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-3"><div className="space-y-1"><Label>Title *</Label><Input value={t} onChange={e=>setT(e.target.value)} required/></div><div className="space-y-1"><Label>Content * ({c.length} chars, min 200)</Label><Textarea value={c} onChange={e=>setC(e.target.value)} rows={10} className="font-mono text-sm"/></div><Button type="submit" disabled={saving}>{saving?<Loader2 className="h-4 w-4 animate-spin mr-2"/>:""}Submit</Button></form></CardContent></Card>;
}
function QuestionForm({isLoggedIn}:{isLoggedIn:boolean}){const[q,setQ]=useState("");const[opts,setOpts]=useState(["","","",""]);const[correct,setCorrect]=useState("A");const[expl,setExpl]=useState("");const[saving,setSaving]=useState(false);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!q||opts.some(o=>!o.trim())){toast.error("All required");return;}setSaving(true);try{const r=await fetch("/api/community/questions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q,optionA:opts[0],optionB:opts[1],optionC:opts[2],optionD:opts[3],correctAnswer:correct,explanation:expl})});if(!r.ok)throw new Error();toast.success("Submitted!");setQ("");setOpts(["","","",""]);setExpl("");}catch{toast.error("Failed");}finally{setSaving(false);}};
  if(!isLoggedIn)return<LoginPrompt m="log in to submit a question"/>;
  return<Card><CardHeader><CardTitle className="text-base">Suggest Question</CardTitle><CardDescription className="text-xs">Submit MCQ. Admin may add to exams.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-3"><div className="space-y-1"><Label>Question *</Label><Textarea value={q} onChange={e=>setQ(e.target.value)} rows={2} required/></div>
    {opts.map((o,i)=>(<div key={i} className="flex items-center gap-2"><button type="button" onClick={()=>setCorrect(["A","B","C","D"][i])} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${correct===["A","B","C","D"][i]?"border-primary bg-primary text-primary-foreground":"border-border"}`}>{["A","B","C","D"][i]}</button><Input value={o} onChange={e=>setOpts(p=>p.map((x,j)=>j===i?e.target.value:x))} required/></div>))}
    <div className="space-y-1"><Label>Explanation</Label><Textarea value={expl} onChange={e=>setExpl(e.target.value)} rows={2}/></div><Button type="submit" disabled={saving}>{saving?<Loader2 className="h-4 w-4 animate-spin mr-2"/>:""}Submit</Button></form></CardContent></Card>;
}
function MySubmissions({isLoggedIn}:{isLoggedIn:boolean}){const[posts,setPosts]=useState<any[]|null>(null);const[qs,setQs]=useState<any[]|null>(null);
  useState(()=>{if(!isLoggedIn)return;fetch("/api/community/guest-posts?status=mine").then(r=>r.json()).then(d=>setPosts(d.items??[])).catch(()=>setPosts([]));fetch("/api/community/questions?filter=mine").then(r=>r.json()).then(d=>setQs(d.items??[])).catch(()=>setQs([]));});
  if(!isLoggedIn)return<LoginPrompt m="log in to view submissions"/>;
  const badge=(s:string)=>s==="PENDING"?<Badge variant="outline" className="text-[10px]"><Clock className="h-2.5 w-2.5"/>Pending</Badge>:s==="APPROVED"||s==="PUBLISHED"?<Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-2.5 w-2.5"/>{s}</Badge>:<Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700"><XCircle className="h-2.5 w-2.5"/>Rejected</Badge>;
  return<div className="space-y-4"><Card><CardHeader><CardTitle className="text-sm">My Guest Posts</CardTitle></CardHeader><CardContent>{posts===null?<Loader2 className="h-4 w-4 animate-spin"/>:posts.length===0?<p className="text-xs text-muted-foreground">None yet.</p>:<div className="space-y-1">{posts.map(p=><div key={p.id} className="flex items-center justify-between border rounded p-2"><span className="text-xs truncate">{p.title}</span>{badge(p.status)}</div>)}</div>}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-sm">My Questions</CardTitle></CardHeader><CardContent>{qs===null?<Loader2 className="h-4 w-4 animate-spin"/>:qs.length===0?<p className="text-xs text-muted-foreground">None yet.</p>:<div className="space-y-1">{qs.map(q=><div key={q.id} className="flex items-center justify-between border rounded p-2"><span className="text-xs truncate">{q.question}</span>{badge(q.status)}</div>)}</div>}</CardContent></Card></div>;
}
