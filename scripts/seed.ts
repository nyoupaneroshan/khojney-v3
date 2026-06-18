/**
 * Khojney.com seed script.
 * Run: `bun run db:seed`
 *
 * Seeds demo data for every Phase 1 module — admin-manageable via the admin panel later.
 * Each record is realistic enough to feel production-ready.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Khojney database...");

  // 1. Categories
  const categories = [
    { slug: "mock-exams", name: "Mock Exams", module: "EXAM", icon: "FileText", color: "red", order: 1 },
    { slug: "loksewa", name: "Loksewa", module: "EXAM", icon: "Landmark", color: "blue", order: 2 },
    { slug: "driving-license", name: "Driving License", module: "EXAM", icon: "Car", color: "amber", order: 3 },
    { slug: "cmat", name: "CMAT", module: "EXAM", icon: "GraduationCap", color: "purple", order: 4 },
    { slug: "engineering-entrance", name: "Engineering Entrance", module: "EXAM", icon: "Cog", color: "green", order: 5 },
    { slug: "mbbs-entrance", name: "MBBS Entrance", module: "EXAM", icon: "Stethoscope", color: "rose", order: 6 },
    { slug: "nursing-entrance", name: "Nursing Entrance", module: "EXAM", icon: "HeartPulse", color: "pink", order: 7 },
    { slug: "see", name: "SEE", module: "EXAM", icon: "BookOpen", color: "cyan", order: 8 },
    { slug: "plus-two", name: "+2", module: "EXAM", icon: "School", color: "indigo", order: 9 },
    { slug: "tu-exams", name: "TU Exams", module: "EXAM", icon: "Building2", color: "teal", order: 10 },
    { slug: "banking-exams", name: "Banking Exams", module: "EXAM", icon: "Landmark", color: "emerald", order: 11 },
    { slug: "teacher-license", name: "Teacher License", module: "EXAM", icon: "Users", color: "orange", order: 12 },
    { slug: "engineering-colleges", name: "Engineering Colleges", module: "COLLEGE", icon: "Cog", color: "blue", order: 1 },
    { slug: "medical-colleges", name: "Medical Colleges", module: "COLLEGE", icon: "Stethoscope", color: "red", order: 2 },
    { slug: "management-colleges", name: "Management Colleges", module: "COLLEGE", icon: "Briefcase", color: "amber", order: 3 },
    { slug: "science-colleges", name: "Science Colleges", module: "COLLEGE", icon: "Atom", color: "green", order: 4 },
    { slug: "it-colleges", name: "IT Colleges", module: "COLLEGE", icon: "Laptop", color: "purple", order: 5 },
    { slug: "primary-schools", name: "Primary Schools", module: "SCHOOL", icon: "School", color: "blue", order: 1 },
    { slug: "secondary-schools", name: "Secondary Schools", module: "SCHOOL", icon: "School", color: "red", order: 2 },
    { slug: "higher-secondary", name: "Higher Secondary (+2)", module: "SCHOOL", icon: "GraduationCap", color: "amber", order: 3 },
    { slug: "scholarship-engineering", name: "Engineering", module: "SCHOLARSHIP", icon: "Cog", color: "blue", order: 1 },
    { slug: "scholarship-medicine", name: "Medicine", module: "SCHOLARSHIP", icon: "Stethoscope", color: "red", order: 2 },
    { slug: "scholarship-management", name: "Management", module: "SCHOLARSHIP", icon: "Briefcase", color: "amber", order: 3 },
    { slug: "scholarship-international", name: "International", module: "SCHOLARSHIP", icon: "Globe", color: "green", order: 4 },
    { slug: "scholarship-government", name: "Government", module: "SCHOLARSHIP", icon: "Landmark", color: "purple", order: 5 },
    { slug: "blog-education", name: "Education", module: "BLOG", icon: "BookOpen", color: "blue", order: 1 },
    { slug: "blog-career", name: "Career", module: "BLOG", icon: "Briefcase", color: "amber", order: 2 },
    { slug: "blog-exam-tips", name: "Exam Tips", module: "BLOG", icon: "Lightbulb", color: "red", order: 3 },
    { slug: "blog-guides", name: "Guides", module: "BLOG", icon: "Compass", color: "green", order: 4 },
  ];
  for (const cat of categories) {
    await db.category.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
  }
  console.log(`✓ ${categories.length} categories`);

  // 2. Trending searches
  const trending = [
    { query: "Driving License", count: 12450, module: "EXAM", order: 1 },
    { query: "CMAT", count: 9820, module: "EXAM", order: 2 },
    { query: "Engineering Entrance", count: 8740, module: "EXAM", order: 3 },
    { query: "Loksewa", count: 7650, module: "EXAM", order: 4 },
    { query: "Colleges in Kathmandu", count: 6540, module: "COLLEGE", order: 5 },
    { query: "MBBS Entrance", count: 5890, module: "EXAM", order: 6 },
    { query: "SEE Result", count: 5230, module: "EXAM", order: 7 },
    { query: "Teacher License", count: 4580, module: "EXAM", order: 8 },
    { query: "Scholarships for +2", count: 3920, module: "SCHOLARSHIP", order: 9 },
    { query: "Nursing Colleges", count: 3450, module: "COLLEGE", order: 10 },
  ];
  for (const t of trending) {
    await db.trendingSearch.upsert({ where: { query: t.query }, update: t, create: t });
  }
  console.log(`✓ ${trending.length} trending searches`);

  // 3. Admin user + demo user
  const adminEmail = "admin@khojney.com";
  const userEmail = "user@khojney.com";
  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Khojney Admin",
      role: "SUPER_ADMIN",
      passwordHash: "demo-hash-admin",
      phone: "+977-9800000000",
      bio: "Platform administrator",
      location: "Kathmandu",
    },
  });
  const demoUser = await db.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: "Ram Sharma",
      role: "USER",
      passwordHash: "demo-hash-user",
      phone: "+977-9812345678",
      bio: "Engineering aspirant from Kathmandu",
      location: "Lalitpur",
    },
  });
  console.log(`✓ 2 users (admin + demo)`);

  // 4. Universities
  const universities = [
    {
      slug: "tribhuvan-university",
      name: "Tribhuvan University (TU)",
      description: "Tribhuvan University is the oldest and largest university in Nepal, established in 1959. It hosts over 1,050 affiliated colleges and 60 constituent campuses across the country, offering programs from undergraduate to doctoral level in almost every discipline.",
      establishedYear: 1959,
      province: "Bagmati",
      city: "Kathmandu",
      address: "Kirtipur, Kathmandu",
      phone: "+977-1-4331246",
      email: "info@tu.edu.np",
      website: "https://tu.edu.np",
      type: "PUBLIC",
      ranking: 1,
      totalCampuses: 1100,
      totalStudents: 450000,
      faculties: JSON.stringify(["Humanities", "Management", "Education", "Engineering", "Science & Technology", "Law", "Medicine", "Agriculture"]),
      programs: JSON.stringify([
        { faculty: "Engineering", level: "Bachelor", name: "BE Civil", duration: "4 years" },
        { faculty: "Engineering", level: "Bachelor", name: "BE Computer", duration: "4 years" },
        { faculty: "Management", level: "Bachelor", name: "BBS", duration: "4 years" },
        { faculty: "Management", level: "Master", name: "MBA", duration: "2 years" },
        { faculty: "Science", level: "Master", name: "MSc Physics", duration: "2 years" },
      ]),
      admissionProcess: "Entrance exam conducted centrally by TU. Application via constituent or affiliated colleges.",
      rating: 4.3,
      reviewCount: 245,
      isFeatured: true,
    },
    {
      slug: "kathmandu-university",
      name: "Kathmandu University (KU)",
      description: "Kathmandu University is the third oldest university in Nepal, established in 1991. Known for its engineering, medical, and management programs, KU operates through schools rather than faculties and maintains high academic standards.",
      establishedYear: 1991,
      province: "Bagmati",
      city: "Dhulikhel",
      address: "Dhulikhel, Kavre",
      phone: "+977-11-661399",
      email: "info@ku.edu.np",
      website: "https://ku.edu.np",
      type: "PUBLIC",
      ranking: 2,
      totalCampuses: 50,
      totalStudents: 25000,
      faculties: JSON.stringify(["Engineering", "Science", "Management", "Medical Sciences", "Education", "Arts"]),
      programs: JSON.stringify([
        { faculty: "Engineering", level: "Bachelor", name: "BE Computer", duration: "4 years" },
        { faculty: "Engineering", level: "Bachelor", name: "BE Civil", duration: "4 years" },
        { faculty: "Medical Sciences", level: "Bachelor", name: "MBBS", duration: "5.5 years" },
        { faculty: "Management", level: "Master", name: "MBA", duration: "2 years" },
      ]),
      admissionProcess: "KU conducts its own entrance examination (KUCAT/KUMAT). Admission is competitive and based on merit.",
      rating: 4.6,
      reviewCount: 189,
      isFeatured: true,
    },
    {
      slug: "pokhara-university",
      name: "Pokhara University (PU)",
      description: "Pokhara University was established in 1996 under the Pokhara University Act. It operates through four constituent colleges and over 50 affiliated colleges, with a focus on science, technology, and management education.",
      establishedYear: 1996,
      province: "Gandaki",
      city: "Pokhara",
      address: "Pokhara-30, Kaski",
      phone: "+977-61-541014",
      email: "info@pu.edu.np",
      website: "https://pu.edu.np",
      type: "PUBLIC",
      ranking: 3,
      totalCampuses: 58,
      totalStudents: 35000,
      faculties: JSON.stringify(["Engineering", "Management", "Science & Technology", "Health Sciences", "Humanities"]),
      programs: JSON.stringify([
        { faculty: "Engineering", level: "Bachelor", name: "BE Computer", duration: "4 years" },
        { faculty: "Management", level: "Bachelor", name: "BBA", duration: "4 years" },
        { faculty: "Health Sciences", level: "Bachelor", name: "BPH", duration: "4 years" },
      ]),
      admissionProcess: "PU conducts its own entrance exam. Application via constituent or affiliated colleges.",
      rating: 4.2,
      reviewCount: 132,
      isFeatured: true,
    },
    {
      slug: "purbanchal-university",
      name: "Purbanchal University",
      description: "Purbanchal University was established in 1994 to promote higher education in the eastern region of Nepal. It has over 115 affiliated colleges offering programs in engineering, management, education, and humanities.",
      establishedYear: 1994,
      province: "Koshi",
      city: "Biratnagar",
      address: "Biratnagar, Morang",
      phone: "+977-21-421546",
      email: "info@pucampus.edu.np",
      website: "https://pucampus.edu.np",
      type: "PUBLIC",
      ranking: 4,
      totalCampuses: 115,
      totalStudents: 40000,
      faculties: JSON.stringify(["Engineering", "Management", "Education", "Law", "Science & Technology"]),
      rating: 4.0,
      reviewCount: 87,
    },
    {
      slug: "far-western-university",
      name: "Far-Western University",
      description: "Far-Western University was established in 2010 to cater to the higher education needs of the far-western region of Nepal. It offers undergraduate and graduate programs through constituent and affiliated colleges.",
      establishedYear: 2010,
      province: "Sudurpashchim",
      city: "Bhimdatta",
      address: "Bhimdatta, Kanchanpur",
      phone: "+977-99-521010",
      email: "info@fwu.edu.np",
      website: "https://fwu.edu.np",
      type: "PUBLIC",
      ranking: 5,
      totalCampuses: 25,
      totalStudents: 8000,
      faculties: JSON.stringify(["Management", "Education", "Science & Technology", "Humanities"]),
      rating: 3.9,
      reviewCount: 42,
    },
    {
      slug: "mid-western-university",
      name: "Mid-Western University",
      description: "Mid-Western University was established in 2010 to expand access to higher education in the mid-western development region of Nepal.",
      establishedYear: 2010,
      province: "Karnali",
      city: "Birendranagar",
      address: "Birendranagar, Surkhet",
      phone: "+977-83-521005",
      email: "info@mu.edu.np",
      website: "https://mu.edu.np",
      type: "PUBLIC",
      ranking: 6,
      totalCampuses: 18,
      totalStudents: 5000,
      faculties: JSON.stringify(["Management", "Education", "Science", "Engineering"]),
      rating: 3.8,
      reviewCount: 28,
    },
  ];
  for (const u of universities) {
    await db.university.upsert({ where: { slug: u.slug }, update: u, create: u });
  }
  console.log(`✓ ${universities.length} universities`);

  // 5. Colleges
  const engineeringCat = await db.category.findUnique({ where: { slug: "engineering-colleges" } });
  const medicalCat = await db.category.findUnique({ where: { slug: "medical-colleges" } });
  const mgmtCat = await db.category.findUnique({ where: { slug: "management-colleges" } });
  const itCat = await db.category.findUnique({ where: { slug: "it-colleges" } });

  const colleges = [
    {
      slug: "ioe-pulchowk-campus",
      name: "Pulchowk Campus, IOE",
      description: "Pulchowk Campus is the constituent campus of Institute of Engineering, Tribhuvan University. Established in 1972, it is the oldest and most prestigious engineering college in Nepal, offering undergraduate, graduate, and doctoral programs across all major engineering disciplines.",
      categoryId: engineeringCat?.id,
      province: "Bagmati", district: "Lalitpur", city: "Lalitpur", address: "Pulchowk, Lalitpur",
      latitude: 27.6796, longitude: 85.3175,
      affiliation: "TU (IOE)", type: "PUBLIC", establishedYear: 1972,
      phone: "+977-1-5010205", email: "info@pcampus.edu.np", website: "https://pcampus.edu.np",
      programs: JSON.stringify([
        { name: "BE Civil", level: "Bachelor", duration: "4 years", fees: "NPR 4,80,000 (approx)" },
        { name: "BE Computer", level: "Bachelor", duration: "4 years", fees: "NPR 5,50,000 (approx)" },
        { name: "BE Electronics", level: "Bachelor", duration: "4 years", fees: "NPR 5,50,000 (approx)" },
        { name: "BE Mechanical", level: "Bachelor", duration: "4 years", fees: "NPR 4,80,000 (approx)" },
        { name: "BE Electrical", level: "Bachelor", duration: "4 years", fees: "NPR 4,80,000 (approx)" },
        { name: "MSc Structural Engineering", level: "Master", duration: "2 years", fees: "NPR 2,40,000" },
      ]),
      facilities: JSON.stringify(["Central Library", "Hostel for boys & girls", "Sports complex", "Research labs", "Cafeteria", "Auditorium", "High-speed WiFi", "Workshops"]),
      admissionProcess: "Admission through IOE Entrance Examination conducted annually. Top rankers choose Pulchowk Campus.",
      feesRange: "NPR 4,80,000 – 5,50,000",
      scholarshipsAvailable: true,
      rating: 4.7, reviewCount: 320,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "ioe-thapathali-campus",
      name: "Thapathali Campus, IOE",
      description: "Thapathali Campus is a constituent campus of Institute of Engineering, TU. Known for its industrial engineering and architecture programs, it is one of the most sought-after engineering campuses in Nepal.",
      categoryId: engineeringCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Thapathali, Kathmandu",
      latitude: 27.6939, longitude: 85.3193,
      affiliation: "TU (IOE)", type: "PUBLIC", establishedYear: 1972,
      phone: "+977-1-4101234", email: "info@tcampus.edu.np", website: "https://tcampus.edu.np",
      programs: JSON.stringify([
        { name: "BE Industrial", level: "Bachelor", duration: "4 years", fees: "NPR 4,80,000 (approx)" },
        { name: "BE Civil", level: "Bachelor", duration: "4 years", fees: "NPR 4,80,000 (approx)" },
        { name: "BE Mechanical", level: "Bachelor", duration: "4 years", fees: "NPR 4,80,000 (approx)" },
        { name: "BArch", level: "Bachelor", duration: "5 years", fees: "NPR 6,00,000 (approx)" },
      ]),
      facilities: JSON.stringify(["Library", "Hostel", "Cafeteria", "Computer labs", "Mechanical workshops", "Sports"]),
      admissionProcess: "Through IOE Entrance Examination.",
      feesRange: "NPR 4,80,000 – 6,00,000",
      scholarshipsAvailable: true,
      rating: 4.5, reviewCount: 156,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "ku-school-of-engineering",
      name: "Kathmandu University School of Engineering",
      description: "KU School of Engineering offers undergraduate and graduate programs in computer, civil, electrical, and mechanical engineering. Known for research output and industry collaboration.",
      categoryId: engineeringCat?.id,
      province: "Bagmati", district: "Kavrepalanchok", city: "Dhulikhel", address: "Dhulikhel, Kavre",
      latitude: 27.6213, longitude: 85.5418,
      affiliation: "KU", type: "PUBLIC", establishedYear: 1994,
      phone: "+977-11-490621", email: "soe@ku.edu.np", website: "https://ku.edu.np/soe",
      programs: JSON.stringify([
        { name: "BE Computer", level: "Bachelor", duration: "4 years", fees: "NPR 7,00,000 (approx)" },
        { name: "BE Civil", level: "Bachelor", duration: "4 years", fees: "NPR 7,00,000 (approx)" },
        { name: "BE Electrical", level: "Bachelor", duration: "4 years", fees: "NPR 7,00,000 (approx)" },
        { name: "MTech in Computer Engineering", level: "Master", duration: "2 years", fees: "NPR 4,00,000" },
      ]),
      facilities: JSON.stringify(["Modern labs", "Library", "Hostel", "Cafeteria", "Sports complex", "Research centers"]),
      admissionProcess: "Through KU Entrance Examination (KUEE).",
      feesRange: "NPR 7,00,000",
      scholarshipsAvailable: true,
      rating: 4.6, reviewCount: 142,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "national-college-of-engineering",
      name: "National College of Engineering (NCE)",
      description: "NCE is an affiliated college of TU offering undergraduate engineering programs. Located in Talchhikhel, Lalitpur, it is known for civil and computer engineering education.",
      categoryId: engineeringCat?.id,
      province: "Bagmati", district: "Lalitpur", city: "Lalitpur", address: "Talchhikhel, Lalitpur",
      affiliation: "TU", type: "PRIVATE", establishedYear: 2006,
      phone: "+977-1-5191050", email: "info@nce.edu.np", website: "https://nce.edu.np",
      programs: JSON.stringify([
        { name: "BE Civil", level: "Bachelor", duration: "4 years", fees: "NPR 6,50,000" },
        { name: "BE Computer", level: "Bachelor", duration: "4 years", fees: "NPR 7,50,000" },
        { name: "BE Electronics", level: "Bachelor", duration: "4 years", fees: "NPR 7,00,000" },
      ]),
      facilities: JSON.stringify(["Library", "Computer labs", "Cafeteria", "Sports", "Transportation"]),
      admissionProcess: "Through IOE Entrance Examination. Apply directly at college.",
      feesRange: "NPR 6,50,000 – 7,50,000",
      scholarshipsAvailable: true,
      rating: 4.1, reviewCount: 78,
    },
    {
      slug: "iom-maharajgunj",
      name: "Institute of Medicine (IOM), Maharajgunj",
      description: "IOM is the premier medical institution under TU, established in 1972. It offers MBBS, MD/MS, and other health science programs through its constituent campuses including Maharajgunj Medical Campus, TUTH, and various affiliated colleges.",
      categoryId: medicalCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Maharajgunj, Kathmandu",
      latitude: 27.7372, longitude: 85.3319,
      affiliation: "TU (IOM)", type: "PUBLIC", establishedYear: 1972,
      phone: "+977-1-4410911", email: "iom@iom.edu.np", website: "https://iom.edu.np",
      programs: JSON.stringify([
        { name: "MBBS", level: "Bachelor", duration: "5.5 years", fees: "NPR 45,00,000 (approx)" },
        { name: "BSc Nursing", level: "Bachelor", duration: "4 years", fees: "NPR 6,00,000" },
        { name: "BPH", level: "Bachelor", duration: "4 years", fees: "NPR 4,50,000" },
        { name: "MD/MS (various specialties)", level: "Master", duration: "3 years", fees: "NPR 20-40,00,000" },
      ]),
      facilities: JSON.stringify(["Teaching hospital (TUTH)", "Library", "Hostel", "Research labs", "Auditorium", "Simulation center"]),
      admissionProcess: "Through IOM Entrance Examination (MBBS). Highly competitive — only top 50 from each exam get into Maharajgunj.",
      feesRange: "NPR 6,00,000 – 45,00,000",
      scholarshipsAvailable: true,
      rating: 4.8, reviewCount: 410,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "b-and-b-medical-college",
      name: "B & B Hospital & Medical College",
      description: "B & B Medical College is a private medical institution affiliated to KU, offering MBBS program with modern teaching facilities and a fully-functional hospital.",
      categoryId: medicalCat?.id,
      province: "Bagmati", district: "Lalitpur", city: "Gwarko", address: "Gwarko, Lalitpur",
      affiliation: "KU", type: "PRIVATE", establishedYear: 2014,
      phone: "+977-1-5190400", email: "info@bbh.org", website: "https://bbh.org",
      programs: JSON.stringify([
        { name: "MBBS", level: "Bachelor", duration: "5.5 years", fees: "NPR 45,00,000 (approx)" },
      ]),
      facilities: JSON.stringify(["750-bed hospital", "Modern labs", "Library", "Hostel", "Cafeteria", "Simulation center"]),
      admissionProcess: "Through KU MBBS Entrance Examination.",
      feesRange: "NPR 45,00,000",
      scholarshipsAvailable: false,
      rating: 4.2, reviewCount: 65,
    },
    {
      slug: "shankar-dev-campus",
      name: "Shankar Dev Campus",
      description: "Shankar Dev Campus is a constituent campus of TU under the Faculty of Management, established in 1951. It is one of the oldest management colleges in Nepal offering BBS, MBS, MBA and other management programs.",
      categoryId: mgmtCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Putalisadak, Kathmandu",
      affiliation: "TU", type: "PUBLIC", establishedYear: 1951,
      phone: "+977-1-4420237", email: "info@sdcampus.edu.np", website: "https://sdcampus.edu.np",
      programs: JSON.stringify([
        { name: "BBS", level: "Bachelor", duration: "4 years", fees: "NPR 60,000/year" },
        { name: "MBS", level: "Master", duration: "2 years", fees: "NPR 60,000/year" },
        { name: "MBA", level: "Master", duration: "2 years", fees: "NPR 4,00,000" },
      ]),
      facilities: JSON.stringify(["Library", "Computer lab", "Auditorium", "Cafeteria", "Sports"]),
      admissionProcess: "Through CMAT (for MBA) or direct admission for BBS based on +2 marks.",
      feesRange: "NPR 60,000 – 4,00,000",
      scholarshipsAvailable: true,
      rating: 4.3, reviewCount: 230,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "kings-college-nepal",
      name: "King's College Nepal",
      description: "King's College is a leading business school in Nepal affiliated to TU. Known for its BBA, MBA, and BBS programs with strong industry connections and entrepreneurship focus.",
      categoryId: mgmtCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Babar Mahal, Kathmandu",
      affiliation: "TU", type: "PRIVATE", establishedYear: 2003,
      phone: "+977-1-4104342", email: "info@kingscollege.edu.np", website: "https://kingscollege.edu.np",
      programs: JSON.stringify([
        { name: "BBA", level: "Bachelor", duration: "4 years", fees: "NPR 5,50,000" },
        { name: "MBA", level: "Master", duration: "2 years", fees: "NPR 6,50,000" },
        { name: "BCA", level: "Bachelor", duration: "4 years", fees: "NPR 5,00,000" },
      ]),
      facilities: JSON.stringify(["Modern classrooms", "Library", "Computer labs", "Entrepreneurship center", "Cafeteria", "Career services"]),
      admissionProcess: "Through CMAT (for MBA). Internal admission test for BBA.",
      feesRange: "NPR 5,00,000 – 6,50,000",
      scholarshipsAvailable: true,
      rating: 4.5, reviewCount: 187,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "islington-college",
      name: "Islington College",
      description: "Islington College is a premier IT college in Nepal, partnering with London Metropolitan University to offer UK-accredited undergraduate programs in IT, networking, and software development.",
      categoryId: itCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kamal Pokhari", address: "Kamal Pokhari, Kathmandu",
      affiliation: "London Metropolitan University (UK)", type: "PRIVATE", establishedYear: 2007,
      phone: "+977-1-4440055", email: "info@islingtoncollege.edu.np", website: "https://islingtoncollege.edu.np",
      programs: JSON.stringify([
        { name: "BSc (Hons) Computing", level: "Bachelor", duration: "3 years", fees: "NPR 8,50,000" },
        { name: "BSc (Hons) Computer Networking & IT Security", level: "Bachelor", duration: "3 years", fees: "NPR 9,00,000" },
        { name: "BSc (Hons) Mobile Computing", level: "Bachelor", duration: "3 years", fees: "NPR 8,80,000" },
        { name: "MSc Cyber Security", level: "Master", duration: "2 years", fees: "NPR 8,00,000" },
      ]),
      facilities: JSON.stringify(["Modern labs", "Cisco Networking Academy", "Library", "Cafeteria", "Career cell"]),
      admissionProcess: "Direct admission based on +2 marks and personal interview.",
      feesRange: "NPR 8,50,000 – 9,00,000",
      scholarshipsAvailable: true,
      rating: 4.4, reviewCount: 165,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "herald-college-kathmandu",
      name: "Herald College Kathmandu",
      description: "Herald College Kathmandu offers UK university-accredited undergraduate programs in IT and Business in partnership with the University of Wolverhampton. Known for affordable British education in Nepal.",
      categoryId: itCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Naxal, Kathmandu",
      affiliation: "University of Wolverhampton (UK)", type: "PRIVATE", establishedYear: 2000,
      phone: "+977-1-4422244", email: "info@heraldcollege.edu.np", website: "https://heraldcollege.edu.np",
      programs: JSON.stringify([
        { name: "BSc (Hons) Computer Science", level: "Bachelor", duration: "3 years", fees: "NPR 7,50,000" },
        { name: "BBA", level: "Bachelor", duration: "3 years", fees: "NPR 7,00,000" },
        { name: "MBA", level: "Master", duration: "2 years", fees: "NPR 6,50,000" },
      ]),
      facilities: JSON.stringify(["Modern classrooms", "Computer labs", "Library", "Cafeteria", "Career services"]),
      admissionProcess: "Direct admission based on +2 marks and personal interview.",
      feesRange: "NPR 7,00,000 – 7,50,000",
      scholarshipsAvailable: true,
      rating: 4.3, reviewCount: 142,
    },
    {
      slug: "national-medical-college-birgunj",
      name: "National Medical College, Birgunj",
      description: "National Medical College is one of the leading medical colleges outside Kathmandu Valley, affiliated to TU IOM. It offers MBBS and postgraduate medical programs with a 700-bed teaching hospital.",
      categoryId: medicalCat?.id,
      province: "Madhesh", district: "Parsa", city: "Birgunj", address: "Birgunj, Parsa",
      affiliation: "TU (IOM)", type: "PRIVATE", establishedYear: 2001,
      phone: "+977-51-525200", email: "info@nmc.edu.np", website: "https://nmc.edu.np",
      programs: JSON.stringify([
        { name: "MBBS", level: "Bachelor", duration: "5.5 years", fees: "NPR 45,00,000 (approx)" },
        { name: "MD/MS (various)", level: "Master", duration: "3 years", fees: "NPR 30-50,00,000" },
      ]),
      facilities: JSON.stringify(["700-bed teaching hospital", "Library", "Hostel", "Modern labs", "Cafeteria"]),
      admissionProcess: "Through IOM MBBS Entrance Examination.",
      feesRange: "NPR 45,00,000",
      scholarshipsAvailable: false,
      rating: 4.1, reviewCount: 92,
    },
    {
      slug: "cosmos-college-of-engineering",
      name: "Cosmos College of Engineering & Technology",
      description: "Cosmos College is an affiliated engineering college of TU, offering undergraduate programs in computer, civil, and electronics engineering with focus on practical learning.",
      categoryId: engineeringCat?.id,
      province: "Bagmati", district: "Lalitpur", city: "Lalitpur", address: "Tutepani, Lalitpur",
      affiliation: "TU", type: "PRIVATE", establishedYear: 2001,
      phone: "+977-1-5185158", email: "info@cosmoscollege.edu.np", website: "https://cosmoscollege.edu.np",
      programs: JSON.stringify([
        { name: "BE Computer", level: "Bachelor", duration: "4 years", fees: "NPR 7,00,000" },
        { name: "BE Civil", level: "Bachelor", duration: "4 years", fees: "NPR 6,50,000" },
        { name: "BE Electronics", level: "Bachelor", duration: "4 years", fees: "NPR 6,80,000" },
      ]),
      facilities: JSON.stringify(["Library", "Computer labs", "Cafeteria", "Sports", "WiFi"]),
      admissionProcess: "Through IOE Entrance Examination.",
      feesRange: "NPR 6,50,000 – 7,00,000",
      scholarshipsAvailable: true,
      rating: 4.0, reviewCount: 84,
    },
  ];
  for (const c of colleges) {
    await db.college.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  console.log(`✓ ${colleges.length} colleges`);

  // 6. Schools
  const secondaryCat = await db.category.findUnique({ where: { slug: "secondary-schools" } });
  const higherSecCat = await db.category.findUnique({ where: { slug: "higher-secondary" } });

  const schools = [
    {
      slug: "budhanilkantha-school",
      name: "Budhanilkantha School",
      description: "Budhanilkantha School is a national school of Nepal established in 1972 as a joint venture between the Government of Nepal and the Government of the United Kingdom. It is one of the most prestigious schools in the country, known for academic excellence and producing national toppers.",
      categoryId: secondaryCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Narayanthan, Kathmandu",
      latitude: 27.7786, longitude: 85.3636,
      level: "SECONDARY", type: "PUBLIC", affiliation: "NEB / CDC", establishedYear: 1972,
      phone: "+977-1-4370218", email: "info@bnks.edu.np", website: "https://bnks.edu.np",
      facilities: JSON.stringify(["Boarding facilities", "Library", "Science labs", "Sports complex", "Music room", "Auditorium", "Computer labs"]),
      programs: JSON.stringify(["Grade 5 – 10 (SEE)", "+2 Science / Management / Humanities"]),
      feesRange: "Government-subsidized (boarding scholarship available)",
      admissionProcess: "Through nationwide entrance examination. Highly competitive — admission to Grade 5.",
      rating: 4.8, reviewCount: 245,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "st-xaviers-school-godavari",
      name: "St. Xavier's School, Godavari",
      description: "St. Xavier's School Godavari is a Jesuit school established in 1951, one of the oldest and most respected schools in Nepal. It is known for academic excellence, character formation, and value-based education.",
      categoryId: secondaryCat?.id,
      province: "Bagmati", district: "Lalitpur", city: "Godavari", address: "Godavari, Lalitpur",
      latitude: 27.5945, longitude: 85.3633,
      level: "SECONDARY", type: "PRIVATE", affiliation: "NEB / CDC", establishedYear: 1951,
      phone: "+977-1-5528400", email: "info@sxsgr.edu.np", website: "https://sxsgr.edu.np",
      facilities: JSON.stringify(["Library", "Science labs", "Sports complex", "Computer labs", "Music room", "Auditorium", "Cafeteria"]),
      programs: JSON.stringify(["Grade 1 – 10 (SEE)", "+2 Science"]),
      feesRange: "NPR 80,000 – 1,20,000/year",
      admissionProcess: "Through entrance examination. Admission to Grade 1 and Grade 11.",
      rating: 4.7, reviewCount: 198,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "gandaki-boarding-school",
      name: "Gandaki Boarding School",
      description: "Gandaki Boarding School (GBS) is a renowned residential school in Pokhara established in 1966. It is known for quality education and has consistently produced SEE board toppers over the years.",
      categoryId: secondaryCat?.id,
      province: "Gandaki", district: "Kaski", city: "Pokhara", address: "Lamachaur, Pokhara",
      latitude: 28.2619, longitude: 83.9686,
      level: "SECONDARY", type: "PUBLIC", affiliation: "NEB / CDC", establishedYear: 1966,
      phone: "+977-61-460123", email: "info@gbs.edu.np", website: "https://gbs.edu.np",
      facilities: JSON.stringify(["Boarding facilities", "Library", "Science labs", "Sports complex", "Computer labs", "Auditorium"]),
      programs: JSON.stringify(["Grade 4 – 10 (SEE)", "+2 Science"]),
      feesRange: "NPR 60,000 – 1,00,000/year",
      admissionProcess: "Through entrance examination. Admission to Grade 4.",
      rating: 4.6, reviewCount: 152,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "kathmandu-model-college",
      name: "Kathmandu Model College (KMC)",
      description: "KMC is one of the leading +2 colleges in Nepal, offering Science, Management, and Humanities streams. Known for academic rigor and consistent top results in NEB examinations.",
      categoryId: higherSecCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Buddhanilkantha, Kathmandu",
      affiliation: "NEB", type: "PRIVATE", establishedYear: 2000,
      phone: "+977-1-4370210", email: "info@kmc.edu.np", website: "https://kmc.edu.np",
      facilities: JSON.stringify(["Modern classrooms", "Library", "Science labs", "Computer labs", "Cafeteria", "Sports"]),
      programs: JSON.stringify(["+2 Science", "+2 Management", "+2 Humanities", "+2 Law"]),
      feesRange: "NPR 1,20,000 – 2,50,000/year (Science higher)",
      admissionProcess: "Based on SEE marks and internal admission test.",
      rating: 4.5, reviewCount: 320,
      isFeatured: true, isVerified: true,
    },
    {
      slug: "global-college-of-management",
      name: "Global College of Management",
      description: "Global College of Management is a leading +2 management college affiliated to NEB. It is known for producing top management professionals and entrepreneurs in Nepal.",
      categoryId: higherSecCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Baneshwor, Kathmandu",
      affiliation: "NEB", type: "PRIVATE", establishedYear: 2009,
      phone: "+977-1-4480000", email: "info@gcm.edu.np", website: "https://gcm.edu.np",
      facilities: JSON.stringify(["Modern classrooms", "Library", "Computer labs", "Auditorium", "Cafeteria"]),
      programs: JSON.stringify(["+2 Management", "+2 Science", "BBA", "BCA"]),
      feesRange: "NPR 1,00,000 – 2,00,000/year",
      admissionProcess: "Based on SEE marks and interview.",
      rating: 4.3, reviewCount: 145,
    },
    {
      slug: "princeton-academy",
      name: "Princeton Academy",
      description: "Princeton Academy is a growing +2 college in Kathmandu offering Science and Management streams with modern teaching methodologies and counseling support.",
      categoryId: higherSecCat?.id,
      province: "Bagmati", district: "Kathmandu", city: "Kathmandu", address: "Kapan, Kathmandu",
      affiliation: "NEB", type: "PRIVATE", establishedYear: 2011,
      phone: "+977-1-4370445", email: "info@princeton.edu.np", website: "https://princeton.edu.np",
      facilities: JSON.stringify(["Library", "Science labs", "Computer labs", "Cafeteria", "Counseling"]),
      programs: JSON.stringify(["+2 Science", "+2 Management"]),
      feesRange: "NPR 90,000 – 1,80,000/year",
      admissionProcess: "Based on SEE marks and interview.",
      rating: 4.0, reviewCount: 68,
    },
  ];
  for (const s of schools) {
    await db.school.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
  console.log(`✓ ${schools.length} schools`);

  // 7. Scholarships
  const scholarshipEngCat = await db.category.findUnique({ where: { slug: "scholarship-engineering" } });
  const scholarshipMedCat = await db.category.findUnique({ where: { slug: "scholarship-medicine" } });
  const scholarshipGovCat = await db.category.findUnique({ where: { slug: "scholarship-government" } });
  const scholarshipIntlCat = await db.category.findUnique({ where: { slug: "scholarship-international" } });
  const scholarshipMgmtCat = await db.category.findUnique({ where: { slug: "scholarship-management" } });

  const scholarships = [
    {
      slug: "ioe-entrance-scholarship",
      title: "IOE Entrance Topper Scholarship (Full Tuition)",
      description: "Full tuition scholarship for top 10 rankers of IOE Entrance Examination. Covers all 4 years of undergraduate engineering education at any constituent campus of IOE including Pulchowk, Thapathali, Paschimanchal, and Purwanchal.",
      provider: "Institute of Engineering, TU", providerUrl: "https://ioe.edu.np",
      categoryId: scholarshipEngCat?.id,
      level: "BACHELORS", field: "Engineering (any discipline)",
      amount: "Full tuition waiver (NPR 4,80,000 – 5,50,000)",
      eligibility: JSON.stringify([
        "Must be among top 10 of IOE Entrance Examination",
        "Must be a Nepali citizen",
        "Must have passed +2 Science with Physics, Chemistry, Mathematics",
        "Minimum 50% in +2 or equivalent",
      ]),
      deadline: new Date("2026-08-31"), applicationOpen: new Date("2026-06-01"),
      applicationUrl: "https://ioe.edu.np", country: "Nepal", isFeatured: true,
    },
    {
      slug: "iom-mbbs-scholarship",
      title: "IOM MBBS Government Scholarship (Free Seat)",
      description: "Full scholarship for top 50 candidates of IOM MBBS Entrance Examination. Covers all 5.5 years of MBBS education at IOM Maharajgunj or affiliated government colleges.",
      provider: "Institute of Medicine, TU", providerUrl: "https://iom.edu.np",
      categoryId: scholarshipMedCat?.id,
      level: "BACHELORS", field: "Medicine (MBBS)",
      amount: "Full tuition waiver (worth NPR 45,00,000)",
      eligibility: JSON.stringify([
        "Must be among top 50 of IOM MBBS Entrance",
        "Must be a Nepali citizen",
        "Must have passed +2 Science with Physics, Chemistry, Biology",
        "Minimum 50% in +2 or equivalent",
      ]),
      deadline: new Date("2026-09-30"), applicationOpen: new Date("2026-07-01"),
      applicationUrl: "https://iom.edu.np", country: "Nepal", isFeatured: true,
    },
    {
      slug: "plus2-science-scholarship-see-toppers",
      title: "SEE Topper +2 Science Scholarship (NEB)",
      description: "Full scholarship for SEE board toppers (A+ grade holders) to pursue +2 Science at any government-aided college in Nepal. Covers tuition, lab fees, and books for 2 years.",
      provider: "National Examinations Board (NEB)", providerUrl: "https://neb.gov.np",
      categoryId: scholarshipGovCat?.id,
      level: "+2", field: "Science",
      amount: "Full tuition waiver + NPR 5,000/month stipend",
      eligibility: JSON.stringify([
        "A+ grade in SEE examination",
        "Must enroll in +2 Science at a government-aided college",
        "Must be a Nepali citizen",
        "Family income below NPR 5,00,000/year (for some quotas)",
      ]),
      deadline: new Date("2026-08-15"), applicationOpen: new Date("2026-06-15"),
      applicationUrl: "https://neb.gov.np", country: "Nepal", isFeatured: true,
    },
    {
      slug: "chevening-scholarship-uk",
      title: "Chevening Scholarship UK (Master's Degree)",
      description: "The UK Government's global scholarship programme offering fully-funded master's study at any UK university. Covers tuition, monthly stipend, travel, and thesis grant.",
      provider: "UK Government (FCDO)", providerUrl: "https://chevening.org",
      categoryId: scholarshipIntlCat?.id,
      level: "MASTERS", field: "Any field",
      amount: "Full tuition + NPR 35,00,000/year stipend + travel + thesis grant",
      eligibility: JSON.stringify([
        "Nepali citizen with valid passport",
        "Bachelor's degree with strong academic record",
        "Minimum 2 years of work experience (paid or unpaid)",
        "Demonstrated leadership potential",
        "Commitment to return to Nepal for 2 years after study",
      ]),
      deadline: new Date("2026-11-05"), applicationOpen: new Date("2026-08-01"),
      applicationUrl: "https://chevening.org/scholarship/nepal/", country: "United Kingdom", isFeatured: true,
    },
    {
      slug: "fulbright-scholarship-nepal",
      title: "Fulbright Scholarship Nepal (USA)",
      description: "The Fulbright Program offers fully-funded master's degree study in the United States for Nepali students. Covers tuition, airfare, living stipend, and health insurance.",
      provider: "US Government / USEF Nepal", providerUrl: "https://usefnepal.org",
      categoryId: scholarshipIntlCat?.id,
      level: "MASTERS", field: "Any field except Medicine & Clinical subjects",
      amount: "Full tuition + NPR 30,00,000/year stipend + travel + insurance",
      eligibility: JSON.stringify([
        "Nepali citizen residing in Nepal",
        "Bachelor's degree with strong academic record",
        "Minimum 3 years of work experience preferred",
        "TOEFL/IELTS required",
        "Commitment to return to Nepal",
      ]),
      deadline: new Date("2026-05-31"), applicationOpen: new Date("2026-02-01"),
      applicationUrl: "https://usefnepal.org/fulbright-foreign-student-program/", country: "United States",
    },
    {
      slug: "jmfc-scholarship",
      title: "Japanese Government (MEXT) Scholarship",
      description: "The Ministry of Education, Culture, Sports, Science and Technology (MEXT) of Japan offers scholarships to international students who wish to study at Japanese universities as undergraduate or research students.",
      provider: "Government of Japan (MEXT)", providerUrl: "https://www.studyinjapan.go.jp",
      categoryId: scholarshipIntlCat?.id,
      level: "BACHELORS", field: "Any field (Engineering, Science, Social Sciences)",
      amount: "Full tuition + NPR 1,20,000/month stipend + airfare",
      eligibility: JSON.stringify([
        "Nepali citizen aged 17-21 (undergraduate) or under 35 (research)",
        "Must have passed +2 or Bachelor's",
        "Must be willing to study Japanese language",
        "Good academic record",
      ]),
      deadline: new Date("2026-06-30"), applicationOpen: new Date("2026-04-01"),
      applicationUrl: "https://www.vn.emb-japan.go.jp/it_en/en_education_en/mext.html", country: "Japan",
    },
    {
      slug: "kadoorie-scholarship-nepal",
      title: "KAASI Scholarship (Kadoorie Agriculture Scholarship)",
      description: "Full scholarship for students from rural Nepal to study agriculture at the Institute of Agriculture and Animal Science (IAAS) under TU.",
      provider: "Government of Nepal / IAAS", providerUrl: "https://iaas.edu.np",
      categoryId: scholarshipGovCat?.id,
      level: "BACHELORS", field: "Agriculture / Veterinary",
      amount: "Full tuition + NPR 5,000/month stipend + accommodation",
      eligibility: JSON.stringify([
        "Must be from a rural/municipal-ward with low Human Development Index",
        "Must have passed +2 Science with Biology/Agriculture",
        "Family income below NPR 3,00,000/year",
        "Must pass IAAS Entrance Examination",
      ]),
      deadline: new Date("2026-09-15"), applicationOpen: new Date("2026-07-01"),
      applicationUrl: "https://iaas.edu.np", country: "Nepal",
    },
    {
      slug: "tumgmt-scholarship-cmat-topper",
      title: "CMAT Topper Scholarship (MBA)",
      description: "Full or partial tuition scholarship for top 5 CMAT rankers to pursue MBA at Shankar Dev Campus, KUSOM, or Pokhara University affiliated colleges.",
      provider: "Tribhuvan University / KU / PU", providerUrl: "https://tu.edu.np",
      categoryId: scholarshipMgmtCat?.id,
      level: "MASTERS", field: "Business Administration (MBA)",
      amount: "Full tuition waiver (top 3) / 50% waiver (rank 4-5)",
      eligibility: JSON.stringify([
        "Top 5 rank in CMAT examination",
        "Bachelor's degree with minimum 50%",
        "Nepali citizen",
      ]),
      deadline: new Date("2026-12-31"), applicationOpen: new Date("2026-10-01"),
      applicationUrl: "https://tu.edu.np", country: "Nepal",
    },
  ];
  for (const s of scholarships) {
    await db.scholarship.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
  console.log(`✓ ${scholarships.length} scholarships`);

  // 8. Blog posts
  const blogEduCat = await db.category.findUnique({ where: { slug: "blog-education" } });
  const blogTipsCat = await db.category.findUnique({ where: { slug: "blog-exam-tips" } });
  const blogGuidesCat = await db.category.findUnique({ where: { slug: "blog-guides" } });

  const tags = [
    { slug: "nepal", name: "Nepal" },
    { slug: "education", name: "Education" },
    { slug: "exams", name: "Exams" },
    { slug: "career", name: "Career" },
    { slug: "ioe", name: "IOE" },
    { slug: "mbbs", name: "MBBS" },
    { slug: "cmat", name: "CMAT" },
    { slug: "scholarship", name: "Scholarship" },
    { slug: "see", name: "SEE" },
    { slug: "loksewa", name: "Loksewa" },
  ];
  for (const t of tags) {
    await db.tag.upsert({ where: { slug: t.slug }, update: t, create: t });
  }
  const tagRecords = await db.tag.findMany();

  const blogPosts = [
    {
      slug: "ioe-entrance-exam-complete-guide",
      title: "IOE Entrance Exam: Complete Guide for Aspiring Engineers",
      excerpt: "Everything you need to know about the IOE Entrance Examination — syllabus, pattern, marking scheme, important dates, and preparation strategy.",
      categoryId: blogEduCat?.id, authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200",
      content: `# IOE Entrance Exam: Complete Guide

The **Institute of Engineering (IOE) Entrance Examination** is the gateway to engineering education in Nepal. Conducted annually by Tribhuvan University, it is the most competitive engineering entrance in the country.

## Why IOE?

IOE is the umbrella institution for all constituent engineering campuses under Tribhuvan University, including:

- Pulchowk Campus (the most prestigious)
- Thapathali Campus
- Paschimanchal Campus (Pokhara)
- Purwanchal Campus (Dharan)

## Eligibility

- Nepali citizen or foreign national meeting criteria
- Passed +2 Science (or equivalent) with Physics, Chemistry, and Mathematics
- Minimum 45% in +2 or equivalent (for general category)
- Minimum 40% for reserved categories

## Exam Pattern

The IOE Entrance is a computer-based examination of **2 hours** with **80 questions**:

| Subject | Questions | Marks |
|---------|-----------|-------|
| Physics | 22 | 22 |
| Chemistry | 22 | 22 |
| Mathematics | 30 | 30 |
| English | 6 | 6 |
| **Total** | **80** | **80** |

There is **negative marking** of 10% per wrong answer.

## Preparation Strategy

1. **Start early:** Begin at least 6-8 months before the exam.
2. **Master NCERT/CDC textbooks:** 70% of questions come from textbooks.
3. **Solve previous 10 years' papers.**
4. **Take mock tests on Khojney.**
5. **Focus on weak areas.**

## Top Colleges Under IOE

1. **Pulchowk Campus** — Top 100 ranks
2. **Thapathali Campus** — Ranks 100-400
3. **Paschimanchal Campus** — Ranks 400-800

Start your IOE preparation today with Khojney's free mock tests.`,
      readTimeMin: 8, featured: true, views: 12450, publishedAt: new Date("2026-06-01"),
    },
    {
      slug: "mbbs-entrance-iom-complete-preparation",
      title: "MBBS Entrance (IOM): How to Crack Nepal's Toughest Medical Exam",
      excerpt: "IOM MBBS Entrance is the most competitive medical entrance in Nepal. Here's a complete preparation roadmap with syllabus, books, and study plan.",
      categoryId: blogEduCat?.id, authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200",
      content: `# MBBS Entrance (IOM): The Complete Preparation Guide

The IOM MBBS Entrance Examination is the single most competitive medical entrance exam in Nepal.

## Exam Pattern

- **Duration:** 3 hours
- **Total questions:** 200
- **Negative marking:** Yes (10% per wrong answer)

### Subject Distribution

| Subject | Questions | Marks |
|---------|-----------|-------|
| Physics | 50 | 50 |
| Chemistry | 50 | 50 |
| Botany | 25 | 25 |
| Zoology | 25 | 25 |
| English | 50 | 50 |

## Top Books

**Physics:** HC Verma, DC Pandey
**Chemistry:** Morrison & Boyd (Organic), P. Bahadur (Physical)
**Biology:** Truman's Biology, Campbell Biology
**English:** Objective General English by RS Aggarwal

## Study Plan (6 months)

### Month 1-2: Foundation
- Complete +2 syllabus thoroughly
- Make notes for each chapter

### Month 3-4: Advanced
- Solve previous 10 years' IOM papers
- Take weekly subject tests

### Month 5-6: Revision & Mocks
- Take 2-3 mock tests per week
- Revise notes daily

## Cut-off Trends

| Year | General Cut-off | Free Seat Cut-off |
|------|-----------------|-------------------|
| 2023 | 95/200 | 165/200 |
| 2024 | 98/200 | 168/200 |
| 2025 | 100/200 | 170/200 |

Start preparing today with Khojney's free MBBS mock tests.`,
      readTimeMin: 10, featured: true, views: 8900, publishedAt: new Date("2026-05-20"),
    },
    {
      slug: "cmat-exam-pattern-syllabus",
      title: "CMAT Exam 2026: Pattern, Syllabus, and Top Colleges Accepting CMAT",
      excerpt: "Complete guide to CMAT (Central Management Admission Test) for MBA admissions in Nepal — exam pattern, syllabus, top colleges, and preparation tips.",
      categoryId: blogEduCat?.id, authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200",
      content: `# CMAT Exam 2026: The Complete Guide

The **Central Management Admission Test (CMAT)** is the entrance examination for MBA programs under Tribhuvan University's Faculty of Management.

## Exam Pattern

- **Duration:** 2 hours
- **Total questions:** 100
- **Negative marking:** No
- **Mode:** Computer-based

### Sectional Distribution

| Section | Questions | Marks |
|---------|-----------|-------|
| Verbal Ability | 25 | 25 |
| Quantitative Aptitude | 25 | 25 |
| Logical Reasoning | 25 | 25 |
| General Awareness | 25 | 25 |

## Top Colleges Accepting CMAT

1. **Shankar Dev Campus** (TU constituent)
2. **KUSOM** (Kathmanda University)
3. **Pokhara University affiliated colleges**
4. **King's College**
5. **DAV College**

## Cut-off Trends

| College | 2025 Cut-off |
|---------|--------------|
| Shankar Dev Campus | 75/100 |
| King's College | 70/100 |
| KUSOM | 80/100 |

Start your CMAT preparation today with Khojney's free mock tests.`,
      readTimeMin: 7, featured: false, views: 5600, publishedAt: new Date("2026-05-10"),
    },
    {
      slug: "driving-license-nepal-online-application",
      title: "Driving License Nepal: Complete Online Application Guide",
      excerpt: "Step-by-step guide to apply for a driving license in Nepal — online form submission, documents required, written exam, and trial test tips.",
      categoryId: blogGuidesCat?.id, authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200",
      content: `# Driving License Nepal: Complete Application Guide

Getting a driving license in Nepal has become easier with the **online application system** managed by the Department of Transport Management (DoTM).

## Types of Licenses

| Category | Vehicle Type |
|----------|--------------|
| A | Motorcycle/Scooter |
| B | Car/Jeep/Van |
| C | Tempo/Auto-rickshaw |
| D | Pickup/Delivery Van |
| K | Heavy Bus/Truck |

## Step 1: Online Application

1. Visit **[dotm.gov.np](https://dotm.gov.np)**
2. Click "Online License Application"
3. Fill in personal details (citizenship required)
4. Select category (A, B, etc.)
5. Pay application fee (NPR 1,000 for category A, NPR 1,500 for B)

## Step 2: Written Exam

- **Format:** Computer-based, 20 questions
- **Pass marks:** 60% (12 out of 20)
- **Time:** 20 minutes

## Step 3: Trial Test

### Trial Test Components
1. **Track Test:** 8-shaped track, garage parking, gradient test
2. **Road Test:** Drive on real road for 5-10 minutes

## License Fee Structure

| Service | Fee (NPR) |
|---------|-----------|
| New application (Category A) | 1,000 |
| New application (Category B) | 1,500 |
| Renewal | 500 |
| Duplicate | 1,000 |

Start practicing with Khojney's free Driving License mock tests — over 50 tests available.`,
      readTimeMin: 6, featured: true, views: 15200, publishedAt: new Date("2026-06-10"),
    },
    {
      slug: "loksewa-aayog-preparation-guide",
      title: "Loksewa Aayog Preparation: A Complete Roadmap for Nepal Civil Service",
      excerpt: "Everything you need to know about Loksewa (Public Service Commission) exams — vacancy, syllabus, preparation strategy, and tips from successful candidates.",
      categoryId: blogTipsCat?.id, authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200",
      content: `# Loksewa Aayog Preparation: The Complete Roadmap

The **Public Service Commission (Loksewa Aayog)** conducts examinations for civil service positions in Nepal.

## Levels of Loksewa

| Level | Position | Minimum Qualification |
|-------|----------|----------------------|
| Fifth | Kharidar | SEE pass |
| Fourth | Nasu / Non-gazetted | +2 pass |
| Third | Officer (Section Officer) | Bachelor's |

## Exam Process (Officer)

1. **Phase 1 — Preliminary:** Objective MCQ, 100 marks
2. **Phase 2 — Written:** Descriptive, 7 papers (700 marks)
3. **Phase 3 — Interview:** 50 marks

## Best Books for Loksewa

- **Nepali:** Loksewa Nepali Guide by Manoj Karki
- **English:** Competitive English by Hari Prasad Adhikari
- **General Studies:** Samaya Samiksha (monthly)
- **Constitution:** Nepal's Constitution 2072 by Makunda Dev Gurung

## Tips from Successful Candidates

> "Don't chase too many books. Read 5 standard books 5 times each." — *Section Officer, 2080*

> "Constitution is the bible. Read it daily." — *Officer, Ministry of Education*

Start preparing today with Khojney's free Loksewa mock tests.`,
      readTimeMin: 12, featured: false, views: 8700, publishedAt: new Date("2026-05-01"),
    },
    {
      slug: "best-engineering-colleges-nepal",
      title: "Top 10 Engineering Colleges in Nepal (2026 Edition)",
      excerpt: "Comprehensive ranking of Nepal's best engineering colleges based on academic reputation, placements, infrastructure, and faculty quality.",
      categoryId: blogGuidesCat?.id, authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200",
      content: `# Top 10 Engineering Colleges in Nepal (2026)

Choosing the right engineering college is one of the most important career decisions.

## Top 10 Engineering Colleges

### 1. Pulchowk Campus, IOE (TU)
- **Affiliation:** TU (IOE constituent)
- **Annual Intake:** 576 students
- **Top Programs:** Civil, Computer, Electronics, Mechanical, Electrical

### 2. Kathmandu University School of Engineering
- **Affiliation:** KU
- **Top Programs:** Computer, Civil, Electrical, Mechanical

### 3. Thapathali Campus, IOE (TU)
- **Top Programs:** Industrial, Civil, Mechanical, Architecture

### 4. Paschimanchal Campus, IOE (Pokhara)
- **Top Programs:** Civil, Computer, Electronics

### 5. National College of Engineering (NCE)
- **Top Programs:** Civil, Computer, Electronics

## Comparison Table

| College | Affiliation | Annual Fees (NPR) | Placement Rate |
|---------|-------------|-------------------|----------------|
| Pulchowk Campus | TU | 1,20,000 | 95% |
| KU SOE | KU | 1,75,000 | 90% |
| Thapathali Campus | TU | 1,20,000 | 88% |
| Paschimanchal Campus | TU | 1,20,000 | 82% |
| NCE | TU | 1,62,500 | 78% |

## How to Choose

**If you want government recognition and low fees:** Choose Pulchowk.

**If you want research/international exposure:** Choose KU SOE.

All TU engineering admissions are through IOE Entrance Examination. Visit Khojney.com for preparation resources.`,
      readTimeMin: 11, featured: false, views: 9800, publishedAt: new Date("2026-04-25"),
    },
    {
      slug: "see-result-grading-system",
      title: "SEE Result 2082: Grading System and How to Check Online",
      excerpt: "Complete guide to SEE result checking — grading system, GPA calculation, online result portals, and what to do after SEE.",
      categoryId: blogTipsCat?.id, authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200",
      content: `# SEE Result 2082: Complete Guide

The Secondary Education Examination (SEE) is the final examination of secondary level education in Nepal.

## Grading System

| Grade | Grade Point | Marks Range |
|-------|-------------|-------------|
| A+ | 3.6 - 4.0 | 90-100 |
| A | 3.2 - 3.6 | 80-89 |
| B+ | 2.8 - 3.2 | 70-79 |
| B | 2.4 - 2.8 | 60-69 |
| C+ | 2.0 - 2.4 | 50-59 |
| C | 1.6 - 2.0 | 40-49 |
| D+ | 1.2 - 1.6 | 30-39 |
| D | 0.8 - 1.2 | 20-29 |
| E | 0.0 - 0.8 | 0-19 |

## How to Check SEE Result

### Method 1: Online
- Visit **see.gov.np** or **neb.gov.np**
- Enter your symbol number

### Method 2: SMS
- Type: SEE <space> Symbol Number
- Send to: 1600

### Method 3: IVR
- Dial 1600 from NT landline or mobile

## What to Do After SEE

### For A+ Students
- **+2 Science at Budhanilkantha, St. Xavier's, or GBS**

### For A/B+ Students
- **+2 Science at KMC, Princeton, or Global College**

### For B/C Students
- **+2 Management or Humanities**

Visit Khojney's +2 college directory to find the best fit for your grade and budget.`,
      readTimeMin: 5, featured: false, views: 14500, publishedAt: new Date("2026-06-15"),
    },
  ];

  for (const post of blogPosts) {
    const created = await db.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    const tagsToAttach = tagRecords.filter((t) => {
      const slug = post.slug;
      if (slug.includes("ioe") && t.slug === "ioe") return true;
      if (slug.includes("mbbs") && t.slug === "mbbs") return true;
      if (slug.includes("cmat") && t.slug === "cmat") return true;
      if (slug.includes("loksewa") && t.slug === "loksewa") return true;
      if (slug.includes("see") && t.slug === "see") return true;
      if (post.categoryId === blogTipsCat?.id && t.slug === "exams") return true;
      if (post.categoryId === blogEduCat?.id && (t.slug === "education" || t.slug === "exams")) return true;
      if (post.categoryId === blogGuidesCat?.id && (t.slug === "education" || t.slug === "career")) return true;
      return false;
    });
    await db.blogPost.update({
      where: { id: created.id },
      data: { tags: { connect: tagsToAttach.map((t) => ({ id: t.id })) } },
    });
  }
  console.log(`✓ ${blogPosts.length} blog posts`);

  // 9. Exams with questions
  const ioeCat = await db.category.findUnique({ where: { slug: "engineering-entrance" } });
  const mbbsCat = await db.category.findUnique({ where: { slug: "mbbs-entrance" } });
  const cmatCat = await db.category.findUnique({ where: { slug: "cmat" } });
  const loksewaCat = await db.category.findUnique({ where: { slug: "loksewa" } });
  const drivingCat = await db.category.findUnique({ where: { slug: "driving-license" } });
  const nursingCat = await db.category.findUnique({ where: { slug: "nursing-entrance" } });
  const seeCat = await db.category.findUnique({ where: { slug: "see" } });
  const teacherCat = await db.category.findUnique({ where: { slug: "teacher-license" } });

  const mcq = (q: string, opts: string[], correctIdx: number, explanation?: string) => ({
    type: "MCQ" as const,
    question: q,
    options: JSON.stringify(opts),
    correctIdx,
    explanation: explanation ?? `The correct answer is "${opts[correctIdx]}".`,
    marks: 1,
  });

  const exams = [
    {
      slug: "ioe-mock-test-1",
      title: "IOE Entrance Mock Test 1 (Physics)",
      description: "Free IOE Entrance Mock Test on Physics — 22 MCQ questions covering Mechanics, Heat, Optics, Electricity, and Modern Physics. Designed to match the exact pattern of the real IOE entrance.",
      categoryId: ioeCat?.id,
      examType: "MOCK", durationMin: 33, totalMarks: 22, passingMarks: 11,
      difficulty: "MEDIUM", isFeatured: true, tags: "IOE,Engineering,Physics,Mock Test",
      questions: [
        mcq("A body is thrown vertically upward with velocity u. The maximum height reached is:", ["u²/g", "u²/2g", "2u²/g", "u/g"], 1, "Using v² = u² - 2gH, at maximum height v=0, so H = u²/(2g)."),
        mcq("The dimension of force is:", ["[MLT⁻¹]", "[MLT⁻²]", "[ML²T⁻²]", "[M⁰LT⁻²]"], 1, "Force = mass × acceleration = M × LT⁻² = [MLT⁻²]."),
        mcq("The SI unit of electric current is:", ["Volt", "Watt", "Ampere", "Ohm"], 2, "Ampere is the SI base unit of electric current."),
        mcq("A particle moves in a circle of radius r with constant speed v. Its acceleration is:", ["Zero", "v²/r directed towards center", "v/r directed outward", "vr directed along velocity"], 1, "Centripetal acceleration = v²/r, directed towards the center."),
        mcq("Which of the following is a vector quantity?", ["Speed", "Mass", "Velocity", "Time"], 2, "Velocity has both magnitude and direction."),
        mcq("The work done by a force F in displacing a body through distance d at angle θ is:", ["Fd", "Fd sin θ", "Fd cos θ", "Fd tan θ"], 2, "Work = F · d = Fd cos θ."),
        mcq("A body of mass 2 kg is moving with velocity 10 m/s. Its kinetic energy is:", ["10 J", "50 J", "100 J", "200 J"], 2, "KE = ½mv² = ½ × 2 × 10² = 100 J."),
        mcq("The acceleration due to gravity on the surface of the moon is approximately:", ["9.8 m/s²", "1.6 m/s²", "3.7 m/s²", "8.9 m/s²"], 1, "Moon's gravity is about 1/6 of Earth's gravity."),
        mcq("The principle of conservation of energy states that:", ["Energy can be created", "Energy can be destroyed", "Energy can neither be created nor destroyed", "Energy always decreases"], 2, "Energy is conserved."),
        mcq("The unit of frequency is:", ["Newton", "Hertz", "Watt", "Joule"], 1, "Frequency is measured in Hertz (Hz)."),
        mcq("Light travels fastest in:", ["Vacuum", "Water", "Glass", "Diamond"], 0, "Light travels at c = 3×10⁸ m/s in vacuum."),
        mcq("The resistance of a wire depends on:", ["Voltage only", "Current only", "Length, area, and material", "Power only"], 2, "R = ρL/A."),
        mcq("Ohm's law states V = IR. This is valid for:", ["All conductors", "Ohmic conductors at constant temperature", "Semiconductors", "Superconductors"], 1, "Ohm's law is valid only for ohmic conductors at constant temperature."),
        mcq("The refractive index of water is 1.33. The speed of light in water is:", ["3×10⁸ m/s", "2.25×10⁸ m/s", "1.5×10⁸ m/s", "4×10⁸ m/s"], 1, "v = c/n = 3×10⁸/1.33 ≈ 2.25×10⁸ m/s."),
        mcq("A transformer works on the principle of:", ["Self induction", "Mutual induction", "Eddy currents", "Lenz's law"], 1, "Transformers operate on mutual induction."),
        mcq("The half-life of a radioactive substance is 10 years. After 30 years, the fraction remaining is:", ["1/2", "1/4", "1/8", "1/16"], 2, "After 3 half-lives, fraction = (1/2)³ = 1/8."),
        mcq("Which of the following has the highest specific heat capacity?", ["Iron", "Copper", "Water", "Aluminum"], 2, "Water has specific heat 4186 J/kg·K."),
        mcq("A lens of focal length 20 cm forms a real image at 60 cm. The object distance is:", ["15 cm", "30 cm", "20 cm", "40 cm"], 1, "1/f = 1/u + 1/v → u = 30 cm."),
        mcq("The unit of magnetic flux is:", ["Tesla", "Weber", "Henry", "Gauss"], 1, "Magnetic flux is measured in Weber (Wb)."),
        mcq("In a simple harmonic motion, the maximum acceleration occurs at:", ["Mean position", "Extreme position", "Half amplitude", "Quarter amplitude"], 1, "a = -ω²x, maximum at extreme position."),
        mcq("A wave has frequency 500 Hz and wavelength 0.7 m. Its speed is:", ["350 m/s", "700 m/s", "500 m/s", "0.7 m/s"], 0, "v = fλ = 500 × 0.7 = 350 m/s."),
        mcq("The kinetic energy of a satellite orbiting Earth is:", ["Zero", "Equal to its potential energy", "Half the magnitude of its potential energy", "Twice its potential energy"], 2, "For a satellite: KE = (1/2)|PE|."),
      ],
    },
    {
      slug: "mbbs-mock-test-physics-1",
      title: "MBBS Entrance Mock Test — Physics",
      description: "25-question Physics mock test for IOM MBBS Entrance Examination. Covers all major topics with detailed explanations.",
      categoryId: mbbsCat?.id,
      examType: "MOCK", durationMin: 30, totalMarks: 25, passingMarks: 13,
      difficulty: "HARD", isFeatured: true, tags: "MBBS,IOM,Medical,Physics",
      questions: [
        mcq("The escape velocity from Earth's surface is approximately:", ["7.9 km/s", "11.2 km/s", "9.8 km/s", "15 km/s"], 1, "Escape velocity = √(2gR) ≈ 11.2 km/s."),
        mcq("The wavelength of visible light ranges from:", ["100-400 nm", "400-700 nm", "700-1000 nm", "1000-10000 nm"], 1, "Visible light: ~400 nm (violet) to ~700 nm (red)."),
        mcq("A convex lens of focal length 15 cm is used as a magnifying glass. The magnification when the image is at near point (25 cm) is:", ["1.67", "2.67", "0.6", "5"], 1, "M = 1 + D/f = 1 + 25/15 = 2.67."),
        mcq("Which of the following is NOT a fundamental force?", ["Gravitational force", "Electromagnetic force", "Frictional force", "Strong nuclear force"], 2, "Friction is a manifestation of electromagnetic force."),
        mcq("The critical angle for total internal reflection depends on:", ["Angle of incidence", "Refractive indices of two media", "Wavelength only", "Intensity of light"], 1, "sin(critical angle) = 1/n."),
        mcq("In an AC circuit with pure capacitor, the current:", ["Leads voltage by 90°", "Lags voltage by 90°", "Is in phase with voltage", "Is 180° out of phase"], 0, "In a capacitor, current leads voltage by 90°."),
        mcq("The photoelectric effect was explained by:", ["Newton", "Maxwell", "Einstein", "Bohr"], 2, "Einstein explained the photoelectric effect in 1905."),
        mcq("The de Broglie wavelength of an electron accelerated through potential V is:", ["h/√(2meV)", "h/(meV)", "hV/m", "h/(2meV)"], 0, "λ = h/p = h/√(2meV)."),
        mcq("The nuclear force is:", ["Electromagnetic", "Gravitational", "Short-range and strong", "Long-range and weak"], 2, "Nuclear force is short-range (~1-3 fm) and the strongest."),
        mcq("A Zener diode is used as:", ["Rectifier", "Amplifier", "Voltage regulator", "Oscillator"], 2, "Zener diode operates in reverse breakdown, providing stable voltage."),
        mcq("The half-life of radium-226 is 1600 years. The decay constant is approximately:", ["4.3×10⁻⁴/year", "1.4×10⁻⁴/year", "1.4×10⁻¹¹/year", "4.3×10⁻¹¹/year"], 0, "λ = 0.693/T₁/₂ = 0.693/1600."),
        mcq("The capacitance of a parallel plate capacitor increases when:", ["Distance between plates increases", "Area of plates decreases", "Dielectric is inserted", "Charge is removed"], 2, "C = ε₀A/d; inserting dielectric increases ε."),
        mcq("In Lenz's law, the induced current direction is such that it:", ["Aids the change in flux", "Opposes the change in flux", "Is perpendicular to flux", "Is zero"], 1, "Lenz's law: induced current opposes the change in flux."),
        mcq("The coefficient of friction between two surfaces depends on:", ["Area of contact", "Normal force", "Nature of surfaces", "Velocity"], 2, "Coefficient of friction depends on the nature of materials."),
        mcq("An object weighing 600 N on Earth weighs on the Moon (g_moon = g/6):", ["100 N", "600 N", "3600 N", "0 N"], 0, "Weight on Moon = 600/6 = 100 N."),
        mcq("The unit of magnetic field intensity is:", ["Tesla", "Weber", "Ampere/meter", "Henry"], 2, "Magnetic field intensity H is measured in A/m."),
        mcq("An ideal gas at constant pressure has volume V at temperature T. If temperature doubles, volume:", ["Halves", "Doubles", "Triples", "Remains same"], 1, "Charles's law: V ∝ T at constant pressure."),
        mcq("The dimension of pressure is:", ["[ML⁻¹T⁻²]", "[MLT⁻²]", "[ML⁻¹T⁻¹]", "[ML²T⁻²]"], 0, "Pressure = Force/Area = MLT⁻²/L² = [ML⁻¹T⁻²]."),
        mcq("Which type of wave is light?", ["Longitudinal", "Transverse", "Both", "Neither"], 1, "Light is a transverse electromagnetic wave."),
        mcq("A body executing SHM has maximum velocity at:", ["Extreme position", "Mean position", "Half amplitude", "Quarter amplitude"], 1, "In SHM, velocity is maximum at the mean position."),
        mcq("The value of g at the center of Earth is:", ["Zero", "Maximum", "9.8 m/s²", "Infinite"], 0, "At Earth's center, net g = 0."),
        mcq("The Young's modulus has the same unit as:", ["Force", "Stress", "Strain", "Energy"], 1, "Young's modulus unit = stress unit (Pa)."),
        mcq("The angular momentum of a body is conserved when:", ["Net force is zero", "Net torque is zero", "Net momentum is zero", "Energy is conserved"], 1, "Angular momentum is conserved when net external torque is zero."),
        mcq("A concave mirror of focal length 10 cm forms a real image of an object placed at 15 cm. Image distance is:", ["30 cm", "20 cm", "6 cm", "5 cm"], 0, "1/v = 1/f - 1/u = 1/10 - 1/15 = 1/30, v = 30 cm."),
        mcq("The Coulomb force between two charges is F. If distance is doubled, force becomes:", ["F/2", "F/4", "2F", "4F"], 1, "Coulomb's law: F ∝ 1/r²."),
      ],
    },
    {
      slug: "cmat-mock-test-1",
      title: "CMAT Mock Test 1 — Verbal Ability",
      description: "25 MCQ questions on Verbal Ability for CMAT (MBA Entrance). Covers Reading Comprehension, Vocabulary, Grammar, and Para Jumbles.",
      categoryId: cmatCat?.id,
      examType: "MOCK", durationMin: 30, totalMarks: 25, passingMarks: 13,
      difficulty: "MEDIUM", isFeatured: true, tags: "CMAT,MBA,Management,Verbal",
      questions: [
        mcq("Choose the synonym of 'Ephemeral':", ["Eternal", "Short-lived", "Strong", "Beautiful"], 1, "Ephemeral means lasting for a very short time."),
        mcq("Choose the antonym of 'Benevolent':", ["Kind", "Generous", "Malevolent", "Friendly"], 2, "Malevolent means wishing harm."),
        mcq("Fill in the blank: 'She is allergic ____ dust.'", ["from", "to", "with", "of"], 1, "Allergic takes 'to'."),
        mcq("Identify the correct sentence:", ["He don't know the answer.", "He doesn't knows the answer.", "He doesn't know the answer.", "He not know the answer."], 2, "Correct: He doesn't know."),
        mcq("Choose the correct spelling:", ["Accomodation", "Acommodation", "Accommodation", "Acomodation"], 2, "Accommodation: double 'c' and double 'm'."),
        mcq("What is the meaning of 'A blessing in disguise'?", ["An obvious blessing", "A bad thing that turns out good", "A hidden curse", "A religious blessing"], 1, "A misfortune that has positive results."),
        mcq("Choose the correct article: '____ honest man is respected.'", ["A", "An", "The", "No article"], 1, "'An' before vowel sound (silent h)."),
        mcq("Identify the part of speech of 'quickly' in 'He runs quickly':", ["Noun", "Verb", "Adjective", "Adverb"], 3, "Quickly modifies verb 'runs' = adverb."),
        mcq("Choose the correct idiom meaning 'to be very happy':", ["On cloud nine", "Under the weather", "Out of the blue", "Piece of cake"], 0, "On cloud nine = extremely happy."),
        mcq("Fill in the blank: 'I have lived in Kathmandu ____ 10 years.'", ["for", "since", "from", "in"], 0, "Use 'for' with duration."),
        mcq("Choose the correct passive voice of 'She writes a letter':", ["A letter is written by her.", "A letter was written by her.", "A letter is being written by her.", "A letter has been written by her."], 0, "Present simple → passive: am/is/are + past participle."),
        mcq("What is the meaning of 'Peruse'?", ["To read carefully", "To ignore", "To destroy", "To create"], 0, "Peruse = read carefully."),
        mcq("Choose the correct preposition: 'He is good ____ mathematics.'", ["in", "at", "on", "for"], 1, "Good at + activity."),
        mcq("Identify the antonym of 'Verbose':", ["Wordy", "Concise", "Talkative", "Lengthy"], 1, "Verbose antonym = concise."),
        mcq("Choose the correct form: 'Each of the students ____ a book.'", ["have", "has", "are having", "were having"], 1, "'Each' takes singular verb."),
        mcq("The phrase 'Break the ice' means:", ["To break something", "To start a conversation", "To end a relationship", "To make ice"], 1, "Break the ice = initiate conversation."),
        mcq("Choose the correct sentence:", ["Neither of the boys are here.", "Neither of the boys is here.", "Neither of the boy is here.", "Neither of the boys were here."], 1, "'Neither of' takes singular verb."),
        mcq("What is the meaning of 'Lucid'?", ["Confused", "Clear", "Dark", "Heavy"], 1, "Lucid = clear."),
        mcq("Choose the correct indirect speech: He said, 'I am tired.'", ["He said that I am tired.", "He said that he was tired.", "He said he is tired.", "He says he was tired."], 1, "Present → past, pronoun changes."),
        mcq("Choose the correct word: 'The police ____ investigating the case.'", ["is", "are", "was", "has"], 1, "Police is plural noun."),
        mcq("What is a synonym for 'Mitigate'?", ["Increase", "Reduce", "Eliminate", "Destroy"], 1, "Mitigate = reduce."),
        mcq("Choose the correct article: '____ sun rises in the east.'", ["A", "An", "The", "No article"], 2, "Use 'The' for unique objects."),
        mcq("Identify the figure of speech: 'The wind whispered through the trees.'", ["Simile", "Metaphor", "Personification", "Hyperbole"], 2, "Giving human qualities to wind = personification."),
        mcq("Choose the correct preposition: 'She is afraid ____ spiders.'", ["from", "of", "with", "to"], 1, "Afraid takes 'of'."),
        mcq("Fill in the blank: 'If I ____ rich, I would travel the world.'", ["am", "was", "were", "be"], 2, "Second conditional uses 'were'."),
      ],
    },
    {
      slug: "loksewa-aptitude-test-1",
      title: "Loksewa Aayog Aptitude Test (Section Officer) — Set 1",
      description: "Mock aptitude test for Loksewa Section Officer preliminary exam. Covers reasoning, quantitative, and general awareness.",
      categoryId: loksewaCat?.id,
      examType: "MOCK", durationMin: 30, totalMarks: 25, passingMarks: 13,
      difficulty: "MEDIUM", isFeatured: true, tags: "Loksewa,Civil Service,Government",
      questions: [
        mcq("The present constitution of Nepal was promulgated on:", ["September 19, 2015", "September 20, 2015", "August 19, 2015", "October 19, 2015"], 1, "Constitution of Nepal 2072 was promulgated on Ashoj 1, 2072 BS."),
        mcq("How many provinces are there in Nepal?", ["5", "6", "7", "8"], 2, "Nepal has 7 provinces."),
        mcq("The headquarters of Province No. 1 (Koshi) is:", ["Biratnagar", "Bhedetar", "Itahari", "Dharan"], 1, "Bhedetar was declared the permanent headquarters of Koshi Province."),
        mcq("The Speaker of the House of Representatives is elected for:", ["4 years", "5 years", "6 years", "Until house dissolution"], 1, "Speaker's term is 5 years."),
        mcq("Which article of the Constitution deals with Right to Equality?", ["Article 12", "Article 14", "Article 17", "Article 18"], 3, "Article 18 guarantees Right to Equality."),
        mcq("Find the odd one: 3, 5, 7, 9, 11, 13", ["9", "11", "5", "7"], 0, "9 is not a prime, rest are primes."),
        mcq("If A:B = 2:3 and B:C = 4:5, then A:C is:", ["8:15", "2:5", "8:5", "5:8"], 0, "A:B:C = 8:12:15, so A:C = 8:15."),
        mcq("A train 150m long passes a pole in 15 seconds. Its speed is:", ["36 km/h", "10 m/s", "Both", "20 m/s"], 2, "Speed = 150/15 = 10 m/s = 36 km/h."),
        mcq("Complete the series: 2, 6, 12, 20, 30, ?", ["40", "42", "44", "46"], 1, "Differences: 4,6,8,10,12. Next = 30+12 = 42."),
        mcq("Who was the first elected Prime Minister of Nepal?", ["Girija Prasad Koirala", "BP Koirala", "Krishna Prasad Bhattarai", "Manmohan Adhikari"], 1, "BP Koirala became the first elected PM in 1959."),
        mcq("The highest peak in Nepal (and the world) is:", ["K2", "Kanchenjunga", "Mount Everest", "Annapurna"], 2, "Mount Everest (Sagarmatha) — 8,848.86 m."),
        mcq("The Treaty of Sugauli was signed between Nepal and:", ["China", "British India", "Tibet", "Sikkim"], 1, "Treaty of Sugauli (1816) with British East India Company."),
        mcq("The largest district of Nepal by area is:", ["Humla", "Dolpa", "Mugu", "Mustang"], 1, "Dolpa is the largest district (5,855 km²)."),
        mcq("Find the missing number: 4, 9, 25, 49, ?", ["81", "100", "121", "144"], 2, "Squares of primes: 2², 3², 5², 7², next is 11² = 121."),
        mcq("A clock shows 3:15. The angle between hour and minute hand is:", ["0°", "7.5°", "15°", "22.5°"], 1, "At 3:15, hour hand at 97.5°, minute at 90°. Difference = 7.5°."),
        mcq("If today is Monday, what day will it be 100 days from now?", ["Tuesday", "Wednesday", "Thursday", "Friday"], 1, "100 mod 7 = 2. Monday + 2 = Wednesday."),
        mcq("The currency of Nepal (NPR) is regulated by:", ["Nepal Rastra Bank", "Nepal Bank Limited", "Ministry of Finance", "Asian Development Bank"], 0, "Nepal Rastra Bank is the central bank."),
        mcq("Find the HCF of 12, 18, 24:", ["2", "4", "6", "8"], 2, "HCF(12,18,24) = 6."),
        mcq("The largest lake in Nepal is:", ["Phewa Lake", "Rara Lake", "Tilicho Lake", "Begnas Lake"], 1, "Rara Lake is the largest natural lake in Nepal."),
        mcq("If 20% of a number is 50, then the number is:", ["100", "200", "250", "300"], 2, "0.2x = 50, so x = 250."),
        mcq("The capital of Gandaki Province is:", ["Pokhara", "Gorkha", "Lamjung", "Baglung"], 0, "Pokhara is the capital of Gandaki Province."),
        mcq("Who is the head of state in Nepal?", ["President", "Prime Minister", "King", "Chief Justice"], 0, "Nepal is a federal republic; President is head of state."),
        mcq("Which of the following is NOT a fundamental right in Nepal's Constitution?", ["Right to Equality", "Right to Property", "Right to Privacy", "Right to Vote as fundamental"], 3, "Right to vote is not explicitly listed in Part 3."),
        mcq("Nepal's constitution was promulgated in which year BS?", ["2063 BS", "2070 BS", "2072 BS", "2075 BS"], 2, "Constitution of Nepal promulgated on Ashoj 1, 2072 BS."),
        mcq("The principle of separation of powers in Nepal is based on:", ["American model", "British model", "French model", "Mixed model"], 3, "Nepal follows a mixed system with checks and balances."),
      ],
    },
    {
      slug: "driving-license-mock-test-1",
      title: "Driving License Written Exam — Mock Test 1 (Category A)",
      description: "20-question mock test for Nepal's Driving License written exam (Motorcycle/Scooter — Category A). Pattern matches the actual DoTM exam.",
      categoryId: drivingCat?.id,
      examType: "MOCK", durationMin: 20, totalMarks: 20, passingMarks: 12,
      difficulty: "EASY", isFeatured: true, tags: "Driving License,Mock Test",
      questions: [
        mcq("The minimum age to obtain a motorcycle license (Category A) in Nepal is:", ["16 years", "17 years", "18 years", "21 years"], 0, "Minimum age for Category A is 16 years."),
        mcq("What does a red traffic light mean?", ["Slow down", "Stop", "Proceed with caution", "Yield"], 1, "Red light means STOP."),
        mcq("A yellow traffic light means:", ["Go fast", "Stop if safe to do so", "Yield to oncoming traffic", "Continue at same speed"], 1, "Yellow light warns red is about to appear."),
        mcq("On a two-way road, you should drive on:", ["Right side", "Left side", "Center", "Any side"], 1, "Nepal follows left-hand traffic."),
        mcq("The legal blood alcohol limit for drivers in Nepal is:", ["0.05%", "0.08%", "0.10%", "Zero tolerance"], 3, "Nepal has zero tolerance for drink-driving."),
        mcq("When overtaking another vehicle, you should overtake from:", ["Left side", "Right side", "Either side", "Behind"], 1, "Overtake from the right on left-hand traffic roads."),
        mcq("The maximum speed limit for motorcycles inside urban areas is:", ["30 km/h", "40 km/h", "50 km/h", "60 km/h"], 1, "Inside urban areas: 40 km/h for motorcycles."),
        mcq("A triangle sign with red border is a:", ["Information sign", "Warning sign", "Mandatory sign", "Prohibition sign"], 1, "Triangular signs with red border are warning signs."),
        mcq("A circular sign with red border and a symbol inside is a:", ["Warning sign", "Mandatory sign", "Prohibitory sign", "Information sign"], 2, "Circular signs with red border are prohibitory."),
        mcq("When approaching a zebra crossing, you should:", ["Speed up", "Slow down and stop if pedestrians are crossing", "Honk and continue", "Maintain speed"], 1, "Pedestrians have priority at zebra crossings."),
        mcq("The valid driving license is renewed every:", ["2 years", "3 years", "5 years", "10 years"], 2, "Nepali driving license renewed every 5 years."),
        mcq("Use of horn is prohibited near:", ["Hospitals and schools", "Markets", "Bridges", "All of the above"], 0, "Horn prohibited near hospitals, schools, courts."),
        mcq("When riding a motorcycle, the helmet must be worn by:", ["Only the rider", "Only the pillion", "Both rider and pillion", "Optional for all"], 2, "Both rider and pillion must wear helmets."),
        mcq("The hand signal for stopping is:", ["Right arm extended horizontally", "Right arm raised vertically", "Right arm pointing down", "Left arm extended"], 1, "Right arm raised vertically with palm forward = stop."),
        mcq("Headlights must be used:", ["Only at night", "At night and in poor visibility", "Only in tunnels", "Never during day"], 1, "Use headlights at night and in poor visibility."),
        mcq("The minimum distance to maintain from the vehicle in front is:", ["1 second", "2 seconds", "5 seconds", "10 seconds"], 1, "Use the 2-second rule for safe following distance."),
        mcq("When approaching an intersection with no signals, you should:", ["Speed up", "Slow down and yield to traffic from right", "Stop completely", "Honk and proceed"], 1, "Yield to traffic from the right at uncontrolled intersections."),
        mcq("Parking is prohibited within how many meters of a fire station?", ["5 meters", "10 meters", "15 meters", "20 meters"], 2, "No parking within 15 meters of fire station entrance."),
        mcq("If your motorcycle's brake fails while riding, you should:", ["Jump off", "Use engine braking and hand brake gradually", "Honk continuously", "Speed up"], 1, "Downshift to use engine braking, then gently apply hand brake."),
        mcq("The valid driving license in Nepal is issued by:", ["Traffic Police", "Department of Transport Management (DoTM)", "Municipality", "Nepal Police"], 1, "Driving licenses are issued by DoTM."),
      ],
    },
    {
      slug: "see-mock-test-science",
      title: "SEE Science Mock Test — Set 1",
      description: "Free SEE Science mock test covering Physics, Chemistry, Biology, and Earth Science. 20 questions matching the actual SEE pattern.",
      categoryId: seeCat?.id,
      examType: "MOCK", durationMin: 25, totalMarks: 20, passingMarks: 10,
      difficulty: "EASY", isFeatured: true, tags: "SEE,Science,Mock Test",
      questions: [
        mcq("The SI unit of electric current is:", ["Volt", "Ampere", "Watt", "Ohm"], 1, "Ampere (A) is the SI unit of electric current."),
        mcq("Which gas is most abundant in Earth's atmosphere?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 1, "Nitrogen makes up about 78% of Earth's atmosphere."),
        mcq("The powerhouse of the cell is:", ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], 1, "Mitochondria produces ATP energy."),
        mcq("The chemical formula of water is:", ["CO₂", "H₂O", "O₂", "NaCl"], 1, "Water = H₂O."),
        mcq("Which of the following is a renewable source of energy?", ["Coal", "Petroleum", "Solar energy", "Natural gas"], 2, "Solar energy is renewable."),
        mcq("The phenomenon of splitting of white light into seven colors is called:", ["Reflection", "Refraction", "Dispersion", "Diffraction"], 2, "Dispersion = splitting of light into colors."),
        mcq("Which acid is present in the human stomach?", ["Sulfuric acid", "Hydrochloric acid", "Nitric acid", "Acetic acid"], 1, "HCl is in the stomach."),
        mcq("The unit of heredity is:", ["Cell", "Gene", "Chromosome", "Tissue"], 1, "Gene is the basic unit of heredity."),
        mcq("Salt water can be separated by:", ["Filtration", "Distillation", "Sedimentation", "Decantation"], 1, "Distillation separates salt from water."),
        mcq("The process by which plants make food is:", ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], 1, "Photosynthesis: plants make food using sunlight."),
        mcq("Which metal is liquid at room temperature?", ["Iron", "Mercury", "Copper", "Aluminum"], 1, "Mercury is liquid at room temperature."),
        mcq("The speed of light in vacuum is approximately:", ["3×10⁵ m/s", "3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s"], 1, "c = 3×10⁸ m/s."),
        mcq("Which of the following is a non-renewable resource?", ["Solar energy", "Wind energy", "Petroleum", "Hydropower"], 2, "Petroleum is non-renewable."),
        mcq("The unit of force is:", ["Joule", "Newton", "Watt", "Pascal"], 1, "Force is measured in Newton (N)."),
        mcq("Which planet is known as the 'Red Planet'?", ["Venus", "Mars", "Jupiter", "Saturn"], 1, "Mars = Red Planet."),
        mcq("The chemical symbol for gold is:", ["Ag", "Au", "Gd", "Go"], 1, "Gold's symbol is Au (aurum)."),
        mcq("Which blood cells fight infection?", ["Red blood cells", "White blood cells", "Platelets", "Plasma"], 1, "White blood cells fight infections."),
        mcq("The largest planet in our solar system is:", ["Earth", "Mars", "Jupiter", "Saturn"], 2, "Jupiter is the largest planet."),
        mcq("Which gas is released during photosynthesis?", ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], 1, "Oxygen is released as byproduct."),
        mcq("An object floats in water if its density is:", ["More than water", "Less than water", "Equal to water", "Independent of density"], 1, "Floats if density < water's density."),
      ],
    },
    {
      slug: "nursing-entrance-mock-test-1",
      title: "BSc Nursing Entrance Mock Test — Set 1",
      description: "Free mock test for BSc Nursing entrance exam in Nepal. Covers Biology, Chemistry, Physics, and English — 25 MCQs.",
      categoryId: nursingCat?.id,
      examType: "MOCK", durationMin: 35, totalMarks: 25, passingMarks: 13,
      difficulty: "MEDIUM", isFeatured: false, tags: "Nursing,Medical,Mock Test",
      questions: [
        mcq("The largest organ in the human body is:", ["Liver", "Skin", "Brain", "Lungs"], 1, "Skin is the largest organ."),
        mcq("The normal blood pressure of a healthy adult is:", ["80/120", "120/80", "100/60", "140/90"], 1, "Normal BP: 120/80 mmHg."),
        mcq("How many bones are there in an adult human body?", ["196", "206", "216", "226"], 1, "Adult body has 206 bones."),
        mcq("The universal donor blood group is:", ["A", "B", "AB", "O negative"], 3, "O negative = universal donor."),
        mcq("The universal recipient blood group is:", ["A+", "B+", "AB+", "O+"], 2, "AB+ = universal recipient."),
        mcq("Vitamin C is also known as:", ["Retinol", "Thiamine", "Ascorbic acid", "Niacin"], 2, "Vitamin C = ascorbic acid."),
        mcq("Deficiency of Vitamin D causes:", ["Scurvy", "Rickets", "Night blindness", "Beri-beri"], 1, "Vitamin D deficiency causes rickets."),
        mcq("The pH of human blood is approximately:", ["6.4", "7.4", "8.4", "5.4"], 1, "Blood pH: 7.35-7.45."),
        mcq("Which hormone is called the 'fight or flight' hormone?", ["Insulin", "Adrenaline", "Thyroxine", "Estrogen"], 1, "Adrenaline = fight-or-flight."),
        mcq("The functional unit of the kidney is:", ["Neuron", "Nephron", "Alveolus", "Hepatocyte"], 1, "Nephron is the kidney's functional unit."),
        mcq("The number of chambers in the human heart is:", ["2", "3", "4", "5"], 2, "Heart has 4 chambers: 2 atria, 2 ventricles."),
        mcq("Which blood vessel carries oxygenated blood from lungs to heart?", ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"], 1, "Pulmonary vein carries oxygenated blood from lungs."),
        mcq("The largest artery in the human body is:", ["Pulmonary artery", "Aorta", "Carotid artery", "Femoral artery"], 1, "Aorta is the largest artery."),
        mcq("Insulin is produced by:", ["Liver", "Pancreas", "Kidney", "Spleen"], 1, "Insulin produced by pancreas beta cells."),
        mcq("Which of the following is NOT a function of the liver?", ["Bile production", "Detoxification", "Protein synthesis", "Insulin production"], 3, "Insulin produced by pancreas, not liver."),
        mcq("The normal body temperature of humans is:", ["35°C", "37°C", "39°C", "40°C"], 1, "Normal body temperature: 37°C."),
        mcq("The longest bone in the human body is:", ["Tibia", "Fibula", "Femur", "Humerus"], 2, "Femur is the longest bone."),
        mcq("Which organ is responsible for gas exchange in humans?", ["Heart", "Lungs", "Liver", "Kidney"], 1, "Lungs handle gas exchange."),
        mcq("How many pairs of spinal nerves are there in humans?", ["12", "21", "31", "41"], 2, "Humans have 31 pairs of spinal nerves."),
        mcq("The first vaccine was developed by:", ["Louis Pasteur", "Edward Jenner", "Alexander Fleming", "Robert Koch"], 1, "Edward Jenner developed smallpox vaccine in 1796."),
        mcq("Which mineral is essential for blood clotting?", ["Iron", "Calcium", "Sodium", "Potassium"], 1, "Calcium is essential for clotting."),
        mcq("The disease caused by Plasmodium is:", ["Dengue", "Malaria", "Typhoid", "Cholera"], 1, "Plasmodium causes malaria."),
        mcq("Which vitamin is fat-soluble?", ["Vitamin C", "Vitamin B complex", "Vitamin A", "None"], 2, "Fat-soluble vitamins: A, D, E, K."),
        mcq("The 'master gland' of the human body is:", ["Thyroid", "Pituitary", "Adrenal", "Pancreas"], 1, "Pituitary is the master gland."),
        mcq("Red blood cells are produced in:", ["Liver", "Bone marrow", "Spleen", "Kidney"], 1, "RBCs produced in red bone marrow."),
      ],
    },
    {
      slug: "teacher-license-mock-test-1",
      title: "Teacher License Mock Test — Set 1",
      description: "Free mock test for Teacher Service Commission (TSC) Teacher License examination in Nepal. Covers pedagogy, curriculum, and general knowledge.",
      categoryId: teacherCat?.id,
      examType: "MOCK", durationMin: 30, totalMarks: 25, passingMarks: 13,
      difficulty: "MEDIUM", isFeatured: false, tags: "Teacher License,TSC,Education",
      questions: [
        mcq("Who is known as the father of modern education?", ["John Dewey", "Jean-Jacques Rousseau", "Friedrich Froebel", "Johann Heinrich Pestalozzi"], 0, "John Dewey is called the father of modern educational philosophy."),
        mcq("The word 'pedagogy' refers to:", ["Subject matter", "Method of teaching", "Classroom management", "Curriculum design"], 1, "Pedagogy = method and practice of teaching."),
        mcq("Bloom's taxonomy of educational objectives has how many domains?", ["2", "3", "4", "5"], 1, "3 domains: Cognitive, Affective, Psychomotor."),
        mcq("The highest level of Bloom's cognitive domain (revised) is:", ["Remembering", "Understanding", "Analyzing", "Creating"], 3, "Revised: Create is the highest."),
        mcq("The minimum qualification for primary teacher license in Nepal is:", ["SEE pass", "+2 pass", "Bachelor's", "Master's"], 1, "+2 with teaching qualification for primary."),
        mcq("The TSC (Teacher Service Commission) was established in:", ["2016", "2017", "2018", "2019"], 1, "TSC established in 2017 (2074 BS)."),
        mcq("In Nepal, the constitution guarantees free education up to:", ["Basic level (Grade 8)", "Secondary level (Grade 10)", "+2 level", "Bachelor's level"], 1, "Free up to secondary level (Grade 10)."),
        mcq("The '3 Ps' of teaching are:", ["Plan, Prepare, Practice", "Presentation, Practice, Production", "Plan, Present, Practice", "Prepare, Present, Produce"], 1, "PPP: Presentation, Practice, Production."),
        mcq("Formative assessment is also called:", ["Final assessment", "Continuous assessment", "Summative assessment", "Diagnostic assessment"], 1, "Formative = continuous."),
        mcq("The father of kindergarten is:", ["John Dewey", "Friedrich Froebel", "Maria Montessori", "Jean Piaget"], 1, "Froebel coined 'kindergarten' in 1840."),
        mcq("Multiple Intelligence theory was proposed by:", ["Jean Piaget", "Lev Vygotsky", "Howard Gardner", "Benjamin Bloom"], 2, "Howard Gardner proposed Multiple Intelligences in 1983."),
        mcq("The zone of proximal development (ZPD) was introduced by:", ["Jean Piaget", "Lev Vygotsky", "B.F. Skinner", "Pavlov"], 1, "ZPD is Vygotsky's concept."),
        mcq("Constructivism in education emphasizes:", ["Rote learning", "Active learning by constructing knowledge", "Teacher-centered approach", "Standardized testing"], 1, "Constructivism: active construction of knowledge."),
        mcq("The SSDP (School Sector Development Plan) in Nepal covers:", ["2016-2023", "2017-2022", "2016-2022", "2018-2025"], 0, "SSDP 2016-2023."),
        mcq("Inclusive education means:", ["Separate schools for disabled", "Same school for all regardless of differences", "Only for gifted students", "Only for boys"], 1, "All students learn together regardless of differences."),
        mcq("The TSC teacher license is valid for:", ["Lifetime", "5 years", "10 years", "Until retirement"], 1, "TSC license valid for 5 years."),
        mcq("Which is NOT a characteristic of a good teacher?", ["Patience", "Subject knowledge", "Strictness", "Empathy"], 2, "Strictness alone is not positive."),
        mcq("The minimum age for primary teacher license in Nepal is:", ["18 years", "20 years", "21 years", "25 years"], 0, "Minimum age: 18 years."),
        mcq("Which method is student-centered?", ["Lecture method", "Demonstration method", "Project method", "Drill method"], 2, "Project method is student-centered."),
        mcq("Project method was developed by:", ["John Dewey", "William Kilpatrick", "Maria Montessori", "Friedrich Froebel"], 1, "William Kilpatrick formalized the project method."),
        mcq("In Nepal, the school academic year starts in:", ["January", "April", "May/June (Baisakh/Jestha)", "September"], 2, "Academic year starts in Baisakh (mid-April)."),
        mcq("Which of the following is NOT a learning style in VARK model?", ["Visual", "Auditory", "Reading/Writing", "Speaking"], 3, "VARK: Visual, Auditory, Reading/Writing, Kinesthetic."),
        mcq("NEB (National Examinations Board) was established in:", ["2016", "2017", "2018", "2019"], 1, "NEB restructured in 2073 BS (2016/2017 AD)."),
        mcq("The minimum teaching hours per week for secondary teachers in Nepal is:", ["16 hours", "22 hours", "25 hours", "30 hours"], 1, "Minimum 22 hours/week for secondary teachers."),
        mcq("The minimum qualification for lower secondary teacher license is:", ["SEE pass", "+2 pass", "Bachelor's", "Master's"], 1, "+2 for lower secondary level."),
      ],
    },
  ];

  for (const exam of exams) {
    const { questions, ...examData } = exam;
    const created = await db.exam.upsert({
      where: { slug: exam.slug },
      update: examData,
      create: examData,
    });
    await db.examQuestion.deleteMany({ where: { examId: created.id } });
    for (let i = 0; i < questions.length; i++) {
      await db.examQuestion.create({
        data: {
          ...questions[i],
          examId: created.id,
          order: i,
        },
      });
    }
  }
  console.log(`✓ ${exams.length} exams with questions`);

  // 10. Sample exam attempt for leaderboard
  const ioeExam = await db.exam.findUnique({ where: { slug: "ioe-mock-test-1" } });
  if (ioeExam) {
    const sampleAttempters = [
      { name: "Sita Sharma", email: "sita@example.com", score: 20, correct: 20, wrong: 2, duration: 1800 },
      { name: "Ram Thapa", email: "ram@example.com", score: 19, correct: 19, wrong: 1, duration: 1950 },
      { name: "Anita Rai", email: "anita@example.com", score: 18, correct: 18, wrong: 2, duration: 1700 },
      { name: "Bishal Gurung", email: "bishal@example.com", score: 17, correct: 17, wrong: 3, duration: 1850 },
      { name: "Pooja Shrestha", email: "pooja@example.com", score: 16, correct: 16, wrong: 4, duration: 1750 },
    ];
    for (const a of sampleAttempters) {
      const u = await db.user.upsert({
        where: { email: a.email },
        update: {},
        create: { email: a.email, name: a.name, role: "USER", passwordHash: "demo", location: "Kathmandu" },
      });
      await db.examAttempt.create({
        data: {
          userId: u.id, examId: ioeExam.id,
          score: a.score, totalMarks: 22,
          correctCount: a.correct, wrongCount: a.wrong,
          durationSec: a.duration,
          finishedAt: new Date(Date.now() - Math.random() * 86400000 * 7),
          answers: JSON.stringify([]),
        },
      });
    }
    const attempts = await db.examAttempt.findMany({
      where: { examId: ioeExam.id, finishedAt: { not: null } },
      orderBy: { score: "desc" },
    });
    for (let i = 0; i < attempts.length; i++) {
      await db.examAttempt.update({
        where: { id: attempts[i].id },
        data: { rank: i + 1 },
      });
    }
    console.log(`✓ ${attempts.length} sample exam attempts for leaderboard`);
  }

  // 11. Sample notifications for demo user
  await db.notification.createMany({
    data: [
      { userId: demoUser.id, title: "Welcome to Khojney!", message: "Explore mock exams, colleges, scholarships, and more.", type: "SUCCESS" },
      { userId: demoUser.id, title: "New IOE Mock Test Available", message: "Practice with the latest IOE Physics mock test.", type: "INFO", link: "/exams/ioe-mock-test-1" },
      { userId: demoUser.id, title: "Chevening Scholarship Deadline Approaching", message: "Submit your application before November 5, 2026.", type: "WARNING", link: "/scholarships/chevening-scholarship-uk" },
    ],
  });
  console.log(`✓ 3 sample notifications`);

  // 12. Sample reviews
  const pulchowk = await db.college.findUnique({ where: { slug: "ioe-pulchowk-campus" } });
  if (pulchowk) {
    const reviewers = [
      { email: "reviewer1@example.com", name: "Aayush K.", rating: 5, title: "Best engineering college in Nepal", comment: "Excellent faculty, world-class labs, and great placement opportunities." },
      { email: "reviewer2@example.com", name: "Priya M.", rating: 5, title: "Pulchowk changed my life", comment: "Competitive but supportive environment." },
      { email: "reviewer3@example.com", name: "Suresh T.", rating: 4, title: "Great academics, dated infrastructure", comment: "Academics top-notch but some buildings need renovation." },
    ];
    for (const r of reviewers) {
      const u = await db.user.upsert({
        where: { email: r.email },
        update: {},
        create: { email: r.email, name: r.name, role: "USER", passwordHash: "demo" },
      });
      await db.review.upsert({
        where: { userId_entity_entityId: { userId: u.id, entity: "COLLEGE", entityId: pulchowk.id } },
        update: {},
        create: { userId: u.id, entity: "COLLEGE", entityId: pulchowk.id, rating: r.rating, title: r.title, comment: r.comment },
      });
    }
    console.log(`✓ 3 sample reviews`);
  }

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("   Admin: admin@khojney.com / admin (any password works in demo)");
  console.log("   User:  user@khojney.com / user (any password works in demo)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
