import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
const VALID = ["EXAM","COLLEGE","SCHOOL","UNIVERSITY","SCHOLARSHIP","POST","BANK","JOB","GOVERNMENT_SERVICE"];
export async function GET() {
  const s = await getSession(); if (!s) return NextResponse.json({error:"Unauthorized"},{status:401});
  const b = await db.bookmark.findMany({where:{userId:s.id},orderBy:{createdAt:"desc"}});
  return NextResponse.json({bookmarks:b});
}
export async function POST(req: NextRequest) {
  const s = await getSession(); if (!s) return NextResponse.json({error:"Auth required"},{status:401});
  const {entity,entityId} = await req.json().catch(()=>({})) as {entity?:string;entityId?:string};
  if (!entity||!entityId) return NextResponse.json({error:"Required"},{status:400});
  if (!VALID.includes(entity)) return NextResponse.json({error:"Invalid"},{status:400});
  try { const b = await db.bookmark.create({data:{userId:s.id,entity,entityId}}); return NextResponse.json({ok:true,bookmark:b}); }
  catch { return NextResponse.json({error:"Already bookmarked"},{status:409}); }
}
export async function DELETE(req: NextRequest) {
  const s = await getSession(); if (!s) return NextResponse.json({error:"Unauthorized"},{status:401});
  const u = new URL(req.url); const e = u.searchParams.get("entity"); const id = u.searchParams.get("entityId");
  if (e&&id) { await db.bookmark.deleteMany({where:{userId:s.id,entity:e,entityId:id}}); return NextResponse.json({ok:true}); }
  return NextResponse.json({error:"Params required"},{status:400});
}
