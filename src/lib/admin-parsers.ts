/**
 * Server-safe initial-value parsers for admin edit pages.
 *
 * These functions take a raw Prisma record (with JSON-string fields like
 * `programs`, `facilities`, `eligibility`) and return a plain object
 * the corresponding admin form component can consume.
 *
 * IMPORTANT: Keep this file free of "use client" so it can be imported
 * from Server Components.
 */

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export interface ProgramItem {
  name: string;
  level?: string;
  duration?: string;
  fees?: string;
  description?: string;
  faculty?: string;
}

export interface CollegeInitial {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string | null;
  province: string | null;
  district: string | null;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  affiliation: string | null;
  type: string;
  establishedYear: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  programs: ProgramItem[];
  facilities: string[];
  admissionProcess: string | null;
  feesRange: string | null;
  scholarshipsAvailable: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  isPublished: boolean;
}

export function parseCollegeInitial(raw: Record<string, unknown>): Partial<CollegeInitial> {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: raw.description as string,
    categoryId: (raw.categoryId as string) || null,
    province: (raw.province as string) || null,
    district: (raw.district as string) || null,
    city: (raw.city as string) || null,
    address: (raw.address as string) || null,
    latitude: raw.latitude != null ? Number(raw.latitude) : null,
    longitude: raw.longitude != null ? Number(raw.longitude) : null,
    affiliation: (raw.affiliation as string) || null,
    type: (raw.type as string) || "PRIVATE",
    establishedYear: raw.establishedYear != null ? Number(raw.establishedYear) : null,
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    website: (raw.website as string) || null,
    logo: (raw.logo as string) || null,
    coverImage: (raw.coverImage as string) || null,
    programs: parseJson<ProgramItem[]>(raw.programs as string, []),
    facilities: parseJson<string[]>(raw.facilities as string, []),
    admissionProcess: (raw.admissionProcess as string) || null,
    feesRange: (raw.feesRange as string) || null,
    scholarshipsAvailable: Boolean(raw.scholarshipsAvailable),
    isFeatured: Boolean(raw.isFeatured),
    isVerified: Boolean(raw.isVerified),
    isPublished: raw.isPublished !== false,
  };
}

export interface SchoolInitial {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string | null;
  province: string | null;
  district: string | null;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  level: string | null;
  type: string;
  affiliation: string | null;
  establishedYear: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  programs: string[];
  facilities: string[];
  feesRange: string | null;
  admissionProcess: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  isPublished: boolean;
}

export function parseSchoolInitial(raw: Record<string, unknown>): Partial<SchoolInitial> {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: raw.description as string,
    categoryId: (raw.categoryId as string) || null,
    province: (raw.province as string) || null,
    district: (raw.district as string) || null,
    city: (raw.city as string) || null,
    address: (raw.address as string) || null,
    latitude: raw.latitude != null ? Number(raw.latitude) : null,
    longitude: raw.longitude != null ? Number(raw.longitude) : null,
    level: (raw.level as string) || null,
    type: (raw.type as string) || "PRIVATE",
    affiliation: (raw.affiliation as string) || null,
    establishedYear: raw.establishedYear != null ? Number(raw.establishedYear) : null,
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    website: (raw.website as string) || null,
    logo: (raw.logo as string) || null,
    coverImage: (raw.coverImage as string) || null,
    programs: parseJson<string[]>(raw.programs as string, []),
    facilities: parseJson<string[]>(raw.facilities as string, []),
    feesRange: (raw.feesRange as string) || null,
    admissionProcess: (raw.admissionProcess as string) || null,
    isFeatured: Boolean(raw.isFeatured),
    isVerified: Boolean(raw.isVerified),
    isPublished: raw.isPublished !== false,
  };
}

export interface UniversityInitial {
  id?: string;
  name: string;
  slug: string;
  description: string;
  establishedYear: number | null;
  province: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  type: string;
  ranking: number | null;
  totalCampuses: number;
  totalStudents: number | null;
  faculties: string[];
  programs: ProgramItem[];
  admissionProcess: string | null;
  notices: Array<{ title: string; date: string; link: string }>;
  results: Array<{ title: string; date: string; link: string }>;
  isFeatured: boolean;
  isPublished: boolean;
}

