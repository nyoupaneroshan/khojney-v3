import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const u = new URL(req.url); const e = u.searchParams.get("entity"); const id = u.searchParams.get("entityId");
  if(!e||!id) return NextResponse.json({error:"Required"},{status:400});
  const comments = await db.comment.findMany({where:{entity:e,entityId:id,isHidden:false,parentId:null},orderBy:[{isPinned:"desc"},{upvotes:"desc"},{createdAt:"desc"}],include:{user:{select:{name:true,image:true}},replies:{where:{isHidden:false},orderBy:{createdAt:"asc"},include:{user:{select:{name:true,image:true}}}}}});
  return NextResponse.json({comments});
}
export async function POST(req: NextRequest) {
  const s = await getSession(); if(!s) return NextResponse.json({error:"Login required"},{status:401});
  const {entity,entityId,content,parentId} = await req.json();
  if(!entity||!entityId||!content?.trim()) return NextResponse.json({error:"Required"},{status:400});
  if(content.trim().length>2000) return NextResponse.json({error:"Too long"},{status:400});
  const c = await db.comment.create({data:{entity,entityId,content:content.trim(),userId:s.id,parentId:parentId||null},include:{user:{select:{name:true,image:true}}}});
  return NextResponse.json({ok:true,comment:c},{status:201});
}
export async function DELETE(req: NextRequest) {
  const s = await getSession(); if(!s) return NextResponse.json({error:"Unauthorized"},{status:401});
  const u = new URL(req.url); const id = u.searchParams.get("id"); if(!id) return NextResponse.json({error:"id required"},{status:400});
  const c = await db.comment.findUnique({where:{id}}); if(!c) return NextResponse.json({error:"Not found"},{status:404});
  if(c.userId!==s.id&&s.role!=="ADMIN"&&s.role!=="SUPER_ADMIN") return NextResponse.json({error:"Forbidden"},{status:403});
  await db.comment.delete({where:{id}}); return NextResponse.json({ok:true});
}
