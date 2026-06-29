"use client";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { slugify } from "@/lib/admin-utils";
const ICONS = ["FileText","Landmark","Car","GraduationCap","Cog","Stethoscope","HeartPulse","BookOpen","School","Building2","University","Award","Newspaper","Users","Globe","Briefcase"];
const COLORS = ["red","blue","amber","purple","green","rose","pink","cyan","indigo","teal","emerald","orange"];
export function InlineCategoryCreator({ module, onCreated, label="New" }: { module: string; onCreated: (c: { id: string; name: string; slug: string }) => void; label?: string }) {
  const [open, setOpen] = useState(false); const [saving, setSaving] = useState(false);
  const [name, setName] = useState(""); const [slug, setSlug] = useState(""); const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("FileText"); const [color, setColor] = useState("red");
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!name.trim()) { toast.error("Name required."); return; } setSaving(true);
    try { const r = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), slug: slug || slugify(name), description: desc.trim() || null, icon, color, module, order: 0 }) }); if (!r.ok) { const d = await r.json(); throw new Error(d.error ?? "Failed"); } const c = await r.json(); toast.success(`Category "${name}" created!`); setName(""); setSlug(""); setDesc(""); setIcon("FileText"); setColor("red"); onCreated({ id: c.id, name: c.name, slug: c.slug }); setOpen(false); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } finally { setSaving(false); } };
  return (<><Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5 shrink-0"><Plus className="h-3.5 w-3.5" />{label}</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Create New Category</DialogTitle><DialogDescription>Add a new {module.toLowerCase()} category.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label>Name *</Label><Input value={name} onChange={e => { setName(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} required /></div>
        <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={e => setSlug(slugify(e.target.value))} placeholder="auto-generated" /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} /></div>
        <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Icon</Label><Select value={icon} onValueChange={setIcon}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ICONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Color</Label><Select value={color} onValueChange={setColor}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div></div>
        <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Create"}</Button></DialogFooter>
      </form></DialogContent></Dialog>
  </>);
}