export function parseUniversityInitial(raw: Record<string, unknown>): Partial<UniversityInitial> {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: raw.description as string,
    establishedYear: raw.establishedYear != null ? Number(raw.establishedYear) : null,
    province: (raw.province as string) || null,
    city: (raw.city as string) || null,
    address: (raw.address as string) || null,
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    website: (raw.website as string) || null,
    logo: (raw.logo as string) || null,
    coverImage: (raw.coverImage as string) || null,
    type: (raw.type as string) || "PUBLIC",
    ranking: raw.ranking != null ? Number(raw.ranking) : null,
    totalCampuses: raw.totalCampuses != null ? Number(raw.totalCampuses) : 0,
    totalStudents: raw.totalStudents != null ? Number(raw.totalStudents) : null,
    faculties: parseJson<string[]>(raw.faculties as string, []),
    programs: parseJson<ProgramItem[]>(raw.programs as string, []),
    admissionProcess: (raw.admissionProcess as string) || null,
    notices: parseJson<Array<{ title: string; date: string; link: string }>>(raw.notices as string, []),
    results: parseJson<Array<{ title: string; date: string; link: string }>>(raw.results as string, []),
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
  };
}

export interface ScholarshipInitial {
  id?: string;
  title: string;
  slug: string;
  description: string;
  provider: string | null;
  providerUrl: string | null;
  categoryId: string | null;
  level: string | null;
  field: string | null;
  amount: string | null;
  eligibility: string[];
  deadline: string | null;
  applicationOpen: string | null;
  applicationUrl: string | null;
  country: string;
  province: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  coverImage: string | null;
}

export function parseScholarshipInitial(raw: Record<string, unknown>): Partial<ScholarshipInitial> {
  const deadline = raw.deadline
    ? new Date(raw.deadline as string).toISOString().slice(0, 10)
    : null;
  const applicationOpen = raw.applicationOpen
    ? new Date(raw.applicationOpen as string).toISOString().slice(0, 10)
    : null;
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    description: raw.description as string,
    provider: (raw.provider as string) || null,
    providerUrl: (raw.providerUrl as string) || null,
    categoryId: (raw.categoryId as string) || null,
    level: (raw.level as string) || null,
    field: (raw.field as string) || null,
    amount: (raw.amount as string) || null,
    eligibility: parseJson<string[]>(raw.eligibility as string, []),
    deadline,
    applicationOpen,
    applicationUrl: (raw.applicationUrl as string) || null,
    country: (raw.country as string) || "Nepal",
    province: (raw.province as string) || null,
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
    coverImage: (raw.coverImage as string) || null,
  };
}

export interface ExamInitial {
  id?: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string | null;
  examType: string;
  durationMin: number;
  totalMarks: number;
  passingMarks: number | null;
  difficulty: string;
  isFeatured: boolean;
  isPublished: boolean;
  tags: string;
  coverImage: string | null;
}

export function parseExamInitial(raw: Record<string, unknown>): Partial<ExamInitial> {
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    description: raw.description as string,
    categoryId: (raw.categoryId as string) || null,
    examType: (raw.examType as string) || "MOCK",
    durationMin: raw.durationMin != null ? Number(raw.durationMin) : 30,
    totalMarks: raw.totalMarks != null ? Number(raw.totalMarks) : 20,
    passingMarks: raw.passingMarks != null ? Number(raw.passingMarks) : null,
    difficulty: (raw.difficulty as string) || "MEDIUM",
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
    tags: (raw.tags as string) || "",
    coverImage: (raw.coverImage as string) || null,
  };
}

export interface BlogPostInitial {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  categoryId: string | null;
  tagIds: string[];
  status: string;
  featured: boolean;
  readTimeMin: number;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string;
}

export function parseBlogPostInitial(raw: Record<string, unknown>): Partial<BlogPostInitial> {
  const publishedAt = raw.publishedAt
    ? new Date(raw.publishedAt as string).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    excerpt: (raw.excerpt as string) || "",
    content: (raw.content as string) || "",
    coverImage: (raw.coverImage as string) || null,
    categoryId: (raw.categoryId as string) || null,
    tagIds: Array.isArray(raw.tags)
      ? (raw.tags as Array<{ id: string }>).map((t) => t.id)
      : [],
    status: (raw.status as string) || "DRAFT",
    featured: Boolean(raw.featured),
    readTimeMin: raw.readTimeMin != null ? Number(raw.readTimeMin) : 5,
    metaTitle: (raw.metaTitle as string) || null,
    metaDescription: (raw.metaDescription as string) || null,
    publishedAt,
  };
}

// ────────────────────────────────────────────────────────────
// Phase 2 parsers
// ────────────────────────────────────────────────────────────

