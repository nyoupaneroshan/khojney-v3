/**
 * Shared constants for the Khojney platform.
 * Add new modules here to register them across navigation, search, etc.
 */

export const MODULES = [
  "EXAM",
  "COLLEGE",
  "SCHOOL",
  "UNIVERSITY",
  "SCHOLARSHIP",
  "BLOG",
  "BANK",
  "JOB",
  "GOVERNMENT_SERVICE",
] as const;
export type ModuleKey = (typeof MODULES)[number];

export const MODULE_LABELS: Record<ModuleKey, string> = {
  EXAM: "Exams",
  COLLEGE: "Colleges",
  SCHOOL: "Schools",
  UNIVERSITY: "Universities",
  SCHOLARSHIP: "Scholarships",
  BLOG: "Blog",
  BANK: "Banks",
  JOB: "Jobs",
  GOVERNMENT_SERVICE: "Government Services",
};

export const MODULE_PATHS: Record<ModuleKey, string> = {
  EXAM: "/exams",
  COLLEGE: "/colleges",
  SCHOOL: "/schools",
  UNIVERSITY: "/universities",
  SCHOLARSHIP: "/scholarships",
  BLOG: "/blog",
  BANK: "/banks",
  JOB: "/jobs",
  GOVERNMENT_SERVICE: "/government",
};

export const MODULE_ENTITIES: Record<ModuleKey, string> = {
  EXAM: "Exam",
  COLLEGE: "College",
  SCHOOL: "School",
  UNIVERSITY: "University",
  SCHOLARSHIP: "Scholarship",
  BLOG: "BlogPost",
  BANK: "Bank",
  JOB: "Job",
  GOVERNMENT_SERVICE: "GovernmentService",
};

export const NEPAL_PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
] as const;

export const NEPAL_DISTRICTS = [
  "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbhu", "Sunsari", "Taplejung", "Terhathum", "Udayapur",
  "Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha",
  "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok",
  "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun",
  "Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Parasi", "Palpa", "Pyuthan", "Rolpa", "Rukum East", "Rupandehi",
  "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Rukum West", "Salyan", "Surkhet",
  "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur",
];

export const EXAM_TYPES = [
  "MOCK",
  "PRACTICE",
  "PREVIOUS_YEAR",
] as const;

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export const USER_ROLES = [
  "USER",
  "EDITOR",
  "MODERATOR",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export const APP_NAME = "Khojney";
export const APP_TAGLINE = "Everything About Nepal, In One Place";

export const POPULAR_SEARCHES = [
  "Driving License",
  "CMAT",
  "Engineering Entrance",
  "Loksewa",
  "Colleges in Kathmandu",
  "MBBS Entrance",
  "SEE Result",
  "Teacher License",
  "Scholarships for +2",
  "Nursing Colleges",
];

export const FEATURED_CATEGORIES = [
  { name: "Mock Exams", icon: "FileText", color: "red", href: "/exams" },
  { name: "Loksewa", icon: "Landmark", color: "blue", href: "/exams?category=loksewa" },
  { name: "Driving License", icon: "Car", color: "amber", href: "/exams?category=driving-license" },
  { name: "CMAT", icon: "GraduationCap", color: "purple", href: "/exams?category=cmat" },
  { name: "Engineering Entrance", icon: "Cog", color: "green", href: "/exams?category=engineering-entrance" },
  { name: "MBBS Entrance", icon: "Stethoscope", color: "rose", href: "/exams?category=mbbs-entrance" },
  { name: "Colleges", icon: "Building2", color: "indigo", href: "/colleges" },
  { name: "Schools", icon: "School", color: "teal", href: "/schools" },
  { name: "Universities", icon: "University", color: "cyan", href: "/universities" },
  { name: "Scholarships", icon: "Award", color: "emerald", href: "/scholarships" },
  { name: "Banks", icon: "Landmark", color: "blue", href: "/banks" },
  { name: "Jobs", icon: "Briefcase", color: "amber", href: "/jobs" },
  { name: "Govt Services", icon: "Building", color: "purple", href: "/government" },
  { name: "Blog", icon: "Newspaper", color: "orange", href: "/blog" },
  { name: "Teacher License", icon: "Users", color: "pink", href: "/exams?category=teacher-license" },
] as const;
