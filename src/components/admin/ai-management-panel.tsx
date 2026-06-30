"use client";
import { useState } from "react";
import { MessageSquare, Users, UserCheck, UserX, Clock, Trash2, Eye, Search, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface Stats { totalSessions:number;totalMessages:number;todaySessions:number;todayMessages:number;registeredUserSessions:number;anonymousSessions:number; }
interface LM { role:string;content:string;createdAt:string; }
interface SI { id:string;title:string;sessionUuid:string;messageCount:number;createdAt:string;updatedAt:string;userId:string|null;userName:string|null;userEmail:string|null;lastMessages:LM[]; }
export function AiManagementPanel({ stats, recentSessions, topQuestions }: { stats:Stats; recentSessions:SI[]; topQuestions:{question:string;count:number}[] }) {
  const [sessions,setSessions]=useState(recentSessions); const [search,setSearch]=useState("");
  const [sel,setSel]=useState<SI|null>(null); const [conv,setConv]=useState<{role:string;content:string;createdAt:string}[]|null>(null);
  const [loading,setLoading]=useState(false); const [deleting,setDeleting]=useState<string|null>(null);
  const filtered=sessions.filter(s=>!search||s.title.toLowerCase().includes(search.toLowerCase())||s.userName?.toLowerCase().includes(search.toLowerCase()));
  const view=async(s:SI)=>{setSel(s);setConv(null);setLoading(true);try{const r=await fetch(`/api/admin/ai-chat/${s.id}`);if(!r.ok)throw new Error();const d=await r.json();setConv(d.messages.map((m:any)=>({role:m.role,content:m.content,createdAt:m.createdAt})));}catch{toast.error("Failed");}finally{setLoading(false);}};
  const del=async(id:string)=>{if(!confirm("Delete?"))return;setDeleting(id);try{await fetch(`/api/admin/ai-chat/${id}`,{method:"DELETE"});setSessions(p=>p.filter(s=>s.id!==id));toast.success("Deleted");}catch{toast.error("Failed");}finally{setDeleting(null);}};
  const cards=[{i:MessageSquare,c:"bg-blue-50 text-blue-600",v:stats.totalMessages,l:"Messages"},{i:Users,c:"bg-emerald-50 text-emerald-600",v:stats.totalSessions,l:"Sessions"},{i:Clock,c:"bg-amber-50 text-amber-600",v:stats.todayMessages,l:"Today"},{i:UserCheck,c:"bg-purple-50 text-purple-600",v:stats.registeredUserSessions,l:"Users"},{i:UserX,c:"bg-gray-50 text-gray-600",v:stats.anonymousSessions,l:"Anonymous"},{i:Clock,c:"bg-red-50 text-red-600",v:stats.todaySessions,l:"New Today"}];
  return (<div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{cards.map((s,i)=>{const I=s.i;return<Card key={i}><CardContent className="pt-4"><div className="flex items-center gap-2"><div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.c}`}><I className="h-4 w-4"/></div><div><div className="text-lg font-bold">{s.v}</div><div className="text-[10px] text-muted-foreground">{s.l}</div></div></div></CardContent></Card>})}</div>
    {topQuestions.length>0&&<Card><CardContent className="pt-4"><h3 className="text-sm font-semibold mb-2 flex items-center gap-1"><TrendingUp className="h-4 w-4 text-primary"/>Top Questions</h3><div className="space-y-1">{topQuestions.map((q,i)=><div key={i} className="flex items-center justify-between text-xs border rounded p-2"><span className="truncate">{q.question}</span><Badge variant="secondary" className="text-[10px]">{q.count}×</Badge></div>)}</div></CardContent></Card>}
    <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-10"/></div><Badge variant="outline">{filtered.length}</Badge></div>
    {filtered.length===0?<Card className="border-dashed"><CardContent className="py-8 text-center text-sm text-muted-foreground">No conversations yet.</CardContent></Card>:
      <div className="space-y-2">{filtered.map(s=><Card key={s.id} className="hover:shadow-sm"><CardContent className="py-3">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1 cursor-pointer" onClick={()=>view(s)}>
          <div className="flex items-center gap-2"><span className="font-medium text-sm truncate">{s.title}</span>{s.userId?<Badge variant="secondary" className="text-[10px]">{s.userName}</Badge>:<Badge variant="outline" className="text-[10px]">Anonymous</Badge>}</div>
          {s.lastMessages[0]&&<p className="text-xs text-muted-foreground truncate mt-1"><b>{s.lastMessages[0].role==="user"?"User":"AI"}:</b> {s.lastMessages[0].content}</p>}
          <div className="text-[10px] text-muted-foreground mt-1">{s.messageCount} msgs · {new Date(s.updatedAt).toLocaleString()}</div>
        </div><div className="flex gap-1 shrink-0"><Button size="sm" variant="ghost" onClick={()=>view(s)}><Eye className="h-3.5 w-3.5"/></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={()=>del(s.id)} disabled={deleting===s.id}>{deleting===s.id?<Loader2 className="h-3.5 w-3.5 animate-spin"/>:<Trash2 className="h-3.5 w-3.5"/>}</Button></div></div>
      </CardContent></Card>)}</div>}
    <Dialog open={!!sel} onOpenChange={o=>{if(!o){setSel(null);setConv(null);}}}><DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"><DialogHeader><DialogTitle className="text-base">{sel?.title}</DialogTitle><DialogDescription>{sel?.userName??"Anonymous"} · {sel?.messageCount} messages</DialogDescription></DialogHeader>
      <div className="flex-1 overflow-y-auto space-y-2 p-1">{loading&&<div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/></div>}
        {conv?.map((m,i)=><div key={i} className={cn("flex gap-2 rounded-lg p-2",m.role==="user"?"bg-primary/5 ml-8":"bg-muted mr-8")}><div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",m.role==="user"?"bg-primary text-primary-foreground":"bg-muted-foreground text-white")}>{m.role==="user"?"U":"AI"}</div><div className="min-w-0 flex-1"><p className="text-xs whitespace-pre-wrap">{m.content}</p><p className="text-[9px] text-muted-foreground mt-0.5">{new Date(m.createdAt).toLocaleTimeString()}</p></div></div>)}
      </div></DialogContent></Dialog>
  </div>);
}
