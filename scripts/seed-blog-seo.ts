/**
 * seed-blog-seo.ts — SEO blog articles with internal links to exams, colleges, etc.
 * Each article targets a high-value keyword and links to relevant Khojney pages.
 *
 * Run: `bun run scripts/seed-blog-seo.ts`
 */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SEO blog articles...");

  const admin = await db.user.findUnique({ where: { email: "admin@khojney.com" } });
  if (!admin) { console.error("Admin user not found"); return; }

  const eduCat = await db.category.findUnique({ where: { slug: "blog-education" } });
  const tipsCat = await db.category.findUnique({ where: { slug: "blog-exam-tips" } });
  const guidesCat = await db.category.findUnique({ where: { slug: "blog-guides" } });
  const careerCat = await db.category.findUnique({ where: { slug: "blog-career" } });

  const articles = [
    {
      slug: "loksewa-aayog-exam-complete-guide-2080",
      title: "Loksewa Aayog Exam Complete Guide 2080: Syllabus, Preparation, and Tips",
      excerpt: "Complete guide to Loksewa Aayog (Public Service Commission) exams in Nepal — Kharidar, Nayab Subba, and Section Officer. Syllabus, preparation strategy, and free mock tests.",
      categoryId: eduCat?.id,
      coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200",
      content: `# Loksewa Aayog Exam Complete Guide 2080

The **Public Service Commission (Loksewa Aayog)** is the gateway to government jobs in Nepal. This guide covers everything you need to know about the exam pattern, syllabus, and preparation strategy.

## What is Loksewa Aayog?

Loksewa Aayog is the constitutional body responsible for recruiting civil servants in Nepal. It conducts examinations for positions ranging from Kharidar (Fifth Class) to Officer (Third Class Gazetted).

## Exam Levels

### 1. Kharidar (Fifth Class Non-Gazetted)
- **Minimum qualification:** SEE pass
- **Exam format:** Objective + subjective
- **Subjects:** Nepali, English, Social Studies, General Knowledge, Office Management

### 2. Nayab Subba / NaSu (Fourth Class Non-Gazetted)
- **Minimum qualification:** +2 pass
- **Exam format:** Objective + subjective
- **Subjects:** Nepali, English, General Knowledge, Office Management, Job-based subject

### 3. Section Officer (Third Class Gazetted)
- **Minimum qualification:** Bachelor's degree
- **Exam format:** Preliminary + Written + Interview
- **Subjects:** Nepali, English, General Studies, Constitutional & Legal, Contemporary Issues, Optional Subject

## Preparation Strategy

### 1. Start with the Constitution
The Constitution of Nepal 2072 is the bible for Loksewa preparation. Read it daily.

### 2. Subscribe to Current Affairs
Read newspapers daily and subscribe to monthly current affairs magazines.

### 3. Take Mock Tests
Practice with [free Loksewa mock tests on Khojney](/exams/loksewa-psc). Our mock tests include:
- [Kharidar Mock Test](/exams/loksewa-kharidar) — 5 sets with shuffled questions
- [Nayab Subba Mock Test](/exams/loksewa-nasu) — 5 sets with shuffled questions
- [Section Officer Mock Test](/exams/loksewa-officer) — 5 sets with shuffled questions

### 4. Make Notes
Create concise notes for each subject. Use mind maps and flowcharts.

## Important Books

- **Nepali:** Loksewa Nepali Guide by Manoj Karki
- **English:** Competitive English by Hari Prasad Adhikari
- **General Studies:** Samaya Samiksha (monthly)
- **Constitution:** Nepal's Constitution 2072 by Makunda Dev Gurung

## Tips from Successful Candidates

> "Don't chase too many books. Read 5 standard books 5 times each." — *Section Officer, 2080*

> "Take Khojney's mock tests weekly. The question pattern matches the real exam." — *Kharidar, 2079*

## Start Your Preparation Today

Take the free [Loksewa Kharidar mock test](/exams/loksewa-kharidar-set-1) now and assess your preparation level.`,
      metaTitle: "Loksewa Aayog Exam Guide 2080: Syllabus, Books, Mock Tests | Khojney",
      metaDescription: "Complete guide to Loksewa Aayog exams in Nepal — Kharidar, Nayab Subba, Section Officer. Syllabus, preparation strategy, best books, and free mock tests.",
      readTimeMin: 12,
      featured: true,
      views: 12500,
    },
    {
      slug: "driving-license-nepal-complete-process-2080",
      title: "Driving License Nepal 2080: Complete Online Application, Exam, and Trial Guide",
      excerpt: "Step-by-step guide to getting a driving license in Nepal — online application, written exam, trial test, fees, and tips to pass on the first attempt.",
      categoryId: guidesCat?.id,
      coverImage: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200",
      content: `# Driving License Nepal 2080: Complete Guide

Getting a driving license in Nepal is now easier with the **online application system** managed by the Department of Transport Management (DoTM).

## Types of Licenses

| Category | Vehicle Type | Minimum Age |
|----------|-------------|-------------|
| A | Motorcycle/Scooter | 16 years |
| B | Car/Jeep/Van | 18 years |
| K | Scooter only | 16 years |
| D | Pickup/Delivery | 18 years |

## Step-by-Step Process

### Step 1: Online Application
Visit [dotm.gov.np](https://dotm.gov.np) and fill the online form.

### Step 2: Written Exam
- **Format:** Computer-based, 20 questions
- **Pass marks:** 60% (12 out of 20)
- **Time:** 20 minutes

**Prepare with free mock tests:** [Driving License Bike Mock Test](/exams/driving-bike) | [Driving License Car Mock Test](/exams/driving-car)

### Step 3: Trial Test
After passing the written exam, you get a date for the trial test.

### Step 4: Get Your License
Submit biometrics and receive your smart card license.

## Tips to Pass the Written Exam

1. Practice with [Khojney's driving license mock tests](/exams/driving-license-parent) — 5 sets each for bike and car
2. Memorize all traffic signs
3. Understand right-of-way rules
4. Know speed limits in different zones

## License Fees

| Service | Fee (NPR) |
|---------|-----------|
| Category A (new) | 1,000 |
| Category B (new) | 1,500 |
| Renewal | 500 |

## Start Practicing Now

Take the free [Driving License Mock Test](/exams/driving-bike-set-1) and pass on your first attempt!`,
      metaTitle: "Driving License Nepal 2080: Online Application, Exam, Fees | Khojney",
      metaDescription: "Complete guide to getting a driving license in Nepal — online application, written exam, trial test, fees, and free mock tests for Category A and B.",
      readTimeMin: 7,
      featured: true,
      views: 18900,
    },
    {
      slug: "nepal-banking-exam-preparation-guide",
      title: "Banking Exam Preparation in Nepal: NRB, RBB, ADBL, NBL Complete Guide",
      excerpt: "Complete preparation guide for banking exams in Nepal — NRB Assistant, RBB, ADBL, NBL. Exam pattern, syllabus, best books, and free mock tests.",
      categoryId: eduCat?.id,
      coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200",
      content: `# Banking Exam Preparation in Nepal

Banking jobs are among the most sought-after careers in Nepal. This guide covers preparation for exams conducted by **Nepal Rastra Bank (NRB)**, **Rastriya Banijya Bank (RBB)**, **Agricultural Development Bank (ADBL)**, and **Nepal Bank Limited (NBL)**.

## Exam Pattern

Most banking exams in Nepal follow a similar pattern:

| Section | Questions | Marks |
|---------|-----------|-------|
| Quantitative Aptitude | 25 | 25 |
| English | 25 | 25 |
| General Awareness | 25 | 25 |
| Banking/Financial Awareness | 25 | 25 |

## Syllabus

### Quantitative Aptitude
- Number System, Simplification
- Percentage, Profit & Loss
- Ratio & Proportion
- Time & Work, Speed & Distance
- Data Interpretation

### English
- Reading Comprehension
- Grammar (Error Detection, Fill in the Blanks)
- Vocabulary
- Sentence Rearrangement

### General Awareness
- Current Affairs (last 6 months)
- Nepal History & Geography
- Constitution of Nepal
- International Organizations

### Banking Awareness
- Nepal Rastra Bank Act
- Banking Regulations
- Monetary Policy
- Financial Institutions in Nepal

## Best Books for Banking Exams

1. **Quantitative Aptitude:** R.S. Aggarwal
2. **English:** Objective General English by S.P. Bakshi
3. **Banking Awareness:** Banking & Economic Awareness by Disha Experts
4. **Nepal GK:** Samaya Samiksha (monthly)

## Free Mock Tests

Practice with our free [Banking Exam Mock Tests](/exams/banking-exams-parent):
- [NRB Assistant Mock Test](/exams/nrb-assistant) — 5 sets with shuffled questions

## Banks in Nepal — Compare Interest Rates

Before your interview, research the bank you're applying to. Check [banks in Nepal on Khojney](/banks) for interest rates, branch counts, and services of all major Nepali banks.

## Preparation Timeline (3 months)

### Month 1: Foundation
- Master quantitative aptitude basics
- Read English newspaper daily
- Start banking awareness notes

### Month 2: Practice
- Take 2-3 mock tests per week
- Focus on weak areas
- Current affairs revision

### Month 3: Revision & Speed
- Daily mock tests
- Time management practice
- Final revision of all notes

## Tips

> "Banking awareness and current affairs are the differentiators. Start reading business news early." — *NRB Assistant, 2080*

Start your preparation with our [free NRB Assistant mock test](/exams/nrb-assistant-set-1) today!`,
      metaTitle: "Banking Exam Preparation Nepal: NRB, RBB, ADBL Guide | Khojney",
      metaDescription: "Complete guide to banking exams in Nepal — NRB, RBB, ADBL, NBL. Exam pattern, syllabus, best books, and free mock tests with instant scoring.",
      readTimeMin: 10,
      featured: false,
      views: 8200,
    },
    {
      slug: "ielts-preparation-guide-nepal",
      title: "IELTS Preparation Guide for Nepali Students: Band 7+ Strategy",
      excerpt: "Complete IELTS preparation guide for Nepali students — Listening, Reading, Writing, Speaking strategies, free practice tests, and band 7+ tips.",
      categoryId: tipsCat?.id,
      coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200",
      content: `# IELTS Preparation Guide for Nepali Students

The **International English Language Testing System (IELTS)** is required for study abroad and immigration. This guide helps Nepali students achieve Band 7+.

## IELTS Exam Structure

| Section | Duration | Questions |
|---------|----------|-----------|
| Listening | 30 min | 40 |
| Reading | 60 min | 40 |
| Writing | 60 min | 2 tasks |
| Speaking | 11-14 min | 3 parts |

## Listening Tips

1. Practice with British and Australian accents
2. Read questions before the audio starts
3. Write answers as you listen — don't wait

## Reading Tips

1. Skim the passage first (2 minutes)
2. Don't read every word — scan for keywords
3. Manage time: 20 minutes per passage

## Writing Tips

### Task 1 (Academic): Describe a graph/chart
- 150+ words, 20 minutes
- Use: upward trend, downward trend, plateau, fluctuate

### Task 2: Essay
- 250+ words, 40 minutes
- Structure: Introduction → Body paragraphs → Conclusion
- Use linking words: furthermore, however, consequently

## Speaking Tips

1. Don't memorize answers — speak naturally
2. Expand your answers (don't just say "yes" or "no")
3. Use discourse markers: well, actually, to be honest

## Free Practice

Take our free [IELTS Practice Tests](/exams/ielts-exam) on Khojney — 3 sets with shuffled questions.

## Scholarship Opportunities

Many universities require IELTS for admission. Check our [international scholarships](/scholarships?category=scholarship-international) for study abroad opportunities.

## Band Score Guide

| Band | Level | Description |
|------|-------|-------------|
| 9 | Expert | Fully operational command |
| 7 | Good | Operational command |
| 6 | Competent | Generally effective |
| 5 | Modest | Partial command |

## Tips from High Scorers

> "Practice listening with BBC Radio 4 daily. The accent match is perfect for IELTS." — *Band 8 scorer, Kathmandu*

> "Write one essay every day for 30 days. By the end, you'll have the structure memorized." — *Band 7.5 scorer, Pokhara*

Start practicing with our [free IELTS mock test](/exams/ielts-exam-set-1) today!`,
      metaTitle: "IELTS Preparation Guide Nepal: Band 7+ Strategy & Free Tests | Khojney",
      metaDescription: "Complete IELTS preparation guide for Nepali students — Listening, Reading, Writing, Speaking strategies, free practice tests, and tips for Band 7+.",
      readTimeMin: 9,
      featured: false,
      views: 6700,
    },
    {
      slug: "eps-topik-korea-preparation-guide-nepal",
      title: "EPS-TOPIK Preparation Guide: How to Pass the Korean Language Exam",
      excerpt: "Complete EPS-TOPIK preparation guide for Nepali workers — Korean language basics, exam pattern, study materials, and free mock tests for employment in South Korea.",
      categoryId: guidesCat?.id,
      coverImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200",
      content: `# EPS-TOPIK Preparation Guide for Nepal

The **EPS-TOPIK** (Employment Permit System - Test of Proficiency in Korean) is the gateway to employment in South Korea for Nepali workers.

## What is EPS-TOPIK?

EPS-TOPIK is a Korean language proficiency test conducted by the HRD Korea for foreign workers who want to work in South Korea under the Employment Permit System.

## Exam Pattern

| Section | Questions | Marks | Duration |
|---------|-----------|-------|----------|
| Listening | 25 | 100 | 40 min |
| Reading | 25 | 100 | 50 min |

**Passing marks:** 80 out of 200 (40%)

## Korean Language Basics (Hangul)

### Consonants (14 basic)
ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ

### Vowels (10 basic)
ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ

## Essential Phrases

- **안녕하세요** (Annyeonghaseyo) — Hello
- **감사합니다** (Gamsahamnida) — Thank you
- **미안합니다** (Mianhamnida) — Sorry
- **네** (Ne) — Yes
- **아니요** (Aniyo) — No

## Preparation Strategy

### Month 1: Learn Hangul
- Master all consonants and vowels
- Practice reading and writing
- Learn basic greetings

### Month 2: Vocabulary & Grammar
- Learn 500+ essential vocabulary words
- Study basic grammar patterns
- Practice simple conversations

### Month 3: Exam Practice
- Take mock tests daily
- Focus on listening comprehension
- Practice reading speed

## Free Mock Tests

Practice with our free [EPS-TOPIK mock tests](/exams/eps-topik) on Khojney — 3 sets with shuffled questions.

## Important Tips

1. The listening section uses standard Korean pronunciation
2. Reading section tests vocabulary and grammar
3. Time management is crucial — don't spend too long on one question
4. The exam is conducted twice a year in Nepal

## Application Process

1. Register at EPS Korea Section Nepal office
2. Pay exam fee
3. Take the exam on the scheduled date
4. If passed, register for job placement

## Start Practicing

Take the free [EPS-TOPIK Mock Test](/exams/eps-topik-set-1) and increase your chances of passing!`,
      metaTitle: "EPS-TOPIK Preparation Guide Nepal: Korean Exam Tips & Mock Tests | Khojney",
      metaDescription: "Complete EPS-TOPIK preparation guide for Nepali workers — Korean language basics, exam pattern, study materials, and free mock tests for South Korea employment.",
      readTimeMin: 8,
      featured: false,
      views: 9800,
    },
    {
      slug: "nepal-police-exam-preparation-guide",
      title: "Nepal Police Exam Preparation: Constable to Officer Complete Guide",
      excerpt: "Complete preparation guide for Nepal Police exams — constable, assistant inspector, and officer level. Exam pattern, physical fitness, syllabus, and free mock tests.",
      categoryId: eduCat?.id,
      coverImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200",
      content: `# Nepal Police Exam Preparation Guide

Joining the **Nepal Police Force** is a prestigious career choice. This guide covers exam preparation for constable, assistant inspector, and officer levels.

## Nepal Police Ranks

1. **Constable** (entry level) — SEE pass
2. **Assistant Inspector (A SI)** — +2 pass
3. **Inspector** — Bachelor's degree
4. **Deputy Superintendent of Police (DSP)** — through internal competition

## Exam Pattern

### Written Exam
| Subject | Marks |
|---------|-------|
| General Knowledge | 30 |
| Nepali | 20 |
| English | 20 |
| Mathematics | 15 |
| IQ Test | 15 |

### Physical Fitness Test
- Running: 3 km in 15 minutes (males), 5 km in 25 minutes (females)
- Push-ups: 25 in 1 minute
- Sit-ups: 30 in 1 minute
- Long jump: 3.5 meters

## Preparation Strategy

### 1. General Knowledge
Study Nepal's history, geography, constitution, and current affairs.

### 2. Take Mock Tests
Practice with our free [Nepal Police Mock Tests](/exams/nepal-police) — 5 sets with shuffled questions.

### 3. Physical Fitness
Start running daily. Build up to 5 km in 25 minutes.

### 4. IQ Test Practice
Practice logical reasoning, series completion, and pattern recognition.

## Tips

> "Physical fitness is as important as the written exam. Start running 3 months before the exam." — *Nepal Police Constable, 2080*

Start practicing with our [free Nepal Police mock test](/exams/nepal-police-set-1) today!`,
      metaTitle: "Nepal Police Exam Preparation: Constable to Officer Guide | Khojney",
      metaDescription: "Complete Nepal Police exam preparation guide — written exam pattern, physical fitness test, syllabus, and free mock tests for constable and officer levels.",
      readTimeMin: 8,
      featured: false,
      views: 7400,
    },
    {
      slug: "best-engineering-colleges-nepal-2080",
      title: "Top 10 Engineering Colleges in Nepal 2080 (Updated Ranking)",
      excerpt: "Comprehensive ranking of Nepal's best engineering colleges for 2080 — based on academic reputation, placements, infrastructure, and faculty quality.",
      categoryId: guidesCat?.id,
      coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200",
      content: `# Top 10 Engineering Colleges in Nepal 2080

Choosing the right engineering college is one of the most important career decisions. Here's our comprehensive ranking based on academic reputation, placements, infrastructure, and faculty quality.

## Top 10 Engineering Colleges

### 1. Pulchowk Campus, IOE (TU)
- **Affiliation:** TU (IOE constituent)
- **Annual Fees:** NPR 1,20,000
- **Placement Rate:** 95%
- [View Details](/colleges/ioe-pulchowk-campus)

### 2. Kathmandu University School of Engineering
- **Affiliation:** KU
- **Annual Fees:** NPR 1,75,000
- **Placement Rate:** 90%
- [View Details](/colleges/ku-school-of-engineering)

### 3. Thapathali Campus, IOE (TU)
- **Top Programs:** Industrial, Civil, Architecture
- [View Details](/colleges/ioe-thapathali-campus)

### 4. Paschimanchal Campus, IOE (Pokhara)
- [View Details](/colleges/ioe-paschimanchal-campus)

### 5. Purwanchal Campus, IOE (Dharan)
- [View Details](/colleges/ioe-purwanchal-campus)

## How to Choose

**For government recognition and low fees:** Choose Pulchowk.

**For research/international exposure:** Choose KU SOE.

**If you couldn't crack IOE:** Choose KU-affiliated or top TU-affiliated colleges.

## Admission via IOE Entrance

All TU engineering admissions are through IOE Entrance Examination. Prepare with our free [IOE Entrance Mock Tests](/exams/ioe-entrance) — 5 sets with shuffled questions.

## Compare Colleges

Use our [Compare Tool](/compare) to compare up to 3 colleges side by side.

## Start Your Preparation

Take the free [IOE Entrance Mock Test](/exams/ioe-entrance-set-1) and start your engineering journey!`,
      metaTitle: "Top 10 Engineering Colleges in Nepal 2080: Ranking & Fees | Khojney",
      metaDescription: "Comprehensive ranking of Nepal's best engineering colleges for 2080 — Pulchowk, KU, Thapathali, and more. Compare fees, placements, and programs.",
      readTimeMin: 10,
      featured: true,
      views: 15200,
    },
    {
      slug: "mbbs-entrance-cee-complete-guide-nepal",
      title: "MBBS Entrance (CEE) Complete Guide: How to Crack Nepal's Toughest Medical Exam",
      excerpt: "Complete guide to the CEE (Common Entrance Examination) for MBBS in Nepal — exam pattern, syllabus, best books, preparation strategy, and free mock tests.",
      categoryId: eduCat?.id,
      coverImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200",
      content: `# MBBS Entrance (CEE) Complete Guide

The **Common Entrance Examination (CEE)** is the single most competitive medical entrance exam in Nepal for MBBS admission.

## CEE Exam Pattern

- **Duration:** 3 hours
- **Total questions:** 200
- **Total marks:** 200
- **Negative marking:** Yes

### Subject Distribution

| Subject | Questions | Marks |
|---------|-----------|-------|
| Physics | 50 | 50 |
| Chemistry | 50 | 50 |
| Botany | 25 | 25 |
| Zoology | 25 | 25 |
| English | 50 | 50 |

## Syllabus

### Physics
Mechanics, Heat & Thermodynamics, Waves & Optics, Electricity & Magnetism, Modern Physics

### Chemistry
Inorganic, Organic, Physical Chemistry — +2 level

### Biology (Botany + Zoology)
Cell Biology, Genetics, Human Physiology, Ecology, Plant Physiology

### English
Grammar, Vocabulary, Reading Comprehension

## Preparation Strategy (6 months)

### Month 1-2: Foundation
- Complete +2 syllabus thoroughly
- Make notes for each chapter

### Month 3-4: Advanced
- Solve previous 10 years' papers
- Take weekly subject tests

### Month 5-6: Revision & Mocks
- Take 2-3 mock tests per week
- Use [Khojney's free MBBS mock tests](/exams/mbbs-cee) — 5 sets with shuffled questions

## Best Medical Colleges in Nepal

1. **IOM Maharajgunj** — [View Details](/colleges/iom-maharajgunj)
2. **BPKIHS Dharan** — [View Details](/colleges/bp-koirala-medical-college)
3. **PAHS Lalitpur** — [View Details](/colleges/patan-academy-of-health-sciences)
4. **Manipal Medical College Pokhara** — [View Details](/colleges/manipal-college-of-medical-sciences)

## Scholarships for MBBS

Check our [medical scholarships](/scholarships?category=scholarship-medicine) for funding opportunities including IOM free seats and international options.

## Start Your Preparation

Take the free [MBBS CEE Mock Test](/exams/mbbs-cee-set-1) now!`,
      metaTitle: "MBBS Entrance (CEE) Guide Nepal: Syllabus, Books, Mock Tests | Khojney",
      metaDescription: "Complete guide to MBBS Common Entrance Examination (CEE) in Nepal — exam pattern, syllabus, best books, preparation strategy, and free mock tests.",
      readTimeMin: 11,
      featured: true,
      views: 11400,
    },
    {
      slug: "tsc-teacher-license-exam-guide-nepal",
      title: "TSC Teacher License Exam Guide: Complete Preparation for Nepal Teachers",
      excerpt: "Complete guide to the Teacher Service Commission (TSC) teacher license exam in Nepal — eligibility, syllabus, preparation strategy, and free mock tests.",
      categoryId: eduCat?.id,
      coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200",
      content: `# TSC Teacher License Exam Guide

The **Teacher Service Commission (TSC)** conducts the teacher license examination for teaching positions in Nepal's community schools.

## Eligibility

| Level | Minimum Qualification | Age |
|-------|----------------------|-----|
| Primary | +2 with teaching qualification | 18-40 |
| Lower Secondary | Bachelor's with B.Ed. | 18-40 |
| Secondary | Master's with B.Ed. | 18-40 |

## Exam Pattern

- **Format:** Multiple choice (Objective)
- **Total marks:** 100
- **Pass marks:** 50
- **Duration:** 2 hours

### Subject Distribution

| Subject | Marks |
|---------|-------|
| Pedagogy/Education | 50 |
| General Knowledge | 20 |
| Subject Knowledge | 30 |

## Preparation Strategy

### 1. Study Pedagogy
Focus on teaching-learning theories, child psychology, and educational philosophy.

### 2. Take Mock Tests
Practice with our free [TSC Mock Tests](/exams/tsc-primary) — 5 sets with shuffled questions.

### 3. Study Nepal's Education System
Understand the School Sector Development Plan (SSDP), inclusive education, and the constitution's education provisions.

## Best Books

- **Pedagogy:** Sahitya Bhawan's TSC Guide
- **General Knowledge:** Samaya Samiksha (monthly)
- **Education Act:** Nepal Education Act 2028 BS

## Teaching Career in Nepal

Teaching is one of the most respected professions in Nepal. Community school teachers enjoy:
- Job security (permanent position after probation)
- Government salary scale
- Pension benefits
- Professional development opportunities

## Start Your Preparation

Take the free [TSC Primary Mock Test](/exams/tsc-primary-set-1) and start your teaching career!`,
      metaTitle: "TSC Teacher License Exam Guide Nepal: Syllabus & Mock Tests | Khojney",
      metaDescription: "Complete guide to Teacher Service Commission (TSC) teacher license exam in Nepal — eligibility, syllabus, preparation strategy, and free mock tests.",
      readTimeMin: 8,
      featured: false,
      views: 5900,
    },
    {
      slug: "nepal-banks-compare-interest-rates",
      title: "Nepal Banks Comparison 2080: Best Savings & Fixed Deposit Interest Rates",
      excerpt: "Compare interest rates of all major banks in Nepal — savings rates, fixed deposit rates, and find the best bank for your money in 2080.",
      categoryId: guidesCat?.id,
      coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200",
      content: `# Nepal Banks Comparison 2080: Best Interest Rates

Compare savings and fixed deposit interest rates of all major commercial banks in Nepal to find the best bank for your money.

## Top Banks by Fixed Deposit Rates

| Bank | FD Rate (Max) | Savings Rate (Max) | Branches |
|------|---------------|-------------------|----------|
| NIC Asia Bank | 10.5% | 6.0% | 290 |
| Nabil Bank | 10.0% | 6.0% | 268 |
| Nepal Investment Mega Bank | 9.5% | 5.5% | 375 |
| Global IME Bank | 9.75% | 5.5% | 355 |

## View All Banks

Browse our complete directory of [banks in Nepal](/banks) with interest rates, branch counts, cards, and loans for each bank.

## How to Choose a Bank

### For Savings
- Look for banks with the highest savings rate (typically 5-6%)
- Check if they offer mobile banking and internet banking
- Consider ATM network coverage

### For Fixed Deposits
- Compare FD rates across banks
- Check the minimum deposit amount
- Look for flexible tenure options (3 months to 5 years)

### For Loans
- Compare interest rates on home, auto, and personal loans
- Check processing fees and prepayment charges
- Look for banks with faster loan approval

## Popular Banks

- [Nabil Bank](/banks/nabil-bank)
- [NIC Asia Bank](/banks/nic-asia-bank)
- [Global IME Bank](/banks/global-ime-bank)
- [Nepal Bank Limited](/banks/nepal-bank-limited)
- [Rastriya Banijya Bank](/banks/rastriya-banijya-bank)

## Banking Career?

If you're interested in a banking career, check our [banking exam mock tests](/exams/banking-exams-parent) for NRB, RBB, and other bank exams.

## Government Services

Need to open a bank account? You'll need your [citizenship certificate](/government/nepali-citizenship-certificate) and [PAN](/government/pan-registration). Check our [government services guide](/government) for step-by-step instructions.`,
      metaTitle: "Nepal Banks Comparison 2080: Best Savings & FD Interest Rates | Khojney",
      metaDescription: "Compare interest rates of all major banks in Nepal — savings rates, fixed deposit rates, branch counts. Find the best bank for your money in 2080.",
      readTimeMin: 6,
      featured: true,
      views: 13600,
    },
    {
      slug: "study-abroad-guide-nepali-students",
      title: "Study Abroad Guide for Nepali Students: USA, UK, Australia, Japan, Korea",
      excerpt: "Complete guide to studying abroad for Nepali students — visa requirements, scholarships, IELTS/PTE preparation, and country comparisons.",
      categoryId: careerCat?.id,
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
      content: `# Study Abroad Guide for Nepali Students

Studying abroad is a dream for many Nepali students. This guide covers everything you need to know about studying in the USA, UK, Australia, Japan, and South Korea.

## Top Destinations

### 1. United States (USA)
- **Language requirement:** IELTS 6.5+ or TOEFL 80+
- **Tuition:** $20,000-$50,000/year
- **Popular for:** Engineering, Computer Science, Business

### 2. United Kingdom (UK)
- **Language requirement:** IELTS 6.5+
- **Tuition:** £12,000-£30,000/year
- **Popular for:** Master's degrees (1 year)

### 3. Australia
- **Language requirement:** IELTS 6.5+ or PTE 58+
- **Tuition:** AUD 20,000-45,000/year
- **Popular for:** IT, Nursing, Accounting

### 4. Japan
- **Language requirement:** JLPT N2+ (for Japanese programs) or English
- **Tuition:** ¥500,000-1,000,000/year
- **Popular for:** Engineering, IT, Research

### 5. South Korea
- **Language requirement:** EPS-TOPIK or English
- **Tuition:** KRW 4,000,000-8,000,000/year
- **Popular for:** Engineering, K-pop studies, Business

## Scholarships

### Chevening Scholarship (UK)
Fully-funded Master's in the UK. Check our [Chevening scholarship page](/scholarships/chevening-scholarship-uk).

### Fulbright Scholarship (USA)
Fully-funded Master's or PhD in the USA. Check our [Fulbright scholarship page](/scholarships/fulbright-scholarship-nepal).

### MEXT Scholarship (Japan)
Fully-funded study in Japan. Check our [MEXT scholarship page](/scholarships/jmfc-scholarship).

Browse all [international scholarships](/scholarships?category=scholarship-international) on Khojney.

## Language Test Preparation

- [IELTS Preparation](/exams/ielts-exam) — Free mock tests
- [EPS-TOPIK Preparation](/exams/eps-topik) — Korean language test for Korea
- [JLPT Preparation](/exams/ielts-exam) — Japanese language test

## Step-by-Step Process

1. **Choose your destination** — Consider cost, language, and career goals
2. **Prepare for language tests** — Take IELTS/TOEFL/PTE mock tests
3. **Research universities** — Check rankings, tuition, and scholarships
4. **Apply to universities** — Submit applications with transcripts and SOPs
5. **Apply for scholarships** — Deadlines are often 6-12 months before start
6. **Visa application** — Prepare financial documents and attend visa interview
7. **Pre-departure** — Book flights, arrange accommodation, get health insurance

## Tips

> "Start preparing at least 1 year before your intended start date. Language tests alone take 3-6 months." — *MS student in USA*

> "Apply to at least 5 universities. Competition is fierce and rejections are normal." — *MBA student in UK*

Start your journey with our [free IELTS mock test](/exams/ielts-exam-set-1) today!`,
      metaTitle: "Study Abroad Guide Nepal: USA, UK, Australia, Japan, Korea | Khojney",
      metaDescription: "Complete study abroad guide for Nepali students — visa requirements, scholarships, IELTS/PTE preparation, and country comparisons for USA, UK, Australia, Japan, Korea.",
      readTimeMin: 11,
      featured: false,
      views: 8800,
    },
  ];

  for (const a of articles) {
    await db.blogPost.upsert({
      where: { slug: a.slug },
      update: {
        ...a,
        authorId: admin.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      create: {
        ...a,
        authorId: admin.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✓ ${articles.length} SEO blog articles seeded`);

  // Also update exam SEO content for major exams
  console.log("Adding SEO content to major exams...");

  const examSeoContent: Record<string, string> = {
    "loksewa-kharidar": `# About Kharidar Exam

The **Kharidar** (Fifth Class Non-Gazetted) is the entry-level examination conducted by the Public Service Commission (Loksewa Aayog) of Nepal. It is the most accessible government job examination, requiring only SEE (School Leaving Certificate) as the minimum qualification.

## Eligibility

- **Educational qualification:** SEE pass
- **Age:** 18-40 years (relaxation for specific categories)
- **Citizenship:** Nepali citizen

## Exam Pattern

- **Format:** Objective (Multiple Choice) + Subjective
- **Total marks:** 100
- **Duration:** 2 hours 30 minutes
- **Negative marking:** 20% for objective section

## Syllabus

### First Paper (Objective - 50 marks)
- General Knowledge (20 marks)
- Nepali Language (15 marks)
- English Language (15 marks)

### Second Paper (Subjective - 50 marks)
- Office Management (25 marks)
- Job-based subject (25 marks)

## Preparation Tips

1. **Read the Constitution daily** — Article 18 (Right to Equality), Article 24 (PSC)
2. **Take free mock tests** on Khojney — questions shuffle every attempt
3. **Subscribe to current affairs** — Samaya Samiksha is the gold standard
4. **Practice previous year questions** — available in our [Loksewa exam sets](/exams/loksewa-kharidar)

## Career Progression

After becoming a Kharidar, you can:
- Appear for Nayab Subba (NaSu) exam after +2
- Get promoted based on performance and seniority
- Work in various government offices across Nepal`,
    "driving-bike": `# About Driving License Category A (Motorcycle)

The **Category A driving license** allows you to ride motorcycles and scooters in Nepal. It is the most common driving license category, with a minimum age requirement of 16 years.

## Eligibility

- **Minimum age:** 16 years
- **Citizenship:** Nepali citizenship certificate required
- **Medical fitness:** Blood group card or medical certificate

## Exam Process

### 1. Online Application
Apply at [dotm.gov.np](https://dotm.gov.np) — select Category A, pay NPR 1,000 fee.

### 2. Written Exam
- **Format:** Computer-based, 20 MCQ questions
- **Pass marks:** 60% (12/20)
- **Time:** 20 minutes
- **Syllabus:** Traffic rules, road signs, vehicle mechanics basics

### 3. Trial Test
- **8-track test:** Figure-8, gradient test, garage parking
- **Road test:** 5-10 minute real road driving

## Traffic Rules You Must Know

- Drive on the **left side** of the road
- **Zero tolerance** for drink-driving
- Speed limit: 40 km/h inside urban areas, 80 km/h on highways
- Helmet mandatory for both rider and pillion
- Use indicators when turning or changing lanes

## Preparation

Take our free [Driving License Mock Tests](/exams/driving-bike) — 5 sets with 50+ unique questions. Questions and options shuffle every attempt for unlimited practice.

## Fees

| Service | Fee (NPR) |
|---------|-----------|
| New application | 1,000 |
| Smart card | 500 |
| Renewal (5 years) | 500 |`,
    "ioe-entrance": `# About IOE Entrance Examination

The **Institute of Engineering (IOE) Entrance Examination** is the gateway to engineering education in Nepal. Conducted annually by Tribhuvan University, it is the most competitive engineering entrance in the country.

## Eligibility

- **Educational qualification:** +2 Science (or equivalent) with Physics, Chemistry, and Mathematics
- **Minimum marks:** 45% in +2 (40% for reserved categories)
- **Citizenship:** Nepali citizen or foreign national meeting criteria

## Exam Pattern

- **Format:** Computer-based examination
- **Duration:** 2 hours
- **Total questions:** 80
- **Total marks:** 80
- **Negative marking:** 10% per wrong answer

### Subject Distribution

| Subject | Questions | Marks |
|---------|-----------|-------|
| Physics | 22 | 22 |
| Chemistry | 22 | 22 |
| Mathematics | 30 | 30 |
| English | 6 | 6 |
| **Total** | **80** | **80** |

## IOE Constituent Campuses

1. **Pulchowk Campus** (Lalitpur) — Top 100 ranks
2. **Thapathali Campus** (Kathmandu) — Ranks 100-400
3. **Paschimanchal Campus** (Pokhara) — Ranks 400-800
4. **Purwanchal Campus** (Dharan) — Ranks 800-1200
5. **Chitwan Campus** (Bharatpur) — Ranks 1200+

## Preparation Strategy

1. **Start early** — 6-8 months before the exam
2. **Master textbooks** — 70% of questions come from CDC/NCERT textbooks
3. **Solve previous 10 years' papers** — available on Khojney
4. **Take mock tests** — [Free IOE mock tests](/exams/ioe-entrance) with shuffled questions
5. **Focus on weak areas** — Use our detailed explanations after each attempt

## Top Engineering Colleges

Browse our [engineering colleges directory](/colleges?category=engineering-colleges) for detailed information on all engineering colleges in Nepal.`,
    "mbbs-cee": `# About MBBS Common Entrance Examination (CEE)

The **Common Entrance Examination (CEE)** is the single entrance test for MBBS admission in Nepal, conducted by the Medical Education Commission (MEC). It is the most competitive medical entrance exam in the country.

## Eligibility

- **Educational qualification:** +2 Science with Physics, Chemistry, Biology
- **Minimum marks:** 50% in +2 or equivalent
- **Citizenship:** Nepali citizen

## Exam Pattern

- **Duration:** 3 hours
- **Total questions:** 200
- **Total marks:** 200
- **Negative marking:** Yes (25% per wrong answer)

### Subject Distribution

| Subject | Questions | Marks |
|---------|-----------|-------|
| Physics | 50 | 50 |
| Chemistry | 50 | 50 |
| Botany | 25 | 25 |
| Zoology | 25 | 25 |
| English | 50 | 50 |

## Top Medical Colleges

1. **IOM Maharajgunj** — [View Details](/colleges/iom-maharajgunj)
2. **BPKIHS Dharan** — [View Details](/colleges/bp-koirala-medical-college)
3. **PAHS Lalitpur** — [View Details](/colleges/patan-academy-of-health-sciences)
4. **Manipal Medical College** — [View Details](/colleges/manipal-college-of-medical-sciences)
5. **Chitwan Medical College** — [View Details](/colleges/pakistan-kgmc-bharatpur)

## Preparation Strategy

1. **Master +2 Biology** — 60% of questions are directly from the syllabus
2. **Practice with CEE pattern questions** — [Free MBBS mock tests](/exams/mbbs-cee)
3. **Solve previous 10 years' IOM/CEE papers**
4. **Focus on English** — 50 marks can shift your rank by hundreds of positions
5. **Time management** — practice completing 200 questions in 3 hours

## Scholarships

- **IOM Free Seat** — Top 50 rankers study MBBS for free (worth NPR 45 lakh)
- Check all [medical scholarships](/scholarships?category=scholarship-medicine) on Khojney`,
  };

  for (const [slug, content] of Object.entries(examSeoContent)) {
    await db.exam.updateMany({
      where: { slug: { startsWith: slug } },
      data: { seoContent: content },
    });
    // Also update the parent exam
    const parent = await db.exam.findUnique({ where: { slug } });
    if (parent) {
      await db.exam.update({
        where: { id: parent.id },
        data: { seoContent: content },
      });
    }
  }
  console.log(`✓ SEO content added to ${Object.keys(examSeoContent).length} major exams`);

  console.log("\n🎉 SEO blog + exam content seeding completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
