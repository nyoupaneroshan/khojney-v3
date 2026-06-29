import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
export const dynamic = "force-dynamic";
export async function GET() { const {error} = await requireAdmin(); if(error) return error; const w = await db.webhook.findMany({orderBy:{createdAt:"desc"},include:{_count:{select:{logs:true}}}}); return NextResponse.json({items:w}); }
export async function POST(req: NextRequest) { const {error} = await requireAdmin(); if(error) return error; const b = await req.json(); if(!b.name||!b.url||!b.events) return NextResponse.json({error:"Required"},{status:400}); const w = await db.webhook.create({data:{name:b.name,url:b.url,events:typeof b.events==="string"?b.events:JSON.stringify(b.events),secret:b.secret||null,isActive:b.isActive!==false}}); return NextResponse.json(w,{status:201}); }
