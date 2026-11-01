/**
 * SQL Statement Generator for Nepal Ecosystem Data
 * Generates SQL batch statements to execute via Neon MCP tool.
 */

import { NEPSE_STOCKS_DATA } from "./data/nepse-stocks";
import { BANKS_DATA } from "./data/banks";
import { UNIVERSITIES_DATA } from "./data/universities";
import { COLLEGES_DATA } from "./data/colleges";
import { EXTRA_EXAMS_DATA } from "./data/exams";
import { HOSPITALS_DATA } from "./data/hospitals";
import { MUTUAL_FUNDS_DATA } from "./data/mutual-funds";
import { INSURANCE_COMPANIES_DATA } from "./data/insurance";
import { GOVERNMENT_SERVICES_DATA } from "./data/government-services";
import { SCHOLARSHIPS_DATA } from "./data/scholarships";

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return "NULL";
  return "'" + str.replace(/'/g, "''") + "'";
}

export function generateNepseSql(): string {
  const rows = NEPSE_STOCKS_DATA.map((s) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(s.slug)}, ${escapeSql(s.symbol)}, ${escapeSql(s.companyName)},
      ${escapeSql(s.description)}, ${escapeSql(s.sector)}, ${s.ltp}, ${s.pointChange}, ${s.percentChange},
      ${s.high52}, ${s.low52}, ${s.peRatio}, ${s.eps}, ${s.bookValue}, ${s.marketCap}, ${s.paidUpCapital},
      ${s.dividendYield}, ${escapeSql(s.bonusShare)}, ${escapeSql(s.cashDividend)}, ${escapeSql(s.website)},
      ${escapeSql(s.headquarters)}, ${s.establishedYear}, ${s.isFeatured}, ${s.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "NepseStock" (
    "id", "slug", "symbol", "companyName", "description", "sector",
    "ltp", "pointChange", "percentChange", "high52", "low52", "peRatio", "eps", "bookValue",
    "marketCap", "paidUpCapital", "dividendYield", "bonusShare", "cashDividend",
    "website", "headquarters", "establishedYear", "isFeatured", "isPublished",
    "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("symbol") DO UPDATE SET
    "companyName" = EXCLUDED."companyName",
    "description" = EXCLUDED."description",
    "sector" = EXCLUDED."sector",
    "ltp" = EXCLUDED."ltp",
    "pointChange" = EXCLUDED."pointChange",
    "percentChange" = EXCLUDED."percentChange",
    "high52" = EXCLUDED."high52",
    "low52" = EXCLUDED."low52",
    "peRatio" = EXCLUDED."peRatio",
    "eps" = EXCLUDED."eps",
    "bookValue" = EXCLUDED."bookValue",
    "marketCap" = EXCLUDED."marketCap",
    "paidUpCapital" = EXCLUDED."paidUpCapital",
    "dividendYield" = EXCLUDED."dividendYield",
    "bonusShare" = EXCLUDED."bonusShare",
    "cashDividend" = EXCLUDED."cashDividend",
    "website" = EXCLUDED."website",
    "headquarters" = EXCLUDED."headquarters",
    "establishedYear" = EXCLUDED."establishedYear",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateBanksSql(): string {
  const rows = BANKS_DATA.map((b) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(b.slug)}, ${escapeSql(b.name)}, ${escapeSql(b.shortName)},
      ${escapeSql(b.description)}, ${escapeSql(b.type)}, ${b.establishedYear}, ${escapeSql(b.headquarters)},
      ${escapeSql(b.website)}, ${escapeSql(b.phone)}, ${escapeSql(b.email)}, ${escapeSql(b.swiftCode)},
      ${b.savingsRateMin}, ${b.savingsRateMax}, ${b.fixedDepositRateMin}, ${b.fixedDepositRateMax},
      ${b.branchCount}, ${b.atmCount}, ${b.mobileBanking}, ${b.internetBanking},
      ${escapeSql(b.cards)}, ${escapeSql(b.loans)}, ${b.rating}, ${b.reviewCount},
      ${b.isFeatured}, ${b.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "Bank" (
    "id", "slug", "name", "shortName", "description", "type", "establishedYear", "headquarters",
    "website", "phone", "email", "swiftCode", "savingsRateMin", "savingsRateMax",
    "fixedDepositRateMin", "fixedDepositRateMax", "branchCount", "atmCount",
    "mobileBanking", "internetBanking", "cards", "loans", "rating", "reviewCount",
    "isFeatured", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "shortName" = EXCLUDED."shortName",
    "description" = EXCLUDED."description",
    "type" = EXCLUDED."type",
    "establishedYear" = EXCLUDED."establishedYear",
    "headquarters" = EXCLUDED."headquarters",
    "website" = EXCLUDED."website",
    "phone" = EXCLUDED."phone",
    "email" = EXCLUDED."email",
    "swiftCode" = EXCLUDED."swiftCode",
    "savingsRateMin" = EXCLUDED."savingsRateMin",
    "savingsRateMax" = EXCLUDED."savingsRateMax",
    "fixedDepositRateMin" = EXCLUDED."fixedDepositRateMin",
    "fixedDepositRateMax" = EXCLUDED."fixedDepositRateMax",
    "branchCount" = EXCLUDED."branchCount",
    "atmCount" = EXCLUDED."atmCount",
    "mobileBanking" = EXCLUDED."mobileBanking",
    "internetBanking" = EXCLUDED."internetBanking",
    "cards" = EXCLUDED."cards",
    "loans" = EXCLUDED."loans",
    "rating" = EXCLUDED."rating",
    "reviewCount" = EXCLUDED."reviewCount",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateUniversitiesSql(): string {
  const rows = UNIVERSITIES_DATA.map((u) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(u.slug)}, ${escapeSql(u.name)}, ${escapeSql(u.description)},
      ${u.establishedYear}, ${escapeSql(u.province)}, ${escapeSql(u.city)}, ${escapeSql(u.address)},
      ${escapeSql(u.phone)}, ${escapeSql(u.email)}, ${escapeSql(u.website)}, ${escapeSql(u.type)},
      ${u.ranking}, ${u.totalCampuses}, ${u.totalStudents}, ${escapeSql(u.programs)},
      ${escapeSql(u.faculties)}, ${escapeSql(u.admissionProcess)}, ${escapeSql(u.notices)},
      ${escapeSql(u.results)}, ${u.rating}, ${u.reviewCount}, ${u.isFeatured}, ${u.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "University" (
    "id", "slug", "name", "description", "establishedYear", "province", "city", "address",
    "phone", "email", "website", "type", "ranking", "totalCampuses", "totalStudents",
    "programs", "faculties", "admissionProcess", "notices", "results",
    "rating", "reviewCount", "isFeatured", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "establishedYear" = EXCLUDED."establishedYear",
    "province" = EXCLUDED."province",
    "city" = EXCLUDED."city",
    "address" = EXCLUDED."address",
    "phone" = EXCLUDED."phone",
    "email" = EXCLUDED."email",
    "website" = EXCLUDED."website",
    "type" = EXCLUDED."type",
    "ranking" = EXCLUDED."ranking",
    "totalCampuses" = EXCLUDED."totalCampuses",
    "totalStudents" = EXCLUDED."totalStudents",
    "programs" = EXCLUDED."programs",
    "faculties" = EXCLUDED."faculties",
    "admissionProcess" = EXCLUDED."admissionProcess",
    "notices" = EXCLUDED."notices",
    "results" = EXCLUDED."results",
    "rating" = EXCLUDED."rating",
    "reviewCount" = EXCLUDED."reviewCount",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateCollegesSql(): string {
  const rows = COLLEGES_DATA.map((c) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(c.slug)}, ${escapeSql(c.name)}, ${escapeSql(c.description)},
      ${escapeSql(c.province)}, ${escapeSql(c.district)}, ${escapeSql(c.city)}, ${escapeSql(c.address)},
      ${escapeSql(c.affiliation)}, ${escapeSql(c.type)}, ${c.establishedYear}, ${escapeSql(c.phone)},
      ${escapeSql(c.email)}, ${escapeSql(c.website)}, ${escapeSql(c.programs)}, ${escapeSql(c.facilities)},
      ${escapeSql(c.admissionProcess)}, ${escapeSql(c.feesRange)}, ${c.scholarshipsAvailable},
      ${c.rating}, ${c.reviewCount}, ${c.isFeatured}, ${c.isVerified}, ${c.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "College" (
    "id", "slug", "name", "description", "province", "district", "city", "address",
    "affiliation", "type", "establishedYear", "phone", "email", "website",
    "programs", "facilities", "admissionProcess", "feesRange", "scholarshipsAvailable",
    "rating", "reviewCount", "isFeatured", "isVerified", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "province" = EXCLUDED."province",
    "district" = EXCLUDED."district",
    "city" = EXCLUDED."city",
    "address" = EXCLUDED."address",
    "affiliation" = EXCLUDED."affiliation",
    "type" = EXCLUDED."type",
    "establishedYear" = EXCLUDED."establishedYear",
    "phone" = EXCLUDED."phone",
    "email" = EXCLUDED."email",
    "website" = EXCLUDED."website",
    "programs" = EXCLUDED."programs",
    "facilities" = EXCLUDED."facilities",
    "admissionProcess" = EXCLUDED."admissionProcess",
    "feesRange" = EXCLUDED."feesRange",
    "scholarshipsAvailable" = EXCLUDED."scholarshipsAvailable",
    "rating" = EXCLUDED."rating",
    "reviewCount" = EXCLUDED."reviewCount",
    "isFeatured" = EXCLUDED."isFeatured",
    "isVerified" = EXCLUDED."isVerified",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateHospitalsSql(): string {
  const rows = HOSPITALS_DATA.map((h) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(h.slug)}, ${escapeSql(h.name)}, ${escapeSql(h.shortName)},
      ${escapeSql(h.description)}, ${escapeSql(h.type)}, ${escapeSql(h.province)}, ${escapeSql(h.district)},
      ${escapeSql(h.city)}, ${escapeSql(h.address)}, ${h.establishedYear}, ${escapeSql(h.website)},
      ${escapeSql(h.phone)}, ${escapeSql(h.emergencyPhone)}, ${escapeSql(h.email)}, ${h.bedCount},
      ${h.icuBeds}, ${h.ventilatorCount}, ${h.hasEmergency}, ${h.hasAmbulance}, ${h.hasBloodBank},
      ${h.hasPharmacy24x7}, ${escapeSql(h.departments)}, ${escapeSql(h.facilities)},
      ${h.rating}, ${h.reviewCount}, ${h.isFeatured}, ${h.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "Hospital" (
    "id", "slug", "name", "shortName", "description", "type", "province", "district",
    "city", "address", "establishedYear", "website", "phone", "emergencyPhone", "email",
    "bedCount", "icuBeds", "ventilatorCount", "hasEmergency", "hasAmbulance", "hasBloodBank",
    "hasPharmacy24x7", "departments", "facilities", "rating", "reviewCount",
    "isFeatured", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "shortName" = EXCLUDED."shortName",
    "description" = EXCLUDED."description",
    "type" = EXCLUDED."type",
    "province" = EXCLUDED."province",
    "district" = EXCLUDED."district",
    "city" = EXCLUDED."city",
    "address" = EXCLUDED."address",
    "establishedYear" = EXCLUDED."establishedYear",
    "website" = EXCLUDED."website",
    "phone" = EXCLUDED."phone",
    "emergencyPhone" = EXCLUDED."emergencyPhone",
    "email" = EXCLUDED."email",
    "bedCount" = EXCLUDED."bedCount",
    "icuBeds" = EXCLUDED."icuBeds",
    "ventilatorCount" = EXCLUDED."ventilatorCount",
    "hasEmergency" = EXCLUDED."hasEmergency",
    "hasAmbulance" = EXCLUDED."hasAmbulance",
    "hasBloodBank" = EXCLUDED."hasBloodBank",
    "hasPharmacy24x7" = EXCLUDED."hasPharmacy24x7",
    "departments" = EXCLUDED."departments",
    "facilities" = EXCLUDED."facilities",
    "rating" = EXCLUDED."rating",
    "reviewCount" = EXCLUDED."reviewCount",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateMutualFundsSql(): string {
  const rows = MUTUAL_FUNDS_DATA.map((m) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(m.slug)}, ${escapeSql(m.name)}, ${escapeSql(m.schemeCode)},
      ${escapeSql(m.fundManager)}, ${escapeSql(m.sponsor)}, ${escapeSql(m.description)},
      ${escapeSql(m.fundType)}, ${escapeSql(m.category)}, ${m.nav}, ${m.fundSize}, ${m.totalUnits},
      ${m.dividendYield}, ${escapeSql(m.latestDividend)}, ${escapeSql(m.topHoldings)},
      ${escapeSql(m.website)}, ${escapeSql(m.contactPhone)}, ${m.isFeatured}, ${m.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "MutualFund" (
    "id", "slug", "name", "schemeCode", "fundManager", "sponsor", "description",
    "fundType", "category", "nav", "fundSize", "totalUnits", "dividendYield",
    "latestDividend", "topHoldings", "website", "contactPhone",
    "isFeatured", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "schemeCode" = EXCLUDED."schemeCode",
    "fundManager" = EXCLUDED."fundManager",
    "sponsor" = EXCLUDED."sponsor",
    "description" = EXCLUDED."description",
    "fundType" = EXCLUDED."fundType",
    "category" = EXCLUDED."category",
    "nav" = EXCLUDED."nav",
    "fundSize" = EXCLUDED."fundSize",
    "totalUnits" = EXCLUDED."totalUnits",
    "dividendYield" = EXCLUDED."dividendYield",
    "latestDividend" = EXCLUDED."latestDividend",
    "topHoldings" = EXCLUDED."topHoldings",
    "website" = EXCLUDED."website",
    "contactPhone" = EXCLUDED."contactPhone",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateInsuranceSql(): string {
  const rows = INSURANCE_COMPANIES_DATA.map((i) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(i.slug)}, ${escapeSql(i.name)}, ${escapeSql(i.shortName)},
      ${escapeSql(i.description)}, ${escapeSql(i.type)}, ${i.establishedYear}, ${escapeSql(i.headquarters)},
      ${escapeSql(i.website)}, ${escapeSql(i.phone)}, ${escapeSql(i.email)}, ${i.paidUpCapital},
      ${i.claimSettlementRatio}, ${i.branchCount}, ${i.solvencyRatio}, ${escapeSql(i.popularPlans)},
      ${escapeSql(i.coverageTypes)}, ${i.rating}, ${i.reviewCount}, ${i.isFeatured}, ${i.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "InsuranceCompany" (
    "id", "slug", "name", "shortName", "description", "type", "establishedYear", "headquarters",
    "website", "phone", "email", "paidUpCapital", "claimSettlementRatio", "branchCount",
    "solvencyRatio", "popularPlans", "coverageTypes", "rating", "reviewCount",
    "isFeatured", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "shortName" = EXCLUDED."shortName",
    "description" = EXCLUDED."description",
    "type" = EXCLUDED."type",
    "establishedYear" = EXCLUDED."establishedYear",
    "headquarters" = EXCLUDED."headquarters",
    "website" = EXCLUDED."website",
    "phone" = EXCLUDED."phone",
    "email" = EXCLUDED."email",
    "paidUpCapital" = EXCLUDED."paidUpCapital",
    "claimSettlementRatio" = EXCLUDED."claimSettlementRatio",
    "branchCount" = EXCLUDED."branchCount",
    "solvencyRatio" = EXCLUDED."solvencyRatio",
    "popularPlans" = EXCLUDED."popularPlans",
    "coverageTypes" = EXCLUDED."coverageTypes",
    "rating" = EXCLUDED."rating",
    "reviewCount" = EXCLUDED."reviewCount",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateGovernmentServicesSql(): string {
  const rows = GOVERNMENT_SERVICES_DATA.map((g) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(g.slug)}, ${escapeSql(g.title)}, ${escapeSql(g.description)},
      ${escapeSql(g.category)}, ${escapeSql(g.ministry)}, ${escapeSql(g.department)}, ${escapeSql(g.office)},
      ${escapeSql(g.applicationUrl)}, ${escapeSql(g.applicationFee)}, ${escapeSql(g.processingTime)},
      ${escapeSql(g.requiredDocuments)}, ${escapeSql(g.steps)}, ${escapeSql(g.contactPhone)},
      ${escapeSql(g.contactEmail)}, ${g.views}, ${g.isFeatured}, ${g.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "GovernmentService" (
    "id", "slug", "title", "description", "category", "ministry", "department", "office",
    "applicationUrl", "applicationFee", "processingTime", "requiredDocuments", "steps",
    "contactPhone", "contactEmail", "views", "isFeatured", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "description" = EXCLUDED."description",
    "category" = EXCLUDED."category",
    "ministry" = EXCLUDED."ministry",
    "department" = EXCLUDED."department",
    "office" = EXCLUDED."office",
    "applicationUrl" = EXCLUDED."applicationUrl",
    "applicationFee" = EXCLUDED."applicationFee",
    "processingTime" = EXCLUDED."processingTime",
    "requiredDocuments" = EXCLUDED."requiredDocuments",
    "steps" = EXCLUDED."steps",
    "contactPhone" = EXCLUDED."contactPhone",
    "contactEmail" = EXCLUDED."contactEmail",
    "views" = EXCLUDED."views",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateScholarshipsSql(): string {
  const rows = SCHOLARSHIPS_DATA.map((s) => {
    return `(
      gen_random_uuid()::text, ${escapeSql(s.slug)}, ${escapeSql(s.title)}, ${escapeSql(s.provider)},
      ${escapeSql(s.description)}, ${escapeSql(s.level)}, ${escapeSql(s.field)}, ${escapeSql(s.country)},
      ${escapeSql(s.amount)}, ${escapeSql(s.deadline)}::timestamp,
      ${escapeSql(s.applicationUrl)}, ${escapeSql(JSON.stringify([s.eligibility]))},
      ${s.isFeatured}, ${s.isPublished}, NOW(), NOW()
    )`;
  }).join(",\n");

  return `INSERT INTO "Scholarship" (
    "id", "slug", "title", "provider", "description", "level", "field", "country",
    "amount", "deadline", "applicationUrl", "eligibility",
    "isFeatured", "isPublished", "createdAt", "updatedAt"
  ) VALUES \n${rows}
  ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "provider" = EXCLUDED."provider",
    "description" = EXCLUDED."description",
    "level" = EXCLUDED."level",
    "field" = EXCLUDED."field",
    "country" = EXCLUDED."country",
    "amount" = EXCLUDED."amount",
    "deadline" = EXCLUDED."deadline",
    "applicationUrl" = EXCLUDED."applicationUrl",
    "eligibility" = EXCLUDED."eligibility",
    "isFeatured" = EXCLUDED."isFeatured",
    "isPublished" = EXCLUDED."isPublished",
    "updatedAt" = NOW();`;
}

export function generateExamsSqlStatements(): string[] {
  const statements: string[] = [];

  for (const group of EXTRA_EXAMS_DATA) {
    // 1. Parent Exam
    statements.push(`INSERT INTO "Exam" (
      "id", "slug", "title", "description", "categoryId", "parentId",
      "isParent", "durationMin", "totalMarks", "tags", "isPublished", "isFeatured",
      "examType", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text,
      ${escapeSql(group.parent.slug)},
      ${escapeSql(group.parent.title)},
      ${escapeSql(group.parent.description)},
      ${escapeSql(group.parent.categoryId)},
      ${escapeSql(group.parent.parentId)},
      true,
      ${group.parent.durationMin},
      ${group.parent.totalMarks},
      ${escapeSql(group.parent.tags)},
      true,
      true,
      'PRACTICE',
      NOW(),
      NOW()
    )
    ON CONFLICT ("slug") DO UPDATE SET
      "title" = EXCLUDED."title",
      "description" = EXCLUDED."description",
      "categoryId" = EXCLUDED."categoryId",
      "parentId" = EXCLUDED."parentId",
      "isParent" = true,
      "tags" = EXCLUDED."tags",
      "updatedAt" = NOW();`);

    // 2. Child Exam
    statements.push(`INSERT INTO "Exam" (
      "id", "slug", "title", "description", "categoryId", "parentId",
      "isParent", "durationMin", "totalMarks", "passingMarks", "difficulty",
      "tags", "examType", "isPublished", "isFeatured", "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid()::text,
      ${escapeSql(group.child.slug)},
      ${escapeSql(group.child.title)},
      ${escapeSql(group.child.description)},
      ${escapeSql(group.child.categoryId)},
      (SELECT "id" FROM "Exam" WHERE "slug" = ${escapeSql(group.parent.slug)} LIMIT 1),
      false,
      ${group.child.durationMin},
      ${group.child.totalMarks},
      ${group.child.passingMarks},
      ${escapeSql(group.child.difficulty)},
      ${escapeSql(group.child.tags)},
      'MOCK',
      true,
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT ("slug") DO UPDATE SET
      "title" = EXCLUDED."title",
      "description" = EXCLUDED."description",
      "parentId" = (SELECT "id" FROM "Exam" WHERE "slug" = ${escapeSql(group.parent.slug)} LIMIT 1),
      "durationMin" = EXCLUDED."durationMin",
      "totalMarks" = EXCLUDED."totalMarks",
      "passingMarks" = EXCLUDED."passingMarks",
      "difficulty" = EXCLUDED."difficulty",
      "tags" = EXCLUDED."tags",
      "updatedAt" = NOW();`);

    // 3. Clear existing questions for idempotency
    statements.push(`DELETE FROM "ExamQuestion" WHERE "examId" = (SELECT "id" FROM "Exam" WHERE "slug" = ${escapeSql(group.child.slug)} LIMIT 1);`);

    // 4. Insert questions
    const qValues = group.questions.map((q, idx) => {
      return `(
        gen_random_uuid()::text,
        (SELECT "id" FROM "Exam" WHERE "slug" = ${escapeSql(group.child.slug)} LIMIT 1),
        'MULTIPLE_CHOICE',
        ${escapeSql(q.question)},
        ${escapeSql(JSON.stringify(q.options))},
        ${q.correctIdx},
        ${escapeSql(q.explanation)},
        ${q.marks},
        ${idx + 1}
      )`;
    }).join(",\n");

    statements.push(`INSERT INTO "ExamQuestion" (
      "id", "examId", "type", "question", "options", "correctIdx", "explanation", "marks", "order"
    ) VALUES \n${qValues};`);
  }

  return statements;
}

