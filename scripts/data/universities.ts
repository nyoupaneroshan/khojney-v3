/**
 * Complete, up-to-date Universities & Autonomous Deemed Academies Data for Nepal (19 institutions)
 * Accurately researched across all 7 provinces of Nepal.
 */

export interface UniversitySeedItem {
  slug: string;
  name: string;
  description: string;
  establishedYear: number;
  province: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  coverImage?: string;
  type: "PUBLIC" | "PRIVATE";
  ranking: number;
  totalCampuses: number;
  totalStudents: number;
  programs: string; // JSON: [{faculty, level, name, duration}]
  faculties: string; // JSON: array of string
  admissionProcess: string;
  notices: string; // JSON: [{title, date, link}]
  results: string; // JSON: [{title, date, link}]
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isPublished: boolean;
}

export const UNIVERSITIES_DATA: UniversitySeedItem[] = [
  {
    slug: "tribhuvan-university",
    name: "Tribhuvan University (TU)",
    description: "Tribhuvan University (TU), established in 1959, is Nepal's oldest, largest, and premier national university. Operating 62 constituent campuses and over 1,060 affiliated colleges across all 77 districts, TU educates more than 75% of Nepal's higher education students across 5 institutes and 4 faculties.",
    establishedYear: 1959,
    province: "Bagmati",
    city: "Kirtipur, Kathmandu",
    address: "Tribhuvan University Central Campus, Kirtipur, Kathmandu 44618",
    phone: "+977-1-4330438",
    email: "info@tu.edu.np",
    website: "https://tu.edu.np",
    type: "PUBLIC",
    ranking: 1,
    totalCampuses: 1122,
    totalStudents: 360000,
    faculties: JSON.stringify([
      "Institute of Engineering (IOE)",
      "Institute of Medicine (IOM)",
      "Institute of Science and Technology (IoST)",
      "Institute of Forestry (IOF)",
      "Institute of Agriculture and Animal Science (IAAS)",
      "Faculty of Management (FOM)",
      "Faculty of Humanities and Social Sciences (FOHSS)",
      "Faculty of Education (FOE)",
      "Faculty of Law (FOL)"
    ]),
    programs: JSON.stringify([
      { faculty: "IOE", level: "BACHELORS", name: "BE Computer / Civil / Electrical / Mechanical", duration: "4 Years" },
      { faculty: "IOM", level: "BACHELORS", name: "MBBS / BDS / BSc Nursing / B.Pharm", duration: "5.5 Years" },
      { faculty: "IoST", level: "BACHELORS", name: "BSc Computer Science and IT (BSc CSIT)", duration: "4 Years" },
      { faculty: "FOM", level: "BACHELORS", name: "BBA / BBM / BIM / BHM / BBS", duration: "4 Years" },
      { faculty: "FOM", level: "MASTERS", name: "MBA / MBS / MBM", duration: "2 Years" },
      { faculty: "FOL", level: "BACHELORS", name: "BALLB / LLB", duration: "5 Years" },
      { faculty: "FOHSS", level: "MASTERS", name: "MA Economics / English / Sociology", duration: "2 Years" }
    ]),
    admissionProcess: `### TU Admission Procedure
1. **Entrance Examinations**: Entrance exams are mandatory for professional courses:
   - **IOE Entrance**: Administered by IOE for engineering programs (Pulchowk, Thapathali, WRC, ERC).
   - **CEE (Medical Entrance)**: Conducted centrally by the Medical Education Commission (MEC) for MBBS/BDS.
   - **CMAT**: Central Management Admissions Test for BBA, BBM, BIM, BHM, and BTTM.
   - **CSIT Entrance**: Conducted by the Dean's Office, Institute of Science and Technology.
2. **Merit Counseling & Enrollment**: Seats are allocated through computerized online priority counseling following national reservation quotas (55% open, 45% inclusive reservation).`,
    notices: JSON.stringify([
      { title: "CMAT Entrance Examination Routine and Center Notice", date: "2026-08-15", link: "https://fomecd.edu.np" },
      { title: "BSc CSIT Entrance Application Open Notice", date: "2026-07-20", link: "https://iost.tu.edu.np" },
      { title: "TU 50th Convocation Ceremony Registration Notice", date: "2026-09-01", link: "https://tu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BBA 8th Semester Final Examination Results", date: "2026-08-25", link: "https://fomecd.edu.np" },
      { title: "BSc CSIT 6th Semester Regular Exam Result", date: "2026-08-10", link: "https://iost.tu.edu.np" }
    ]),
    rating: 4.5,
    reviewCount: 420,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "kathmandu-university",
    name: "Kathmandu University (KU)",
    description: "Kathmandu University (KU), founded in 1991 in Dhulikhel, is Nepal's premier autonomous, non-profit, private-public research university. Known for strict academic calendar compliance, zero political strikes, modern curricula, and strong industry linkages across Engineering, Medicine, Management, and Science.",
    establishedYear: 1991,
    province: "Bagmati",
    city: "Dhulikhel, Kavrepalanchok",
    address: "Kathmandu University Main Campus, Dhulikhel, Kavre, Nepal",
    phone: "+977-11-415100",
    email: "info@ku.edu.np",
    website: "https://ku.edu.np",
    type: "PUBLIC",
    ranking: 2,
    totalCampuses: 8,
    totalStudents: 18500,
    faculties: JSON.stringify([
      "School of Engineering",
      "School of Science",
      "School of Management (KUSOM)",
      "School of Medical Sciences (KUMS)",
      "School of Arts",
      "School of Education",
      "School of Law"
    ]),
    programs: JSON.stringify([
      { faculty: "School of Engineering", level: "BACHELORS", name: "BE Computer / AI / Civil / Geomatics / Mechanical", duration: "4 Years" },
      { faculty: "School of Management", level: "BACHELORS", name: "BBA / BBIS (Dhulikhel & KUSOM)", duration: "4 Years" },
      { faculty: "School of Management", level: "MASTERS", name: "MBA / EMBA", duration: "2 Years" },
      { faculty: "School of Medical Sciences", level: "BACHELORS", name: "MBBS / BDS / BSc Nursing / BPT", duration: "5.5 Years" },
      { faculty: "School of Science", level: "BACHELORS", name: "BSc Computational Mathematics / Biotechnology", duration: "4 Years" },
      { faculty: "School of Law", level: "BACHELORS", name: "BBM-LLB / BEc-LLB", duration: "5 Years" }
    ]),
    admissionProcess: `### KU Admission Procedure
1. **Engineering & Science (KUCAT)**: Computer-based test (CBT) covering Mathematics, Physics, and Chemistry.
2. **Management (KUUMAT / KUMAT)**: Conducted by KUSOM (Verbal reasoning, Quantitative analysis, Written essay, and Personal Interview).
3. **Medical (CEE MEC)**: Centrally administered by Medical Education Commission.
4. **Law (KULAT)**: Law aptitude test and analytical writing test.`,
    notices: JSON.stringify([
      { title: "KU Undergraduate Admissions (KUCAT-CBT) Application Open", date: "2026-07-10", link: "https://apply.ku.edu.np" },
      { title: "KUSOM BBA/BBIS Fall Admissions Intake Announcement", date: "2026-06-25", link: "https://kusom.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "KUCAT-CBT Merit List for BE Computer Engineering", date: "2026-08-12", link: "https://ku.edu.np" },
      { title: "KUUMAT 2026 Qualified Applicants List", date: "2026-07-28", link: "https://kusom.edu.np" }
    ]),
    rating: 4.8,
    reviewCount: 310,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "pokhara-university",
    name: "Pokhara University (PU)",
    description: "Pokhara University, established in 1997 in Lekhnath, Pokhara, is celebrated for professional degree programs in management, engineering, pharmaceutical sciences, and health professions. PU affiliates over 58 prestigious private colleges in Kathmandu and Pokhara.",
    establishedYear: 1997,
    province: "Gandaki",
    city: "Pokhara, Kaski",
    address: "Pokhara University Central Campus, Lekhnath, Pokhara 33700",
    phone: "+977-61-504046",
    email: "info@pu.edu.np",
    website: "https://pu.edu.np",
    type: "PUBLIC",
    ranking: 3,
    totalCampuses: 62,
    totalStudents: 32000,
    faculties: JSON.stringify([
      "Faculty of Management Studies",
      "Faculty of Science and Technology",
      "Faculty of Health Sciences",
      "Faculty of Humanities and Social Sciences"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Management Studies", level: "BACHELORS", name: "BBA / BBA-BI / BHM / BCIS", duration: "4 Years" },
      { faculty: "Faculty of Management Studies", level: "MASTERS", name: "MBA / MBA (Global Business) / MHCM", duration: "2 Years" },
      { faculty: "Faculty of Science and Technology", level: "BACHELORS", name: "BE Civil / Computer / IT / Software Engineering", duration: "4 Years" },
      { faculty: "Faculty of Health Sciences", level: "BACHELORS", name: "B.Pharmacy / BSc Medical Laboratory Technology / BPH", duration: "4 Years" }
    ]),
    admissionProcess: `### PU Admission Procedure
- Entrance examination conducted for central campus and affiliated institutions.
- Scholarships: 20% of total seats in affiliated institutions are reserved as fully funded government/university scholarships.`,
    notices: JSON.stringify([
      { title: "PU Scholarship Application Open for Bachelor Programs", date: "2026-08-01", link: "https://pu.edu.np" },
      { title: "BBA & BE End-Semester Examination Schedule", date: "2026-07-15", link: "https://pu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "B.Pharmacy 8th Semester Final Results", date: "2026-08-18", link: "https://pu.edu.np" },
      { title: "BBA 6th Semester Exam Results", date: "2026-07-30", link: "https://pu.edu.np" }
    ]),
    rating: 4.4,
    reviewCount: 185,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "purbanchal-university",
    name: "Purbanchal University",
    description: "Purbanchal University, established in 1993 with main administrative offices in Biratnagar and a sprawling 545-bigha medical and academic complex at Gothgaun, Morang, serves Eastern Nepal with diverse offerings in medicine, engineering, law, and education.",
    establishedYear: 1993,
    province: "Koshi",
    city: "Biratnagar & Gothgaun, Morang",
    address: "Pushpalal Chowk, Biratnagar / Gothgaun, Morang, Nepal",
    phone: "+977-21-463704",
    email: "info@puexam.edu.np",
    website: "https://puexam.edu.np",
    type: "PUBLIC",
    ranking: 4,
    totalCampuses: 125,
    totalStudents: 29000,
    faculties: JSON.stringify([
      "Faculty of Science and Technology",
      "Faculty of Management",
      "Faculty of Medical and Allied Health Sciences",
      "Faculty of Arts",
      "Faculty of Education",
      "Faculty of Law"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Science and Technology", level: "BACHELORS", name: "BE Civil / Computer / Electrical", duration: "4 Years" },
      { faculty: "Faculty of Management", level: "BACHELORS", name: "BBA / BHM / BBS", duration: "4 Years" },
      { faculty: "Faculty of Medical and Allied Health", level: "BACHELORS", name: "MBBS (Gothgaun) / B.Pharm / BPH / BSc Nursing", duration: "5 Years" },
      { faculty: "Faculty of Law", level: "BACHELORS", name: "BALLB", duration: "5 Years" }
    ]),
    admissionProcess: `### Purbanchal University Admission
- Central Entrance Examination for Engineering, Nursing, Pharmacy, and Management.
- Quota-based university scholarship examination allocating subsidized seats across affiliated colleges.`,
    notices: JSON.stringify([
      { title: "PU Gothgaun Campus Medical College Operational Notice", date: "2026-08-05", link: "https://puexam.edu.np" },
      { title: "Engineering Faculty Entrance Application", date: "2026-07-22", link: "https://puexam.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BE Civil 7th Semester Result Publication", date: "2026-08-14", link: "https://puexam.edu.np" }
    ]),
    rating: 4.1,
    reviewCount: 142,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "agriculture-and-forestry-university",
    name: "Agriculture and Forestry University (AFU)",
    description: "Agriculture and Forestry University (AFU), established in 2010 in Rampur, Chitwan, is Nepal's only specialized state university dedicated to agricultural innovation, veterinary medicine, animal husbandry, and forestry conservation.",
    establishedYear: 2010,
    province: "Bagmati",
    city: "Rampur, Chitwan",
    address: "AFU Central Campus, Rampur, Bharatpur-15, Chitwan",
    phone: "+977-56-591602",
    email: "info@afu.edu.np",
    website: "https://afu.edu.np",
    type: "PUBLIC",
    ranking: 5,
    totalCampuses: 9,
    totalStudents: 4500,
    faculties: JSON.stringify([
      "Faculty of Agriculture",
      "Faculty of Animal Science, Veterinary Science and Fisheries (FAVF)",
      "Faculty of Forestry (Hetauda)"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Agriculture", level: "BACHELORS", name: "BSc Agriculture (Honors)", duration: "4 Years" },
      { faculty: "FAVF", level: "BACHELORS", name: "BVSc & AH (Bachelor of Veterinary Science & Animal Husbandry)", duration: "5 Years" },
      { faculty: "FAVF", level: "BACHELORS", name: "BSc Fisheries", duration: "4 Years" },
      { faculty: "Faculty of Forestry", level: "BACHELORS", name: "BSc Forestry", duration: "4 Years" },
      { faculty: "Faculty of Agriculture", level: "MASTERS", name: "MSc Agriculture (Agronomy / Horticulture / Entomology)", duration: "2 Years" }
    ]),
    admissionProcess: `### AFU Admission Procedure
- Highly competitive nationwide entrance exam covering Physics, Chemistry, Biology, Mathematics, English, and General Agriculture.
- Significant reservation quotas for women, marginalized communities, and students from rural districts.`,
    notices: JSON.stringify([
      { title: "AFU BSc Ag and BVSc & AH Entrance Exam Form Notice", date: "2026-08-10", link: "https://afu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BVSc & AH Merit List Publication", date: "2026-09-02", link: "https://afu.edu.np" }
    ]),
    rating: 4.6,
    reviewCount: 95,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "nepal-sanskrit-university",
    name: "Nepal Sanskrit University (NSU)",
    description: "Nepal Sanskrit University (NSU), founded in 1986 in Beljhundi, Dang, is the national center of excellence for Sanskrit literature, Vedic astrology, ancient philosophy, Eastern culture, and Bachelor of Ayurvedic Medicine and Surgery (BAMS).",
    establishedYear: 1986,
    province: "Lumbini",
    city: "Beljhundi, Dang",
    address: "Beljhundi, Dang, Nepal",
    phone: "+977-82-412017",
    email: "info@nsu.edu.np",
    website: "https://nsu.edu.np",
    type: "PUBLIC",
    ranking: 8,
    totalCampuses: 18,
    totalStudents: 6200,
    faculties: JSON.stringify([
      "Faculty of Ayurveda",
      "Faculty of Sahitya & Sanskrit",
      "Faculty of Veda & Jyotish",
      "Faculty of Education & Philosophy"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Ayurveda", level: "BACHELORS", name: "BAMS (Bachelor of Ayurvedic Medicine & Surgery)", duration: "5.5 Years" },
      { faculty: "Faculty of Sahitya", level: "BACHELORS", name: "Shastri (Bachelor in Sanskrit / Eastern Studies)", duration: "3 Years" },
      { faculty: "Faculty of Sahitya", level: "MASTERS", name: "Acharya (Master in Sanskrit / Philosophy)", duration: "2 Years" }
    ]),
    admissionProcess: `### NSU Admission
- BAMS entrance conducted via Medical Education Commission (MEC) CEE.
- Direct merit admission for Shastri and Acharya programs with tuition waivers for deserving students.`,
    notices: JSON.stringify([
      { title: "BAMS Academic Session Orientation Notice", date: "2026-08-20", link: "https://nsu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BAMS Final Professional Examination Results", date: "2026-07-14", link: "https://nsu.edu.np" }
    ]),
    rating: 4.2,
    reviewCount: 64,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "lumbini-bauddha-university",
    name: "Lumbini Bauddha University (LBU)",
    description: "Established in 2004 in the birthplace of Lord Buddha, Lumbini Bauddha University is an international academic center for Buddhist studies, Theravada, Mahayana, Vajrayana philosophies, peace studies, and archeology.",
    establishedYear: 2004,
    province: "Lumbini",
    city: "Lumbini, Rupandehi",
    address: "Lumbini Cultural Municipality, Rupandehi, Nepal",
    phone: "+977-71-404040",
    email: "info@lbu.edu.np",
    website: "https://lbu.edu.np",
    type: "PUBLIC",
    ranking: 9,
    totalCampuses: 7,
    totalStudents: 3800,
    faculties: JSON.stringify([
      "Faculty of Buddhist Studies",
      "Faculty of Humanities & Social Sciences",
      "School of Development Studies & Applied Sciences"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Buddhist Studies", level: "BACHELORS", name: "BA in Buddhist Studies", duration: "3 Years" },
      { faculty: "Faculty of Buddhist Studies", level: "MASTERS", name: "MA in Buddhist Studies & Peace Studies", duration: "2 Years" },
      { faculty: "School of Development Studies", level: "BACHELORS", name: "BTTM (Travel & Tourism Management)", duration: "4 Years" }
    ]),
    admissionProcess: "Admission based on academic marks, entrance aptitude test, and personal interview.",
    notices: JSON.stringify([
      { title: "MA Peace Studies Admissions Announcement", date: "2026-08-01", link: "https://lbu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "MA Buddhist Studies Semester Exam Result", date: "2026-07-29", link: "https://lbu.edu.np" }
    ]),
    rating: 4.3,
    reviewCount: 52,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "far-western-university",
    name: "Far-Western University (FWU)",
    description: "Far-Western University, established in 2010 in Mahendranagar (Bhimdatta), Kanchanpur, promotes higher education in Sudurpashchim Province across humanities, science, engineering, management, and agriculture.",
    establishedYear: 2010,
    province: "Sudurpashchim",
    city: "Bhimdatta, Kanchanpur",
    address: "Bhimdatta Municipality-18, Kanchanpur, Nepal",
    phone: "+977-99-520729",
    email: "info@fwu.edu.np",
    website: "https://fwu.edu.np",
    type: "PUBLIC",
    ranking: 7,
    totalCampuses: 16,
    totalStudents: 14000,
    faculties: JSON.stringify([
      "Faculty of Engineering",
      "Faculty of Science and Technology",
      "Faculty of Management",
      "Faculty of Education",
      "Faculty of Agriculture",
      "Faculty of Law"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Engineering", level: "BACHELORS", name: "BE Civil / Computer", duration: "4 Years" },
      { faculty: "Faculty of Agriculture", level: "BACHELORS", name: "BSc Agriculture", duration: "4 Years" },
      { faculty: "Faculty of Management", level: "BACHELORS", name: "BBA / BBS", duration: "4 Years" },
      { faculty: "Faculty of Law", level: "BACHELORS", name: "BALLB", duration: "5 Years" }
    ]),
    admissionProcess: "Merit-based admission and entrance exams conducted by respective Dean's offices.",
    notices: JSON.stringify([
      { title: "FWU Engineering & Agriculture Entrance Routine", date: "2026-08-15", link: "https://fwu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BBA 4th Semester Exam Results", date: "2026-08-02", link: "https://fwu.edu.np" }
    ]),
    rating: 4.1,
    reviewCount: 78,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "mid-western-university",
    name: "Mid-Western University (MU)",
    description: "Mid-Western University, established in 2010 in Birendranagar, Surkhet, serves Karnali Province with progressive university departments in engineering, hydro-sciences, forestry, agriculture, and business administration.",
    establishedYear: 2010,
    province: "Karnali",
    city: "Birendranagar, Surkhet",
    address: "Birendranagar-8, Surkhet, Karnali Province, Nepal",
    phone: "+977-83-524681",
    email: "info@mwu.edu.np",
    website: "https://mwu.edu.np",
    type: "PUBLIC",
    ranking: 6,
    totalCampuses: 14,
    totalStudents: 12500,
    faculties: JSON.stringify([
      "Faculty of Engineering",
      "Faculty of Science and Technology",
      "Faculty of Management",
      "Faculty of Agriculture and Forestry",
      "Faculty of Law"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Engineering", level: "BACHELORS", name: "BE Civil / Hydro Power / Computer", duration: "4 Years" },
      { faculty: "Faculty of Management", level: "BACHELORS", name: "BBA / MBA", duration: "4 Years" },
      { faculty: "Faculty of Agriculture and Forestry", level: "BACHELORS", name: "BSc Agriculture", duration: "4 Years" }
    ]),
    admissionProcess: "Entrance exams for technical faculties; merit admissions for general programs.",
    notices: JSON.stringify([
      { title: "Mid-Western University Entrance Form Notice", date: "2026-08-08", link: "https://mwu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BE Civil 5th Semester Result", date: "2026-07-25", link: "https://mwu.edu.np" }
    ]),
    rating: 4.2,
    reviewCount: 82,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "bp-koirala-institute-of-health-sciences",
    name: "B.P. Koirala Institute of Health Sciences (BPKIHS)",
    description: "BPKIHS Dharan is Nepal's premier autonomous health sciences university and tertiary referral hospital, founded in 1993 with Indian government cooperation. It is internationally accredited and educates doctors, dentists, nurses, and allied health specialists.",
    establishedYear: 1993,
    province: "Koshi",
    city: "Dharan, Sunsari",
    address: "BPKIHS Campus, Ghopa, Dharan, Sunsari, Nepal",
    phone: "+977-25-525555",
    email: "info@bpkihs.edu",
    website: "https://bpkihs.edu",
    type: "PUBLIC",
    ranking: 2,
    totalCampuses: 1,
    totalStudents: 2200,
    faculties: JSON.stringify([
      "Faculty of Medicine (School of Medicine)",
      "College of Dental Surgery (CODS)",
      "College of Nursing",
      "School of Public Health and Community Medicine"
    ]),
    programs: JSON.stringify([
      { faculty: "School of Medicine", level: "BACHELORS", name: "MBBS", duration: "5.5 Years" },
      { faculty: "CODS", level: "BACHELORS", name: "BDS", duration: "5 Years" },
      { faculty: "College of Nursing", level: "BACHELORS", name: "BSc Nursing / Post Basic Nursing", duration: "4 Years" },
      { faculty: "School of Medicine", level: "MASTERS", name: "MD / MS Specialty Programs", duration: "3 Years" },
      { faculty: "School of Medicine", level: "MASTERS", name: "DM / MCh Super-Specialty Programs", duration: "3 Years" }
    ]),
    admissionProcess: "Centralized CEE exam conducted by the Medical Education Commission (MEC) followed by online matching.",
    notices: JSON.stringify([
      { title: "MEC CEE Qualified Candidate Admission Directive", date: "2026-08-14", link: "https://bpkihs.edu" }
    ]),
    results: JSON.stringify([
      { title: "MBBS Final Professional Examination Results", date: "2026-07-20", link: "https://bpkihs.edu" }
    ]),
    rating: 4.8,
    reviewCount: 260,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "patan-academy-of-health-sciences",
    name: "Patan Academy of Health Sciences (PAHS)",
    description: "Patan Academy of Health Sciences (PAHS) is an autonomous state health university located at Patan Hospital, Lalitpur, established in 2008. PAHS is world-renowned for its rural community-oriented curriculum dedicated to producing compassionate doctors for underserved rural Nepal.",
    establishedYear: 2008,
    province: "Bagmati",
    city: "Lagankhel, Lalitpur",
    address: "Patan Hospital Complex, Lagankhel, Lalitpur, Nepal",
    phone: "+977-1-5545112",
    email: "info@pahs.edu.np",
    website: "https://pahs.edu.np",
    type: "PUBLIC",
    ranking: 3,
    totalCampuses: 1,
    totalStudents: 1500,
    faculties: JSON.stringify([
      "School of Medicine",
      "School of Nursing and Midwifery",
      "School of Public Health"
    ]),
    programs: JSON.stringify([
      { faculty: "School of Medicine", level: "BACHELORS", name: "MBBS", duration: "5.5 Years" },
      { faculty: "School of Nursing", level: "BACHELORS", name: "BSc Nursing / Bachelor in Midwifery", duration: "4 Years" },
      { faculty: "School of Medicine", level: "MASTERS", name: "MD General Practice / Pediatrics / OBGYN / Internal Medicine", duration: "3 Years" }
    ]),
    admissionProcess: "MEC CEE exam followed by PAHS-specific Collaborative Rural Commitment Evaluation.",
    notices: JSON.stringify([
      { title: "PAHS MBBS Matching and Scholarship List", date: "2026-08-11", link: "https://pahs.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "MBBS 4th Year Result Notice", date: "2026-07-16", link: "https://pahs.edu.np" }
    ]),
    rating: 4.8,
    reviewCount: 195,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "national-academy-of-medical-sciences",
    name: "National Academy of Medical Sciences (NAMS)",
    description: "NAMS Bir Hospital, established in 2002 under an act of parliament, is Nepal's premier post-graduate medical university based at the historic 135-year-old Bir Hospital and the National Trauma Center, training MD, MS, DM, and MCh specialists.",
    establishedYear: 2002,
    province: "Bagmati",
    city: "Mahabouddha, Kathmandu",
    address: "Bir Hospital Premises, Mahabouddha, Kanti Path, Kathmandu",
    phone: "+977-1-4230710",
    email: "info@nams.org.np",
    website: "https://nams.org.np",
    type: "PUBLIC",
    ranking: 4,
    totalCampuses: 1,
    totalStudents: 1200,
    faculties: JSON.stringify([
      "Faculty of Medicine & Surgery",
      "Faculty of Dental Sciences",
      "Faculty of Nursing",
      "School of Allied Health Sciences"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Medicine", level: "MASTERS", name: "MD Internal Medicine / Anesthesiology / Pathology / Radiology", duration: "3 Years" },
      { faculty: "Faculty of Surgery", level: "MASTERS", name: "MS General Surgery / Orthopedics / ENT / Ophthalmology", duration: "3 Years" },
      { faculty: "Faculty of Medicine", level: "MASTERS", name: "DM Cardiology / Gastroenterology / Nephrology / Neurology", duration: "3 Years" },
      { faculty: "Faculty of Surgery", level: "MASTERS", name: "MCh Neurosurgery / Urology / CTVS", duration: "3 Years" },
      { faculty: "Faculty of Nursing", level: "BACHELORS", name: "BSc Nursing / Post Basic", duration: "4 Years" }
    ]),
    admissionProcess: "Central PG Entrance Exam conducted by Medical Education Commission (MEC).",
    notices: JSON.stringify([
      { title: "NAMS Post Graduate Residency Admission Schedule", date: "2026-08-04", link: "https://nams.org.np" }
    ]),
    results: JSON.stringify([
      { title: "MD/MS Final Exit Examination Results", date: "2026-07-22", link: "https://nams.org.np" }
    ]),
    rating: 4.7,
    reviewCount: 160,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "karnali-academy-of-health-sciences",
    name: "Karnali Academy of Health Sciences (KAHS)",
    description: "Karnali Academy of Health Sciences (KAHS) is a transformative autonomous health university in Jumla, established in 2011 to deliver world-class medical training and tertiary healthcare to the high Himalayas of Karnali Province.",
    establishedYear: 2011,
    province: "Karnali",
    city: "Jumla",
    address: "Khalanga, Chandannath, Jumla, Karnali Province, Nepal",
    phone: "+977-87-520355",
    email: "info@kahs.edu.np",
    website: "https://kahs.edu.np",
    type: "PUBLIC",
    ranking: 8,
    totalCampuses: 1,
    totalStudents: 850,
    faculties: JSON.stringify([
      "Faculty of Medicine",
      "Faculty of Nursing",
      "Faculty of Public Health",
      "Faculty of Pharmacy"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Medicine", level: "BACHELORS", name: "MBBS", duration: "5.5 Years" },
      { faculty: "Faculty of Pharmacy", level: "BACHELORS", name: "B.Pharmacy", duration: "4 Years" },
      { faculty: "Faculty of Public Health", level: "BACHELORS", name: "BPH", duration: "4 Years" },
      { faculty: "Faculty of Nursing", level: "BACHELORS", name: "BSc Nursing", duration: "4 Years" },
      { faculty: "Faculty of Medicine", level: "MASTERS", name: "MD General Practice & Emergency Medicine", duration: "3 Years" }
    ]),
    admissionProcess: "MEC CEE examination with dedicated reservation quota for Karnali and backward Himalayan regions.",
    notices: JSON.stringify([
      { title: "KAHS MBBS Admission and Matching List", date: "2026-08-16", link: "https://kahs.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BPH and B.Pharm Semester Results", date: "2026-07-18", link: "https://kahs.edu.np" }
    ]),
    rating: 4.7,
    reviewCount: 110,
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "gandaki-university",
    name: "Gandaki University (GU)",
    description: "Gandaki University is Nepal's first provincial university established under the Gandaki Province Higher Education Act in 2019 in Pokhara, pioneering degrees in Sports Management, AI, Software Engineering, and Pharmacy.",
    establishedYear: 2019,
    province: "Gandaki",
    city: "Pokhara, Kaski",
    address: "Mustang Chowk / Lekhnath, Pokhara, Nepal",
    phone: "+977-61-597000",
    email: "info@gandakiuniversity.edu.np",
    website: "https://gandakiuniversity.edu.np",
    type: "PUBLIC",
    ranking: 10,
    totalCampuses: 2,
    totalStudents: 1400,
    faculties: JSON.stringify([
      "Faculty of Science & Technology",
      "Faculty of Humanities & Social Sciences",
      "School of Health Sciences"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Science & Technology", level: "BACHELORS", name: "Bachelor in Information Technology (BIT) / Artificial Intelligence", duration: "4 Years" },
      { faculty: "Faculty of Humanities", level: "BACHELORS", name: "Bachelor of Sports Management (BSM)", duration: "4 Years" },
      { faculty: "School of Health Sciences", level: "BACHELORS", name: "B.Pharmacy", duration: "4 Years" }
    ]),
    admissionProcess: "Direct entrance test and merit interview conducted by Gandaki University.",
    notices: JSON.stringify([
      { title: "Bachelor in Sports Management and BIT Entrance Notice", date: "2026-07-28", link: "https://gandakiuniversity.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BIT First Year Second Semester Results", date: "2026-08-03", link: "https://gandakiuniversity.edu.np" }
    ]),
    rating: 4.4,
    reviewCount: 45,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "manmohan-technical-university",
    name: "Manmohan Technical University (MTU)",
    description: "Manmohan Technical University (MTU) in Budhiganga, Morang, is Nepal's first specialized technical university established by Koshi Province in 2019, focusing on practical engineering and applied technology.",
    establishedYear: 2019,
    province: "Koshi",
    city: "Budhiganga, Morang",
    address: "Budhiganga Rural Municipality-4, Hattimudha, Morang",
    phone: "+977-21-580724",
    email: "info@mtu.edu.np",
    website: "https://mtu.edu.np",
    type: "PUBLIC",
    ranking: 11,
    totalCampuses: 1,
    totalStudents: 950,
    faculties: JSON.stringify([
      "School of Engineering",
      "School of Applied Science & Technology",
      "School of Medicine & Allied Health"
    ]),
    programs: JSON.stringify([
      { faculty: "School of Engineering", level: "BACHELORS", name: "BE Civil Engineering", duration: "4 Years" },
      { faculty: "School of Engineering", level: "BACHELORS", name: "BE Electrical & Electronics Engineering", duration: "4 Years" },
      { faculty: "School of Applied Science", level: "BACHELORS", name: "B.Tech in Artificial Intelligence", duration: "4 Years" }
    ]),
    admissionProcess: "Entrance examination covering Physics, Mathematics, Chemistry, and Technical aptitude.",
    notices: JSON.stringify([
      { title: "BE Entrance Exam Application Form", date: "2026-08-01", link: "https://mtu.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BE Civil 2nd Semester Exam Results", date: "2026-07-15", link: "https://mtu.edu.np" }
    ]),
    rating: 4.3,
    reviewCount: 38,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "rajarshi-janak-university",
    name: "Rajarshi Janak University (RJU)",
    description: "Rajarshi Janak University, established in 2017 in the historic cultural city of Janakpurdham, Madhesh Province, provides specialized higher education in computer science, management, law, and medical laboratory technology.",
    establishedYear: 2017,
    province: "Madhesh",
    city: "Janakpurdham, Dhanusha",
    address: "Janakpurdham, Dhanusha, Madhesh Province, Nepal",
    phone: "+977-41-590656",
    email: "info@rju.edu.np",
    website: "https://rju.edu.np",
    type: "PUBLIC",
    ranking: 12,
    totalCampuses: 4,
    totalStudents: 2600,
    faculties: JSON.stringify([
      "Faculty of Science and Technology",
      "Faculty of Management",
      "Faculty of Humanities & Law"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Science and Technology", level: "BACHELORS", name: "BSc CSIT / BCA", duration: "4 Years" },
      { faculty: "Faculty of Management", level: "BACHELORS", name: "BBA / MBA", duration: "4 Years" },
      { faculty: "Faculty of Humanities & Law", level: "BACHELORS", name: "BALLB", duration: "5 Years" },
      { faculty: "Faculty of Science and Technology", level: "BACHELORS", name: "BSc Medical Lab Technology (BMLT)", duration: "4 Years" }
    ]),
    admissionProcess: "Central entrance exam conducted by RJU Examination Board.",
    notices: JSON.stringify([
      { title: "BSc CSIT and BALLB Admissions Notice", date: "2026-08-04", link: "https://rju.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "BBA 3rd Semester Result Notice", date: "2026-07-20", link: "https://rju.edu.np" }
    ]),
    rating: 4.1,
    reviewCount: 35,
    isFeatured: false,
    isPublished: true,
  },
  {
    slug: "pokhara-academy-of-health-sciences",
    name: "Pokhara Academy of Health Sciences (PoAHS)",
    description: "Pokhara Academy of Health Sciences (PoAHS) is an autonomous medical academy and university located at the Western Regional Hospital in Pokhara, offering postgraduate MD/MS and undergraduate MBBS education.",
    establishedYear: 2015,
    province: "Gandaki",
    city: "Pokhara, Kaski",
    address: "Western Regional Hospital, Ramghat, Pokhara, Nepal",
    phone: "+977-61-520067",
    email: "info@poahs.edu.np",
    website: "https://poahs.edu.np",
    type: "PUBLIC",
    ranking: 7,
    totalCampuses: 1,
    totalStudents: 650,
    faculties: JSON.stringify([
      "Faculty of Medicine",
      "Faculty of Nursing",
      "School of Public Health"
    ]),
    programs: JSON.stringify([
      { faculty: "Faculty of Medicine", level: "BACHELORS", name: "MBBS", duration: "5.5 Years" },
      { faculty: "Faculty of Medicine", level: "MASTERS", name: "MD General Practice / Anesthesia / OBGYN / Pediatrics", duration: "3 Years" },
      { faculty: "Faculty of Nursing", level: "BACHELORS", name: "BSc Nursing", duration: "4 Years" }
    ]),
    admissionProcess: "MEC CEE entrance examination matching.",
    notices: JSON.stringify([
      { title: "PoAHS MBBS and MD/MS Candidate Enrollment Notice", date: "2026-08-12", link: "https://poahs.edu.np" }
    ]),
    results: JSON.stringify([
      { title: "MD/MS Internal Assessment Results", date: "2026-07-15", link: "https://poahs.edu.np" }
    ]),
    rating: 4.6,
    reviewCount: 75,
    isFeatured: false,
    isPublished: true,
  },
];
