import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
export const dynamic = "force-dynamic";
export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) { const {error} = await requireAdmin(); if(error) return error; const {id} = await params; const s = await db.aiChatSession.findUnique({where:{id},include:{user:{select:{name:true,email:true}},messages:{orderBy:{createdAt:"asc"}}}}); if(!s) return NextResponse.json({error:"Not found"},{status:404}); return NextResponse.json(s); }
export async function DELETE(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) { const {error} = await requireAdmin(); if(error) return error; const {id} = await params; await db.aiChatSession.delete({where:{id}}); return NextResponse.json({ok:true}); }
