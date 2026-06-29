import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function SEOAdminPage() {
  const te = await db.exam.count({where:{isPublished:true,parentId:null}});
  const ets = await db.exam.count({where:{isPublished:true,parentId:null,seoTitle:{not:null}}}).catch(()=>0);
  const etc = await db.exam.count({where:{isPublished:true,parentId:null,seoContent:{not:null}}}).catch(()=>0);
  const tb = await db.blogPost.count({where:{status:"PUBLISHED"}});
  const bm = await db.blogPost.count({where:{status:"PUBLISHED",metaTitle:{not:null}}}).catch(()=>0);
  const score = Math.round((ets/Math.max(te,1))*30+(etc/Math.max(te,1))*20+(bm/Math.max(tb,1))*20+30);
  const features = ["XML Sitemap","Robots.txt","JSON-LD Schema","FAQ Schema","Breadcrumbs","Canonical URLs","OG Tags","Twitter Cards","Location Pages","Internal Linking","Mobile-First","ISR Caching"];
  return (<div><BackToAdminLink href="/admin" label="Back" /><AdminFormHeader title="SEO Management" description="Monitor SEO across all pages." />
    <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />SEO Score: {score}%</CardTitle></CardHeader><CardContent><div className="w-full bg-muted rounded-full h-3 overflow-hidden"><div className={`h-full ${score>=80?"bg-emerald-500":score>=60?"bg-amber-500":"bg-red-500"}`} style={{width:`${score}%`}}/></div></CardContent></Card>
    <div className="grid gap-3 sm:grid-cols-3 mb-6"><Card><CardContent className="pt-4"><div className="text-xl font-bold">{ets}/{te}</div><div className="text-xs text-muted-foreground">Exam SEO Title</div></CardContent></Card><Card><CardContent className="pt-4"><div className="text-xl font-bold">{etc}/{te}</div><div className="text-xs text-muted-foreground">Exam SEO Content</div></CardContent></Card><Card><CardContent className="pt-4"><div className="text-xl font-bold">{bm}/{tb}</div><div className="text-xs text-muted-foreground">Blog Meta Tags</div></CardContent></Card></div>
    <Card><CardHeader><CardTitle className="text-lg">Features</CardTitle></CardHeader><CardContent><div className="grid gap-2 sm:grid-cols-2">{features.map(f=><div key={f} className="flex items-center gap-2 rounded-lg border p-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-sm">{f}</span></div>)}</div></CardContent></Card>
  </div>);
}
