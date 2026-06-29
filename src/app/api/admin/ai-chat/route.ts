import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/app/api/admin/_lib/require-admin";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) { const {error} = await requireAdmin(); if(error) return error; const u = new URL(req.url); const s = u.searchParams.get("search")??""; const where = s?{OR:[{title:{contains:s}},{user:{email:{contains:s}}},{user:{name:{contains:s}}}]}:{}; const [total,items] = await Promise.all([db.aiChatSession.count({where}), db.aiChatSession.findMany({where,orderBy:{updatedAt:"desc"},take:50,include:{user:{select:{name:true,email:true}},_count:{select:{messages:true}},messages:{orderBy:{createdAt:"desc"},take:2,select:{content:true,role:true,createdAt:true}}}})]); return NextResponse.json({items,total}); }
