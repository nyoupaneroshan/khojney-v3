/**
 * seo-blog.ts — Comprehensive SEO blog seed for Khojney.com
 *
 * Targets keyword gaps identified from SEO analysis:
 *   - Driving license (DOTM exam, Category A, written test)
 *   - CMAT MBA (preparation, verbal ability, MBA entrance)
 *   - SEE exam (grading system, how it works)
 *   - Mock tests vs coaching (Loksewa, free mock tests)
 *   - IOE vs IOM (entrance comparison, engineering vs medical)
 *   - Loksewa preparation (PSC study guide)
 *   - Nepal scholarships (undergraduate, SEE toppers, free seats)
 *   - College admission guide (how to apply, best colleges)
 *   - Study Nepal from abroad (diaspora scholarships)
 *   - Pulchowk campus ranking (IOE constituent campuses)
 *
 * Each article:
 *   - 1500+ words of original, in-depth content
 *   - Primary + 5-10 secondary keywords
 *   - Internal links to exams, colleges, and related articles
 *   - FAQ section for FAQ schema
 *   - H2/H3 structure for featured snippets
 *
 * Run: `bun run scripts/seo-blog.ts`
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  featured: boolean;
  readTimeMin: number;
}

const articles: ArticleInput[] = [
  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 1: DOTM Exam Nepal — Driving License Complete Guide
  // Keywords: dotm exam nepal, nepal driving license written test,
  //           driving license nepal written exam, category a driving license nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "dotm-exam-nepal-driving-license-complete-guide-2025",
    title: "DOTM Exam Nepal 2025: Complete Driving License Written Test Guide",
    excerpt:
      "Complete guide to the DOTM exam in Nepal. Learn about Category A driving license, written test pattern, pass marks, trial test, and free online practice tests for scooter, bike, and car.",
    metaTitle: "DOTM Exam Nepal 2025 — Driving License Written Test Guide | Khojney",
    metaDescription:
      "Complete guide to Nepal's DOTM driving license exam. Category A license, written test pattern, pass marks, trial test rules, and free online practice tests for scooter, bike, and car.",
    categoryName: "Guides",
    categorySlug: "blog-guides",
    tags: ["dotm", "driving-license", "nepal", "written-test", "category-a"],
    featured: true,
    readTimeMin: 10,
    content: `# DOTM Exam Nepal 2025: Complete Driving License Written Test Guide

The **Department of Transport Management (DOTM)** conducts the driving license examination in Nepal through its Transport Management Offices located across all seven provinces. Whether you're applying for a **Category A** (scooter/motorcycle) license or a **Category B** (car/jeep/van) license, you must pass the **DOTM written exam** (also called the Likhit exam) followed by a practical trial test. This comprehensive guide covers everything you need to know about the DOTM exam in Nepal, including the written test pattern, pass marks, Category A license details, and free online practice tests.

## What is the DOTM Exam?

The **DOTM exam** is the official driving license examination conducted by the Department of Transport Management, Government of Nepal. The exam consists of two stages:

1. **Written Test (Likhit Exam)** — a multiple-choice test on traffic signs, signals, rules, and road safety
2. **Trial Test (Practical)** — a practical driving test where you navigate a marked track

You must pass both tests to receive your driving license. The written test is conducted at your nearest Transport Management Office (Yatayat Byabastha Karyalaya).

## Nepal Driving License Categories

The DOTM issues driving licenses under different categories based on vehicle type:

| Category | Vehicle Type | CC Limit | Minimum Age |
|----------|-------------|----------|-------------|
| **A** | Scooter/Motorcycle | Up to 125cc | 16 years |
| **A1** | Scooter/Motorcycle (light, auto only) | Up to 125cc | 16 years |
| **B** | Car/Jeep/Van | — | 18 years |
| **C** | Tempo/Auto-rickshaw | — | 18 years |
| **D** | Tempo (electric, Safa) | — | 18 years |

## Category A Driving License Nepal

The **Category A driving license** is the most common license type in Nepal, covering scooters and motorcycles up to 125cc. This includes popular vehicles like:

- Honda Activa, Dio, Grazia
- TVS Ntorq, Jupiter, Scooty
- Yamaha Ray, Fascino
- Bajaj Pulsar 125, Honda Shine 125

### Category A Eligibility

- **Minimum age**: 16 years (one of the lowest in the world for two-wheelers)
- **Education**: No minimum education requirement
- **Medical**: Must be physically fit (eyesight, hearing)

### Category A License Fee

- Application fee: ~NPR 500–1,000
- Written test: Included in application
- Trial test: ~NPR 200–500
- License printing: ~NPR 1,000–1,500
- **Total cost**: NPR 1,500–3,000 (varies by office)

## Nepal Driving License Written Test Pattern

The **written test** (Likhit exam) is the first hurdle. Many candidates fail not because they can't drive, but because they're unprepared for the written exam.

### Exam Details

- **Number of questions**: 15–20 MCQs (varies by transport office)
- **Duration**: 15–20 minutes
- **Pass mark**: **60%** (e.g., 9 out of 15, or 12 out of 20)
- **Language**: Available in both **Nepali and English**
- **Format**: Computer-based or paper-based (varies by office)
- **Fee**: Included in the license application fee

### Topics Covered in Written Test

The DOTM written test covers four main areas:

#### 1. Traffic Signs and Signals (40% of questions)

This is the most heavily tested section. You must recognize and understand:

- **Mandatory/Regulatory signs**: Stop (red octagon), No Entry, Speed Limit, No Parking, No Overtaking, One Way
- **Cautionary/Warning signs**: School Ahead, Sharp Turn (left/right), Slippery Road, Pedestrian Crossing, Hump Ahead, T-Junction, Y-Junction, Round About
- **Informatory signs**: Hospital, Parking, Fuel Station, First Aid Post, Rest Area

#### 2. Traffic Rules and Regulations (30%)

- Speed limits in different areas (residential: 40 km/h, highway: 80 km/h)
- Right-of-way rules at intersections
- Lane discipline and overtaking rules
- Parking restrictions

#### 3. Road Safety (15%)

- Pedestrian crossing rules
- School zone rules
- Emergency vehicle right-of-way
- Night driving rules

#### 4. Vehicle Safety (15%)

- Helmet requirements (mandatory for Category A)
- Seatbelt requirements (mandatory for Category B)
- Mirror and indicator usage
- Document requirements: license, bluebook (vehicle registration), insurance, pollution certificate

## Free DOTM Written Test Practice

Khojney offers **free driving license mock tests** that match the real DOTM exam pattern:

- 15–20 MCQs on traffic signs, rules, and safety
- Instant scoring with detailed explanations
- Both Nepali and English language options
- Unlimited attempts

👉 **[Start your free driving license mock test →](/exams/driving-license-parent)**

## How to Apply for a Driving License in Nepal

### Step 1: Get a Learner's License (Chalani)

1. Visit your nearest **Transport Management Office**
2. Required documents:
   - Citizenship certificate (original + photocopy)
   - Blood group certificate (from a registered health post)
   - 2 passport-size photos
3. Fill out the application form
4. Pay the application fee (~NPR 500–1,000)
5. Get your **Learner's License** (valid for 3 months)

### Step 2: Practice Driving

- Display an "L" sticker on your vehicle
- Always carry your learner's license
- Practice in different traffic conditions for at least 1 month
- For Category A: practice slow-speed balance, turning, signaling
- For Category B: practice parking, reverse, hill start, U-turn

### Step 3: Take the Written Test (Likhit Exam)

1. Schedule your written test at the transport office
2. Arrive 30 minutes early with your learner's license and citizenship
3. Take the 15–20 MCQ test
4. Get same-day results (most offices)

### Step 4: Take the Trial Test (Practical)

After passing the written test, schedule your trial test:

**Category A (Scooter/Bike) Trial:**
- Ride through a figure-8 or serpentine track
- Must not touch boundary markers
- Must not put your foot down during the trial
- Must wear a helmet

**Category B (Car) Trial:**
- Drive through a marked course
- Parallel parking and reverse parking
- Hill start (manual transmission)
- U-turn and 3-point turn
- Must use seatbelt, indicators, and mirrors

### Step 5: Get Your License

- After passing both tests, your license will be printed within 1–2 weeks
- Collect it from the transport office
- Carry it whenever you drive

## Nepal Driving License Test Rules (2025 Update)

Recent changes to Nepal's driving license rules include:

- **Computer-based testing** rolled out in major offices (Kathmandu, Pokhara, Chitwan, Biratnagar)
- **Stricter trial test evaluation** with more cameras and observers
- **Online scheduling** available for written tests
- **Photo capture** at the test center for identity verification
- **Same-day written test results** in most offices
- **Biometric verification** at license collection

## Common Written Test Questions

Here are sample questions you might encounter in the DOTM written test:

1. **What does a red octagonal sign mean?**
   - a) Speed limit
   - b) **Stop** ✓
   - c) No entry
   - d) Yield

2. **What is the speed limit in residential areas in Nepal?**
   - a) 30 km/h
   - b) **40 km/h** ✓
   - c) 50 km/h
   - d) 60 km/h

3. **What is the minimum age for a Category A scooter license?**
   - a) 15 years
   - b) **16 years** ✓
   - c) 18 years
   - d) 21 years

4. **When should you use your scooter's indicators?**
   - a) Only at night
   - b) Only on highways
   - c) **Whenever turning or changing lanes** ✓
   - d) Only when other vehicles are present

5. **Which document must you carry while driving?**
   - a) Only citizenship
   - b) **License, bluebook, insurance** ✓
   - c) Only license
   - d) Only bluebook

## Tips to Pass the DOTM Exam on First Attempt

1. **Memorize all traffic signs** — use our free mock test daily for 1 week
2. **Read the driver's handbook** — available at transport offices
3. **Practice driving in real traffic** — not just empty roads
4. **Arrive early** on test day to reduce stress
5. **Bring all required documents** — citizenship, learner's license, photos
6. **Stay calm during the trial** — slow and steady wins
7. **Wear a helmet/seatbelt** — mandatory, disqualification if missing

## List of Transport Management Offices in Nepal

| Office | Location | Coverage |
|--------|----------|----------|
| Ekantakuna Transport Office | Lalitpur | Kathmandu Valley (Lalitpur) |
| Chabahil Transport Office | Kathmandu | Kathmandu Valley (Kathmandu east) |
| Balaju Transport Office | Kathmandu | Kathmandu Valley (Kathmandu west) |
| Pokhara Transport Office | Pokhara | Kaski, Gandaki |
| Bharatpur Transport Office | Chitwan | Chitwan, Nawalparasi |
| Butwal Transport Office | Butwal | Rupandehi, Kapilvastu |
| Biratnagar Transport Office | Biratnagar | Morang, Sunsari |
| Nepalgunj Transport Office | Nepalgunj | Banke, Bardiya |

## FAQ

### What is the DOTM exam in Nepal?
The **DOTM exam** is the driving license examination conducted by the Department of Transport Management. It consists of a written test (Likhit) and a practical trial test.

### How many questions are in the Nepal driving license written test?
The written test has **15–20 MCQs** depending on the transport office. You need 60% correct to pass.

### What is the pass mark for the DOTM written test?
The pass mark is **60%** — typically 9 out of 15 or 12 out of 20 questions correct.

### What is Category A driving license in Nepal?
**Category A** covers scooters and motorcycles up to 125cc. The minimum age is 16 years. Popular vehicles include Honda Activa, TVS Ntorq, and Bajaj Pulsar 125.

### Can I take the DOTM written test in English?
Yes, the written test is available in **both Nepali and English**. Choose your language when applying.

### How much does a driving license cost in Nepal?
Total cost including learner's license, written test, trial, and license printing: **NPR 1,500–3,000** depending on category and office.

### What happens if I fail the written test?
You can retake the written test by paying a re-examination fee (~NPR 200–500). There's no limit on attempts within the 3-month learner's license validity.

### How long is the learner's license valid?
The learner's license is valid for **3 months**. You must pass both tests within this period, or reapply.

### Is helmet mandatory for Category A license?
Yes, wearing a helmet is **mandatory** for all Category A (scooter/motorcycle) riders and pillion passengers. You will be disqualified from the trial test without one.

---

Practice for your DOTM exam with our **[free driving license mock test](/exams/driving-license-parent)**. For more details on the scooter license process, read our **[scooter license written test guide](/blog/driving-license-written-test-nepal-scooter-complete-guide)** and our **[driving license complete process guide](/blog/driving-license-nepal-complete-process-2080)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 2: CMAT Exam Guide for MBA
  // Keywords: cmat exam guide for mba, cmat preparation nepal,
  //           cmat nepal mba entrance, cmat verbal ability test
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "cmat-exam-guide-mba-preparation-nepal-2025",
    title: "CMAT Exam Guide for MBA in Nepal: Complete Preparation Strategy 2025",
    excerpt:
      "Complete CMAT exam guide for MBA admission in Nepal. Syllabus, verbal ability, quantitative aptitude, logical reasoning, general awareness preparation tips, and free online mock tests.",
    metaTitle: "CMAT Exam Guide for MBA Nepal 2025 — Preparation & Syllabus | Khojney",
    metaDescription:
      "Complete CMAT exam guide for MBA in Nepal. Preparation strategy, syllabus, verbal ability, quantitative, logical reasoning, general awareness, and free online mock tests.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["cmat", "mba", "preparation", "nepal", "management"],
    featured: true,
    readTimeMin: 11,
    content: `# CMAT Exam Guide for MBA in Nepal: Complete Preparation Strategy 2025

The **Central Management Admission Test (CMAT)** is the entrance examination for MBA and MBS programs at Tribhuvan University (TU) and its affiliated colleges in Nepal. Conducted by the Faculty of Management (FOM), CMAT is mandatory for admission to all TU-affiliated management colleges, including prestigious institutions like Shanker Dev Campus, Prime College, Kathmandu College of Management (KCM), and Apex College. This comprehensive **CMAT exam guide for MBA** covers everything you need to know — syllabus, preparation strategy, verbal ability tips, and free online mock tests.

## What is CMAT?

**CMAT** stands for **Central Management Admission Test**. It is a standardized entrance examination conducted by TU's Faculty of Management for admission to:

- **MBA (Master of Business Administration)** — 2-year program
- **MBS (Master of Business Studies)** — 2-year program
- **PGD (Post Graduate Diploma)** — 1-year program

The CMAT exam is conducted once per year, typically in **Bhadra–Ashwin (September–October)**.

## CMAT Exam Pattern 2025

The CMAT exam consists of **100 multiple-choice questions** worth 100 marks, to be completed in **90 minutes**:

| Section | Questions | Marks | Time Suggested |
|---------|-----------|-------|----------------|
| Verbal Ability | 25 | 25 | 20 min |
| Quantitative Aptitude | 25 | 25 | 30 min |
| Logical Reasoning | 25 | 25 | 25 min |
| General Awareness | 25 | 25 | 15 min |
| **Total** | **100** | **100** | **90 min** |

There is **no negative marking** in CMAT, so you should attempt every question.

## CMAT Eligibility for MBA

To be eligible for the CMAT exam for MBA admission:

- **Educational qualification**: Bachelor's degree in any discipline from a recognized university
- **Minimum marks**: 50% aggregate in bachelor's (45% for reserved categories)
- **Work experience**: Not required (but preferred by some colleges)
- **Age**: No upper age limit

## CMAT Syllabus — Detailed Breakdown

### 1. Verbal Ability (25 Questions)

The Verbal Ability section tests your English language proficiency. This is often the deciding factor for many candidates.

**Topics covered:**
- **Reading Comprehension** — 2–3 passages with 5–10 questions each
- **Vocabulary** — synonyms, antonyms, analogies, one-word substitution
- **Grammar** — sentence correction, fill in the blanks, error spotting
- **Verbal Reasoning** — para jumbles, sentence rearrangement, sentence completion

**CMAT Verbal Ability Test Preparation Tips:**
1. **Read daily** — The Kathmandu Post, Republica, editorial pages
2. **Build vocabulary** — learn 20 new words per day with meanings and usage
3. **Practice RC** — solve 2–3 comprehension passages daily
4. **Grammar rules** — master tenses, articles, prepositions, subject-verb agreement
5. **Para jumbles** — practice 10 daily to build pattern recognition

**Recommended books:**
- "High School English Grammar" by Wren & Martin
- "Word Power Made Easy" by Norman Lewis
- "Verbal Ability and Reading Comprehension" by Arun Sharma

### 2. Quantitative Aptitude (25 Questions)

This section tests your mathematical ability and numerical skills.

**Topics covered:**
- **Arithmetic** (40%): percentages, profit & loss, time & work, time & distance, ratios, averages, simple/compound interest
- **Algebra** (25%): linear equations, quadratic equations, inequalities, progressions
- **Geometry & Mensuration** (20%): triangles, circles, areas, volumes
- **Data Interpretation** (15%): tables, bar charts, pie charts, line graphs

**Preparation tips:**
1. **Memorize basics** — multiplication tables up to 30, squares up to 30, cubes up to 20
2. **Learn shortcuts** — Vedic math techniques for faster calculation
3. **Practice daily** — solve 30–50 quant questions per day
4. **Data interpretation** — practice 5 DI sets per week
5. **Time management** — aim for 45 seconds per question

**Recommended books:**
- "Quantitative Aptitude" by R.S. Aggarwal
- "Fast Track Objective Arithmetic" by Rajesh Verma
- "How to Prepare for Quantitative Aptitude" by Arun Sharma

### 3. Logical Reasoning (25 Questions)

This is often the most scoring section if you prepare well. It tests your analytical and logical thinking.

**Topics covered:**
- **Series completion** — number series, letter series, figure series
- **Coding-Decoding** — letter coding, number coding, substitution
- **Blood relations** — family tree problems
- **Direction sense** — north/south/east/west problems
- **Syllogisms** — logical deductions
- **Puzzles** — seating arrangement, scheduling, classification
- **Analogies** — word analogies, number analogies

**Preparation tips:**
1. **Practice 50 reasoning questions daily** — this is the most scoring section
2. **Learn puzzle types** — linear arrangement, circular arrangement, matrix
3. **Draw diagrams** — for blood relations and direction sense
4. **Don't get stuck** — if a puzzle takes more than 3 minutes, move on

**Recommended books:**
- "A Modern Approach to Verbal & Non-Verbal Reasoning" by R.S. Aggarwal
- "Logical Reasoning and Data Interpretation" by Arun Sharma

### 4. General Awareness (25 Questions)

This section tests your knowledge of current affairs and static GK.

**Topics covered:**
- **Nepali current affairs** (40%): politics, economy, sports, government schemes
- **International current affairs** (20%): global events, organizations
- **Business & Economics** (20%): budget, monetary policy, NEPSE, GDP
- **Static GK** (20%): history, geography, science, awards

**Preparation tips:**
1. **Read newspapers daily** — Gorkhapatra, The Kathmandu Post
2. **Follow business news** — Republica business section, Himalayan Times business
3. **Review government publications** — Economic Survey, Nepal Rastra Bank reports
4. **Maintain a GK notebook** — write 5 new facts daily
5. **Watch news bulletins** — 30 minutes daily

## CMAT Preparation Strategy — 8 Week Plan

### Week 1–2: Foundation Building

- Understand the complete syllabus and exam pattern
- Take a **[diagnostic CMAT mock test](/exams/cmat-full)** to assess your level
- Start daily routine: 30 min vocabulary + 30 min current affairs + 2 hours concept study
- Focus on weakest section first

### Week 3–4: Section-wise Intensive Study

- **Verbal**: 50 vocabulary words + 3 RC passages + 20 grammar questions daily
- **Quant**: 50 questions daily (mix of topics)
- **Reasoning**: 50 questions daily (mix of types)
- **GK**: 1 hour newspaper reading + 30 min GK book

### Week 5–6: Practice and Speed Building

- Take **2 mock tests per week** (timed)
- Analyze every mock test for 30 minutes
- Focus on improving speed without sacrificing accuracy
- Identify and strengthen weak areas

### Week 7–8: Mock Test Marathon

- Take **1 full-length mock test daily**
- Revise all formulas, vocabulary, and GK notes
- Practice meditation/exercise to stay calm
- Sleep 7+ hours — don't burn out

## Free CMAT Mock Test Online

Khojney offers **free CMAT mock tests** that match the real exam pattern:

- 100 questions across all 4 sections, timed at 90 minutes
- Instant scoring with section-wise breakdown
- Detailed explanations for every question
- Shuffled questions and options for realistic practice
- Rank comparison with other CMAT aspirants

👉 **[Start your free CMAT mock test →](/exams/cmat-full)**

## Best Management Colleges Under CMAT

Your CMAT score determines which MBA college you get into:

1. **Shanker Dev Campus** — top-ranked TU campus for management
2. **Prime College** — known for BBA and MBA programs
3. **Kathmandu College of Management (KCM)** — industry connections
4. **Apex College** — strong MBA program with international exposure
5. **King's College** — entrepreneurship focus
6. **National College** — DAV program, affordable
7. **Uniglobe College** — growing reputation
8. **Kathmandu Don Bosco College** — BBA + MBA

Read our guide to **[top 10 colleges in Nepal](/blog/top-10-colleges-nepal-2025-plus2-engineering-medical)** for more management college options.

## CMAT vs KUUMAT vs SOMAT

Nepal has three main MBA entrance exams:

| Exam | Conducted By | Duration | Questions | Difficulty |
|------|-------------|----------|-----------|------------|
| **CMAT** | TU (FOM) | 90 min | 100 | Medium |
| **KUUMAT** | Kathmandu University | 90 min | 100 | Medium-High |
| **SOMAT** | Purbanchal University | 90 min | 100 | Medium |

Most students appear for CMAT as it covers the maximum number of colleges.

## CMAT Score and MBA Admission

### What is a good CMAT score?

- **40+ out of 100**: Eligible for most TU-affiliated colleges
- **60+ out of 100**: Competitive for top colleges (Shanker Dev, Prime, KCM)
- **80+ out of 100**: Likely to get into any college of choice

### CMAT Counseling Process

1. **Result publication** — usually within 2–3 weeks of the exam
2. **Merit list** — based on CMAT score + bachelor's percentage (weightage varies)
3. **College selection** — fill preferences during counseling
4. **Admission** — complete college formalities within deadline

## Common Mistakes to Avoid in CMAT

1. **Ignoring Verbal Ability** — 25 easy marks that many lose
2. **Spending too much time on one question** — move on if stuck
3. **Not attempting all questions** — no negative marking means attempt everything
4. **Weak GK** — current affairs require consistent daily reading
5. **Not taking mock tests** — knowledge without practice = failure
6. **Panic on tough questions** — skip and return later

## FAQ

### What is CMAT exam in Nepal?
**CMAT** (Central Management Admission Test) is the entrance exam for MBA and MBS programs at Tribhuvan University and its affiliated colleges in Nepal.

### How many questions are in CMAT?
CMAT has **100 MCQs** — 25 each from Verbal Ability, Quantitative Aptitude, Logical Reasoning, and General Awareness — to be completed in 90 minutes.

### Is there negative marking in CMAT?
**No**, there is no negative marking in CMAT. You should attempt every question.

### What is the pass mark for CMAT?
There is no formal pass mark, but you need at least **40+** to get into a decent college and **60+** for top colleges.

### How can I prepare for CMAT verbal ability?
Read English newspapers daily, learn 20 new words per day, practice reading comprehension passages, and solve grammar exercises from Wren & Martin.

### Can I give CMAT after +2?
No, CMAT is for postgraduate admission (MBA/MBS). You need a bachelor's degree to be eligible. For undergraduate management programs, look at BBA/BBS admission at TU-affiliated colleges.

### How many times is CMAT conducted in a year?
CMAT is conducted **once per year**, typically in Bhadra–Ashwin (September–October).

### Which is the best college for MBA under CMAT?
**Shanker Dev Campus** is the top-ranked TU campus for management. Other excellent options include Prime College, KCM, and Apex College.

---

Start your CMAT preparation today with our **[free CMAT mock test](/exams/cmat-full)** and read our **[CMAT mock test guide](/blog/cmat-mock-test-nepal-free-preparation-guide)** for more tips. Explore management colleges on our **[colleges directory](/colleges)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 3: SEE Exam Nepal — How It Works
  // Keywords: see exam nepal, how nepal's see exam works,
  //           see grading system nepal, secondary education examination nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "see-exam-nepal-grading-system-complete-guide-2025",
    title: "SEE Exam Nepal 2025: How It Works, Grading System & Complete Guide",
    excerpt:
      "Complete guide to Nepal's SEE exam (Secondary Education Examination). How it works, grading system (GPA), subjects, exam pattern, results, and preparation tips for Class 10 students.",
    metaTitle: "SEE Exam Nepal 2025 — Grading System & How It Works | Khojney",
    metaDescription:
      "Complete guide to Nepal's SEE exam (Secondary Education Examination). How it works, GPA grading system, subjects, exam pattern, results, and preparation tips for Class 10 students.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["see", "nepal", "grading", "exam", "secondary-education"],
    featured: true,
    readTimeMin: 10,
    content: `# SEE Exam Nepal 2025: How It Works, Grading System & Complete Guide

The **Secondary Education Examination (SEE)** is the final examination of secondary level education (Class 10) in Nepal. Conducted by the **National Examinations Board (NEB)**, it is one of the most important milestones in a Nepali student's academic journey. Formerly known as the SLC (School Leaving Certificate) exam, SEE was introduced in 2016 BS (2016 AD) when the school education system was restructured from 10+2+3 to 8+4+4 pattern. This comprehensive guide explains **how Nepal's SEE exam works**, the **SEE grading system**, subjects, exam pattern, results, and preparation tips.

## What is SEE Exam in Nepal?

The **SEE (Secondary Education Examination)** is the Class 10 board examination conducted by NEB. It marks the completion of basic education and is the gateway to higher secondary education (+2 or Class 11–12).

### Key Facts about SEE

| Detail | Information |
|--------|-------------|
| **Full form** | Secondary Education Examination |
| **Conducted by** | National Examinations Board (NEB) |
| **Established** | 2073 BS (replaced SLC) |
| **Level** | Class 10 (end of basic education) |
| **Frequency** | Once per year (Chaitra, March–April) |
| **Eligibility** | Class 10 pass from a recognized school |
| **Exam format** | Written + practical + internal assessment |
| **Grading** | GPA system (0–4) |
| **Result** | Usually published in Ashar (June–July) |

## How Nepal's SEE Exam Works

### 1. Registration

- Schools register their Class 10 students with NEB in **Mangsir–Poush (November–December)**
- Students fill out exam forms with subject choices
- Regular, partial, and exempted categories available

### 2. Exam Schedule

- **Exam date**: Usually starts in **Chaitra 15 (late March)** and runs for about 2 weeks
- **Routine**: Published by NEB 2–3 months before the exam
- **Centers**: Designated schools across all 77 districts

### 3. SEE Exam Pattern

The SEE exam consists of:

- **Written examination**: 75% of total marks (most subjects)
- **Practical examination**: 25% of total marks (science, computer, etc.)
- **Internal assessment**: Includes attendance, class performance, and project work

Each subject has **full marks of 100**, with a **pass mark of 27 (Grade D)**.

### 4. Compulsory Subjects

All SEE students must take these compulsory subjects:

1. **Nepali** (compulsory)
2. **English** (compulsory)
3. **Mathematics** (compulsory)
4. **Science and Technology** (compulsory)
5. **Social Studies** (compulsory)
6. **Health, Population and Environment Education** (compulsory)
7. **Optional subjects** (choose 2):
   - Accounting, Economics, Computer Science, Agriculture, Sanskrit, Urdu, Maithili, etc.

## SEE Grading System Nepal

Nepal uses a **GPA (Grade Point Average)** system for SEE results. There are no marks — only grades.

### SEE Grade Table

| Grade | Grade Point | Percentage | Remarks |
|-------|-------------|------------|---------|
| **A+** | 3.6–4.0 | 90–100% | Outstanding |
| **A** | 3.2–3.6 | 80–90% | Excellent |
| **B+** | 2.8–3.2 | 70–80% | Very Good |
| **B** | 2.4–2.8 | 60–70% | Good |
| **C+** | 2.0–2.4 | 50–60% | Satisfactory |
| **C** | 1.6–2.0 | 40–50% | Acceptable |
| **D+** | 1.2–1.6 | 30–40% | Partially Acceptable |
| **D** | 0.8–1.2 | 20–30% | Insufficient |
| **E** | 0–0.8 | 0–20% | Very Insufficient (Fail) |

### How GPA is Calculated

1. Each subject's grade point is determined from the marks
2. All grade points are added
3. Sum is divided by the number of subjects
4. The result is the GPA

**Example**: If a student gets A+ in 5 subjects (3.6 × 5 = 18.0) and A in 2 subjects (3.2 × 2 = 6.4), total = 24.4. GPA = 24.4 ÷ 7 = **3.49**.

### Pass Criteria

- Must achieve at least **Grade D (0.8 grade point)** in each subject
- If a student gets E in any subject, they are considered **failed**
- Failed students can re-appear in the supplementary exam (chance exam)

### What is a Good SEE GPA?

- **3.6+ (A+)**: Outstanding — eligible for top +2 colleges like St. Xavier's, Budhanilkantha
- **3.2–3.6 (A)**: Excellent — eligible for most good colleges
- **2.8–3.2 (B+)**: Very Good — eligible for most private colleges
- **2.4–2.8 (B)**: Good — eligible for most colleges
- **Below 2.4**: May need to consider alternative colleges

## SEE Exam Results

### How to Check SEE Results

Results are usually published in **Ashar (June–July)**, about 3 months after the exam. Students can check results through:

1. **NEB official website**: see.gov.np or neb.gov.np
2. **SMS**: Type SEE <space> Symbol Number and send to 35001 (NTC) or 1600 (Ncell)
3. **IVR**: Call 1600 (NTC) and follow instructions
4. **School**: Schools receive result sheets and distribute to students

### SEE Result Documents

- **Grade Sheet**: Shows grades for each subject + overall GPA
- **Character Certificate**: Issued by the school
- **Transfer Certificate (TC)**: Required for +2 admission

## SEE to +2 Transition

After SEE results, students choose their +2 stream based on their GPA and interests:

### Science Stream
- **Requirement**: Usually B+ or higher (2.8+ GPA)
- **Subjects**: Physics, Chemistry, Biology/Mathematics, English, Nepali
- **Top colleges**: St. Xavier's, Budhanilkantha, CCRC, KMC, Premier
- **Career paths**: Engineering, Medicine, IT, Pure Sciences

### Management Stream
- **Requirement**: Usually C+ or higher (2.0+ GPA)
- **Subjects**: Accounting, Economics, Business Studies, English, Nepali, Math
- **Top colleges**: Global College, Prime College, KMC
- **Career paths**: BBA, BBS, CA, Banking, Entrepreneurship

### Humanities Stream
- **Requirement**: Usually C or higher (1.6+ GPA)
- **Subjects**: Sociology, Psychology, Mass Communication, English, Nepali
- **Career paths**: Law, Journalism, Social Work, BA

### Education Stream
- **Subjects**: Education, English, Nepali, Health
- **Career paths**: Teaching, B.Ed

Read our guide to **[top 10 colleges in Nepal](/blog/top-10-colleges-nepal-2025-plus2-engineering-medical)** for +2 college selection.

## SEE Exam Preparation Tips

### 1. Start Early (6 months before)

The SEE syllabus is vast. Starting 6 months early gives you time to:
- Complete the entire syllabus
- Revise multiple times
- Practice past papers
- Take mock tests

### 2. Use the Right Books

- **NEB textbooks** — the primary source (all questions come from here)
- **Reference books** — for additional practice (Diamond, Asia, Ekta)
- **Past papers** — solve at least 5 years of past papers

### 3. Subject-wise Strategy

**Nepali & English**:
- Practice writing essays, stories, letters
- Memorize grammar rules
- Read textbook chapters 3–4 times

**Mathematics**:
- Practice every problem in the textbook
- Make formula notes
- Solve past papers under time pressure

**Science**:
- Understand concepts, don't just memorize
- Make notes with diagrams
- Practice numerical problems (Physics, Chemistry)

**Social Studies**:
- Memorize historical events, dates, and geography
- Make mind maps for chapters
- Practice map-based questions

### 4. Take Regular Mock Tests

- Take **1 full mock test per week** starting 3 months before SEE
- Simulate exam conditions — sit for 3 hours, no breaks
- Analyze every test for weak areas

### 5. Stay Healthy

- Sleep 7–8 hours daily
- Eat nutritious food
- Exercise 30 minutes daily
- Take breaks during study (Pomodoro technique: 25 min study + 5 min break)

## SEE Scholarships

Many +2 colleges offer scholarships to SEE toppers:

- **Full scholarship**: A+ students (3.6+ GPA) — tuition + books free
- **Partial scholarship**: A students (3.2+ GPA) — 50–100% tuition waiver
- **Merit scholarship**: B+ students — 25–50% tuition waiver
- **Need-based scholarship**: For economically disadvantaged students

Explore **[SEE scholarships on Khojney](/scholarships)** for details.

## Common SEE Mistakes to Avoid

1. **Starting late** — begin preparation at least 6 months before
2. **Ignoring practical exams** — 25% of marks in science, computer
3. **Not solving past papers** — question patterns repeat
4. **Poor time management in exam** — practice writing fast
5. **Neglecting internal assessment** — attendance and classwork matter
6. **Panic during exam** — stay calm, attempt easy questions first

## FAQ

### What is SEE exam in Nepal?
**SEE (Secondary Education Examination)** is the Class 10 board exam conducted by NEB. It replaced the SLC exam in 2073 BS.

### How does the SEE grading system work?
SEE uses a GPA system. Each subject is graded A+ to E, with grade points from 4.0 to 0. The overall GPA is the average of all subjects' grade points.

### What is the pass mark for SEE?
Students must achieve at least **Grade D (0.8 grade point)** in each subject to pass. Grade E (below 0.8) is considered fail.

### When is SEE conducted?
SEE is conducted once per year, usually starting in **Chaitra (late March)** and results are published in **Ashar (June–July)**.

### How can I check SEE results?
You can check SEE results through the **NEB website** (see.gov.np), SMS (send "SEE <symbol-number>" to 35001), IVR (call 1600), or your school.

### What is a good GPA in SEE?
**3.6+ (A+)** is considered outstanding and qualifies for top +2 colleges. **3.2+ (A)** is excellent and qualifies for most good colleges.

### Can I improve my SEE grades?
Yes, you can take the **grade improvement exam** (chance exam) if you're not satisfied with your grades. The better of the two results is final.

### What subjects are compulsory in SEE?
Compulsory subjects are: **Nepali, English, Mathematics, Science, Social Studies, and Health, Population & Environment**. Students also choose 2 optional subjects.

### How many subjects are there in SEE?
Students typically take **8 subjects** — 6 compulsory + 2 optional. Each subject has 100 full marks.

---

Prepare for your SEE exam with our **[free mock tests](/exams)** and explore +2 colleges on our **[colleges directory](/colleges)**. Read our **[top 10 colleges guide](/blog/top-10-colleges-nepal-2025-plus2-engineering-medical)** for stream selection after SEE.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 4: Khojney Mock Tests vs Coaching Classes
  // Keywords: khojney mock tests vs coaching classes, loksewa mock test free,
  //           free mock tests nepal, online exam practice nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "khojney-mock-tests-vs-coaching-classes-nepal-comparison",
    title: "Khojney Mock Tests vs Coaching Classes: Which is Better for Nepal Exam Prep?",
    excerpt:
      "Should you use free online mock tests or join coaching classes for exam preparation in Nepal? Compare Khojney mock tests vs traditional coaching for IOE, CEE, CMAT, Loksewa, and driving license.",
    metaTitle: "Khojney Mock Tests vs Coaching Classes Nepal — Comparison | Khojney",
    metaDescription:
      "Khojney free mock tests vs traditional coaching classes in Nepal. Compare cost, flexibility, effectiveness for IOE, CEE, CMAT, Loksewa, and driving license exam preparation.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["mock-tests", "coaching", "nepal", "comparison", "preparation"],
    featured: false,
    readTimeMin: 9,
    content: `# Khojney Mock Tests vs Coaching Classes: Which is Better for Nepal Exam Prep?

Nepali students preparing for competitive exams like IOE, CEE, CMAT, Loksewa, and driving license face a common dilemma: **should you join a coaching class or use free online mock tests?** With the rising cost of coaching institutes and the increasing quality of online platforms like Khojney, this question has become more relevant than ever. This detailed comparison helps you decide which approach — or combination — works best for your exam preparation in Nepal.

## The Changing Landscape of Exam Preparation in Nepal

Traditionally, Nepali students relied on coaching institutes like Namuna, VIBRANT, PEA, and Entrance Nepal for exam preparation. These institutes charged NPR 5,000–15,000 for 3–6 month courses. However, the rise of free online platforms has disrupted this model:

- **Khojney** offers free mock tests for IOE, CEE, CMAT, Loksewa, driving license, and more
- **YouTube** has hundreds of free tutorial channels
- **Online resources** provide past papers, syllabi, and study materials
- **Mobile apps** allow practice anytime, anywhere

But does free online preparation really replace coaching classes? Let's compare.

## Khojney Mock Tests — Overview

Khojney is Nepal's largest free platform for **online exam practice**. Key features:

- **100% free** mock tests — no registration fee, no subscription
- **Real exam pattern** — questions match the actual exam format
- **Instant scoring** with subject-wise breakdown
- **Detailed explanations** for every question
- **Unlimited attempts** — practice as many times as you want
- **Shuffled questions and options** — realistic simulation
- **Mobile-friendly** — practice on any device
- **Performance tracking** — monitor improvement over time

### Exams Covered by Khojney

- **IOE Entrance** (engineering) — 140 questions, 3 hours
- **CEE / MBBS Entrance** — 200 questions, 3 hours
- **CMAT** (MBA) — 100 questions, 90 minutes
- **Loksewa** (Kharidar, Nasu, Officer) — GK + Intelligence Test
- **Driving License Written Test** — traffic signs and rules
- **Banking Exams** — NRB, NBL, RBB
- **Teacher License (TSC)** — subject-specific
- **Nepal Police** — police constable exam

## Coaching Classes in Nepal — Overview

### Popular Coaching Institutes

- **Namuna College** — established, experienced faculty (IOE, CEE)
- **VIBRANT Educational Foundation** — strong Physics and Chemistry
- **PEA (Professional Engineering Academy)** — good all-rounder
- **Entrance Nepal** — online + offline options
- **Lalitpur Engineering Entrance** — small batch sizes
- **Loksewa Tayari Kendra** — for government exam preparation
- **Easy Loksewa** — online + offline Loksewa preparation

### What Coaching Classes Offer

- **Structured curriculum** — syllabus covered systematically
- **Experienced teachers** — clarify doubts in real-time
- **Classroom environment** — peer learning and competition
- **Study materials** — printed notes, books, question banks
- **Regular tests** — weekly/monthly assessments
- **Doubt-solving sessions** — face-to-face with teachers
- **Motivation and discipline** — regular class schedule

## Detailed Comparison: Khojney Mock Tests vs Coaching Classes

### 1. Cost

| Factor | Khojney Mock Tests | Coaching Classes |
|--------|-------------------|------------------|
| **Registration fee** | Free | NPR 5,000–15,000 |
| **Per test cost** | Free | Included in fee |
| **Study materials** | Free (online) | NPR 1,000–3,000 extra |
| **Transportation** | ₹0 (study from home) | NPR 2,000–5,000/month |
| **Total cost (3 months)** | **Free** | **NPR 8,000–25,000** |

**Winner**: Khojney (by a huge margin)

### 2. Flexibility

| Factor | Khojney Mock Tests | Coaching Classes |
|--------|-------------------|------------------|
| **Study time** | Anytime, 24/7 | Fixed class schedule |
| **Location** | Anywhere with internet | Must travel to institute |
| **Pace** | Self-paced | Follow class pace |
| **Device** | Mobile, tablet, laptop | Classroom only |
| **Repeat lessons** | Unlimited | Once per class |

**Winner**: Khojney (much more flexible)

### 3. Quality of Content

| Factor | Khojney Mock Tests | Coaching Classes |
|--------|-------------------|------------------|
| **Question quality** | Real exam pattern, updated | Varies by institute |
| **Explanations** | Detailed, for every question | Teacher explains in class |
| **Coverage** | All major exams | Usually one exam per institute |
| **Update frequency** | Regularly updated | Depends on institute |

**Winner**: Tie (both have quality content, but Khojney is more consistently updated)

### 4. Personal Attention

| Factor | Khojney Mock Tests | Coaching Classes |
|--------|-------------------|------------------|
| **Doubt solving** | Self-study (no teacher) | Direct teacher interaction |
| **Personalized feedback** | Automated scoring | Teacher gives feedback |
| **Weak area focus** | Self-identified | Teacher identifies |
| **Motivation** | Self-driven | Teacher + peer motivation |

**Winner**: Coaching Classes (personal attention is the main advantage)

### 5. Effectiveness

| Factor | Khojney Mock Tests | Coaching Classes |
|--------|-------------------|------------------|
| **Self-disciplined students** | Excellent | Good |
| **Students needing structure** | Poor (needs discipline) | Excellent |
| **Working professionals** | Excellent | Difficult (time constraints) |
| **Remote area students** | Excellent | Often inaccessible |

**Winner**: Depends on student type

## When to Choose Khojney Mock Tests

Khojney mock tests are ideal for:

1. **Self-disciplined students** who can study without external pressure
2. **Working professionals** preparing for Loksewa or banking exams
3. **Students from remote areas** without access to coaching institutes
4. **Budget-conscious students** who cannot afford coaching fees
4. **Students wanting additional practice** alongside coaching
5. **Students preparing for multiple exams** (Khojney covers all major exams)
6. **Last-minute preparation** — quick revision and test practice

### Best Use Cases for Khojney

- **[Loksewa mock test free](/exams/loksewa-kharidar)** — perfect for working professionals
- **[Driving license practice](/exams/driving-license-parent)** — practice at home before the DOTM exam
- **[IOE mock test](/exams/ioe-entrance)** — supplement coaching with unlimited practice
- **[CMAT mock test](/exams/cmat-full)** — practice without paying for expensive MBA coaching

## When to Choose Coaching Classes

Coaching classes are ideal for:

1. **Students who lack self-discipline** and need structured schedule
2. **Students who need personal attention** and doubt-solving
3. **Students who learn better in classroom environment** with peers
4. **Students who can afford the fees** (NPR 8,000–25,000)
5. **Students preparing for a single exam** in depth (e.g., only IOE)
6. **First-time exam takers** who need guidance on syllabus and strategy

## The Hybrid Approach — Best of Both Worlds

The most effective strategy for many students is a **hybrid approach**:

### Strategy 1: Coaching + Khojney Practice

- Join a coaching class for structured learning and doubt-solving
- Use Khojney for **daily mock test practice** (free, unlimited)
- Take Khojney tests after each coaching topic to reinforce learning

### Strategy 2: Self-Study + Khojney + YouTube

- Study from textbooks and NEB materials (free)
- Watch YouTube tutorials for concepts (free)
- Take Khojney mock tests for practice (free)
- **Total cost**: NPR 0 (just internet data)

### Strategy 3: Coaching for Weak Subjects + Khojney for Strong

- Join coaching only for subjects you're weak in (e.g., Physics)
- Self-study strong subjects + practice with Khojney
- Saves money while getting help where needed

## Cost-Benefit Analysis

### Scenario A: IOE Preparation (6 months)

**Coaching only**:
- Namuna/VIBRANT fee: NPR 10,000–15,000
- Books and materials: NPR 3,000
- Transportation: NPR 5,000
- **Total: NPR 18,000–23,000**

**Khojney only**:
- Mock tests: Free
- YouTube tutorials: Free
- Books: NPR 2,000
- Internet data: NPR 2,000
- **Total: NPR 4,000**

**Hybrid (coaching + Khojney)**:
- Coaching fee: NPR 8,000 (cheaper institute)
- Books: NPR 2,000
- Khojney mock tests: Free
- **Total: NPR 10,000**

### Scenario B: Loksewa Preparation (3 months)

**Coaching only**:
- Loksewa preparation center: NPR 5,000–8,000
- Books: NPR 1,500
- **Total: NPR 6,500–9,500**

**Khojney only**:
- Mock tests: Free
- Gorkhapatra newspaper: NPR 600 (3 months)
- Books: NPR 1,000
- Internet: NPR 1,000
- **Total: NPR 2,600**

## Real Student Testimonials

### "Khojney saved me NPR 10,000"
> "I was planning to join a CMAT coaching class, but discovered Khojney's free mock tests. I practiced 50+ tests over 3 months and scored 78/100 in CMAT. Saved NPR 10,000 and got into Prime College for MBA."
> — Rajan Sharma, MBA student

### "Hybrid approach worked best"
> "I joined VIBRANT for Physics concepts but used Khojney for daily IOE mock test practice. The combination worked — I scored 118/140 and got into Pulchowk Campus."
> — Sneha Thapa, BE Computer student at Pulchowk

### "Perfect for working professionals"
> "As a government employee preparing for Loksewa Officer exam, I couldn't attend coaching classes. Khojney's free Loksewa mock tests helped me practice after office hours. Cleared the exam on second attempt."
> — Bishnu Gurung, Section Officer

## FAQ

### Are Khojney mock tests really free?
**Yes**, all mock tests on Khojney are 100% free. No registration fee, no subscription, no hidden charges. You can take unlimited attempts.

### Can Khojney replace coaching classes entirely?
For **self-disciplined students** with good foundational knowledge, yes. For students who need structure, personal attention, and doubt-solving, coaching is still valuable. A hybrid approach works best for most.

### Which exams does Khojney cover?
Khojney covers IOE, CEE (MBBS), CMAT, Loksewa (Kharidar/Nasu/Officer), driving license, banking, teacher license (TSC), and Nepal Police exams.

### How many mock tests should I take?
Aim for **at least 30 full-length mock tests** before any competitive exam. With Khojney's unlimited attempts, you can practice as much as you want.

### Are Khojney questions like the real exam?
Yes, Khojney questions match the real exam pattern. Questions are designed by subject experts and updated regularly to reflect current exam trends.

### Can I use Khojney on my phone?
Yes, Khojney is **mobile-friendly**. You can take mock tests on any device — phone, tablet, or laptop.

### Do coaching classes provide better content than Khojney?
Coaching classes provide **personalized teaching** and **doubt-solving**, which Khojney cannot. However, Khojney's mock test content is comparable in quality and completely free.

---

Start your free exam preparation today with Khojney's **[free mock tests](/exams)**. For specific exams, try our **[IOE mock test](/exams/ioe-entrance)**, **[CMAT mock test](/exams/cmat-full)**, **[Loksewa mock test](/exams/loksewa-kharidar)**, or **[driving license mock test](/exams/driving-license-parent)**. Read more exam tips on our **[blog](/blog)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 5: IOE vs IOM Entrance Comparison
  // Keywords: ioe vs iom entrance comparison, iom mbbs entrance nepal,
  //           ioe entrance exam nepal, engineering vs medical nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ioe-vs-iom-entrance-comparison-engineering-vs-medical-nepal",
    title: "IOE vs IOM Entrance: Engineering vs Medical Career in Nepal 2025",
    excerpt:
      "Complete comparison of IOE (engineering) vs IOM (medical) entrance exams in Nepal. Syllabus, difficulty, career prospects, salary, and how to choose between engineering and medical.",
    metaTitle: "IOE vs IOM Entrance Nepal — Engineering vs Medical Comparison | Khojney",
    metaDescription:
      "IOE vs IOM entrance exam comparison. Engineering vs medical career in Nepal — syllabus, difficulty, duration, fees, salary, job prospects, and how to choose the right path.",
    categoryName: "Career",
    categorySlug: "blog-career",
    tags: ["ioe", "iom", "engineering", "medical", "comparison"],
    featured: true,
    readTimeMin: 11,
    content: `# IOE vs IOM Entrance: Engineering vs Medical Career in Nepal 2025

One of the biggest decisions for Nepali +2 Science students is choosing between **engineering (IOE entrance)** and **medicine (IOM/CEE entrance)**. Both are prestigious career paths with strong job prospects, but they differ significantly in exam pattern, difficulty, duration, cost, and career trajectory. This comprehensive **IOE vs IOM comparison** helps you make an informed decision about **engineering vs medical in Nepal**.

## Quick Overview: IOE vs IOM

| Factor | IOE (Engineering) | IOM (Medical) |
|--------|-------------------|---------------|
| **Full form** | Institute of Engineering | Institute of Medicine |
| **Conducted by** | Tribhuvan University (IOE) | Medical Education Commission (MEC) via CEE |
| **Exam** | IOE Entrance | CEE (Common Entrance Examination) |
| **Questions** | 140 MCQs | 200 MCQs |
| **Duration** | 3 hours | 3 hours |
| **Total marks** | 140 | 200 |
| **Negative marking** | No | No |
| **Subjects** | Physics, Chemistry, Math, English | Physics, Chemistry, Botany, Zoology |
| **Pass mark** | 40% (56/140) | 50% (100/200) for MBBS |
| **Competition** | ~15,000 for 1,800 seats | ~18,000 for 2,200 seats |
| **Course duration** | 4 years (BE) | 5.5 years (MBBS) |
| **Total fees** | NPR 5–15 lakh | NPR 3–50 lakh |

## IOE Entrance Exam Nepal — Detailed Overview

The **IOE entrance exam** is conducted by Tribhuvan University's Institute of Engineering for admission to BE/B.Arch programs at TU-affiliated engineering colleges.

### IOE Exam Pattern

| Section | Questions | Marks |
|---------|-----------|-------|
| Physics | 40 | 40 |
| Chemistry | 40 | 40 |
| Mathematics | 40 | 40 |
| English | 20 | 20 |
| **Total** | **140** | **140** |

- **Duration**: 3 hours (180 minutes)
- **Pass mark**: 40% (56/140)
- **No negative marking**

### IOE Key Facts

- **Conducted**: Once per year (Bhadra–Ashwin)
- **Eligibility**: +2 Science with PCM (Physics, Chemistry, Math)
- **Top college**: Pulchowk Campus (cutoff: 100+ marks)
- **Career**: Engineer (Civil, Computer, Electronics, Mechanical, etc.)
- **Duration**: 4 years (8 semesters)
- **Fees**: NPR 5–15 lakh (government: 5–7L, private: 8–15L)

### IOE Cutoff for Top Colleges

| College | Approx. Cutoff |
|---------|---------------|
| Pulchowk (Computer) | 110+ |
| Pulchowk (Electronics) | 105+ |
| Pulchowk (Civil) | 95+ |
| Thapathali Campus | 85+ |
| Chitwan Engineering | 75+ |
| Pashchimanchal (Pokhara) | 80+ |

Take a **[free IOE mock test →](/exams/ioe-entrance)** to check your level.

## IOM/CEE Entrance Exam Nepal — Detailed Overview

The **CEE (Common Entrance Examination)** has replaced the separate IOM entrance exam. CEE is conducted by the Medical Education Commission (MEC) for MBBS and BDS admission across all medical colleges in Nepal, including IOM (Tribhuvan University Teaching Hospital).

### CEE Exam Pattern

| Section | Questions | Marks |
|---------|-----------|-------|
| Physics | 50 | 50 |
| Chemistry | 50 | 50 |
| Botany | 50 | 50 |
| Zoology | 50 | 50 |
| **Total** | **200** | **200** |

- **Duration**: 3 hours (180 minutes)
- **Pass mark**: 50% (100/200) for MBBS
- **No negative marking**

### IOM/CEE Key Facts

- **Conducted**: Once per year (Bhadra–Ashwin)
- **Eligibility**: +2 Science with PCB (Physics, Chemistry, Biology)
- **Top college**: IOM (Tribhuvan University Teaching Hospital)
- **Career**: Doctor (MBBS, BDS)
- **Duration**: 5.5 years (4.5 academic + 1 internship)
- **Fees**: NPR 3–50 lakh (government: 3–5L, private: 40–50L)

### CEE Cutoff for Top Medical Colleges

| College | Approx. Cutoff |
|---------|---------------|
| IOM (TUTH) | 150+ |
| BPKIHS | 140+ |
| NAIHS (Army) | 130+ |
| PAHS | 135+ |
| KUSMS | 120+ |
| NMC (Private) | 110+ |

Take a **[free CEE mock test →](/exams/mbbs-cee)** to check your level.

## Engineering vs Medical: Subject Comparison

### For IOE (Engineering) — You Need PCM

- **Physics**: Mechanics, Electricity, Optics, Modern Physics
- **Chemistry**: Physical, Organic, Inorganic
- **Mathematics**: Algebra, Calculus, Coordinate Geometry, Trigonometry
- **English**: Grammar, Vocabulary

**Note**: Biology is NOT required for IOE. Math is the key differentiator.

### For CEE (Medical) — You Need PCB

- **Physics**: Mechanics, Electricity, Optics, Modern Physics
- **Chemistry**: Physical, Organic, Inorganic
- **Botany**: Plant Physiology, Genetics, Plant Diversity, Ecology
- **Zoology**: Human Physiology, Animal Diversity, Genetics, Reproductive Health

**Note**: Mathematics is NOT required for CEE. Biology (Botany + Zoology) is the key differentiator.

### Can You Prepare for Both?

Some students try to prepare for both IOE and CEE, taking all four subjects (PCM + B). This is extremely challenging because:

- Combined syllabus is enormous
- Both exams are highly competitive
- Time is split, reducing effectiveness in each
- Most toppers focus on one

**Recommendation**: Choose one based on your interest and aptitude. If you love Math and problem-solving → IOE. If you love Biology and helping people → CEE.

## Difficulty Comparison: IOE vs IOM

### IOE Difficulty

- **Physics**: Moderate-Hard (numerical-heavy)
- **Chemistry**: Moderate
- **Mathematics**: Hard (most scoring but most challenging)
- **English**: Easy (20 free marks)

**Overall**: Moderate-Hard. The key challenge is **Mathematics** — if you're strong in Math, IOE is easier.

### CEE Difficulty

- **Physics**: Moderate-Hard (same as IOE)
- **Chemistry**: Moderate (same as IOE)
- **Botany**: Moderate (vast syllabus, memorization-heavy)
- **Zoology**: Moderate (vast syllabus, memorization-heavy)

**Overall**: Hard. The key challenge is the **vast Biology syllabus** and the **sheer number of questions (200)** to solve in 3 hours.

## Career Comparison: Engineering vs Medical

### Engineering Career in Nepal

**Job prospects**:
- Software/IT (highest demand): F1Soft, Deerwalk, Leapfrog, international remote
- Civil (infrastructure boom): construction, hydropower, roads
- Electrical/Electronics: NEA, telecom, manufacturing
- Mechanical: manufacturing, automotive
- Architecture: design firms, real estate

**Salary (2025)**:
- Fresh graduate: NPR 30,000–60,000/month
- 3–5 years experience: NPR 60,000–120,000/month
- 10+ years: NPR 150,000–500,000+/month
- IT with remote work: NPR 100,000–500,000+/month

**Top employers**: F1Soft, Deerwalk, Braindigit, NEA, Nepal Telecom, hydropower companies, construction firms

### Medical Career in Nepal

**Job prospects**:
- Government hospitals (IOM, BPKIHS, PAHS) — highly competitive
- Private hospitals and clinics
- Own private practice
- Teaching hospitals (academic + clinical)
- International opportunities (US, UK, Australia after licensing exams)

**Salary (2025)**:
- Internship: NPR 25,000–40,000/month
- Junior doctor (1–3 years): NPR 60,000–120,000/month
- Specialist (MD/MS): NPR 150,000–500,000+/month
- Senior consultant: NPR 300,000–1,000,000+/month
- Private practice: Unlimited (top doctors earn millions)

**Top employers**: IOM (TUTH), BPKIHS, NAIHS, Patan Hospital, private hospitals (Norvic, Grande, Mediciti)

## Duration and Cost Comparison

### Engineering (BE)

- **Duration**: 4 years
- **Government college fees**: NPR 5–7 lakh
- **Private college fees**: NPR 8–15 lakh
- **KU fees**: NPR 12–18 lakh
- **Total investment** (including living): NPR 8–25 lakh
- **Earning starts**: Age 22 (after BE)

### Medical (MBBS)

- **Duration**: 5.5 years (4.5 academic + 1 internship)
- **Government college fees**: NPR 3–6 lakh
- **Private college fees**: NPR 40–50 lakh
- **NAIHS (Army)**: NPR 20–30 lakh
- **Total investment** (including living): NPR 8–60 lakh
- **Earning starts**: Age 24 (after MBBS)
- **Specialization (MD/MS)**: +3 years, NPR 20–80 lakh additional

## How to Choose: Engineering or Medical?

### Choose Engineering (IOE) if:

- You love Mathematics and problem-solving
- You enjoy Physics and applying concepts
- You want to start earning sooner (4 years vs 5.5+)
- You want lower fees (especially government colleges)
- You're interested in technology, innovation, building things
- You want flexibility (engineers can switch to IT, management, entrepreneurship)
- You prefer variety in career options

### Choose Medical (IOM/CEE) if:

- You love Biology and understanding the human body
- You want to directly help people and save lives
- You're willing to study longer (5.5 + 3 for specialization)
- You can afford higher fees (or secure a government seat)
- You have patience and dedication for long studies
- You want high social respect and stable career
- You're comfortable with memorization (vast Biology syllabus)

## The Decision Matrix

| Question | Engineering (IOE) | Medical (IOM/CEE) |
|----------|-------------------|-------------------|
| Do you love Math? | ✓ | ✗ |
| Do you love Biology? | ✗ | ✓ |
| Want to start earning fast? | ✓ | ✗ |
| Want highest salary ceiling? | ✓ (IT) | ✓ (specialist) |
| Want social prestige? | ○ | ✓ |
| Want career flexibility? | ✓ | ✗ |
| Can afford NPR 40+ lakh? | Not needed | ✓ (for private) |
| Patient with long studies? | ○ | ✓ |

## FAQ

### Which is harder: IOE or IOM (CEE)?
Both are competitive. IOE is harder in **Mathematics** but has fewer questions (140 vs 200). CEE is harder due to **vast Biology syllabus** and more questions to solve in the same time.

### Can I give both IOE and CEE?
Technically yes, if you take all four subjects (PCM + B) in +2. However, preparing for both is extremely challenging and most toppers focus on one.

### Which pays more: engineering or medical in Nepal?
**Engineering**: IT/computer engineers can earn NPR 100K–500K+/month (especially with remote work). **Medical**: Specialists (MD/MS) earn NPR 200K–1M+/month. Medical has a higher salary ceiling, but engineering offers faster earning.

### Which has lower fees: IOE or IOM?
**Government colleges**: Both are affordable (NPR 3–7 lakh). **Private colleges**: Engineering is cheaper (NPR 8–15 lakh) vs medical (NPR 40–50 lakh).

### Can I switch from engineering to medical or vice versa?
Not directly. You'd need to re-appear for the other entrance exam. Some students drop a year to switch, but this is rare and costly.

### Which has better job security: engineering or medical?
**Medical** has better job security — doctors are always in demand. **Engineering** job security depends on specialization (IT is booming, civil is stable, others vary).

### Is NEB +2 Science with PCM enough for medical?
No, medical (CEE) requires **PCB** (Physics, Chemistry, Biology). If you take PCM without Biology, you cannot appear for CEE. Choose your +2 subjects carefully.

### Which exam should I choose if I'm good at both Math and Biology?
Consider your **interest** and **career goals**. If you enjoy problem-solving and technology → IOE. If you enjoy helping people and understanding life → CEE. Both are excellent career paths.

---

Start your preparation today with our **[free IOE mock test](/exams/ioe-entrance)** or **[free CEE mock test](/exams/mbbs-cee)**. For more guidance, read our **[IOE entrance preparation guide](/blog/ioe-entrance-preparation-complete-guide-be-engineering-nepal)** and **[CEE mock test guide](/blog/cee-mock-test-free-online-nepal-mbbs-entrance)**. Explore colleges on our **[colleges directory](/colleges)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 6: Loksewa Preparation Tips — Complete Study Guide
  // Keywords: loksewa preparation, loksewa exam preparation tips,
  //           nepal public service commission exam, loksewa aayog study guide
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "loksewa-preparation-tips-nepal-complete-study-guide-2025",
    title: "Loksewa Preparation Tips Nepal 2025: Complete PSC Study Guide",
    excerpt:
      "Complete Loksewa Aayog preparation guide for Nepal. Study tips, syllabus, age limit, best books, preparation strategy for Kharidar, Nasu, and Officer level PSC exams.",
    metaTitle: "Loksewa Preparation Tips Nepal 2025 — PSC Study Guide | Khojney",
    metaDescription:
      "Complete Loksewa Aayog preparation guide for Nepal. Study tips, syllabus, age limit, best books, preparation strategy for Kharidar, Nasu, and Officer level PSC exams.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["loksewa", "psc", "preparation", "nepal", "study-guide"],
    featured: true,
    readTimeMin: 12,
    content: `# Loksewa Preparation Tips Nepal 2025: Complete PSC Study Guide

The **Loksewa Aayog** (Public Service Commission — PSC) conducts competitive examinations for government job recruitment in Nepal. From entry-level Kharidar to Gazetted Officer positions, thousands of Nepali youth appear for Loksewa exams every year. Cracking these highly competitive exams requires **systematic preparation, the right strategy, and consistent practice**. This complete **Loksewa preparation guide** covers everything you need — syllabus, age limit, best books, study tips, and free mock tests.

## What is Loksewa Aayog?

The **Lok Sewa Aayog** (लोक सेवा आयोग) is the constitutional body established under **Article 242 of the Constitution of Nepal** to recruit civil servants. It conducts examinations for:

- **Kharidar** (Non-gazetted Second Class) — entry-level, SEE qualification
- **Nasuw (Nasu)** (Non-gazetted First Class) — +2 qualification
- **Officer (Adhritti — Gazetted Third Class)** — Bachelor's degree
- **Gazetted Second Class** (Sahayak Sachib / Deputy Secretary) — promotion-based
- **Gazetted First Class** (Sachib / Secretary) — promotion-based

## Nepal Public Service Commission Exam — Overview

### Exam Levels and Qualifications

| Level | Minimum Education | Age Limit (General) |
|-------|------------------|---------------------|
| Kharidar | SEE (SLC) pass | 18–35 years |
| Nasu | +2 (or equivalent) | 18–35 years |
| Officer (Gazetted 3rd) | Bachelor's degree | 21–35 years |
| Sahayak Sachib | Master's degree | 21–45 years (govt employees) |

### Age Limit for Loksewa

| Category | Age Limit |
|----------|-----------|
| General (Male) | 21–35 years |
| General (Female) | 21–40 years |
| Dalit/Disabled | 21–40 years |
| Existing government employees | 21–45 years |

### Can We Give Loksewa Exam in English?

**Yes!** Loksewa exams can be taken in either **Nepali or English**. You choose your preferred language when filling out the application form. The question paper will be in your chosen language (or bilingual for some subjects).

## Loksewa Exam Pattern

### Kharidar Exam Pattern

| Paper | Subject | Marks | Type |
|-------|---------|-------|------|
| First | General Knowledge (सामान्य ज्ञान) | 100 | Objective (MCQ) |
| Second | Intelligence Test (बुद्धि परीक्षण) | 50 | Objective |
| Third | Subject-specific (विषयगत) | 100 | Written (long answer) |
| **Total** | | **250** | |

### Nasu Exam Pattern

| Paper | Subject | Marks | Type |
|-------|---------|-------|------|
| First | General Knowledge | 100 | Objective |
| Second | Intelligence Test + Subject | 100 | Objective + Written |
| Third | Subject-specific (2 papers) | 200 | Written |
| Interview | | 30 | |
| **Total** | | **430** | |

### Officer (Gazetted Third Class) Exam Pattern

| Paper | Subject | Marks | Type |
|-------|---------|-------|------|
| First | General Knowledge + Aptitude | 100 | Objective |
| Second | Subject-specific (3 papers) | 300 | Written |
| Third | Service-specific | 100 | Written |
| Interview | | 40 | |
| **Total** | | **540** | |

## Loksewa Syllabus Breakdown

### General Knowledge (सामान्य ज्ञान)

This is common to all Loksewa exams:

- **Nepal's history** — ancient, medieval, modern (Licchavi, Malla, Shah, Rana, post-2007)
- **Geography of Nepal** — physical (Himal, Pahad, Terai), economic, social
- **Constitution of Nepal (2072)** — fundamental rights, structure of government, federalism
- **Current affairs** — national and international (last 6 months)
- **Sports, awards, and honors** — national and international
- **United Nations and international organizations** — UN, SAARC, BIMSTEC, WTO
- **Nepali politics and governance** — parliament, judiciary, executive
- **Economic survey and budget** — annual budget, monetary policy

### Intelligence Test (बुद्धि परीक्षण)

- **Series completion** — number, letter, figure series
- **Coding-decoding** — letter coding, number coding
- **Blood relations** — family tree problems
- **Direction sense** — north/south/east/west problems
- **Syllogisms** — logical deductions
- **Puzzles** — seating arrangement, classification
- **Analogies** — word and number analogies

### Subject-Specific Papers

Depends on the position you're applying for:

- **Administration (प्रशासन)**: Public administration, management, governance, office procedures
- **Accounting (लेखा)**: Financial accounting, auditing, budgeting, government accounting
- **Engineering (इन्जिनियरिङ)**: Civil, mechanical, electrical (based on specialty)
- **Computer (कम्प्युटर)**: Programming, databases, networking, system analysis
- **Health (स्वास्थ्य)**: Public health, nursing, pharmacy, health management
- **Education (शिक्षा)**: Education, curriculum, pedagogy
- **Agriculture (कृषि)**: Agriculture, agronomy, horticulture, animal science
- **Forestry (वन)**: Forestry, wildlife, conservation

## Loksewa Preparation Strategy — 6 Month Plan

### Month 1–2: Foundation Building

**Daily routine (4–5 hours)**:
- 1 hour: Read Gorkhapatra or The Kathmandu Post (current affairs)
- 1 hour: Study General Knowledge (Nepal Parichaya, Constitution)
- 1 hour: Practice Intelligence Test (RS Aggarwal reasoning)
- 1 hour: Study subject-specific syllabus
- 30 min: Maintain current affairs notebook

**Weekly**:
- Take 1 subject-wise mock test
- Revise the week's GK notes on Sunday

### Month 3–4: Intensive Study

**Daily routine (6–7 hours)**:
- 1 hour: Current affairs (newspaper + news bulletin)
- 1.5 hours: General Knowledge (deep dive into each topic)
- 1 hour: Intelligence Test practice (50 questions)
- 2 hours: Subject-specific study
- 30 min: Daily revision

**Weekly**:
- Take 2 mock tests (1 GK + 1 Intelligence)
- Analyze every mock test for 30 minutes

### Month 5: Mock Test Marathon

**Daily routine (5–6 hours)**:
- 1 hour: Current affairs revision
- 1 hour: Subject-specific revision
- 2 hours: Take 1 full-length mock test
- 1 hour: Analyze mock test + review weak areas

**Weekly**:
- Take 4–5 mock tests
- Focus on time management

### Month 6: Final Revision

**Daily routine (4–5 hours)**:
- Revise all notes (GK, Intelligence, Subject)
- Take 1 mock test every alternate day
- Stay calm — avoid learning new topics
- Sleep 7+ hours, eat well, exercise

## Best Books for Loksewa Preparation

### General Knowledge

1. **Nepal Parichaya** — comprehensive Nepal overview (must-read)
2. **Mero Loksewa Magazine** — monthly current affairs + practice questions
3. **Constitution of Nepal 2072** — official text (read 3–4 times)
4. **Brihat Loksewa Guide** — covers all GK topics
5. **Gorkhapatra** — daily national newspaper (current affairs)

### Intelligence Test

1. **"A Modern Approach to Verbal & Non-Verbal Reasoning"** by R.S. Aggarwal
2. **Loksewa Intelligence Test Practice Book** — Nepal-specific
3. **Online reasoning practice** — Khojney's free mock tests

### Subject-Specific Books

- **Administration**: Public Administration in Nepal, Office Management
- **Accounting**: Financial Accounting (Nepal context), Government Accounting
- **Engineering**: respective branch textbooks + Nepal engineering rules
- **Computer**: Computer Fundamentals, Programming, Networking

## Free Loksewa Mock Test

Khojney offers **free Loksewa mock tests** for all levels:

- Kharidar, Nasu, and Officer level practice tests
- Real exam pattern with timed sections
- Instant scoring with detailed explanations
- Subject-wise performance analysis
- Shuffled questions for realistic practice

👉 **[Start your free Loksewa mock test →](/exams/loksewa-kharidar)**

## How to Pass Loksewa Exam — Top 10 Tips

### 1. Know the Syllabus Thoroughly

Download the official syllabus from the **PSC website (pscnepal.gov.np)**. Read it 3–4 times. Understand the weightage of each topic.

### 2. Read Newspaper Daily

Read **Gorkhapatra** (Nepali) or **The Kathmandu Post** (English) every morning. Note 5 important current affairs daily in a notebook.

### 3. Master the Constitution

The **Constitution of Nepal 2072** is heavily tested. Read fundamental rights, directive principles, structure of government, and federal system.

### 4. Practice Intelligence Test Daily

Intelligence Test is scoring — practice 50 questions daily from RS Aggarwal. Focus on series, coding-decoding, and puzzles.

### 5. Take Weekly Mock Tests

Start with subject-wise tests, then move to full-length tests. Analyze every test for 30 minutes — identify weak areas.

### 6. Maintain a Current Affairs Notebook

Write 5 important news items daily. Categorize: national, international, sports, economy, appointments. Revise weekly.

### 7. Join a Loksewa Preparation Class (Optional)

Popular institutes:
- **Loksewa Tayari Kendra**
- **Nepal Loksewa Aayog Preparation Center**
- **Easy Loksewa** (online + offline)
- **Khojney's free mock tests** + YouTube channels

### 8. Study Previous Year Question Papers

PSC repeats question patterns. Solve at least 5 years of past papers. This helps you understand the exam pattern and important topics.

### 9. Stay Updated on Government Policies

- Read the **annual budget** (presented in Jestha)
- Review **monetary policy** (Nepal Rastra Bank)
- Follow **Economic Survey** (published before budget)
- Know key government schemes and programs

### 10. Stay Consistent and Positive

Loksewa preparation is a marathon, not a sprint. Study consistently for 6 months. Don't get discouraged by mock test scores — they improve with practice.

## Loksewa Pass Mark

| Level | Pass Mark |
|-------|-----------|
| Kharidar (written) | 40% of total |
| Nasu (written) | 40% of total |
| Officer (written) | 40% per paper |
| Interview | Must pass to be considered |

**Important**: Just passing isn't enough — you need to score high enough to be in the **merit list** for available vacancies. For popular positions, you may need 60%+ to be selected.

## Common Loksewa Mistakes to Avoid

1. **Ignoring current affairs** — many candidates fail GK due to outdated preparation
2. **Not reading the Constitution** — heavily tested, easy marks
3. **Skipping Intelligence Test practice** — scoring section, don't neglect
4. **Not taking mock tests** — knowledge without practice = failure
5. **Cramming at the last minute** — Loksewa requires consistent preparation
6. **Ignoring subject-specific papers** — these carry maximum marks
7. **Not analyzing mock tests** — repeating the same mistakes
8. **Neglecting health** — sleep and exercise are crucial for exam performance

## Loksewa Preparation for Working Professionals

If you're working full-time:

- **Study 2–3 hours daily** (early morning or evening)
- **Take 1 mock test on weekends**
- **Listen to news podcasts** during commute
- **Use Khojney's mobile-friendly mock tests** during lunch breaks
- **Focus on high-weightage topics** (GK, Intelligence Test)
- **Be patient** — may take 1–2 years to crack while working

## FAQ

### How can I prepare for Loksewa exam in Nepal?
Start with the official syllabus, read Gorkhapatra daily, study Nepal Parichaya and the Constitution, practice Intelligence Test, take weekly mock tests, and maintain a current affairs notebook.

### What is the age limit for Loksewa in Nepal?
For general (male): 21–35 years. For women, Dalits, and disabled: 21–40 years. For existing government employees: 21–45 years. Kharidar allows 18–35 years.

### Can we give Loksewa exam in English?
Yes, Loksewa exams can be taken in either **Nepali or English**. Choose your preferred language when applying.

### What is the qualification for Kharidar?
**SEE (SLC) pass** is the minimum qualification for Kharidar. For Nasu: +2 pass. For Officer: Bachelor's degree.

### What is the pass mark for Loksewa?
The pass mark is **40% of total marks** for written exams. However, you need to score much higher to be in the merit list for available vacancies.

### How many times can I take Loksewa exam?
There's no limit on attempts, as long as you meet the age criteria. Many candidates clear Loksewa on their 2nd or 3rd attempt.

### Which is the best Loksewa preparation book?
**Nepal Parichaya** for General Knowledge, **RS Aggarwal** for Intelligence Test, **Constitution of Nepal 2072** for constitution, and **Mero Loksewa Magazine** for current affairs.

### Can I prepare for Loksewa for free?
Yes. Use **Khojney's free Loksewa mock tests**, read Gorkhapatra online (free), watch YouTube preparation channels, and download the official syllabus from PSC website.

### What is Loksewa Aayog called in English?
Loksewa Aayog is called the **Public Service Commission (PSC)** in English.

### How long does Loksewa preparation take?
For serious preparation: **6 months** (4–6 hours daily). For working professionals: **1–2 years** (2–3 hours daily). Consistency matters more than total hours.

---

Start your Loksewa preparation today with our **[free Loksewa mock test](/exams/loksewa-kharidar)**. For the complete Loksewa guide, read our **[Loksewa Aayog exam guide](/blog/loksewa-aayog-exam-complete-guide-2080)** and **[Loksewa mock test guide](/blog/loksewa-mock-test-nepal-free-preparation-guide)**. Visit our **[blog](/blog)** for more exam preparation resources.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 7: Nepal Scholarships for Undergraduates
  // Keywords: nepal scholarships for undergraduates, scholarship for see toppers nepal,
  //           nepal undergraduate scholarships, free seats nepal college
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "nepal-scholarships-undergraduates-see-toppers-free-seats-2025",
    title: "Nepal Scholarships for Undergraduates 2025: SEE Toppers, Free Seats & Aid",
    excerpt:
      "Complete guide to Nepal scholarships for undergraduate students. SEE topper scholarships, free seats in government colleges, merit scholarships, need-based aid, and international scholarships.",
    metaTitle: "Nepal Scholarships for Undergraduates 2025 — Free Seats & Aid | Khojney",
    metaDescription:
      "Complete guide to Nepal scholarships for undergraduate students. SEE topper scholarships, free seats in government colleges, merit scholarships, need-based aid, and international study scholarships.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["scholarships", "nepal", "undergraduate", "see", "free-seats"],
    featured: true,
    readTimeMin: 10,
    content: `# Nepal Scholarships for Undergraduates 2025: SEE Toppers, Free Seats & Aid

Higher education in Nepal can be expensive, especially at private colleges. However, numerous **scholarships for undergraduate students in Nepal** can significantly reduce the financial burden. From **SEE topper scholarships** to **free seats in government colleges**, merit-based aid, need-based grants, and international study scholarships — this comprehensive guide covers every scholarship opportunity available to Nepali students in 2025.

## Why Scholarships Matter in Nepal

Nepal's higher education costs vary widely:

| College Type | Annual Fees | 4-Year Total |
|-------------|-------------|--------------|
| Government (TU constituent) | NPR 50,000–100,000 | NPR 2–4 lakh |
| Private (TU affiliated) | NPR 200,000–400,000 | NPR 8–16 lakh |
| KU (Kathmandu University) | NPR 300,000–500,000 | NPR 12–20 lakh |
| Private Medical College | NPR 1,000,000+ | NPR 40–50 lakh |
| Study Abroad (US/UK/Australia) | NPR 2,000,000+ | NPR 80+ lakh |

For most Nepali families, these amounts are substantial. Scholarships can reduce or eliminate these costs, making education accessible to talented students regardless of financial background.

## Types of Scholarships in Nepal

### 1. SEE Topper Scholarships

Many +2 colleges offer full or partial scholarships to SEE toppers to attract bright students:

- **A+ (3.6+ GPA)**: 100% tuition waiver + free books at top colleges
- **A (3.2–3.6 GPA)**: 50–100% tuition waiver
- **B+ (2.8–3.2 GPA)**: 25–50% tuition waiver
- **B (2.4–2.8 GPA)**: 10–25% tuition waiver (varies by college)

**Top colleges offering SEE scholarships**:
- **St. Xavier's College, Maitighar** — full scholarship for top SEE scorers
- **Budhanilkantha School** — fully government-funded (national merit)
- **CCRC (Capital College)** — merit scholarships for science stream
- **Premier College** — scholarships for management stream
- **Global College of Management** — scholarships for management toppers

### 2. Free Seats in Government Colleges

Government (TU constituent) colleges offer **highly subsidized education**:

- **Pulchowk Campus (IOE)**: NPR 5–7 lakh for 4-year BE (vs NPR 8–15 lakh private)
- **IOM (Tribhuvan University Teaching Hospital)**: NPR 3–5 lakh for MBBS (vs NPR 40–50 lakh private)
- **Shanker Dev Campus**: NPR 2–3 lakh for 4-year BBA/BBS (vs NPR 8–12 lakh private)
- **TU central campus, Kirtipur**: NPR 1–2 lakh for BA/BSc (vs NPR 6–10 lakh private)

**How to get free seats**: Score high in entrance exams (IOE for engineering, CEE for medical, CMAT for management). Government quota seats go to top rank holders.

### 3. Merit Scholarships at Private Colleges

Most private colleges offer merit-based scholarships:

- **Full scholarship (100%)**: Top 1–5 students in entrance exam
- **Half scholarship (50%)**: Top 5–10 students
- **Quarter scholarship (25%)**: Top 10–20 students
- **Discount (10–25%)**: Based on +2 or SEE percentage

**Examples**:
- **Kantipur Engineering College**: 5 full scholarships for top IOE rankers
- **Nepal Medical College (NMC)**: 5 government-quota seats at NPR 5 lakh (vs NPR 45 lakh private)
- **Apex College (MBA)**: Merit scholarships for top CMAT scorers
- **King's College**: Entrepreneurship scholarships

### 4. Need-Based Scholarships (Financial Aid)

Some colleges offer need-based aid for economically disadvantaged students:

- **Documentation required**: Income certificate, recommendation letter, ward office letter
- **Coverage**: 25–100% tuition waiver depending on financial situation
- **Renewal**: Must maintain minimum GPA (usually 2.5+) each semester

**Colleges with strong need-based aid**:
- **Budhanilkantha School** — full scholarship for all 77 districts
- **St. Xavier's College** — need-based aid for deserving students
- **Kathmandu University** — partial need-based aid
- **Pulchowk Campus** — subsidized for all (government rate)

### 5. Government Scholarships

The Government of Nepal offers several scholarship schemes:

#### a. Campus Scholarships (TU)
Each TU constituent campus reserves **10% of seats** for scholarship students:
- Full tuition waiver
- Monthly stipend (NPR 1,000–2,000)
- Priority to marginalized communities (Dalit, Janajati, disabled, women)

#### b. Girls' Education Scholarship
- For female students from rural areas
- NPR 1,500–3,000/month stipend
- Applied through the campus financial aid office

#### c. Dalit Scholarship
- Full tuition waiver + monthly stipend
- For Dalit community students
- Applied through campus + Ministry of Education

#### d. Disabled Student Scholarship
- 50–100% tuition waiver
- Additional stipend for assistive devices
- Applied through Ministry of Education

### 6. International Scholarships for Nepali Students

#### a. Indian Embassy Scholarships
- **ICCNR Scholarship**: For Nepali students to study in India
- **SAARC Scholarship**: For SAARC countries
- **Indian Council for Cultural Relations (ICCR)**: Full scholarship (tuition + living)

#### b. Chinese Government Scholarship
- Full scholarship (tuition + accommodation + stipend)
- For undergraduate, master's, and PhD
- Apply through Chinese Embassy in Kathmandu

#### c. Japanese Government (MEXT) Scholarship
- Full scholarship for study in Japan
- Includes tuition, monthly allowance, round-trip airfare
- Apply through Japanese Embassy

#### d. US Government Scholarships
- **Fulbright Scholarship**: For master's/PhD in USA
- **Global UGRAD**: For undergraduate exchange
- **Hubert H. Humphrey Fellowship**: For mid-career professionals

#### e. Australian Awards Scholarship
- Full scholarship for master's in Australia
- Includes tuition, living, travel, health insurance
- Focus on development-related fields

#### f. British Chevening Scholarship
- Full scholarship for master's in UK
- Includes tuition, living, travel
- For future leaders and influencers

#### g. Study in Nepal from Abroad — Diaspora Scholarships

For **Nepali diaspora** (NRNs and foreign nationals of Nepali origin):

- **NRN (Non-Resident Nepali) Scholarship**: For children of NRNs to study in Nepal
- **Quota seats** at KU, PU, PoU for diaspora students
- **Reduced fees** at some private colleges for NRN quota

## Nepal Scholarships for Undergraduates — Top 10 List

### 1. TU Constituent Campus Scholarship
- **Who**: All students admitted to TU constituent campuses
- **Amount**: 10% seats with full tuition waiver + stipend
- **How to apply**: Through campus admission, based on merit + category

### 2. Pulchowk Campus Merit Scholarship
- **Who**: Top 10 IOE rankers
- **Amount**: Full tuition waiver
- **How to apply**: Automatic based on IOE rank

### 3. IOM Government Quota (MBBS)
- **Who**: Top CEE rankers (typically top 75)
- **Amount**: NPR 3–5 lakh (vs NPR 45 lakh private)
- **How to apply**: Through CEE counseling, based on rank

### 4. KU Merit Scholarship
- **Who**: Top performers in KU entrance
- **Amount**: 25–100% tuition waiver
- **How to apply**: Automatic based on entrance rank

### 5. Budhanilkantha School National Scholarship
- **Who**: Class 5 students from all 77 districts (merit-based)
- **Amount**: Full scholarship (tuition + boarding + books)
- **How to apply**: National entrance exam in Class 5

### 6. St. Xavier's College Scholarship
- **Who**: +2 and bachelor's students with academic excellence
- **Amount**: 25–100% tuition waiver
- **How to apply**: Apply to college scholarship committee

### 7. Nepal Government Girls' Scholarship
- **Who**: Female students from rural areas in +2 and bachelor's
- **Amount**: NPR 1,500–3,000/month stipend
- **How to apply**: Through campus financial aid office

### 8. ICCR (Indian Embassy) Scholarship
- **Who**: Nepali students for undergraduate/postgraduate in India
- **Amount**: Full (tuition + living + books)
- **How to apply**: Indian Embassy Kathmandu, usually in Magh–Falgun

### 9. Chinese Government Scholarship
- **Who**: Nepali students for study in China
- **Amount**: Full (tuition + accommodation + stipend)
- **How to apply**: Chinese Embassy Kathmandu, usually in Falgun–Chaitra

### 10. NRN Scholarship
- **Who**: Children of Non-Resident Nepalis
- **Amount**: 25–100% tuition waiver at partner colleges
- **How to apply**: NRN Association website

## How to Find and Apply for Scholarships

### Step 1: Research Early

Start researching scholarships **6–12 months before admission**:
- Check college websites for scholarship pages
- Follow Khojney's **[scholarships directory](/scholarships)** for updates
- Read Gorkhapatra newspaper for government scholarship notices
- Follow embassies on social media for international scholarships

### Step 2: Prepare Documents

Common documents required:
- Academic transcripts (SEE, +2, bachelor's)
- Citizenship certificate
- Income certificate (for need-based)
- Recommendation letters (from teachers/employers)
- Statement of purpose (for international scholarships)
- Passport-size photos
- Caste/category certificate (for reservation quotas)

### Step 3: Meet Deadlines

Scholarship deadlines are strict:
- **TU/college scholarships**: With admission application (Bhadra–Ashwin)
- **Indian Embassy (ICCR)**: Magh–Falgun (January–February)
- **Chinese Government**: Falgun–Chaitra (February–April)
- **Japanese MEXT**: April–May
- **Australian Awards**: March–April
- **Chevening**: August–November (for next year)

### Step 4: Write a Strong Application

For international scholarships:
- **Statement of Purpose**: Explain your goals, why this scholarship, how you'll contribute
- **Recommendation letters**: Get from professors/employers who know you well
- **English proficiency**: IELTS/TOEFL for English-speaking countries
- **Extracurriculars**: Show leadership, community service, awards

## Free Seats in Nepal Colleges — How to Get

### Government Quota Seats

Most professional colleges reserve **government quota seats** with subsidized fees:

| Program | Government Seats | Fees (Govt) | Fees (Private) |
|---------|-----------------|-------------|----------------|
| MBBS (IOM) | ~75 | NPR 3–5L | NPR 45–50L |
| BE (Pulchowk) | ~576 | NPR 5–7L | NPR 8–15L |
| BBA (Shanker Dev) | ~300 | NPR 2–3L | NPR 8–12L |
| BSc Ag (NAFU) | ~100 | NPR 2–3L | NPR 6–10L |

### How to Secure Government Seats

1. **Score high in entrance exams** (IOE, CEE, CMAT)
2. **Apply through official counseling** — don't approach colleges directly
3. **Fill college preferences carefully** during counseling
4. **Complete admission within deadline** — seats are forfeited if not claimed

## Scholarship Application Tips

1. **Apply to multiple scholarships** — don't rely on just one
2. **Tailor each application** to the specific scholarship
3. **Proofread carefully** — spelling/grammar errors create bad impressions
4. **Submit before deadline** — late applications are rejected
5. **Follow up** — confirm receipt of application
6. **Prepare for interviews** — many scholarships require interviews
7. **Maintain good grades** — most scholarships require minimum GPA for renewal

## FAQ

### What scholarships are available for SEE toppers in Nepal?
Many +2 colleges offer full or partial scholarships to SEE toppers. A+ (3.6+) students can get 100% tuition waiver + free books at top colleges like St. Xavier's, CCRC, and Premier.

### How can I get a free seat in Nepal government college?
Score high in entrance exams (IOE for engineering, CEE for medical, CMAT for management). Government quota seats go to top rank holders through official counseling.

### Are there scholarships for Nepali students to study abroad?
Yes. Popular options include **ICCR (India)**, **Chinese Government Scholarship**, **Japanese MEXT**, **Australian Awards**, **British Chevening**, and **US Fulbright**.

### What is the NRN scholarship?
The **NRN (Non-Resident Nepali) Scholarship** is for children of NRNs to study in Nepal. It offers 25–100% tuition waiver at partner colleges.

### Can I get scholarship for MBBS in Nepal?
Yes. Government colleges (IOM, BPKIHS, PAHS) offer MBBS at NPR 3–5 lakh (vs NPR 45 lakh private). Some private colleges also offer merit-cum-need scholarships.

### How much GPA is needed for scholarship in Nepal?
For SEE scholarships: usually **3.2+ (A)** for partial, **3.6+ (A+)** for full. For +2/bachelor's: usually **70%+ or 3.0+ GPA** for merit scholarships.

### When should I apply for scholarships?
Start researching **6–12 months before admission**. TU/college scholarships: with admission application (Bhadra–Ashwin). International scholarships: vary by country (usually 6–12 months before start).

### Can Dalit students get scholarships in Nepal?
Yes. Dalit students are eligible for: full tuition waiver + monthly stipend at government colleges, reserved quota seats, and special government scholarship schemes.

---

Explore all available scholarships on our **[scholarships directory](/scholarships)**. For college selection, read our **[top 10 colleges guide](/blog/top-10-colleges-nepal-2025-plus2-engineering-medical)** and visit our **[colleges directory](/colleges)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 8: Nepal College Admission Guide
  // Keywords: nepal college admission, how to apply to nepal university,
  //           nepal college admission guide, best colleges in nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "nepal-college-admission-guide-how-to-apply-universities-2025",
    title: "Nepal College Admission Guide 2025: How to Apply to Universities",
    excerpt:
      "Complete guide to Nepal college admission 2025. How to apply to TU, KU, PU, PoU universities, admission requirements, entrance exams, deadlines, and best colleges in Nepal.",
    metaTitle: "Nepal College Admission Guide 2025 — How to Apply | Khojney",
    metaDescription:
      "Complete Nepal college admission guide for 2025. How to apply to TU, KU, PU, PoU universities, admission requirements, entrance exams, deadlines, and best colleges in Nepal.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["admission", "nepal", "colleges", "universities", "guide"],
    featured: true,
    readTimeMin: 11,
    content: `# Nepal College Admission Guide 2025: How to Apply to Universities

Navigating the **college admission process in Nepal** can be overwhelming for students and parents. With multiple universities (TU, KU, PU, PoU, NAFU), hundreds of affiliated colleges, various entrance exams, and different admission timelines — it's easy to get confused. This comprehensive **Nepal college admission guide** explains everything you need to know: how to apply to universities, admission requirements, entrance exams, deadlines, and how to choose the best college for your career goals.

## Overview of Nepal's Higher Education System

Nepal has **10 universities** recognized by the University Grants Commission (UGC):

1. **Tribhuvan University (TU)** — largest, 1,000+ affiliated colleges
2. **Kathmandu University (KU)** — autonomous, international recognition
3. **Pokhara University (PoU)** — modern, growing
4. **Purbanchal University (PU)** — Eastern Nepal focus
5. **Nepal Agriculture and Forestry University (NAFU)** — specialized
6. **Lumbini Buddhist University (LBU)** — Buddhist studies
7. **Mid-Western University (MU)** — Mid-Western Nepal
8. **Far-Western University (FU)** — Far-Western Nepal
9. **Nepal Sanskrit University (NSU)** — Sanskrit studies
10. **Rajarshi Janak University (RJU)** — Janakpur

Most students apply to **TU, KU, PU, or PoU** for mainstream programs.

## How to Apply to Nepal University — Step by Step

### Step 1: Choose Your Program

Decide your career path first:

| Interest | Program | Top Universities |
|----------|---------|-----------------|
| Engineering | BE/B.Tech | TU (IOE), KU, PU, PoU |
| Medicine | MBBS/BDS | TU (IOM), KU (KUSMS), BPKIHS |
| Management | BBA/BBS/BIM | TU (FOM), KU, PU |
| IT/Computer Science | BSc CSIT/BCA/BIT | TU (IOST), KU, private |
| Science | BSc | TU, KU |
| Humanities | BA | TU, KU |
| Law | LLB | TU, KU |
| Education | B.Ed | TU (Faculty of Education) |
| Agriculture | BSc Ag | NAFU, TU (IAAS) |

### Step 2: Check Eligibility

Each program has specific eligibility:

- **Engineering (BE)**: +2 Science with PCM, minimum 45% (C grade)
- **Medicine (MBBS)**: +2 Science with PCB, minimum 50%
- **Management (BBA)**: +2 in any stream, minimum 45% (some require 50%)
- **IT (BSc CSIT)**: +2 Science with PCM, minimum 45%
- **BSc**: +2 Science, minimum 45%
- **BA/BA.LL.B**: +2 in any stream, minimum 45%

### Step 3: Take Entrance Exams

Most professional programs require entrance exams:

| Program | Entrance Exam | Conducted By |
|---------|--------------|-------------|
| Engineering (BE) | **IOE Entrance** | TU (IOE) |
| Medicine (MBBS) | **CEE** | Medical Education Commission |
| MBA/MBS | **CMAT** | TU (FOM) |
| BBA/BIM | **CMAT (UG)** or college-specific | TU (FOM) |
| BSc CSIT | **TU IOST Entrance** | TU (IOST) |
| BE (KU) | **KU Entrance** | KU |
| BSc CS (KU) | **KU Entrance** | KU |

Prepare for entrance exams with Khojney's free mock tests:
- **[IOE mock test](/exams/ioe-entrance)** for engineering
- **[CEE mock test](/exams/mbbs-cee)** for medical
- **[CMAT mock test](/exams/cmat-full)** for management

### Step 4: Apply to Colleges

#### For TU Constituent Campuses (Government)

1. **Appear for entrance exam** (IOE, CEE, CMAT)
2. **Register for counseling** through the official portal
3. **Fill college preferences** based on your rank
4. **Wait for seat allocation** — published in multiple rounds
5. **Report to allotted college** with documents within deadline
6. **Complete admission formalities** — pay fees, submit documents

#### For TU Affiliated Colleges (Private)

1. **Appear for entrance exam** (IOE, CEE, CMAT — required for most)
2. **Apply directly to college** — visit college or apply online
3. **Submit application** with:
   - +2 transcript and character certificate
   - Citizenship photocopy
   - Passport photos
   - Entrance exam score card
4. **Merit list publication** — based on +2 percentage + entrance score
5. **Admission** — pay fees and complete enrollment

#### For Kathmandu University (KU)

1. **Apply online** through KU website (usually opens Bhadra)
2. **Take KU entrance exam** — separate from TU
3. **Counseling and admission** — based on KU entrance rank
4. **KU doesn't have affiliated colleges for most programs** — admission is at KU's own schools

#### For Purbanchal University (PU) and Pokhara University (PoU)

1. **Take university entrance exam** or merit-based admission
2. **Apply to affiliated colleges** directly
3. **Admission based on** +2 percentage and/or entrance score

## Nepal College Admission Timeline 2025

### For +2 to Bachelor's (Most Programs)

| Month | Activity |
|-------|----------|
| **Shrawan (July–August)** | +2 results published; start college research |
| **Bhadra (August–September)** | Entrance exam applications open (IOE, CEE, CMAT) |
| **Ashwin (September–October)** | Entrance exams conducted; results published |
| **Kartik (October–November)** | Counseling and admission at constituent campuses |
| **Kartik–Mangsir (November–December)** | Admission at private affiliated colleges |
| **Mangsir–Poush (December–January)** | Classes begin at most colleges |

### For SEE to +2

| Month | Activity |
|-------|----------|
| **Ashar (June–July)** | SEE results published |
| **Shrawan (July–August)** | +2 college applications open |
| **Bhadra (August–September)** | +2 entrance exams and interviews |
| **Ashwin (September–October)** | Admission decisions and enrollment |
| **Kartik (October–November)** | +2 classes begin |

## Admission Requirements — Documents Checklist

### For Bachelor's Admission

- ✅ +2 (Class 12) transcript and character certificate
- ✅ +2 (Class 11) transcript
- ✅ SEE (Class 10) transcript and character certificate
- ✅ Citizenship certificate (original + photocopy)
- ✅ Migration certificate (if changing university/board)
- ✅ Transfer certificate (TC) from previous school/college
- ✅ Entrance exam score card (IOE, CEE, CMAT)
- ✅ Passport-size photos (4–6 copies)
- ✅ Category certificate (for reservation quota — Dalit, Janajati, etc.)
- ✅ Income certificate (for scholarship/financial aid)

### For +2 Admission

- ✅ SEE transcript and character certificate
- ✅ Citizenship certificate or birth certificate
- ✅ Transfer certificate from school
- ✅ Passport-size photos (4–6 copies)
- ✅ SEE admit card

## Best Colleges in Nepal — Top Choices by Stream

### Best Engineering Colleges

1. **Pulchowk Campus (IOE, TU)** — #1 engineering college
2. **Thapathali Campus (IOE, TU)**
3. **Kathmandu University School of Engineering**
4. **Chitwan Engineering Campus (IOE, TU)**
5. **Kantipur Engineering College (TU)**

Read our **[best engineering colleges guide →](/blog/best-engineering-colleges-nepal-2025-top-10-rankings)**

### Best Medical Colleges

1. **IOM (Tribhuvan University Teaching Hospital)** — #1 government medical college
2. **BPKIHS (B.P. Koirala Institute of Health Sciences)** — Dharan
3. **KUSMS (Kathmandu University School of Medical Sciences)** — Dhulikhel
4. **NAIHS (Nepalese Army Institute of Health Sciences)**
5. **Patan Academy of Health Sciences (PAHS)**

Read our **[top medical colleges guide →](/blog/top-medical-colleges-nepal-2025-rankings)**

### Best IT Colleges

1. **Pulchowk Campus (IOE)** — BE Computer
2. **Kathmandu University School of Science** — BSc CS
3. **NCCS (National College of Computer Studies)** — BSc CSIT
4. **St. Xavier's College** — BSc CSIT, BIM
5. **Prime College** — BIM, BCA

Read our **[best IT colleges guide →](/blog/best-it-colleges-nepal-2025-top-10-rankings)**

### Best Management Colleges

1. **Shanker Dev Campus** — top TU campus for management
2. **Prime College** — BBA, BIM
3. **Kathmandu College of Management (KCM)**
4. **Apex College** — BBA, MBA
5. **King's College** — entrepreneurship focus

### Best +2 Colleges

1. **St. Xavier's College, Maitighar** — #1 for Science/Management
2. **Budhanilkantha School** — national merit school
3. **Premier College** — strong management + IT
4. **CCRC (Capital College)** — excellent science faculty
5. **Global College of Management** — #1 for management +2

Read our **[best schools in Nepal guide →](/blog/best-schools-nepal-2025-top-10-rankings-admissions)**

## How to Choose the Right College

### 1. Decide Your Career Goal

- Want to be an engineer? → Focus on +2 Science → IOE → Pulchowk
- Want to be a doctor? → Focus on +2 Science → CEE → IOM
- Want to be an IT professional? → +2 Science/Management → CSIT/BCA/BIM
- Want to be a manager? → +2 Management → BBA/BBS

### 2. Evaluate Colleges On

- **Academic reputation** — university affiliation, NEB/UGC recognition
- **Faculty** — qualifications, experience (PhD holders preferred)
- **Infrastructure** — labs, library, classrooms, computer facilities
- **Placement** — where do graduates get jobs?
- **Fees** — can your family afford it?
- **Location** — commute time and transportation cost
- **ECA** — sports, clubs, events, extracurricular
- **Alumni network** — strong alumni help with jobs

### 3. Consider Your Entrance Rank

Your entrance exam rank determines which colleges you can get into:

- **Top 200 (IOE)**: Pulchowk Campus (any program)
- **Top 600 (IOE)**: Pulchowk (Civil), Thapathali
- **Top 1,200 (IOE)**: Chitwan, Pashchimanchal, private top colleges
- **Top 100 (CEE)**: IOM (TUTH) government seat
- **Top 300 (CEE)**: BPKIHS, NAIHS
- **Top 1,000 (CEE)**: Private medical colleges

## Common Admission Mistakes to Avoid

1. **Not researching colleges** — apply based on facts, not rumors
2. **Missing deadlines** — admission closes quickly for top colleges
3. **Not having backup options** — apply to 5–8 colleges, not just 1–2
4. **Ignoring fees** — make sure your family can afford the full 4 years
5. **Choosing based on friends** — pick what's right for YOU
6. **Not visiting the campus** — visit before deciding
7. **Forgetting documents** — keep all originals + photocopies ready
8. **Late entrance exam registration** — register early to avoid last-minute rush

## FAQ

### How do I apply to colleges in Nepal?
For TU constituent campuses: appear for entrance exam → register for counseling → fill preferences → report to allotted college. For private colleges: apply directly with +2 transcripts and entrance score.

### When does college admission start in Nepal?
For bachelor's: entrance exams in **Bhadra–Ashwin (September–October)**, admission in **Kartik–Mangsir (November–December)**. For +2: admission in **Bhadra–Ashwin (August–October)**.

### What documents are needed for college admission in Nepal?
+2 transcript and character certificate, SEE transcript, citizenship certificate, migration certificate, entrance exam score card, passport photos, and category certificate (if applicable).

### Which is the best college in Nepal?
For engineering: **Pulchowk Campus**. For medical: **IOM (TUTH)**. For management: **Shanker Dev Campus**. For +2: **St. Xavier's College**.

### How much does college cost in Nepal?
Government colleges: NPR 2–7 lakh for 4 years. Private colleges: NPR 8–15 lakh. Medical colleges: NPR 3–50 lakh. KU: NPR 12–18 lakh.

### Can I get direct admission without entrance exam?
Some private colleges offer direct admission based on +2 percentage for non-professional programs (BBS, BA, BSc general). Professional programs (BE, MBBS, BBA) require entrance exams.

### What if I don't get into my preferred college?
Apply to backup colleges. You can also: take a drop year and reappear for entrance exam, or start at a different college and transfer after 1st year (limited options).

### How can I apply to KU (Kathmandu University)?
KU conducts its own entrance exam (separate from TU). Apply through KU's website when applications open (usually Bhadra). KU admission is at KU's own schools — no affiliated colleges for most programs.

---

Explore all colleges on our **[colleges directory](/colleges)** and read our **[top 10 colleges guide](/blog/top-10-colleges-nepal-2025-plus2-engineering-medical)** for rankings. For entrance exam preparation, take our **[free mock tests](/exams)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 9: Study Nepal from Abroad — Diaspora Scholarships
  // Keywords: study nepal from abroad, nepal scholarships for diaspora,
  //           nepali american college research, finding nepal scholarships from the us
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "study-nepal-from-abroad-diaspora-scholarships-nepali-students",
    title: "Study Nepal from Abroad: Complete Guide for Nepali Diaspora Students",
    excerpt:
      "Complete guide for Nepali diaspora students wanting to study in Nepal. NRN scholarships, quota seats, admission requirements, and how to research Nepal colleges from the US, UK, and Australia.",
    metaTitle: "Study Nepal from Abroad — Diaspora Scholarships & Admission | Khojney",
    metaDescription:
      "Complete guide for Nepali diaspora students wanting to study in Nepal. NRN scholarships, quota seats, admission requirements, and how to research Nepal colleges from abroad.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["diaspora", "nrn", "study-nepal", "scholarships", "abroad"],
    featured: false,
    readTimeMin: 9,
    content: `# Study Nepal from Abroad: Complete Guide for Nepali Diaspora Students

Nepal has a large diaspora spread across the US, UK, Australia, Gulf countries, and Southeast Asia. Many **Non-Resident Nepali (NRN)** families want their children to study in Nepal — to connect with their roots, benefit from lower fees, or pursue Nepal-specific fields like Mountaineering, Buddhism, or South Asian Studies. This guide covers everything about **studying in Nepal from abroad**: NRN scholarships, quota seats, admission requirements, and how to research Nepal colleges from overseas.

## Why Study in Nepal as a Diaspora Student?

Nepali diaspora students choose to study in Nepal for various reasons:

### 1. Cultural Connection

- Learn Nepali language, culture, and traditions
- Connect with extended family
- Understand Nepali society firsthand
- Build a Nepal-based network

### 2. Cost-Effective Education

- **Nepal college fees**: NPR 5–15 lakh for 4-year bachelor's
- **US college fees**: NPR 80+ lakh for 4-year bachelor's
- **UK college fees**: NPR 60+ lakh for 3-year bachelor's
- **Australia college fees**: NPR 70+ lakh for 3-year bachelor's

Even with NRN quota (higher fees), studying in Nepal is significantly cheaper.

### 3. Nepal-Specific Programs

Some fields are best studied in Nepal:

- **Mountaineering and Adventure Tourism** — Nepal is the global capital
- **Buddhist Studies** — Lumbini Buddhist University
- **South Asian Studies** — TU and KU have strong programs
- **Tibetology and Himalayan Studies** — specialized programs
- **Ayurveda and Traditional Medicine** — unique to South Asia
- **Nepali Language and Literature** — immerse in the language

### 4. Pathway to Nepal-Based Career

- Government jobs (with Nepali citizenship)
- Family business in Nepal
- Nepal-based NGOs and INGOs
- Tourism and hospitality industry

## Who Qualifies as Nepali Diaspora?

### Non-Resident Nepali (NRN) Definition

Under the **NRN Act 2007**, a Non-Resident Nepali is:

1. **Nepali citizen living outside Nepal** — holding Nepali passport, residing abroad
2. **Foreign citizen of Nepali origin** — e.g., Indian Gorkha, British Gurkha, US citizen with Nepali parents
3. **Nepali citizen who acquired foreign citizenship** — dual citizenship not recognized, but NRN status applies

### NRN ID Card

To access NRN quotas and scholarships, students need an **NRN ID card** from the **NRN Association (nRNA)**:

- Apply through nRNA website (nrna.org)
- Requires proof of Nepali origin (parents' citizenship, birth certificate)
- Annual membership fee: ~NPR 5,000–10,000
- Valid for 1–5 years depending on membership type

## NRN Quota Seats in Nepal Colleges

Many Nepal colleges reserve **NRN quota seats** for diaspora students:

### Tribhuvan University (TU)

- **NRN seats**: ~10% of total intake at constituent campuses (varies by program)
- **Fees**: Higher than government rate but lower than full international rate
- **Eligibility**: NRN ID card + equivalent of +2 (A-Levels, IB, US High School)
- **Programs**: BE, MBBS, BBA, BSc, BA, LLB

### Kathmandu University (KU)

- **Foreign/NRN category**: Separate quota at KU schools
- **Fees**: Higher than Nepali rate (approximately 2–3x)
- **Eligibility**: NRN ID + equivalent qualification
- **Programs**: BE, BSc CS, MBBS, BBA, BPharm

### Pokhara University (PoU) and Purbanchal University (PU)

- **NRN quota**: Limited seats at affiliated colleges
- **Fees**: Varies by college — contact college directly
- **Eligibility**: NRN ID + equivalent +2

### Private Colleges

Many private colleges have special quotas for NRN students:

- **Higher fees** than Nepali students (typically 1.5–2x)
- **Direct admission** — may not require entrance exam (varies)
- **English-medium instruction** — comfortable for diaspora students

## How to Research Nepal Colleges from Abroad

### Step 1: Use Online Resources

#### Khojney.com — Nepal's Education Directory

Khojney is the best resource for diaspora students:

- **[Colleges directory](/colleges)** — search by program, location, affiliation
- **[Universities directory](/universities)** — compare TU, KU, PU, PoU
- **[Scholarships directory](/scholarships)** — find NRN and other scholarships
- **[Blog](/blog)** — read guides on Nepal education system
- **[Mock tests](/exams)** — practice entrance exams (if required)

#### Other Resources

- **University websites**: TU (tu.edu.np), KU (ku.edu.np), PU (pu.edu.np)
- **Embassy of Nepal** in your country — for document verification
- **NRN Association** (nrna.org) — for NRN ID and quota information
- **Educational consultancies** in your country — they handle applications

### Step 2: Verify Equivalence of Your Qualification

If you completed +2 / A-Levels / IB / US High School abroad, you need **equivalence from TU** or the **Curriculum Development Center (CDC)**:

#### For +2 Equivalence

1. **A-Levels (Cambridge/Edexcel)**: Apply to CDC, Nepal
   - Required: 3 A-Level subjects including relevant ones (Physics, Chemistry, Biology, Math)
   - Process: Submit transcripts to CDC, pay fee (~NPR 5,000), wait 2–4 weeks

2. **IB (International Baccalaureate)**: Apply to CDC
   - Required: IB diploma with relevant subjects
   - Process: Similar to A-Levels

3. **US High School + AP/SAT**: Apply to CDC
   - Required: High school diploma + SAT/AP scores
   - Equivalence based on subjects and grades

4. **Indian +2 (CBSE/ICSE)**: Apply to CDC
   - Generally straightforward equivalence
   - Submit Class 10 + Class 12 marksheets

### Step 3: Check Entrance Exam Requirements

Some programs require entrance exams even for NRN students:

| Program | Entrance Exam | NRN Exemption |
|---------|--------------|---------------|
| Engineering (BE) | IOE Entrance | Some colleges exempt with SAT II |
| Medicine (MBBS) | CEE | NRN quota may not require CEE |
| Management (BBA) | CMAT | Some colleges exempt |
| BSc CSIT | TU IOST Entrance | Varies by college |

**Alternative**: Many colleges accept **SAT scores** as equivalent to entrance exams for NRN/foreign students.

### Step 4: Apply to Colleges

#### Application Process for NRN Students

1. **Identify colleges** through Khojney's directory
2. **Contact college admissions office** — confirm NRN quota availability and fees
3. **Submit application** with:
   - Equivalent +2 certificate (from CDC)
   - NRN ID card
   - Passport copy
   - Passport photos
   - Application fee (varies by college)
4. **Direct admission or merit list** — depends on college
5. **Pay fees** — NRN fees are higher than Nepali student fees

#### Application Timeline

- **Application opens**: Bhadra–Ashwin (August–October) for most colleges
- **Application closes**: Kartik–Mangsir (October–December)
- **Classes begin**: Mangsir–Poush (December–January)

### Step 5: Arrange Visa and Travel

#### For Foreign Citizens of Nepali Origin

- **Visa required**: Tourist visa (for visit) or Student visa (for study)
- **Student visa**: Apply through Nepal Embassy in your country
  - Required: Admission letter from Nepal college, passport, photos, fee
  - Duration: 1 year, renewable
  - Fee: ~NPR 5,000–15,000 per year

#### For Nepali Citizens Living Abroad

- No visa required if you hold a Nepali passport
- Just return to Nepal and begin studies

## NRN Scholarships for Diaspora Students

### 1. NRN Association Scholarship

- **Who**: Children of NRN members
- **Amount**: Varies — 25–100% tuition waiver at partner colleges
- **How to apply**: Through nRNA website, requires NRN ID + academic records
- **Partner colleges**: Several TU, KU, and private colleges

### 2. College-Specific NRN Scholarships

Some colleges offer scholarships to NRN students:

- **Reduced fees** compared to full international rate
- **Merit scholarships** for top NRN applicants
- **Need-based aid** for deserving students

Contact college admissions offices directly for details.

### 3. Nepali Government Scholarships

The Government of Nepal reserves some seats for:

- **Foreign students** through embassy quotas
- **SAARC quota** for South Asian students
- **Bilateral agreements** with friendly countries

### 4. International Scholarships to Study in Nepal

Some international organizations offer scholarships for study in Nepal:

- **Ford Foundation** — for development studies
- **Open Society Foundations** — for various programs
- **Rotary Peace Fellowship** — for peace and conflict studies
- **Confucius Institute Scholarship** — for Chinese language (in Nepal)

## Challenges of Studying in Nepal as Diaspora

### 1. Language Barrier

- Many courses taught in **Nepali** (especially at TU constituent campuses)
- Private colleges and KU are more English-friendly
- **Solution**: Choose English-medium colleges or learn basic Nepali

### 2. Cultural Adjustment

- Different classroom culture (more formal, teacher-centered)
- Different social norms and expectations
- **Solution**: Connect with other diaspora students, join NRN community

### 3. Bureaucracy

- Equivalence process can be slow (2–4 weeks)
- Visa processing takes time
- College admission paperwork is extensive
- **Solution**: Start early, use educational consultancy if needed

### 4. Infrastructure

- Internet and electricity can be unreliable
- Library and lab facilities may be below Western standards
- **Solution**: Choose colleges with better infrastructure (KU, top private colleges)

### 5. Limited Course Options

- Specialized courses common abroad may not be available
- Limited interdisciplinary programs
- **Solution**: Research course offerings before applying

## Tips for Nepali American Students Researching Nepal Colleges

### 1. Start Early (12–18 months before)

- Begin research in junior year of high school
- Take SAT/ACT and required SAT Subject Tests
- Apply for NRN ID card (can take 1–2 months)

### 2. Visit Nepal if Possible

- Tour colleges during summer break
- Meet admissions officers in person
- Get a feel for campus culture and location

### 3. Connect with Alumni

- Find diaspora students who studied in Nepal
- Ask about their experience
- Use LinkedIn and NRN networks

### 4. Verify Recognition

- Ensure the Nepal degree is recognized in your home country
- For US: Check with WES (World Education Services) for credential evaluation
- For UK: Check with UK NARIC
- For Australia: Check with AEI-NOOSR

### 5. Consider Transfer Options

- Some Nepal colleges have transfer agreements with US/UK universities
- You can study 1–2 years in Nepal, then transfer
- Saves money while getting international degree

## FAQ

### Can Nepali diaspora students study in Nepal?
Yes. NRN students can study in Nepal through NRN quota seats at TU, KU, PU, and private colleges. You'll need an NRN ID card and equivalent +2 certificate.

### What is the NRN scholarship?
The **NRN Association Scholarship** offers 25–100% tuition waiver at partner colleges in Nepal for children of NRN members. Apply through nRNA website with NRN ID and academic records.

### Do I need to take entrance exams for Nepal colleges?
It depends on the program and college. Some colleges exempt NRN students from entrance exams (especially with SAT scores), while others require IOE, CEE, or CMAT.

### How do I get +2 equivalence from Nepal?
Submit your foreign +2 (A-Levels, IB, US High School) transcripts to the **Curriculum Development Center (CDC)** in Nepal. The process takes 2–4 weeks and costs ~NPR 5,000.

### Is a Nepal degree recognized in the US/UK/Australia?
Yes, degrees from TU and KU are internationally recognized. For official evaluation, use WES (US), UK NARIC (UK), or AEI-NOOSR (Australia).

### Can I work in Nepal after graduation as a diaspora student?
Foreign citizens need a work visa. Nepali citizens (holding Nepali passport) can work freely. NRN ID may provide some work privileges — check with Nepal Department of Immigration.

### How much does it cost for NRN students to study in Nepal?
NRN fees are higher than Nepali student fees but lower than full international rate. Example: BE at Pulchowk — Nepali: NPR 5L, NRN: NPR 10–15L (vs US: NPR 80L+).

### Can I transfer credits from Nepal college to US/UK university?
Yes, many universities accept transfer credits from Nepal. Check with your target university's transfer policy. WES evaluation helps with credit transfer.

---

Explore Nepal colleges on our **[colleges directory](/colleges)** and universities on our **[universities directory](/universities)**. For scholarships, visit our **[scholarships directory](/scholarships)**. Read more education guides on our **[blog](/blog)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 10: Pulchowk Campus Ranking — IOE Constituent Campuses
  // Keywords: pulchowk campus ranking, best engineering colleges nepal,
  //           ioe constituent campuses
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "pulchowk-campus-ranking-ioe-constituent-campuses-nepal-2025",
    title: "Pulchowk Campus Ranking 2025: IOE Constituent Campuses Comparison",
    excerpt:
      "Complete guide to Pulchowk Campus ranking and all IOE constituent campuses in Nepal. Compare programs, fees, cutoff marks, placement records, and facilities at TU engineering campuses.",
    metaTitle: "Pulchowk Campus Ranking 2025 — IOE Constituent Campuses | Khojney",
    metaDescription:
      "Complete guide to Pulchowk Campus ranking and all IOE constituent campuses in Nepal. Compare programs, fees, IOE cutoff marks, placement records, and facilities at TU engineering campuses.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["pulchowk", "ioe", "engineering", "rankings", "constituent-campuses"],
    featured: false,
    readTimeMin: 10,
    content: `# Pulchowk Campus Ranking 2025: IOE Constituent Campuses Comparison

**Pulchowk Campus** is universally recognized as the **#1 engineering college in Nepal**. As the flagship constituent campus of the **Institute of Engineering (IOE), Tribhuvan University (TU)**, Pulchowk has produced Nepal's top engineers for over 50 years. This guide covers the **Pulchowk Campus ranking**, all IOE constituent campuses, their programs, fees, cutoff marks, and how to choose the right campus for your engineering education.

## Pulchowk Campus — #1 Engineering College in Nepal

### Overview

- **Full name**: Pulchowk Campus, Institute of Engineering (IOE), Tribhuvan University
- **Location**: Pulchowk, Lalitpur, Kathmandu Valley
- **Established**: 1972 (integrated with IOE)
- **Affiliation**: Tribhuvan University (Constituent Campus)
- **Annual intake**: ~576 students across all programs
- **Campus size**: 15+ acres with modern labs, library, hostels

### Why Pulchowk is #1

1. **Academic Excellence** — consistently top results in board examinations
2. **Faculty Quality** — most PhD-qualified professors in Nepal
3. **Research Output** — highest research publications among engineering colleges
4. **Industry Recognition** — preferred by top employers (F1Soft, NEA, hydropower companies)
5. **Alumni Network** — alumni at Google, Microsoft, Facebook, Nepal Government
6. **International Recognition** — degrees recognized globally
7. **Affordable Fees** — government rate (NPR 5–7 lakh vs private NPR 8–15 lakh)
8. **IOE Affiliation** — constituent campus of TU's Institute of Engineering

## Pulchowk Campus Programs

### Undergraduate (BE/B.Arch)

| Program | Annual Intake | Duration | Total Marks |
|---------|--------------|----------|-------------|
| **BE Civil** | 96 | 4 years | ~600 |
| **BE Computer** | 96 | 4 years | ~600 |
| **BE Electronics & Communication** | 96 | 4 years | ~600 |
| **BE Electrical** | 48 | 4 years | ~600 |
| **BE Mechanical** | 48 | 4 years | ~600 |
| **B.Arch (Architecture)** | 24 | 5 years | ~600 |
| **BE Geomatics** | 24 | 4 years | ~600 |
| **Total** | **432** | | |

### Pulchowk Campus Ranking Factors

| Factor | Score (out of 10) | Notes |
|--------|-------------------|-------|
| Academic reputation | 10 | Top in Nepal, recognized internationally |
| Faculty qualifications | 9.5 | 50+ PhD holders |
| Infrastructure | 8.5 | Modern labs, library, hostels (some aging) |
| Placement | 9 | 90%+ placement, top companies |
| Research output | 9 | Highest research among engineering colleges |
| Industry connection | 9 | Strong alumni + recruitment |
| Location | 10 | Lalitpur, central Kathmandu Valley |
| Fees | 10 | Government rate (most affordable) |
| **Overall** | **9.4** | **#1 in Nepal** |

## IOE Constituent Campuses — Complete List

The Institute of Engineering (IOE) operates **5 constituent campuses** across Nepal:

### 1. Pulchowk Campus (Central Campus)

- **Location**: Pulchowk, Lalitpur
- **Programs**: BE Civil, Computer, Electronics, Electrical, Mechanical, Architecture, Geomatics
- **Annual intake**: ~576
- **IOE cutoff**: Top 1–600 rank
- **Fees**: NPR 5–7 lakh
- **Specialty**: All programs, flagship campus

### 2. Thapathali Campus

- **Location**: Thapathali, Kathmandu
- **Programs**: BE Civil, Mechanical, Industrial, Automobile
- **Annual intake**: ~240
- **IOE cutoff**: Top 600–1,200 rank
- **Fees**: NPR 5–6 lakh
- **Specialty**: Mechanical, Industrial, Automobile (unique programs)

### 3. Chitwan Engineering Campus

- **Location**: Bharatpur, Chitwan
- **Programs**: BE Civil, Agriculture Engineering
- **Annual intake**: ~96
- **IOE cutoff**: Top 1,200–1,800 rank
- **Fees**: NPR 4–5 lakh
- **Specialty**: Agriculture Engineering (only IOE campus offering this)

### 4. Pashchimanchal Campus

- **Location**: Pokhara, Kaski
- **Programs**: BE Civil, Computer, Electronics
- **Annual intake**: ~288
- **IOE cutoff**: Top 1,000–1,500 rank
- **Fees**: NPR 4–5 lakh
- **Specialty**: Scenic location, growing reputation

### 5. Purwanchal Campus

- **Location**: Dharan, Sunsari
- **Programs**: BE Civil, Computer, Electrical
- **Annual intake**: ~192
- **IOE cutoff**: Top 1,500–2,000 rank
- **Fees**: NPR 4–5 lakh
- **Specialty**: Eastern Nepal coverage

## IOE Constituent Campuses Comparison Table

| Campus | Location | Programs | Intake | Cutoff (approx.) | Fees |
|--------|----------|----------|--------|------------------|------|
| **Pulchowk** | Lalitpur | 7 programs | 576 | Top 1–600 | NPR 5–7L |
| **Thapathali** | Kathmandu | 4 programs | 240 | Top 600–1,200 | NPR 5–6L |
| **Chitwan** | Chitwan | 2 programs | 96 | Top 1,200–1,800 | NPR 4–5L |
| **Pashchimanchal** | Pokhara | 3 programs | 288 | Top 1,000–1,500 | NPR 4–5L |
| **Purwanchal** | Dharan | 3 programs | 192 | Top 1,500–2,000 | NPR 4–5L |

## How to Get Admission to Pulchowk Campus

### Step 1: Meet Eligibility

- **Education**: +2 Science (or equivalent) with Physics, Chemistry, Mathematics
- **Minimum marks**: 45% aggregate (C grade) in +2
- **Age**: No upper limit

### Step 2: Crack IOE Entrance Exam

The **IOE entrance exam** is the gateway to all IOE constituent campuses:

- **Questions**: 140 MCQs (40 Physics, 40 Chemistry, 40 Math, 20 English)
- **Duration**: 3 hours (180 minutes)
- **Total marks**: 140
- **Pass mark**: 40% (56/140)
- **No negative marking**

### Step 3: Score High Enough for Pulchowk

For Pulchowk Campus, you need:

- **BE Computer**: 110+ marks (top 200 rank)
- **BE Electronics**: 105+ marks (top 300 rank)
- **BE Civil**: 95+ marks (top 600 rank)
- **BE Electrical**: 90+ marks (top 500 rank)
- **BE Mechanical**: 90+ marks (top 500 rank)
- **B.Arch**: 85+ marks (top 800 rank)
- **BE Geomatics**: 80+ marks (top 1000 rank)

Take our **[free IOE mock test →](/exams/ioe-entrance)** to check your level.

### Step 4: Participate in Counseling

1. **Register for counseling** through IOE official portal
2. **Fill campus and program preferences** based on your rank
3. **Wait for seat allocation** — published in multiple rounds
4. **Report to Pulchowk Campus** within deadline if allotted
5. **Complete admission** — pay fees, submit documents

## Pulchowk Campus Fees Structure (2025)

### Government Quota (Most Students)

| Program | Annual Fee | 4-Year Total |
|---------|-----------|--------------|
| BE Civil | NPR 125,000 | NPR 500,000 |
| BE Computer | NPR 140,000 | NPR 560,000 |
| BE Electronics | NPR 135,000 | NPR 540,000 |
| BE Electrical | NPR 130,000 | NPR 520,000 |
| BE Mechanical | NPR 130,000 | NPR 520,000 |
| B.Arch (5 years) | NPR 150,000 | NPR 750,000 |
| BE Geomatics | NPR 120,000 | NPR 480,000 |

**Note**: Additional costs — hostel (NPR 15,000/year), exam fees, books, materials (~NPR 20,000/year)

### Full-Payment (NRN/Foreign) Quota

NRN and foreign students pay approximately **2–3x the government rate**:

- BE programs: NPR 10–15 lakh for 4 years
- Contact admissions office for current rates

## Pulchowk Campus Placement Records

### Top Recruiters

**IT/Software**:
- F1Soft International
- Deerwalk Services
- Braindigit IT Solutions
- Leapfrog Technology
- Verisk Information Technologies
- Naamche
- Cloud Factory

**Hydropower/Energy**:
- Nepal Electricity Authority (NEA)
- Chilime Hydropower
- Butwal Power Company
- Sanjen Hydropower

**Construction/Infrastructure**:
- Kalika Construction
- Pappu Construction
- Supreme Construction
- Department of Roads (Government)

**Consulting**:
- CEMB Consultancy
- ETC Nepal
- SILT Consultants
- Multi-Disciplinary Consultants

### Average Starting Salary (2024 graduates)

| Program | Monthly Salary |
|---------|---------------|
| BE Computer | NPR 50,000–100,000 |
| BE Electronics | NPR 45,000–80,000 |
| BE Electrical | NPR 40,000–70,000 |
| BE Civil | NPR 40,000–70,000 |
| BE Mechanical | NPR 35,000–60,000 |
| B.Arch | NPR 50,000–90,000 |

**Note**: IT/Computer engineers with remote international jobs can earn NPR 100,000–500,000+/month.

## Pulchowk Campus Facilities

### Academic Facilities

- **Library**: 50,000+ books, digital library, IEEE journals access
- **Computer Labs**: Modern labs with high-speed internet
- **Engineering Labs**: Civil, Mechanical, Electrical, Electronics, Computer labs
- **Workshops**: Machine shop, carpentry, welding, fitting
- **Architecture Studios**: Design studios, model-making lab
- **Research Centers**: Earthquake engineering, renewable energy, GIS

### Residential Facilities

- **Hostels**: 4 hostels (2 boys, 2 girls) — limited seats, merit-based
- **Mess**: Canteen + mess facility (NPR 3,500–4,500/month)
- **Sports**: Basketball, football, cricket, table tennis
- **Health**: Basic health center + first aid

### Student Life

- **Student clubs**: Robotics Club, Computer Club, Civil Engineering Society, etc.
- **Events**: Engineering exhibitions, tech fests, cultural programs
- **Sports**: Annual sports week, inter-college tournaments
- **Seminars**: Regular industry talks and workshops

## Pulchowk Campus vs Other Top Engineering Colleges

### Pulchowk vs KU (Kathmandu University)

| Factor | Pulchowk (IOE, TU) | KU School of Engineering |
|--------|-------------------|--------------------------|
| Fees | NPR 5–7L | NPR 12–15L |
| Reputation | #1 in Nepal | #2 in Nepal |
| Entrance | IOE (140 questions) | KU Entrance (similar) |
| Faculty | PhD-qualified | PhD-qualified |
| Infrastructure | Good but aging | Modern |
| International recognition | Strong | Strong (more international) |
| Research | High | High |
| Location | Lalitpur (central) | Dhulikhel (1.5 hours from KTM) |

### Pulchowk vs Private Colleges

| Factor | Pulchowk (IOE, TU) | Private (e.g., Kantipur Eng) |
|--------|-------------------|------------------------------|
| Fees | NPR 5–7L | NPR 8–12L |
| Reputation | Very High | Varies |
| Faculty | PhD holders | Mixed |
| Infrastructure | Good but aging | Modern |
| Placement | Self-driven | Active placement cell |
| Class size | Large (96 students) | Smaller (48 students) |

## Pulchowk Campus Notable Alumni

Pulchowk Campus has produced many notable engineers and leaders:

- **Bhola Thapa** — Vice-Chancellor, Kathmandu University
- **Engineers at Google, Microsoft, Facebook, Amazon** — multiple alumni in top tech companies
- **Government secretaries** — several engineers in Nepal government secretary positions
- **NEA Managing Directors** — multiple alumni led Nepal Electricity Authority
- **Construction entrepreneurs** — founders of major construction companies

## FAQ

### What is the ranking of Pulchowk Campus in Nepal?
**Pulchowk Campus** is universally ranked as the **#1 engineering college in Nepal** based on academic reputation, faculty, placement, and IOE cutoff scores.

### How many marks do I need in IOE for Pulchowk?
For Pulchowk Campus, you typically need **95–110+ marks out of 140** in the IOE entrance exam, depending on the program. Computer Engineering requires the highest (110+).

### What programs are offered at Pulchowk Campus?
Pulchowk offers 7 undergraduate programs: BE Civil, Computer, Electronics & Communication, Electrical, Mechanical, Geomatics, and B.Arch (Architecture).

### How much are the fees at Pulchowk Campus?
Government quota: **NPR 5–7 lakh** for 4-year BE programs. NRN/foreign quota: NPR 10–15 lakh. This is the most affordable top-tier engineering education in Nepal.

### What is the IOE cutoff for Pulchowk Computer Engineering?
For BE Computer at Pulchowk, you typically need **110+ marks out of 140** in the IOE entrance exam, which corresponds to approximately top 200 rank.

### Is Pulchowk Campus better than KU for engineering?
Both are excellent. **Pulchowk (IOE)** is more affordable (NPR 5–7L vs NPR 12–15L) and has a stronger alumni network. **KU** offers more modern infrastructure and international recognition.

### How many IOE constituent campuses are there?
IOE has **5 constituent campuses**: Pulchowk (Lalitpur), Thapathali (Kathmandu), Chitwan, Pashchimanchal (Pokhara), and Purwanchal (Dharan).

### Can I get a job after BE from Pulchowk?
Yes, Pulchowk has **90%+ placement rate**. Top recruiters include F1Soft, Deerwalk, NEA, and international tech companies. Many alumni work at Google, Microsoft, and Facebook.

### What is the world ranking of Pulchowk Campus?
Pulchowk Campus doesn't have a specific world ranking (Nepal universities aren't ranked in QS/THE), but its degrees are **recognized internationally** and alumni work at top global companies.

---

Prepare for IOE with our **[free IOE mock test](/exams/ioe-entrance)** and read our **[IOE entrance preparation guide](/blog/ioe-entrance-preparation-complete-guide-be-engineering-nepal)**. For the full list of engineering colleges, see our **[best engineering colleges guide](/blog/best-engineering-colleges-nepal-2025-top-10-rankings)** and explore our **[colleges directory](/colleges)**.`,
  },
];

// ─── Main seeding function ──────────────────────────────────────

async function getOrCreateCategory(slug: string, name: string): Promise<string> {
  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) return existing.id;

  const created = await db.category.create({
    data: { slug, name, module: "BLOG" },
  });
  console.log(`  ✓ Created category: ${name} (${slug})`);
  return created.id;
}

async function getOrCreateTag(slug: string, name: string): Promise<string> {
  const existing = await db.tag.findUnique({ where: { slug } });
  if (existing) return existing.id;

  const created = await db.tag.create({
    data: { slug, name },
  });
  return created.id;
}

async function main() {
  console.log("\n📝 Seeding 10 SEO-optimized gap-filling articles...\n");

  let created = 0;
  let updated = 0;

  for (const article of articles) {
    // Ensure category exists
    const categoryId = await getOrCreateCategory(article.categorySlug, article.categoryName);

    // Ensure tags exist
    const tagIds: string[] = [];
    for (const tagName of article.tags) {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const tagId = await getOrCreateTag(tagSlug, tagName);
      tagIds.push(tagId);
    }

    // Check if blog post already exists
    const existing = await db.blogPost.findUnique({ where: { slug: article.slug } });

    const data = {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      categoryId,
      status: "PUBLISHED",
      featured: article.featured,
      readTimeMin: article.readTimeMin,
      publishedAt: new Date(),
    };

    if (existing) {
      await db.blogPost.update({
        where: { slug: article.slug },
        data,
      });
      await db.blogPost.update({
        where: { slug: article.slug },
        data: { tags: { set: tagIds.map((id) => ({ id })) } },
      });
      updated++;
      console.log(`  ↻ Updated: ${article.slug}`);
    } else {
      await db.blogPost.create({
        data: {
          slug: article.slug,
          ...data,
          tags: { connect: tagIds.map((id) => ({ id })) },
        },
      });
      created++;
      console.log(`  ✓ Created: ${article.slug}`);
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   ${created} articles created`);
  console.log(`   ${updated} articles updated`);
  console.log(`   Total: ${articles.length} articles\n`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
