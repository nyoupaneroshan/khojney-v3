/**
 * Complete, up-to-date Scholarships Data for Nepal & Abroad Studies
 * Researched across Government, Bilateral, and International schemes.
 */

export interface ScholarshipSeedItem {
  slug: string;
  title: string;
  provider: string;
  description: string;
  level: "SCHOOL" | "PLUS_TWO" | "BACHELORS" | "MASTERS" | "PHD" | "ANY";
  field: string;
  country: string;
  amount: string;
  coverage: string;
  deadline: string; // ISO date
  applicationUrl: string;
  eligibility: string; // Markdown
  selectionProcess: string; // Markdown
  isFeatured: boolean;
  isPublished: boolean;
}

export const SCHOLARSHIPS_DATA: ScholarshipSeedItem[] = [
  {
    slug: "moest-national-merit-scholarship-mbbs-engineering",
    title: "Ministry of Education (MOEST) National Merit Scholarship",
    provider: "Ministry of Education, Science and Technology (MoEST), Nepal",
    description: "The Government of Nepal provides 100% tuition-free scholarships in all public and constituent institutions (Pulchowk, Maharajgunj IOM, BPKIHS, KU) for MBBS, BDS, BE, and Nursing programs under the Scholarship Act 2021.",
    level: "BACHELORS",
    field: "Medicine, Engineering & Applied Sciences",
    country: "Nepal",
    amount: "100% Full Tuition Waiver (approx NPR 40 to 55 Lakhs)",
    coverage: "Full tuition waiver, exam fees, laboratory fees, and subsidized hostel lodging",
    deadline: "2026-09-15T23:59:59Z",
    applicationUrl: "https://moest.gov.np",
    eligibility: `### Eligibility Requirements
- Nepali citizenship certificate.
- Minimum GPA 2.4 in +2 Science (Physics, Chemistry, Biology/Mathematics) or equivalent from a recognized government/community school.
- 55% seats allocated on general open merit; 45% reserved for inclusive groups (Women, Dalit, Indigenous Janajati, Madhesi, Muslims, Tharu, Backward regions, and Persons with Disabilities).
- Qualification in national entrance exams (MEC CEE for Medicine / IOE Entrance for Engineering).`,
    selectionProcess: "Computerized merit matching based on MEC CEE and IOE rank followed by compulsory public service bond.",
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "indian-embassy-golden-jubilee-scholarship-scheme",
    title: "Indian Embassy Golden Jubilee Scholarship Scheme",
    provider: "Embassy of India, Kathmandu",
    description: "Established in 2002 to commemorate 50 years of India-Nepal economic cooperation, this scholarship provides monthly stipends throughout the duration of study to deserving Nepali students pursuing MBBS, BE, BArch, BBA, and BSc degrees in Nepali institutions.",
    level: "BACHELORS",
    field: "Medicine, Engineering, IT, Commerce, Arts",
    country: "Nepal",
    amount: "NPR 4,000 per month (MBBS/BE) / NPR 3,000 per month (BBA/BSc)",
    coverage: "Direct monthly bank transfer stipend for 3 to 5 years depending on degree duration",
    deadline: "2026-11-30T23:59:59Z",
    applicationUrl: "https://www.indembkathmandu.gov.np",
    eligibility: `### Eligibility Requirements
- Nepali citizens currently enrolled in the 1st year of Bachelor's degree in recognized Nepali universities.
- Minimum 70% marks (or GPA 3.2) in Class 12 (NEB).
- Family annual income less than NPR 2,00,000 per annum (income certificate issued by local ward office required).`,
    selectionProcess: "Shortlisting on Class 12 academic merit, income verification, and geographic distribution across all 77 districts.",
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "australia-awards-scholarships-nepal",
    title: "Australia Awards Scholarships for Nepal",
    provider: "Department of Foreign Affairs and Trade (DFAT), Australian Government",
    description: "Prestigious Australian government scholarships for high-achieving Nepali mid-career professionals to undertake full-time Master's degree studies at world-ranked Australian universities, contributing to Nepal's long-term development.",
    level: "MASTERS",
    field: "Economic Development, Climate Change, Governance, Education, Gender Equality",
    country: "Australia",
    amount: "Full Financial Support (AUD 150,000+ total value)",
    coverage: "Full tuition fees, return airfare, establishment allowance, monthly living stipend (CLE), and Overseas Student Health Cover (OSHC)",
    deadline: "2026-04-30T23:59:59Z",
    applicationUrl: "https://australiaawardsnepal.org",
    eligibility: `### Eligibility Requirements
- Nepali citizen residing in Nepal at the time of application.
- Completed Bachelor's degree (minimum 3 or 4 years) from a recognized university.
- Minimum 3 years of relevant full-time work experience in Nepal.
- Academic IELTS minimum 6.5 (no band less than 6.0) or equivalent TOEFL / PTE score.
- Clear development impact plan demonstrating how studies will benefit Nepal upon return.`,
    selectionProcess: "Rigorous shortlisting, academic reference review, and panel interview with Australian Embassy and DFAT delegates.",
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "erasmus-mundus-joint-masters-scholarship",
    title: "Erasmus Mundus Joint Masters Scholarship (European Union)",
    provider: "European Commission, European Union",
    description: "Erasmus Mundus Joint Masters are prestigious, integrated, international study programs jointly delivered by an international consortium of European higher education institutions across at least 2 different European countries.",
    level: "MASTERS",
    field: "Engineering, Data Science, Environmental Sciences, Humanities, Economics",
    country: "Europe (Multiple Countries: Germany, France, Italy, Spain, Netherlands)",
    amount: "Fully Funded (€1,400 per month + Full Tuition Waiver)",
    coverage: "Full tuition waiver across all host universities, €1,400 monthly living allowance for 24 months, travel, and worldwide health insurance",
    deadline: "2027-01-15T23:59:59Z",
    applicationUrl: "https://erasmus-plus.ec.europa.eu",
    eligibility: `### Eligibility Requirements
- Possess a first higher education degree (Bachelor's degree or equivalent).
- Strong academic track record with high GPA.
- English language proficiency (IELTS minimum 6.5 to 7.0 depending on program consortium).
- Outstanding Statement of Purpose (SOP) and academic recommendation letters.`,
    selectionProcess: "Consortium committee evaluation based on academic excellence, research proposals, and international motivation.",
    isFeatured: true,
    isPublished: true,
  },
  {
    slug: "fulbright-foreign-student-program-nepal",
    title: "Fulbright Foreign Student Program (USEF Nepal)",
    provider: "United States Department of State & USEF Nepal",
    description: "The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government, providing full financial funding for Nepali citizens to pursue two-year Master's degree study in the United States.",
    level: "MASTERS",
    field: "All fields except clinical medicine and MBA",
    country: "United States",
    amount: "Fully Funded (Valued at $120,000+)",
    coverage: "Full tuition, living stipend, roundtrip airfare, textbook allowance, health insurance, and pre-academic orientation in the USA",
    deadline: "2026-05-15T23:59:59Z",
    applicationUrl: "https://usefnepal.org",
    eligibility: `### Eligibility Requirements
- Nepali citizen residing in Nepal with valid passport.
- Equivalent of an American Bachelor's degree (16 years of education; or 3-year Bachelor's + 2-year Master's).
- Minimum 3 years of post-bachelor's full-time work experience in Nepal.
- Demonstrated leadership qualities, commitment to return and contribute to Nepal.`,
    selectionProcess: "Written application review, intensive personal interviews, TOEFL and GRE test administration by USEF Nepal.",
    isFeatured: true,
    isPublished: true,
  },
];