export interface BankInitial {
  id?: string;
  name: string;
  slug: string;
  shortName: string;
  description: string;
  type: string;
  establishedYear: number | null;
  headquarters: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  swiftCode: string | null;
  savingsRateMin: number | null;
  savingsRateMax: number | null;
  fixedDepositRateMin: number | null;
  fixedDepositRateMax: number | null;
  branchCount: number | null;
  atmCount: number | null;
  mobileBanking: boolean;
  internetBanking: boolean;
  cards: string[];
  loans: string[];
  isFeatured: boolean;
  isPublished: boolean;
}

export function parseBankInitial(raw: Record<string, unknown>): Partial<BankInitial> {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    shortName: (raw.shortName as string) || "",
    description: (raw.description as string) || "",
    type: (raw.type as string) || "COMMERCIAL",
    establishedYear: raw.establishedYear != null ? Number(raw.establishedYear) : null,
    headquarters: (raw.headquarters as string) || null,
    website: (raw.website as string) || null,
    phone: (raw.phone as string) || null,
    email: (raw.email as string) || null,
    logo: (raw.logo as string) || null,
    swiftCode: (raw.swiftCode as string) || null,
    savingsRateMin: raw.savingsRateMin != null ? Number(raw.savingsRateMin) : null,
    savingsRateMax: raw.savingsRateMax != null ? Number(raw.savingsRateMax) : null,
    fixedDepositRateMin: raw.fixedDepositRateMin != null ? Number(raw.fixedDepositRateMin) : null,
    fixedDepositRateMax: raw.fixedDepositRateMax != null ? Number(raw.fixedDepositRateMax) : null,
    branchCount: raw.branchCount != null ? Number(raw.branchCount) : null,
    atmCount: raw.atmCount != null ? Number(raw.atmCount) : null,
    mobileBanking: Boolean(raw.mobileBanking),
    internetBanking: Boolean(raw.internetBanking),
    cards: parseJson<string[]>(raw.cards as string, []),
    loans: parseJson<string[]>(raw.loans as string, []),
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
  };
}

export interface JobInitial {
  id?: string;
  title: string;
  slug: string;
  description: string;
  company: string;
  companyLogo: string | null;
  location: string | null;
  jobType: string;
  category: string | null;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  applicationUrl: string | null;
  applicationEmail: string | null;
  deadline: string | null;
  skills: string[];
  qualifications: string[];
  isFeatured: boolean;
  isPublished: boolean;
}

export function parseJobInitial(raw: Record<string, unknown>): Partial<JobInitial> {
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    description: (raw.description as string) || "",
    company: (raw.company as string) || "",
    companyLogo: (raw.companyLogo as string) || null,
    location: (raw.location as string) || null,
    jobType: (raw.jobType as string) || "FULL_TIME",
    category: (raw.category as string) || null,
    experienceLevel: (raw.experienceLevel as string) || "ENTRY",
    salaryMin: raw.salaryMin != null ? Number(raw.salaryMin) : null,
    salaryMax: raw.salaryMax != null ? Number(raw.salaryMax) : null,
    salaryCurrency: (raw.salaryCurrency as string) || "NPR",
    applicationUrl: (raw.applicationUrl as string) || null,
    applicationEmail: (raw.applicationEmail as string) || null,
    deadline: raw.deadline ? new Date(raw.deadline as string).toISOString().slice(0, 10) : null,
    skills: parseJson<string[]>(raw.skills as string, []),
    qualifications: parseJson<string[]>(raw.qualifications as string, []),
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
  };
}

export interface GovernmentServiceInitial {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  ministry: string | null;
  department: string | null;
  office: string | null;
  applicationUrl: string | null;
  applicationFee: string | null;
  processingTime: string | null;
  requiredDocuments: string[];
  steps: string[];
  contactPhone: string | null;
  contactEmail: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export function parseGovernmentServiceInitial(raw: Record<string, unknown>): Partial<GovernmentServiceInitial> {
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    description: (raw.description as string) || "",
    category: (raw.category as string) || "CITIZENSHIP",
    ministry: (raw.ministry as string) || null,
    department: (raw.department as string) || null,
    office: (raw.office as string) || null,
    applicationUrl: (raw.applicationUrl as string) || null,
    applicationFee: (raw.applicationFee as string) || null,
    processingTime: (raw.processingTime as string) || null,
    requiredDocuments: parseJson<string[]>(raw.requiredDocuments as string, []),
    steps: parseJson<string[]>(raw.steps as string, []),
    contactPhone: (raw.contactPhone as string) || null,
    contactEmail: (raw.contactEmail as string) || null,
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
  };
}
