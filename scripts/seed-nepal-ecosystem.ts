/**
 * Master Seed Script for Nepal Ecosystem Data
 * Populates NEPSE Stocks, Banks, Universities, Colleges, Exams, Hospitals,
 * Mutual Funds, Insurance Companies, Government Services, and Scholarships.
 *
 * Run: `bun run scripts/seed-nepal-ecosystem.ts`
 */

import { PrismaClient } from "@prisma/client";
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

const prisma = new PrismaClient();

async function main() {
  console.log("🇳🇵 Starting Nepal Ecosystem Comprehensive Seed...");

  // 1. NEPSE Stocks
  console.log(`📈 Seeding ${NEPSE_STOCKS_DATA.length} NEPSE Stocks...`);
  for (const s of NEPSE_STOCKS_DATA) {
    await prisma.nepseStock.upsert({
      where: { symbol: s.symbol },
      create: s,
      update: s,
    });
  }

  // 2. Banks
  console.log(`🏦 Seeding ${BANKS_DATA.length} Banks & Financial Institutions...`);
  for (const b of BANKS_DATA) {
    await prisma.bank.upsert({
      where: { slug: b.slug },
      create: b,
      update: b,
    });
  }

  // 3. Universities
  console.log(`🎓 Seeding ${UNIVERSITIES_DATA.length} Universities & Academies...`);
  for (const u of UNIVERSITIES_DATA) {
    await prisma.university.upsert({
      where: { slug: u.slug },
      create: u,
      update: u,
    });
  }

  // 4. Colleges
  console.log(`🏛️ Seeding ${COLLEGES_DATA.length} Colleges...`);
  for (const c of COLLEGES_DATA) {
    await prisma.college.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
  }

  // 5. Hospitals
  console.log(`🏥 Seeding ${HOSPITALS_DATA.length} Hospitals...`);
  for (const h of HOSPITALS_DATA) {
    await prisma.hospital.upsert({
      where: { slug: h.slug },
      create: h,
      update: h,
    });
  }

  // 6. Mutual Funds
  console.log(`📊 Seeding ${MUTUAL_FUNDS_DATA.length} Mutual Funds...`);
  for (const m of MUTUAL_FUNDS_DATA) {
    await prisma.mutualFund.upsert({
      where: { slug: m.slug },
      create: m,
      update: m,
    });
  }

  // 7. Insurance Companies
  console.log(`🛡️ Seeding ${INSURANCE_COMPANIES_DATA.length} Insurance Companies...`);
  for (const i of INSURANCE_COMPANIES_DATA) {
    await prisma.insuranceCompany.upsert({
      where: { slug: i.slug },
      create: i,
      update: i,
    });
  }

  // 8. Government Services
  console.log(`🏛️ Seeding ${GOVERNMENT_SERVICES_DATA.length} Government Services...`);
  for (const g of GOVERNMENT_SERVICES_DATA) {
    await prisma.governmentService.upsert({
      where: { slug: g.slug },
      create: g,
      update: g,
    });
  }

  // 9. Scholarships
  console.log(`📜 Seeding ${SCHOLARSHIPS_DATA.length} Scholarships...`);
  for (const sc of SCHOLARSHIPS_DATA) {
    await prisma.scholarship.upsert({
      where: { slug: sc.slug },
      create: sc,
      update: sc,
    });
  }

  // 10. Extra Exams & Questions
  console.log(`📝 Seeding ${EXTRA_EXAMS_DATA.length} Exam Groups and Questions...`);
  for (const grp of EXTRA_EXAMS_DATA) {
    const parentExam = await prisma.exam.upsert({
      where: { slug: grp.parent.slug },
      create: {
        slug: grp.parent.slug,
        title: grp.parent.title,
        description: grp.parent.description,
        categoryId: grp.parent.categoryId,
        parentId: grp.parent.parentId,
        isParent: true,
        durationMin: grp.parent.durationMin,
        totalMarks: grp.parent.totalMarks,
        tags: grp.parent.tags,
        examType: "PRACTICE",
        isPublished: true,
        isFeatured: true,
      },
      update: {
        title: grp.parent.title,
        description: grp.parent.description,
        tags: grp.parent.tags,
      },
    });

    const childExam = await prisma.exam.upsert({
      where: { slug: grp.child.slug },
      create: {
        slug: grp.child.slug,
        title: grp.child.title,
        description: grp.child.description,
        categoryId: grp.child.categoryId,
        parentId: parentExam.id,
        isParent: false,
        durationMin: grp.child.durationMin,
        totalMarks: grp.child.totalMarks,
        passingMarks: grp.child.passingMarks,
        difficulty: grp.child.difficulty,
        tags: grp.child.tags,
        examType: "MOCK",
        isPublished: true,
        isFeatured: true,
      },
      update: {
        title: grp.child.title,
        description: grp.child.description,
        parentId: parentExam.id,
        durationMin: grp.child.durationMin,
        totalMarks: grp.child.totalMarks,
      },
    });

    // Clean and insert questions
    await prisma.examQuestion.deleteMany({
      where: { examId: childExam.id },
    });

    for (let i = 0; i < grp.questions.length; i++) {
      const q = grp.questions[i];
      await prisma.examQuestion.create({
        data: {
          examId: childExam.id,
          type: "MULTIPLE_CHOICE",
          question: q.question,
          options: JSON.stringify(q.options),
          correctIdx: q.correctIdx,
          explanation: q.explanation,
          marks: q.marks,
          order: i + 1,
        },
      });
    }
  }

  console.log("✅ Nepal Ecosystem Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
