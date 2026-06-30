import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
export const dynamic = "force-dynamic";
export async function POST(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession(); if(!s) return NextResponse.json({error:"Login required"},{status:401});
  const {id} = await params; const c = await db.comment.findUnique({where:{id},select:{id:true,upvotes:true}});
  if(!c) return NextResponse.json({error:"Not found"},{status:404});
  const u = await db.comment.update({where:{id},data:{upvotes:{increment:1}},select:{id:true,upvotes:true}});
  return NextResponse.json({ok:true,upvotes:u.upvotes});
}
