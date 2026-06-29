import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
import { triggerWebhooks } from "@/lib/webhook";
export const dynamic = "force-dynamic";
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { const {error} = await requireAdmin(); if(error) return error; const {id} = await params; const b = await req.json(); const u = await db.webhook.update({where:{id},data:{...(b.name!==undefined&&{name:b.name}),...(b.url!==undefined&&{url:b.url}),...(b.events!==undefined&&{events:typeof b.events==="string"?b.events:JSON.stringify(b.events)}),...(b.secret!==undefined&&{secret:b.secret||null}),...(b.isActive!==undefined&&{isActive:b.isActive})}}); return NextResponse.json(u); }
export async function DELETE(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) { const {error} = await requireAdmin(); if(error) return error; const {id} = await params; await db.webhook.delete({where:{id}}); return NextResponse.json({ok:true}); }
export async function POST(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) { const {error} = await requireAdmin(); if(error) return error; const {id} = await params; const w = await db.webhook.findUnique({where:{id}}); if(!w) return NextResponse.json({error:"Not found"},{status:404}); await triggerWebhooks("webhook.test",{message:"Test",webhookId:id}); return NextResponse.json({ok:true}); }
