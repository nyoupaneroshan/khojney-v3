"use client";
type AdFormat = "leaderboard" | "rectangle" | "inline" | "sidebar" | "mobile-banner";
const SIZES: Record<AdFormat,{w:string;h:string;l:string}> = { leaderboard:{w:"728px",h:"90px",l:"728×90"},rectangle:{w:"336px",h:"280px",l:"336×280"},inline:{w:"100%",h:"120px",l:"Responsive"},sidebar:{w:"300px",h:"250px",l:"300×250"},"mobile-banner":{w:"320px",h:"50px",l:"320×50"} };
export function AdZone({ slot, format="inline", className }: { slot:string; format?:AdFormat; className?:string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; const s = SIZES[format];
  if (client && client !== "ca-pub-XXXXXXXXXXXXXXXX") { return <div className={`ad-zone ${className??""}`} data-ad-slot={slot}><ins className="adsbygoogle" style={{display:"block",width:s.w,height:s.h}} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" /></div>; }
  return <div className={`ad-zone ${className??""}`} style={{maxWidth:s.w==="100%"?"100%":s.w,height:s.h,width:"100%"}} data-ad-slot={slot}><div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40"><div className="text-center"><p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">Advertisement</p><p className="text-[9px] text-muted-foreground/40 mt-0.5">{s.l} · {slot}</p></div></div></div>;
}
