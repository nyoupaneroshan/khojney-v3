import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const u = new URL(req.url); const status = u.searchParams.get("status")??"PUBLISHED";
  if(status==="mine"){const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const p=await db.guestPost.findMany({where:{authorId:s.id},orderBy:{createdAt:"desc"}});return NextResponse.json({items:p});}
  const w = status==="all"?{}:{status}; const p = await db.guestPost.findMany({where:w,orderBy:{createdAt:"desc"},include:{category:true}}); return NextResponse.json({items:p});
}
export async function POST(req: NextRequest) {
  const s = await getSession(); if(!s) return NextResponse.json({error:"Login required"},{status:401});
  const {title,excerpt,content,coverImage,categoryId} = await req.json();
  if(!title||!content) return NextResponse.json({error:"Required"},{status:400});
  if(content.length<200) return NextResponse.json({error:"Min 200 chars"},{status:400});
  const slugify=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  let slug=slugify(title); const ex=await db.guestPost.findUnique({where:{slug}}); if(ex) slug=`${slug}-${Date.now().toString(36)}`;
  const p = await db.guestPost.create({data:{title,slug,excerpt:excerpt||content.slice(0,150),content,coverImage:coverImage||null,categoryId:categoryId||null,authorId:s.id,authorName:s.name??s.email,status:"PENDING"}});
  return NextResponse.json({ok:true,post:p},{status:201});
}
