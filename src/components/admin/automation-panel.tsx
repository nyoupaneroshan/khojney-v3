"use client";
import { useState } from "react";
import { Plus, Trash2, Send, Zap, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface WL { id:string;event:string;success:boolean;statusCode:number|null;createdAt:string; }
interface WH { id:string;name:string;url:string;events:string;secret:string|null;isActive:boolean;lastTriggered:string|null;lastStatus:string|null;triggerCount:number;_count:{logs:number};logs:WL[]; }
const EVENTS = [{v:"exam.completed",l:"Exam Completed"},{v:"user.registered",l:"User Registered"},{v:"blog.published",l:"Blog Published"},{v:"college.created",l:"College Created"},{v:"bank.created",l:"Bank Created"},{v:"job.created",l:"Job Created"},{v:"review.submitted",l:"Review Submitted"},{v:"bookmark.created",l:"Bookmark Created"},{v:"contact.submitted",l:"Contact Submitted"},{v:"guest_post.submitted",l:"Guest Post Submitted"},{v:"community_question.submitted",l:"Question Submitted"}];
export function AutomationPanel({ webhooks: initial }: { webhooks: WH[] }) {
  const [wh, setWh] = useState(initial); const [show, setShow] = useState(false); const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string|null>(null); const [name, setName] = useState(""); const [url, setUrl] = useState(""); const [secret, setSecret] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const toggle = (e:string)=>setEvents(p=>p.includes(e)?p.filter(x=>x!==e):[...p,e]);
  const create = async (e:React.FormEvent) => { e.preventDefault(); if(!name||!url||!events.length){toast.error("All required");return;} setSaving(true);
    try{const r=await fetch("/api/admin/webhooks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,url,events:JSON.stringify(events),secret:secret||undefined,isActive:true})});
      if(!r.ok) throw new Error(); const c=await r.json(); setWh(p=>[{...c,_count:{logs:0},logs:[]},...p]); toast.success("Created!"); setName("");setUrl("");setSecret("");setEvents([]);setShow(false);
    }catch{toast.error("Failed");}finally{setSaving(false);} };
  const del = async (id:string)=>{if(!confirm("Delete?"))return;try{await fetch(`/api/admin/webhooks/${id}`,{method:"DELETE"});setWh(p=>p.filter(w=>w.id!==id));toast.success("Deleted");}catch{}};
  const toggleActive = async (id:string,a:boolean)=>{try{await fetch(`/api/admin/webhooks/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({isActive:!a})});setWh(p=>p.map(w=>w.id===id?{...w,isActive:!a}:w));}catch{}};
  const test = async (id:string)=>{setTesting(id);try{await fetch(`/api/admin/webhooks/${id}`,{method:"POST"});toast.success("Test fired!");setTimeout(async()=>{const r=await fetch("/api/admin/webhooks").then(r=>r.json());if(r.items)setWh(r.items);},2000);}catch{toast.error("Failed");}finally{setTesting(null);}};
  return (<div className="space-y-6">
    <Card className="border-primary/20 bg-primary/5"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Zap className="h-5 w-5 text-primary" />n8n Integration</CardTitle><CardDescription>Connect Khojney to n8n for automation.</CardDescription></CardHeader><CardContent>
      <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">{`{ "event":"exam.completed", "timestamp":"...", "data":{...} }`}</pre>
    </CardContent></Card>
    {!show&&<Button onClick={()=>setShow(true)}><Plus className="h-4 w-4 mr-2" />Add Webhook</Button>}
    {show&&<Card><CardHeader><CardTitle className="text-lg">New Webhook</CardTitle></CardHeader><CardContent>
      <form onSubmit={create} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={e=>setName(e.target.value)} required /></div><div className="space-y-2"><Label>URL *</Label><Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." required /></div></div>
        <div className="space-y-2"><Label>Secret</Label><Input value={secret} onChange={e=>setSecret(e.target.value)} /></div>
        <div className="space-y-2"><Label>Events *</Label><div className="grid gap-2 sm:grid-cols-3">{EVENTS.map(ev=>(<label key={ev.v} className={cn("flex items-center gap-2 rounded-lg border p-2 cursor-pointer",events.includes(ev.v)&&"border-primary bg-primary/5")}><Checkbox checked={events.includes(ev.v)} onCheckedChange={()=>toggle(ev.v)} /><span className="text-xs">{ev.l}</span></label>))}</div></div>
        <div className="flex gap-2"><Button type="submit" disabled={saving}>{saving?<Loader2 className="h-4 w-4 animate-spin mr-2" />:"Create"}</Button><Button type="button" variant="outline" onClick={()=>setShow(false)}>Cancel</Button></div>
      </form>
    </CardContent></Card>}
    {wh.length===0&&!show?<Card className="border-dashed"><CardContent className="py-8 text-center text-sm text-muted-foreground">No webhooks yet.</CardContent></Card>:
      <div className="space-y-3">{wh.map(w=>(<Card key={w.id}><CardContent className="py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="font-medium text-sm">{w.name}</span><Badge variant={w.isActive?"secondary":"outline"} className="text-[10px]">{w.isActive?"Active":"Disabled"}</Badge>{w.lastStatus==="success"&&<CheckCircle2 className="h-3 w-3 text-emerald-500"/>}{w.lastStatus==="failed"&&<XCircle className="h-3 w-3 text-red-500"/>}</div>
          <code className="text-[10px] text-muted-foreground truncate block">{w.url}</code></div>
          <div className="flex gap-1 shrink-0"><Button size="sm" variant="ghost" onClick={()=>test(w.id)} disabled={testing===w.id}>{testing===w.id?<Loader2 className="h-3 w-3 animate-spin"/>:<Send className="h-3 w-3"/>}</Button><Button size="sm" variant="ghost" onClick={()=>toggleActive(w.id,w.isActive)}>{w.isActive?"Off":"On"}</Button><Button size="sm" variant="ghost" className="text-destructive" onClick={()=>del(w.id)}><Trash2 className="h-3 w-3"/></Button></div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">{(()=>{try{return JSON.parse(w.events).map((e:string)=><Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>)}catch{return null}})()}</div>
        <div className="text-[10px] text-muted-foreground mt-1">Triggered: {w.triggerCount} · Logs: {w._count.logs}</div>
      </CardContent></Card>))}</div>}
  </div>);
}
