/**
 * ranking-seed.ts — 15 SEO-optimized articles for khojney.com
 *
 * Targets the highest-opportunity keywords from Google Search Console data,
 * focusing on queries with high impressions but low/zero clicks (biggest
 * ranking gaps). Each article:
 *   - Is 2000–5000 characters of rich, original content
 *   - Targets a primary + 5–15 secondary keywords
 *   - Includes internal links to relevant exams, colleges, and other articles
 *   - Has a FAQ section for FAQ schema
 *   - Includes proper H2/H3 structure for featured snippets
 *
 * Keyword targeting strategy (based on GSC data):
 *   Article 1:  IOE Mock Test (1,082 imp, 292 clicks — keep ranking)
 *   Article 2:  CMAT Mock Test (822 imp, 77 clicks — improve CTR)
 *   Article 3:  CEE Mock Test Free (408 imp, 45 clicks — improve CTR)
 *   Article 4:  MBBS Mock Test (186 imp, 112 clicks — expand)
 *   Article 5:  Best Engineering Colleges (1,459 imp, 13 clicks — HUGE gap)
 *   Article 6:  Best IT Colleges in Nepal (1,256 imp, 1 click — HUGE gap)
 *   Article 7:  Loksewa Mock Test (258 imp free prep — grow)
 *   Article 8:  Driving License Written Test (190+ imp scooter — grow)
 *   Article 9:  Driving License Mock Test (428 imp driving test — grow)
 *   Article 10: IOE Entrance Preparation (77+ imp — expand long-tail)
 *   Article 11: Top 10 Colleges in Nepal (133+ imp — broad)
 *   Article 12: Best Schools in Nepal (187 imp — grow)
 *   Article 13: Top Medical Colleges (48+ imp — expand)
 *   Article 14: Top Universities in Nepal (24+ imp — expand)
 *   Article 15: Engineering in Nepal (751 imp eng college — HUGE gap)
 *
 * Run: `bun run scripts/ranking-seed.ts`
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
  // ARTICLE 1: IOE Mock Test
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ioe-mock-test-free-online-complete-guide",
    title: "IOE Mock Test Free Online: Complete Guide to IOE Entrance Preparation 2025",
    excerpt:
      "Practice free IOE mock tests online with real exam patterns. Complete guide to IOE entrance preparation with syllabus, tips, and instant scoring.",
    metaTitle: "IOE Mock Test Free Online 2025 — Instant Scoring | Khojney",
    metaDescription:
      "Take free IOE mock tests online with real exam patterns. Complete IOE entrance preparation guide with syllabus, tips, and instant scoring. Start practicing now.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["ioe", "mock-test", "engineering", "entrance", "nepal"],
    featured: true,
    readTimeMin: 8,
    content: `# IOE Mock Test Free Online: Complete Guide to IOE Entrance Preparation

The **Institute of Engineering (IOE) entrance exam** is the most competitive engineering entrance in Nepal, conducted by Tribhuvan University (TU). Every year, over 15,000 students compete for approximately 1,800 seats across TU-affiliated engineering colleges. Taking regular **IOE mock tests** is the single most effective way to boost your score and secure admission to top colleges like Pulchowk Campus, Thapathali Campus, and Chitwan Engineering Campus.

## Why Take IOE Mock Tests?

Mock tests simulate the real exam environment, helping you:

- **Master time management** — the IOE exam has 140 questions in 3 hours (about 77 seconds per question)
- **Identify weak areas** — pinpoint subjects where you lose the most marks
- **Build exam temperament** — reduce anxiety by practicing under timed conditions
- **Track progress** — measure improvement over weeks of preparation
- **Learn question patterns** — IOE repeats question structures year after year

## IOE Exam Pattern 2025

The IOE entrance exam consists of **140 multiple-choice questions** worth 140 total marks, to be completed in **3 hours**. The passing mark is typically 40% (56 marks). The subject breakdown is:

| Subject | Questions | Marks |
|---------|-----------|-------|
| Physics | 40 | 40 |
| Chemistry | 40 | 40 |
| Mathematics | 40 | 40 |
| English | 20 | 20 |
| **Total** | **140** | **140** |

## Free IOE Mock Test on Khojney

Khojney offers **free IOE mock tests** with instant scoring and detailed explanations. Our mock tests feature:

- Real IOE exam pattern with shuffled questions and options
- Instant scoring with subject-wise breakdown
- Detailed explanations for every question
- Rank comparison with other students
- Unlimited attempts — practice as many times as you want

👉 **[Start your free IOE mock test now →](/exams/ioe-entrance)**

## IOE Entrance Preparation Strategy

### 1. Master the Syllabus

The IOE syllabus is based on the NEB Class 11–12 curriculum. Focus on:

- **Physics**: Mechanics, Electricity & Magnetism, Optics, Modern Physics
- **Chemistry**: Physical Chemistry, Organic Chemistry, Inorganic Chemistry
- **Mathematics**: Algebra, Calculus, Coordinate Geometry, Trigonometry, Vectors
- **English**: Grammar, Vocabulary, Comprehension

### 2. Practice Daily

Take at least **one mock test per day** in the final 2 months before the exam. Consistency matters more than intensity — 2 hours daily for 60 days beats 12 hours daily for 10 days.

### 3. Analyze Every Mock Test

After each mock test, spend 30 minutes reviewing:

- Which questions you got wrong and why
- Which questions took too long to solve
- Which subjects you're strongest/weakest in

### 4. Focus on High-Weightage Topics

In Physics, **Mechanics** and **Electricity** account for ~60% of questions. In Math, **Calculus** and **Algebra** are heavily weighted. Prioritize these.

## Best Engineering Colleges Under IOE

Your IOE score determines which college you get into. Top choices include:

- **Pulchowk Campus** — the #1 engineering college in Nepal
- **Thapathali Campus** — strong in civil and mechanical engineering
- **Chitwan Engineering Campus** — growing reputation
- **Pashchimanchal Campus** (Pokhara) — scenic location, good facilities

Read our complete guide to **[best engineering colleges in Nepal](/blog/best-engineering-colleges-nepal-2080)** for rankings, fees, and admission details.

## IOE Preparation Tips from Toppers

1. **Start early** — 6 months of preparation is ideal
2. **Use reference books** — HC Verma for Physics, Morrison & Boyd for Chemistry
3. **Join a preparation institute** — Namuna, VIBRANT, or PEA are popular
4. **Solve past 10 years' papers** — IOE repeats question patterns
5. **Take weekly full-length mock tests** — track your progress systematically

## Common Mistakes to Avoid

- **Skipping English** — 20 easy marks that many students lose
- **Not managing time** — spending 5+ minutes on a single question
- **Ignoring negative marking** — there's no negative marking, so never leave a question blank
- **Cramming the night before** — rest is critical for exam performance

## FAQ

### Is the IOE mock test on Khojney free?
Yes, all mock tests on Khojney are 100% free. You can take unlimited attempts with instant scoring.

### How many questions are in the IOE entrance exam?
The IOE exam has 140 MCQs — 40 Physics, 40 Chemistry, 40 Math, and 20 English — to be completed in 3 hours.

### What is the passing mark for IOE?
The passing mark is 40% (56 out of 140). However, to get into Pulchowk Campus, you typically need 100+ marks.

### Can I give the IOE exam in Nepali?
No, the IOE entrance exam is conducted entirely in English.

### How do I register for the IOE entrance exam?
Registration opens in Bhadra–Ashoj (September–October) each year. Visit the IOE official website or your nearest campus to apply.

---

Start your **[free IOE mock test](/exams/ioe-entrance)** today and track your progress toward becoming an engineer. For more exam tips, explore our **[blog](/blog)** and **[complete exam guide](/exams)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 2: CMAT Mock Test
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "cmat-mock-test-nepal-free-preparation-guide",
    title: "CMAT Mock Test Nepal: Free CMAT Preparation Guide & Practice Tests 2025",
    excerpt:
      "Free CMAT mock tests for Nepal students. Complete CMAT preparation guide with syllabus, question pattern, tips, and online practice tests with instant scoring.",
    metaTitle: "CMAT Mock Test Nepal Free 2025 — Practice Online | Khojney",
    metaDescription:
      "Take free CMAT mock tests online in Nepal. Complete CMAT preparation guide with syllabus, question pattern, tips, and instant scoring. Start practicing today.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["cmat", "mock-test", "management", "mba", "nepal"],
    featured: true,
    readTimeMin: 7,
    content: `# CMAT Mock Test Nepal: Free CMAT Preparation Guide & Practice Tests

The **Central Management Admission Test (CMAT)** is the entrance exam for MBA and MBS programs at Tribhuvan University (TU) and its affiliated colleges in Nepal. Conducted by the Faculty of Management (FOM), CMAT is mandatory for admission to all TU-affiliated management colleges. Taking regular **CMAT mock tests** is essential for scoring well and securing a seat at top management colleges like Shanker Dev Campus, Prime College, or Kathmandu College of Management.

## CMAT Exam Pattern 2025

The CMAT exam consists of **100 multiple-choice questions** worth 100 marks, to be completed in **90 minutes**. The four sections are:

| Section | Questions | Marks |
|---------|-----------|-------|
| Verbal Ability | 25 | 25 |
| Quantitative Aptitude | 25 | 25 |
| Logical Reasoning | 25 | 25 |
| General Awareness | 25 | 25 |
| **Total** | **100** | **100** |

There is **no negative marking** in CMAT, so you should attempt every question.

## Free CMAT Mock Test Online

Khojney provides **free CMAT mock tests** that match the real exam pattern. Features include:

- 100 questions across all 4 sections, timed exactly like the real exam
- Instant scoring with section-wise breakdown
- Detailed explanations for every question
- Shuffled questions and options for realistic practice
- Rank comparison with other CMAT aspirants

👉 **[Start your free CMAT mock test →](/exams/cmat-full)**

## CMAT Syllabus Breakdown

### Verbal Ability (25 Questions)

This section tests your English proficiency:

- Reading comprehension passages
- Vocabulary (synonyms, antonyms, analogies)
- Grammar (sentence correction, fill in the blanks)
- Para jumbles and sentence rearrangement

**Tips**: Read English newspapers (The Kathmandu Post, Republica) daily. Practice 20 vocabulary words per day.

### Quantitative Aptitude (25 Questions)

Tests your mathematical ability:

- Arithmetic (percentages, profit & loss, time & work, ratios)
- Algebra (equations, inequalities, progressions)
- Geometry and mensuration
- Data interpretation (tables, charts, graphs)

**Tips**: Memorize multiplication tables up to 30, squares up to 30, cubes up to 20. Practice mental math daily.

### Logical Reasoning (25 Questions)

Tests analytical and logical thinking:

- Series completion (number, letter, figure)
- Coding-decoding
- Blood relations
- Direction sense
- Syllogisms
- Puzzles and seating arrangements

**Tips**: This is the most scoring section. Practice 50+ reasoning questions daily from RS Aggarwal's "A Modern Approach to Verbal & Non-Verbal Reasoning."

### General Awareness (25 Questions)

Tests knowledge of current affairs and static GK:

- Nepali current affairs (politics, economy, sports)
- International current affairs
- Business and economics
- History, geography, and science

**Tips**: Read Nepali news portals daily. Follow business news. Review Nepal's budget, monetary policy, and economic survey.

## CMAT Preparation Strategy (8-Week Plan)

### Week 1–2: Foundation
- Learn the syllabus and exam pattern
- Take a diagnostic mock test to assess your starting level
- Begin daily vocabulary and current affairs prep

### Week 3–4: Concept Building
- Study each section systematically using reference books
- Practice 50 questions per section daily
- Take 2 mock tests per week

### Week 5–6: Intensive Practice
- Take 3–4 mock tests per week
- Analyze every mock test for 30 minutes
- Focus on weak sections

### Week 7–8: Mock Test Marathon
- Take 1 full-length mock test daily
- Revise all formulas and vocabulary
- Stay calm and confident

## Best Management Colleges Under CMAT

Your CMAT score determines which college you get into:

- **Shanker Dev Campus** — top-ranked TU campus for management
- **Prime College** — known for BBA and MBA programs
- **Kathmandu College of Management (KCM)** — industry connections
- **Apex College** — strong MBA program
- **King's College** — entrepreneurship focus

## CMAT vs Other MBA Entrance Exams

| Exam | Conducted By | Duration | Questions |
|------|-------------|----------|-----------|
| CMAT | TU FOM | 90 min | 100 |
| KUUMAT | Kathmandu University | 90 min | 100 |
| SOMAT | Purbanchal University | 90 min | 100 |

## FAQ

### Is CMAT mock test free on Khojney?
Yes, all CMAT mock tests on Khojney are completely free with unlimited attempts.

### What is the pass mark for CMAT?
There is no formal pass mark, but you need at least 40+ to get into a decent college and 60+ for top colleges.

### How many times can I take CMAT?
CMAT is conducted once per year, typically in Bhadra–Ashwin (September–October).

### Can I give CMAT after +2?
No, CMAT is for postgraduate admission (MBA/MBS). You need a bachelor's degree to be eligible. For undergraduate management programs, check **[CMAT undergraduate programs](/exams/cmat-parent)**.

### What is the full form of CMAT?
CMAT stands for **Central Management Admission Test**, conducted by TU's Faculty of Management.

---

Ready to start? Take our **[free CMAT mock test](/exams/cmat-full)** now and see where you stand. For more management exam resources, explore our **[complete exam directory](/exams)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 3: CEE Mock Test Free
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "cee-mock-test-free-online-nepal-mbbs-entrance",
    title: "CEE Mock Test Free Online: Complete MBBS Entrance Preparation Guide Nepal",
    excerpt:
      "Free CEE mock tests for MBBS entrance in Nepal. Practice Common Entrance Examination (CEE) online with real exam pattern, instant scoring, and detailed explanations.",
    metaTitle: "CEE Mock Test Free Online Nepal 2025 — MBBS Entrance | Khojney",
    metaDescription:
      "Take free CEE mock tests online for MBBS entrance in Nepal. Complete Common Entrance Examination preparation guide with syllabus, tips, and instant scoring.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["cee", "mbbs", "mock-test", "medical", "nepal"],
    featured: true,
    readTimeMin: 8,
    content: `# CEE Mock Test Free Online: Complete MBBS Entrance Preparation Guide

The **Common Entrance Examination (CEE)** is the entrance exam for MBBS and BDS programs in Nepal, conducted by the Medical Education Commission (MEC). Over 18,000 students compete for approximately 2,200 MBBS seats across Nepal's medical colleges. Taking regular **CEE mock tests** is crucial for scoring well and securing a seat in government medical colleges like IOM (Teaching Hospital), BPKIHS, or NAIHS.

## CEE Exam Pattern 2025

The CEE exam consists of **200 multiple-choice questions** worth 200 marks, to be completed in **3 hours**. The subject breakdown is:

| Subject | Questions | Marks |
|---------|-----------|-------|
| Physics | 50 | 50 |
| Chemistry | 50 | 50 |
| Botany | 50 | 50 |
| Zoology | 50 | 50 |
| **Total** | **200** | **200** |

Each correct answer awards 1 mark. There is **no negative marking**. The pass mark is 50% (100/200) for MBBS and 40% (80/200) for BDS.

## Free CEE Mock Test on Khojney

Khojney offers **free CEE mock tests** designed to match the real exam pattern:

- 200 questions across Physics, Chemistry, Botany, and Zoology
- 3-hour timer matching the actual CEE exam
- Instant scoring with subject-wise breakdown
- Detailed explanations for every question
- Shuffled questions and options for realistic practice

👉 **[Start your free CEE mock test →](/exams/mbbs-cee)**

## CEE Syllabus Breakdown

### Physics (50 Questions)

Key topics include:

- Mechanics (kinematics, Newton's laws, work-energy, rotational motion)
- Thermodynamics
- Optics (geometrical and wave optics)
- Electrostatics and current electricity
- Magnetism and electromagnetic induction
- Modern physics (atomic, nuclear, quantum)

**Weightage**: Mechanics ~30%, Electricity & Magnetism ~25%, Optics ~15%

### Chemistry (50 Questions)

Covers:

- **Physical Chemistry**: atomic structure, chemical bonding, thermodynamics, equilibrium, electrochemistry
- **Organic Chemistry**: hydrocarbons, functional groups, biomolecules
- **Inorganic Chemistry**: periodic table, coordination compounds, qualitative analysis

**Weightage**: Physical ~35%, Organic ~30%, Inorganic ~35%

### Botany (50 Questions)

Key areas:

- Plant anatomy and physiology
- Genetics and evolution
- Ecology and environment
- Plant diversity (algae, fungi, bryophytes, pteridophytes, gymnosperms, angiosperms)
- Biotechnology

### Zoology (50 Questions)

Key areas:

- Human physiology (digestion, respiration, circulation, excretion, nervous, endocrine)
- Animal diversity (invertebrates and vertebrates)
- Genetics and evolution
- Human health and disease
- Reproductive biology

## CEE Preparation Strategy

### 1. Start 8–10 Months Before the Exam

The CEE syllabus is vast. Give yourself enough time to cover everything thoroughly. Most successful candidates start preparing right after their +2 final exams.

### 2. Use the Right Reference Books

- **Physics**: HC Verma + Concepts of Physics by Resnick Halliday
- **Chemistry**: NCERT Chemistry (Class 11–12) + Morrison & Boyd
- **Botany**: NCERT Biology + Ganguly's Botany
- **Zoology**: NCERT Biology + Jordan & Verma

### 3. Take Weekly Mock Tests

- Start with subject-wise mock tests in months 1–3
- Switch to full-length (200-question) mock tests in months 4+
- Analyze every mock test for at least 30 minutes

### 4. Focus on High-Yield Topics

In Botany/Zoology, **Genetics** and **Human Physiology** account for ~30% of questions. In Physics, **Mechanics** and **Electricity** are heavily weighted.

## Top Medical Colleges in Nepal

Your CEE score determines which medical college you get into:

- **IOM (Tribhuvan University Teaching Hospital)** — #1 government medical college
- **BPKIHS (B.P. Koirala Institute of Health Sciences)** — Dharan, autonomous
- **NAIHS (Nepalese Army Institute of Health Sciences)** — military-affiliated
- **Patan Academy of Health Sciences** — growing reputation
- **KUSMS (Kathmandu University School of Medical Sciences)** — Dhulikhel

Read our guide to **[top medical colleges in Nepal](/blog/top-medical-colleges-nepal)** for fees, admission requirements, and rankings.

## CEE Preparation Institutes

Popular preparation institutes in Nepal:

- **VIBRANT** — strong for Physics and Chemistry
- **Namuna** — known for Biology
- **PEA** — good for all subjects
- **Entrance Nepal** — online + offline options
- **Lalitpur Medical Entrance** — focused on Biology

## Common CEE Mistakes to Avoid

1. **Ignoring Botany** — many students focus only on Zoology and lose 50 easy marks
2. **Not managing time** — 200 questions in 180 minutes means ~54 seconds per question
3. **Skipping current syllabus topics** — CEE follows the NEB +2 syllabus closely
4. **Not taking enough mock tests** — aim for at least 30 full-length mocks before the exam

## FAQ

### Is the CEE mock test free on Khojney?
Yes, all CEE mock tests on Khojney are completely free with unlimited attempts and instant scoring.

### How many questions are in the CEE exam?
The CEE has 200 MCQs — 50 Physics, 50 Chemistry, 50 Botany, 50 Zoology — to be completed in 3 hours.

### What is the pass mark for CEE MBBS?
The pass mark is 50% (100/200) for MBBS. For BDS, it's 40% (80/200).

### Is there negative marking in CEE?
No, there is no negative marking in CEE. You should attempt every question.

### How can I get into IOM (Tribhuvan University Teaching Hospital)?
You need a top CEE score (typically 150+/200) to secure a government seat at IOM. Take our **[free CEE mock test](/exams/mbbs-cee)** to gauge your level.

### Can I give CEE after +2 Science?
Yes, CEE is open to +2 Science graduates (or equivalent) with Biology, Physics, and Chemistry as main subjects.

---

Start your **[free CEE mock test](/exams/mbbs-cee)** today and track your progress toward becoming a doctor. For more medical exam resources, read our **[complete MBBS entrance guide](/blog/mbbs-entrance-cee-complete-guide-nepal)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 4: MBBS Mock Test
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "mbbs-mock-test-nepal-free-online-practice",
    title: "MBBS Mock Test Nepal: Free Online Practice for Medical Entrance 2025",
    excerpt:
      "Free MBBS mock tests for Nepal medical entrance exams. Practice CEE, IOM, BPKIHS entrance patterns online with instant scoring and detailed solutions.",
    metaTitle: "MBBS Mock Test Nepal Free Online 2025 — CEE Practice | Khojney",
    metaDescription:
      "Take free MBBS mock tests online in Nepal. Practice CEE, IOM, and BPKIHS medical entrance exam patterns with instant scoring and detailed explanations.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["mbbs", "mock-test", "medical", "cee", "nepal"],
    featured: false,
    readTimeMin: 7,
    content: `# MBBS Mock Test Nepal: Free Online Practice for Medical Entrance

Becoming a doctor is one of the most prestigious career paths in Nepal. The journey begins with cracking the **MBBS entrance exam** — primarily the CEE (Common Entrance Examination) conducted by the Medical Education Commission. With over 18,000 aspirants competing for ~2,200 MBBS seats, regular **MBBS mock test practice** is non-negotiable for success.

## Why MBBS Mock Tests Matter

The CEE exam is not just about knowledge — it's about speed, accuracy, and stamina. You need to answer **200 questions in 3 hours**, which means roughly 54 seconds per question. Without mock test practice, even the most knowledgeable students struggle to finish on time.

Mock tests help you:

- **Build exam stamina** — sitting for 3 hours of intense concentration requires practice
- **Improve speed** — learn shortcuts and quick-solving techniques
- **Reduce silly mistakes** — train your brain to read questions carefully
- **Track improvement** — quantify your progress over weeks

## Free MBBS Mock Test on Khojney

Our platform offers **free MBBS mock tests** that match the official CEE pattern:

- 200 MCQs: 50 Physics, 50 Chemistry, 50 Botany, 50 Zoology
- 3-hour timer with automatic submission
- Instant scoring with subject-wise analysis
- Detailed explanations for every question
- Rank prediction based on historical data

👉 **[Start your free MBBS mock test →](/exams/mbbs-cee)**

## MBBS Entrance Exams in Nepal

While CEE is the primary exam, several institutions conduct their own entrance tests:

### 1. CEE (Common Entrance Examination)
- Conducted by: Medical Education Commission (MEC)
- For: All government and most private medical colleges
- Pattern: 200 MCQs, 3 hours, no negative marking
- Take **[free CEE mock test →](/exams/mbbs-cee)**

### 2. IOM Entrance (Historical)
- IOM previously conducted separate exams; now merged into CEE
- Still referred to colloquially as "IOM entrance"
- Read our **[complete CEE guide →](/blog/cee-mock-test-free-online-nepal-mbbs-entrance)**

### 3. BPKIHS Entrance
- B.P. Koirala Institute of Health Sciences (Dharan)
- Autonomous institution with its own admission process
- Now participates in CEE but may have additional criteria

### 4. KUSMS Entrance
- Kathmandu University School of Medical Sciences (Dhulikhel)
- Conducts its own entrance exam alongside CEE participation

### 5. NAIHS Entrance
- Nepalese Army Institute of Health Sciences
- Separate entrance exam + interview for military-affiliated medical college

## Subject-Wise Preparation Tips

### Physics (50 Marks)

Physics is often the make-or-break subject for medical aspirants. Focus on:

- **Mechanics** (~30% of questions): kinematics, laws of motion, work-energy, rotational motion
- **Electricity & Magnetism** (~25%): current electricity, magnetic effects, electromagnetic induction
- **Optics** (~15%): reflection, refraction, lenses, optical instruments
- **Modern Physics** (~10%): atomic structure, nuclear physics, semiconductors

**Pro tip**: Solve numerical problems daily. Physics in CEE is 60% conceptual and 40% numerical.

### Chemistry (50 Marks)

Chemistry is highly scoring if you prepare well:

- **Physical Chemistry** (35%): focus on calculations — mole concept, stoichiometry, equilibrium, electrochemistry
- **Organic Chemistry** (30%): master reaction mechanisms, named reactions, functional group interconversions
- **Inorganic Chemistry** (35%): periodic table trends, coordination compounds, qualitative analysis

### Botany (50 Marks)

Often neglected but equally important:

- **Plant Physiology** (~20%): photosynthesis, respiration, plant growth
- **Genetics** (~15%): Mendelian genetics, molecular genetics
- **Plant Diversity** (~15%): classification of algae through angiosperms
- **Ecology** (~10%): ecosystems, biodiversity

### Zoology (50 Marks)

The most scoring subject for most students:

- **Human Physiology** (~30%): digestion, circulation, respiration, excretion, nervous system, endocrine
- **Animal Diversity** (~15%): invertebrate and vertebrate classification
- **Genetics & Evolution** (~10%): human genetics, evolutionary theory
- **Reproductive Health** (~10%): human reproduction, reproductive health

## MBBS Admission Process in Nepal

1. **Complete +2 Science** (or equivalent) with Biology, Physics, Chemistry, and English
2. **Register for CEE** — applications open around Shrawan–Bhadra (July–August)
3. **Appear for CEE** — exam typically held in Bhadra–Ashwin (September–October)
4. **Counseling and seat allocation** — based on CEE rank
5. **Admission** — complete college formalities and begin your MBBS journey

## MBBS Fees in Nepal

| College Type | Total Fees (Approx.) |
|-------------|---------------------|
| Government (IOM, BPKIHS, PAHS) | NPR 3–5 lakh |
| Private (KUSMS, NMC, MCOMS) | NPR 40–50 lakh |
| NAIHS (Army) | NPR 20–30 lakh |

Read our guide to **[medical scholarships in Nepal](/scholarships)** to reduce your financial burden.

## FAQ

### Is the MBBS mock test free on Khojney?
Yes, all MBBS/CEE mock tests on Khojney are 100% free with unlimited attempts.

### How many marks do I need for MBBS in Nepal?
You need at least 100/200 (50%) to pass CEE for MBBS. For government seats at IOM, aim for 150+.

### What is the duration of MBBS in Nepal?
MBBS is a 5.5-year program (4.5 years academic + 1 year internship).

### Can I study MBBS in Nepal after +2 from India?
Yes, Nepali and Indian +2 Science graduates (with Biology, Physics, Chemistry) are eligible for CEE.

### Which is the best medical college in Nepal?
IOM (Tribhuvan University Teaching Hospital) is the #1 government medical college. Among private colleges, KUSMS, NMC, and MCOMS are highly regarded.

---

Ready to test your preparation? Take our **[free MBBS mock test](/exams/mbbs-cee)** now and see your predicted rank. Explore our **[complete medical exam resources](/exams/medical-entrance-parent)** for more practice.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 5: Best Engineering Colleges in Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "best-engineering-colleges-nepal-2025-top-10-rankings",
    title: "Best Engineering Colleges in Nepal 2025: Top 10 Rankings, Fees & Admissions",
    excerpt:
      "Complete guide to the best engineering colleges in Nepal 2025. Top 10 rankings, fees, admission requirements, IOE cutoff, and courses offered at TU, KU, PU colleges.",
    metaTitle: "Best Engineering Colleges in Nepal 2025 — Top 10 Rankings | Khojney",
    metaDescription:
      "Discover the best engineering colleges in Nepal 2025. Top 10 rankings with fees, admission requirements, IOE cutoff, courses, and campus facilities. Compare and choose.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["engineering", "colleges", "nepal", "rankings", "admission"],
    featured: true,
    readTimeMin: 10,
    content: `# Best Engineering Colleges in Nepal 2025: Top 10 Rankings, Fees & Admissions

Choosing the right engineering college is one of the most important decisions for any student in Nepal. With over 60 engineering colleges affiliated to Tribhuvan University (TU), Kathmandu University (KU), Purbanchal University (PU), and Pokhara University (PoU), finding the **best engineering college in Nepal** can be overwhelming. This comprehensive guide ranks the top 10 engineering colleges based on academic reputation, placement records, faculty quality, infrastructure, and IOE cutoff trends.

## How We Ranked These Colleges

Our rankings consider:

- **Academic reputation** — university affiliation, NAAC/QAA accreditation
- **IOE cutoff trends** — historical admission scores
- **Placement records** — percentage of graduates employed within 6 months
- **Faculty qualifications** — PhD holders, industry experience
- **Infrastructure** — labs, libraries, hostels, workshops
- **Industry connections** — internships, campus recruitment

## Top 10 Engineering Colleges in Nepal 2025

### 1. Pulchowk Campus (IOE, TU)

**The undisputed #1 engineering college in Nepal.**

- **Location**: Lalitpur, Kathmandu Valley
- **Affiliation**: Tribhuvan University (Institute of Engineering)
- **Programs**: BE Civil, BE Computer, BE Electronics, BE Electrical, BE Mechanical, BE Architecture, BE Geomatics
- **Annual intake**: ~576 students
- **IOE cutoff**: Top 1–600 rank (varies by program; Computer/Electronics require top 200)
- **Fees**: ~NPR 5–7 lakh for 4 years
- **Why choose**: Best faculty, excellent placement, strong alumni network, government affiliation

### 2. Thapathali Campus (IOE, TU)

- **Location**: Thapathali, Kathmandu
- **Affiliation**: Tribhuvan University (IOE)
- **Programs**: BE Civil, BE Mechanical, BE Industrial, BE Automobile
- **IOE cutoff**: Top 600–1,200 rank
- **Fees**: ~NPR 5–6 lakh
- **Why choose**: Strong in mechanical and industrial engineering, good industry tie-ups

### 3. Chitwan Engineering Campus (IOE, TU)

- **Location**: Bharatpur, Chitwan
- **Affiliation**: TU (IOE)
- **Programs**: BE Civil, BE Agriculture
- **IOE cutoff**: Top 1,200–1,800 rank
- **Fees**: ~NPR 4–5 lakh
- **Why choose**: Peaceful environment, growing reputation, affordable

### 4. Kantipur Engineering College (TU Affiliated)

- **Location**: Dhapakhel, Lalitpur
- **Affiliation**: TU (private)
- **Programs**: BE Civil, BE Computer, BE Electronics
- **Fees**: ~NPR 8–12 lakh
- **Why choose**: Good infrastructure, strong placement cell

### 5. Kathmandu University (KU), School of Engineering

- **Location**: Dhulikhel, Kavre
- **Affiliation**: Kathmandu University (autonomous)
- **Programs**: BE Computer, BE Civil, BE Electrical, BE Mechanical, BE Geomatics
- **Entrance**: KU entrance exam (separate from IOE)
- **Fees**: ~NPR 12–15 lakh
- **Why choose**: International recognition, research focus, excellent faculty

### 6. Advanced College of Engineering (TU Affiliated)

- **Location**: Baneshwor, Kathmandu
- **Programs**: BE Civil, BE Computer
- **Fees**: ~NPR 8–10 lakh
- **Why choose**: Central location, good teaching quality

### 7. Nepal Engineering College (NEC) (PU Affiliated)

- **Location**: Changunarayan, Bhaktapur
- **Affiliation**: Purbanchal University
- **Programs**: BE Civil, BE Computer, BE Electronics, BE Electrical
- **Fees**: ~NPR 7–9 lakh
- **Why choose**: Spacious campus, experienced faculty

### 8. Pashchimanchal Campus (IOE, TU)

- **Location**: Pokhara
- **Affiliation**: TU (IOE)
- **Programs**: BE Civil, BE Computer, BE Electronics
- **IOE cutoff**: Top 1,000–1,500 rank
- **Fees**: ~NPR 4–5 lakh
- **Why choose**: Scenic location, government affiliation, affordable

### 9. Khwopa College of Engineering (TU Affiliated)

- **Location**: Libali, Bhaktapur
- **Affiliation**: TU (private)
- **Programs**: BE Civil, BE Computer, BE Architecture
- **Fees**: ~NPR 7–9 lakh
- **Why choose**: Bhaktapur location, disciplined environment

### 10. Cosmos College of Management and Technology (PU Affiliated)

- **Location**: Tutepani, Lalitpur
- **Affiliation**: Purbanchal University
- **Programs**: BE Computer, BE Civil, BE Electronics
- **Fees**: ~NPR 7–9 lakh
- **Why choose**: Focus on practical skills, IT industry connections

## How to Get Admission to Top Engineering Colleges

### Step 1: Pass +2 Science (or equivalent)

You need +2 Science (or A-Levels / IB) with Physics, Chemistry, and Mathematics as compulsory subjects. Minimum 45% aggregate (C grade) is typically required.

### Step 2: Crack the IOE Entrance Exam

The IOE entrance exam has 140 MCQs (40 Physics, 40 Chemistry, 40 Math, 20 English) in 3 hours. To get into Pulchowk Campus, you need to rank in the top 200–600.

👉 **[Take a free IOE mock test →](/exams/ioe-entrance)** to check your level.

### Step 3: Participate in Counseling

Based on your IOE rank, you'll be called for counseling where you can choose your college and program. Higher rank = more choices.

## Engineering Specializations in Demand (2025)

| Specialization | Job Demand | Starting Salary |
|---------------|-----------|-----------------|
| Computer Engineering | Very High | NPR 40K–80K/month |
| Civil Engineering | High | NPR 35K–60K/month |
| Electronics & Communication | High | NPR 35K–55K/month |
| Electrical Engineering | Medium-High | NPR 35K–55K/month |
| Mechanical Engineering | Medium | NPR 30K–50K/month |
| Architecture | Growing | NPR 40K–70K/month |

## Private vs Government Engineering Colleges

| Factor | Government (IOE) | Private |
|--------|------------------|---------|
| Fees | NPR 5–7 lakh | NPR 8–15 lakh |
| Faculty | PhD-qualified | Mixed |
| Infrastructure | Good but aging | Modern |
| Placement | Self-driven | Active placement cell |
| Reputation | Very High | Varies by college |

## FAQ

### Which is the best engineering college in Nepal?
**Pulchowk Campus (IOE, TU)** is universally ranked as the #1 engineering college in Nepal based on reputation, placement, and cutoff scores.

### How many marks do I need in IOE for Pulchowk?
You typically need 100+ out of 140 in the IOE entrance exam to secure a seat at Pulchowk Campus. For Computer Engineering, aim for 110+.

### Which is better: TU or KU for engineering?
Both are excellent. TU (IOE) is more affordable and has a stronger alumni network. KU offers a more modern curriculum and international recognition.

### What is the fees for engineering in Nepal?
Government colleges (IOE): NPR 5–7 lakh for 4 years. Private colleges: NPR 8–15 lakh. KU: NPR 12–15 lakh.

### Can I get scholarship for engineering in Nepal?
Yes. Many colleges offer merit scholarships based on IOE rank. Government quotas also provide free/ subsidized seats for marginalized communities.

---

Compare all engineering colleges on our **[colleges page](/colleges)** and prepare for IOE with our **[free mock tests](/exams/ioe-entrance)**. For more details on the admission process, read our **[IOE entrance preparation guide](/blog/ioe-mock-test-free-online-complete-guide)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 6: Best IT Colleges in Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "best-it-colleges-nepal-2025-top-10-rankings",
    title: "Best IT Colleges in Nepal 2025: Top 10 IT College Rankings & Admissions",
    excerpt:
      "Complete guide to the best IT colleges in Nepal 2025. Top 10 rankings for BSc CSIT, BCA, BIM, BIT programs with fees, admission requirements, and placement records.",
    metaTitle: "Best IT Colleges in Nepal 2025 — Top 10 Rankings & Fees | Khojney",
    metaDescription:
      "Discover the best IT colleges in Nepal 2025. Top 10 rankings for BSc CSIT, BCA, BIM, BIT programs with fees, admission requirements, placements, and campus details.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["it", "colleges", "nepal", "csit", "bca", "bim"],
    featured: true,
    readTimeMin: 10,
    content: `# Best IT Colleges in Nepal 2025: Top 10 IT College Rankings & Admissions

Information Technology (IT) is the fastest-growing career field in Nepal, with thousands of job openings every year in software development, data science, cybersecurity, and cloud computing. Choosing the **best IT college in Nepal** is the first step toward a successful tech career. This guide ranks the top 10 IT colleges based on placement records, curriculum quality, faculty, infrastructure, and industry connections.

## Popular IT Programs in Nepal

Before choosing a college, understand the IT programs available:

| Program | Full Form | Duration | Affiliation | Focus |
|---------|-----------|----------|-------------|-------|
| BSc CSIT | Bachelor of Science in Computer Science & IT | 4 years | TU | Software + Hardware + Theory |
| BCA | Bachelor of Computer Applications | 4 years | TU/Faculty of Humanities | Software development |
| BIM | Bachelor of Information Management | 4 years | TU (FOM) | IT + Management |
| BIT | Bachelor of Information Technology | 4 years | KU/PU/PoU | Practical IT skills |
| BE Computer | Bachelor of Computer Engineering | 4 years | TU (IOE) | Hardware + Software engineering |
| BSc CS | Bachelor of Science in Computer Science | 4 years | KU | Theoretical CS |

## Top 10 IT Colleges in Nepal 2025

### 1. Institute of Engineering (IOE), Pulchowk Campus

**Best for BE Computer Engineering**

- **Location**: Lalitpur
- **Program**: BE Computer Engineering
- **Entrance**: IOE entrance exam (top 200 rank needed)
- **Fees**: NPR 5–7 lakh
- **Placement**: 95%+ placed in top tech companies
- **Why choose**: Best reputation, strong alumni at Google, Microsoft, Facebook

### 2. Kathmandu University (KU), School of Science

**Best for BSc CS and BE Computer**

- **Location**: Dhulikhel, Kavre
- **Programs**: BSc CS, BE Computer
- **Entrance**: KU entrance exam
- **Fees**: NPR 12–15 lakh
- **Placement**: 90%+ placement rate
- **Why choose**: International recognition, research opportunities

### 3. National College of Computer Studies (NCCS)

**Best for BSc CSIT (TU)**

- **Location**: Putalisadak, Kathmandu
- **Program**: BSc CSIT
- **Entrance**: TU IOST entrance
- **Fees**: NPR 6–8 lakh
- **Placement**: 85%+ placed
- **Why choose**: Central location, experienced faculty, good lab facilities

### 4. St. Xavier's College

**Best for BSc CSIT and BIM**

- **Location**: Maitighar, Kathmandu
- **Programs**: BSc CSIT, BIM
- **Entrance**: TU entrance + college interview
- **Fees**: NPR 8–10 lakh
- **Placement**: 90%+ placement
- **Why choose**: Jesuit education tradition, strong discipline, excellent reputation

### 5. Prime College

**Best for BIM and BCA**

- **Location**: Khusibun, Nayabazar, Kathmandu
- **Programs**: BIM, BCA, BBS
- **Entrance**: CMAT (for BIM) + college criteria
- **Fees**: NPR 6–8 lakh
- **Placement**: 80%+ placement
- **Why choose**: Strong management+IT combination, active ECA

### 6. Herald College Kathmandu

**Best for BSc IT (International Degree)**

- **Location**: Naxal, Kathmandu
- **Program**: BSc IT (affiliated to University of Wolverhampton, UK)
- **Fees**: NPR 10–12 lakh
- **Placement**: 85%+ placement, international opportunities
- **Why choose**: UK degree at Nepal cost, direct pathway to UK master's

### 7. Islington College

**Best for BIT (International Degree)**

- **Location**: Kamaladi, Kathmandu
- **Program**: BIT (affiliated to London Metropolitan University, UK)
- **Fees**: NPR 10–14 lakh
- **Placement**: 85%+ placement
- **Why choose**: UK degree, modern curriculum, industry-focused

### 8. Deerwalk Institute of Technology

**Best for BSc CSIT with Industry Focus**

- **Location**: Sifal, Kathmandu
- **Program**: BSc CSIT (TU)
- **Fees**: NPR 7–9 lakh
- **Placement**: 90%+ placement (Deerwalk Services guaranteed internship)
- **Why choose**: Direct industry exposure through Deerwalk Services

### 9. Kathmandu College of Technology (KCT)

**Best for BE Computer (PU Affiliated)**

- **Location**: Kalanki, Kathmandu
- **Programs**: BE Computer, BSc CSIT
- **Fees**: NPR 7–9 lakh
- **Placement**: 75%+ placement
- **Why choose**: Affordable, good infrastructure

### 10. Kantipur City College (KCC)

**Best for BCA and BIM**

- **Location**: Putalisadak, Kathmandu
- **Programs**: BCA, BIM, BSc CSIT
- **Fees**: NPR 5–7 lakh
- **Placement**: 70%+ placement
- **Why choose**: Central location, affordable fees

## How to Choose the Right IT College

### 1. Decide Your Program First

- **Want software engineering?** → BE Computer (IOE) or BSc CSIT
- **Want IT + management?** → BIM
- **Want pure software development?** → BCA
- **Want international degree?** → BSc IT (Herald) or BIT (Islington)

### 2. Consider the Entrance Exam

- **IOE entrance** (for BE Computer at Pulchowk) — most competitive
- **CMAT** (for BIM at TU-affiliated colleges)
- **TU IOST entrance** (for BSc CSIT)
- **College-specific entrance** (for BCA, BIT at private colleges)

### 3. Evaluate Placement Records

Ask colleges for:
- Percentage of students placed in the last 3 years
- Average and median salary
- Top recruiting companies
- Internship opportunities

### 4. Check Infrastructure

- Computer labs with latest hardware
- High-speed internet
- Library with IT books and journals
- Project labs and maker spaces

## IT Career Opportunities in Nepal

The IT sector in Nepal is booming, with starting salaries ranging from NPR 30K–80K/month:

| Role | Starting Salary | Experience Needed |
|------|----------------|-------------------|
| Junior Software Developer | NPR 30K–50K | 0–1 year |
| Frontend Developer | NPR 35K–60K | 0–2 years |
| Backend Developer | NPR 40K–70K | 1–3 years |
| Full Stack Developer | NPR 50K–80K | 2–4 years |
| Data Analyst | NPR 40K–60K | 1–3 years |
| DevOps Engineer | NPR 50K–80K | 2–4 years |
| Mobile App Developer | NPR 40K–70K | 1–3 years |

Top IT companies hiring in Nepal: **F1Soft, Deerwalk, Braindigit, Yomari, Locus, Verisk, Leapfrog, Cedar Gate, Naamche, Cloud Factory**

## FAQ

### Which is the best IT college in Nepal?
**Pulchowk Campus (IOE)** is the best for BE Computer Engineering. For BSc CSIT, **NCCS** and **St. Xavier's** are top choices. For international degrees, **Herald** and **Islington** are excellent.

### Which is better: BSc CSIT or BE Computer?
BE Computer is more engineering-focused (hardware + software, 4-year engineering degree). BSc CSIT is more application-focused (software + IT, 4-year science degree). Both are good — choose based on your interest.

### What is the fees for BSc CSIT in Nepal?
Government colleges: NPR 4–6 lakh. Private colleges: NPR 6–10 lakh. International degree programs: NPR 10–15 lakh.

### Is BCA better than BSc CSIT?
Both are good. BCA is more software-development focused and shorter (3 years at some colleges). BSc CSIT is more comprehensive (4 years, includes hardware + theory).

### Can I get a job after BSc CSIT in Nepal?
Yes, IT is the most employable field in Nepal. With good skills and projects, you can earn NPR 40K–60K/month starting salary.

### Which IT college has the best placement in Nepal?
**Pulchowk Campus** and **KU School of Science** have the highest placement rates (90%+). Among private colleges, **Deerwalk Institute** and **Herald College** have strong placement records.

---

Compare all IT colleges on our **[colleges page](/colleges)** and filter by IT programs. For engineering entrance prep, check our **[free IOE mock tests](/exams/ioe-entrance)**. Read more education guides on our **[blog](/blog)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 7: Loksewa Mock Test
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "loksewa-mock-test-nepal-free-preparation-guide",
    title: "Loksewa Mock Test Nepal: Free Loksewa Aayog Preparation Guide 2025",
    excerpt:
      "Free Loksewa mock tests for Nepal. Complete Loksewa Aayog (PSC) preparation guide with syllabus, age limit, exam pattern, tips, and online practice tests.",
    metaTitle: "Loksewa Mock Test Nepal Free 2025 — PSC Preparation | Khojney",
    metaDescription:
      "Take free Loksewa mock tests online. Complete Loksewa Aayog (PSC) preparation guide with syllabus, age limit, exam pattern, tips, and practice tests.",
    categoryName: "Exam Tips",
    categorySlug: "blog-exam-tips",
    tags: ["loksewa", "psc", "mock-test", "nepal", "government"],
    featured: true,
    readTimeMin: 9,
    content: `# Loksewa Mock Test Nepal: Free Loksewa Aayog Preparation Guide

The **Loksewa Aayog** (Public Service Commission — PSC) conducts competitive exams for government jobs in Nepal. From Kharidar to Officer (Gazetted Third Class), thousands of Nepali youth aspire to secure a government position through Loksewa. Regular **Loksewa mock test practice** is the key to cracking these highly competitive exams.

## What is Loksewa Aayog?

The **Lok Sewa Aayog** (लोक सेवा आयोग) is the constitutional body responsible for recruiting civil servants in Nepal. Established under Article 242 of the Constitution of Nepal, it conducts examinations for:

- **Kharidar** (Non-gazetted Second Class)
- **Nasuw (Nasu)** (Non-gazetted First Class)
- **Officer (Adhritti — Gazetted Third Class)**
- **Gazetted Second Class** (Sahayak Sachib / Deputy Secretary)
- **Gazetted First Class** (Sachib / Secretary — promotion-based)

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

## Free Loksewa Mock Test on Khojney

Khojney offers **free Loksewa mock tests** for all levels:

- Kharidar, Nasu, and Officer level practice tests
- Real exam pattern with timed sections
- Instant scoring with detailed explanations
- Subject-wise performance analysis
- Shuffled questions for realistic practice

👉 **[Start your free Loksewa mock test →](/exams/loksewa-kharidar)**

## Loksewa Syllabus Breakdown

### General Knowledge (सामान्य ज्ञान)

This is common to all Loksewa exams:

- **Nepal's history** — ancient, medieval, modern
- **Geography of Nepal** — physical, economic, social
- **Constitution of Nepal** (2072) — fundamental rights, structure of government
- **Current affairs** — national and international (last 6 months)
- **Sports, awards, and honors**
- **United Nations and international organizations**
- **Nepali politics and governance**

### Intelligence Test (बुद्धि परीक्षण)

- **Series completion** — number, letter, figure series
- **Coding-decoding**
- **Blood relations**
- **Direction sense**
- **Syllogisms**
- **Puzzles**
- **Analogies**

### Subject-Specific Papers

Depends on the position you're applying for:
- **Administration (प्रशासन)**: Public administration, management, governance
- **Accounting (लेखा)**: Financial accounting, auditing, budgeting
- **Engineering (इन्जिनियरिङ)**: Civil, mechanical, electrical (based on specialty)
- **Computer (कम्प्युटर)**: Programming, databases, networking
- **Health (स्वास्थ्य)**: Public health, nursing, pharmacy

## Loksewa Eligibility & Age Limit

### Educational Qualification

| Position | Minimum Education |
|----------|------------------|
| Kharidar | SEE (SLC) pass |
| Nasu | +2 (or equivalent) pass |
| Officer (Gazetted 3rd) | Bachelor's degree |
| Sahayak Sachib (Gazetted 2nd) | Master's degree (usually) |

### Age Limit for Loksewa

| Category | Age Limit |
|----------|-----------|
| General (Male) | 21–35 years |
| General (Female) | 21–40 years |
| Dalit/Disabled | 21–40 years |
| Existing government employees | 21–45 years |

### Can We Give Loksewa Exam in English?

**Yes!** Loksewa exams can be taken in either **Nepali or English**. You choose your preferred language when filling out the application form. The question paper will be in your chosen language (or bilingual for some subjects).

## Loksewa Preparation Strategy

### 1. Know the Syllabus Thoroughly

Download the official syllabus from the PSC website (pscnepal.gov.np). The syllabus is detailed — read it multiple times.

### 2. Read Standard Reference Books

- **General Knowledge**: Nepal Parichaya, Mero Loksewa Magazine
- **Constitution**: Constitution of Nepal 2072 (official text)
- **Intelligence Test**: RS Aggarwal's reasoning book
- **Current Affairs**: Read The Kathmandu Post, Gorkhapatra daily

### 3. Take Weekly Mock Tests

- Start with subject-wise mock tests
- Gradually move to full-length mock tests
- Analyze every mock test for weak areas
- Aim for at least 20 mock tests before the real exam

### 4. Join a Loksewa Preparation Class

Popular institutes:
- **Loksewa Tayari Kendra**
- **Nepal Loksewa Aayog Preparation Center**
- **Easy Loksewa**
- Online: **Khojney's free mock tests** + YouTube channels

### 5. Stay Updated on Current Affairs

- Read one national newspaper daily (Gorkhapatra or The Kathmandu Post)
- Watch news bulletins
- Follow Nepal government's official announcements
- Review the national budget and monetary policy

## Loksewa Pass Mark

| Level | Pass Mark |
|-------|-----------|
| Kharidar (written) | 40% of total |
| Nasu (written) | 40% of total |
| Officer (written) | 40% per paper |
| Interview | Must pass to be considered |

Note: Just passing isn't enough — you need to score high enough to be in the merit list for the available vacancies.

## FAQ

### Is the Loksewa mock test free on Khojney?
Yes, all Loksewa mock tests on Khojney are completely free with unlimited attempts.

### What is the age limit for Loksewa in Nepal?
For general (male): 21–35 years. For women, Dalits, and disabled: 21–40 years. For existing government employees: 21–45 years.

### Can we give Loksewa exam in English?
Yes, Loksewa exams can be taken in either Nepali or English. Choose your preferred language when applying.

### What is the pass mark for Loksewa?
The pass mark is 40% of total marks for written exams. However, you need to score much higher to be in the merit list.

### How can I prepare for Loksewa for free?
Use Khojney's **[free Loksewa mock tests](/exams/loksewa-kharidar)**, read Gorkhapatra daily, watch YouTube preparation channels, and download the official syllabus.

### What is the qualification for Kharidar?
SEE (SLC) pass is the minimum qualification for Kharidar.

### How many times can I take Loksewa exam?
There's no limit on attempts, as long as you meet the age criteria.

### What is Loksewa Aayog called in English?
Loksewa Aayog is called the **Public Service Commission (PSC)** in English.

---

Start preparing for your government career with our **[free Loksewa mock tests](/exams/loksewa-kharidar)**. For more resources, explore our **[complete Loksewa exam guide](/blog/loksewa-aayog-exam-complete-guide-2080)** and **[all available mock tests](/exams/loksewa-psc)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 8: Driving License Written Test Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "driving-license-written-test-nepal-scooter-complete-guide",
    title: "Driving License Written Test Nepal: Complete Scooter License Guide 2025",
    excerpt:
      "Complete guide to the driving license written test in Nepal for scooter. Exam questions, pass marks, trial rules, age limit, and free online practice tests.",
    metaTitle: "Driving License Written Test Nepal 2025 — Scooter Guide | Khojney",
    metaDescription:
      "Complete guide to Nepal's driving license written test for scooter. Exam questions, pass marks, trial rules, age limit, and free online practice tests.",
    categoryName: "Guides",
    categorySlug: "blog-guides",
    tags: ["driving-license", "scooter", "nepal", "written-test", "likhit"],
    featured: true,
    readTimeMin: 8,
    content: `# Driving License Written Test Nepal: Complete Scooter License Guide

Getting a **scooter driving license in Nepal** involves passing two tests: the **written test (Likhit exam)** and the **trial test (practical driving test)**. The written test is often underestimated, but many candidates fail it on their first attempt. This guide covers everything you need to know about the **scooter license written test in Nepal**, including exam questions, pass marks, age limits, and free practice tests.

## Scooter License Category in Nepal

In Nepal, scooters fall under **Category A** of the driving license system. The categories are:

| Category | Vehicle Type | CC Limit |
|----------|-------------|----------|
| **A** | Scooter/Motorcycle | Up to 125cc |
| **A1** | Scooter/Motorcycle (light) | Up to 125cc (auto only) |
| **B** | Car/Jeep/Van | — |
| **C** | Tempo/Auto-rickshaw | — |

For most scooter riders (Activa, Access, Ntorq, Dio, etc.), **Category A** is the right choice.

## Scooter License Age Limit in Nepal

| License Type | Minimum Age |
|-------------|-------------|
| Category A (scooter/motorcycle) | **16 years** |
| Category B (car) | 18 years |

Yes, you can get a scooter license at **16 years** in Nepal — earlier than most other countries.

## Driving License Written Test (Likhit Exam) Pattern

The written test for the scooter license is conducted by the **Department of Transport Management (DoTM)**.

### Exam Details

- **Number of questions**: 15–20 MCQs (varies by office)
- **Duration**: 15–20 minutes
- **Pass mark**: **60%** (you need to get at least 9 out of 15 correct, or equivalent)
- **Language**: Available in Nepali and English
- **Format**: Computer-based or paper-based (varies by office)
- **Fee**: Included in the license application fee

### Topics Covered

The written test covers:

1. **Traffic signs and signals** (most questions)
   - Mandatory/regulatory signs (stop, no entry, speed limit)
   - Cautionary/warning signs (school ahead, sharp turn, slippery road)
   - Informatory signs (hospital, parking, fuel station)

2. **Traffic rules and regulations**
   - Speed limits in different areas
   - Right-of-way rules
   - Lane discipline
   - Overtaking rules

3. **Vehicle safety**
   - Helmet requirements (mandatory for scooters)
   - Mirror and indicator usage
   - Document requirements (license, bluebook, insurance)

4. **Road safety**
   - Pedestrian crossing rules
   - School zone rules
   - Emergency vehicle rules

## Free Driving License Mock Test

Khojney offers **free driving license mock tests** that match the real exam pattern:

- 15–20 MCQs on traffic signs, rules, and safety
- Instant scoring with detailed explanations
- Both Nepali and English language options
- Practice unlimited times

👉 **[Start your free driving license mock test →](/exams/driving-license-parent)**

## How to Apply for a Scooter License in Nepal

### Step 1: Get a Lear's License (Chalani)

1. Visit your nearest **Transport Management Office** (Yatayat Byabastha Karyalaya)
2. Bring: Citizenship photocopy, 2 passport photos, blood group certificate
3. Fill out the application form
4. Pay the fee (~NPR 500–1000)
5. Get your **Learner's License** (valid for 3 months)

### Step 2: Practice Driving

Practice scooter driving for at least 1 month with your learner's license. You must display an "L" sticker on your scooter.

### Step 3: Take the Written Test (Likhit Exam)

1. Schedule your written test at the transport office
2. Arrive 30 minutes early with your learner's license and citizenship
3. Take the 15–20 MCQ test
4. Get same-day results

### Step 4: Take the Trial Test (Practical)

After passing the written test, schedule your **trial test**:

- **Scooter trial**: Ride through a marked track (typically a figure-8 or serpentine path)
- Must complete without touching boundary markers
- Must not put your foot down during the trial

### Step 5: Get Your License

After passing both tests, your license will be printed within 1–2 weeks. Collect it from the transport office.

## Scooter Trial Test Tips

The trial test is where many candidates fail. Practice these:

1. **Figure-8 track**: Practice at an empty ground — keep your speed slow and steady
2. **Don't put your foot down**: Balance is key; practice slow-speed riding
3. **Use indicators**: Even on the trial track
4. **Stay calm**: Nervousness leads to mistakes
5. **Wear a helmet**: Mandatory — you'll be disqualified without one

## Common Written Test Questions

Here are sample questions you might encounter:

1. **What does a red octagonal sign mean?**
   - a) Speed limit
   - b) **Stop** ✓
   - c) No entry
   - d) Yield

2. **What is the speed limit in residential areas?**
   - a) 30 km/h
   - b) **40 km/h** ✓
   - c) 50 km/h
   - d) 60 km/h

3. **What is the minimum age for a scooter license?**
   - a) 15 years
   - b) **16 years** ✓
   - c) 18 years
   - d) 21 years

4. **When should you use your scooter's indicators?**
   - a) Only at night
   - b) Only on highways
   - c) **Whenever turning or changing lanes** ✓
   - d) Only when other vehicles are present

## Documents Required for License

- ✅ Citizenship certificate (original + photocopy)
- ✅ Blood group certificate (from a registered health post)
- ✅ 2 passport-size photos
- ✅ Learner's license (for written/trial test)
- ✅ Application fee receipt

## FAQ

### How many questions are in the driving license written test in Nepal?
The written test has **15–20 MCQs** (the exact number varies by transport office). You need 60% correct to pass.

### What is the pass mark for the driving written test in Nepal?
The pass mark is **60%** — typically 9 out of 15 questions correct.

### How many points are needed to pass the driving test (trial)?
The trial test is pass/fail based on whether you complete the track without touching markers or putting your foot down.

### What is the age for a scooter license in Nepal?
The minimum age for a **Category A** scooter/motorcycle license is **16 years**.

### Can I give the written test in English?
Yes, the written test is available in both **Nepali and English**. Choose your language when applying.

### How much does a scooter license cost in Nepal?
Total cost (including learner's license, written test, trial, and license printing): **NPR 1,500–3,000** depending on the office and services.

### How long is the learner's license valid?
The learner's license is valid for **3 months**. You must pass both tests within this period, or reapply.

### What happens if I fail the written test?
You can retake the written test by paying a re-examination fee (~NPR 200–500). There's no limit on attempts.

---

Practice for your scooter license exam with our **[free driving license mock test](/exams/driving-license-parent)**. For the complete license process, read our **[driving license Nepal guide](/blog/driving-license-nepal-complete-process-2080)**. For car license preparation, see our **[car driving license guide](/blog/driving-license-mock-test-nepal-car-bike-practice)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 9: Driving License Mock Test
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "driving-license-mock-test-nepal-car-bike-practice",
    title: "Driving License Mock Test Nepal: Free Online Practice for Car & Bike 2025",
    excerpt:
      "Free driving license mock tests for Nepal. Practice car, bike, and scooter license exams online with real questions, traffic signs, and instant scoring.",
    metaTitle: "Driving License Mock Test Nepal Free 2025 — Car & Bike | Khojney",
    metaDescription:
      "Take free driving license mock tests online in Nepal. Practice car, bike, and scooter license exam questions with traffic signs, rules, and instant scoring.",
    categoryName: "Guides",
    categorySlug: "blog-guides",
    tags: ["driving-license", "mock-test", "car", "bike", "nepal"],
    featured: false,
    readTimeMin: 7,
    content: `# Driving License Mock Test Nepal: Free Online Practice for Car & Bike

Whether you're applying for a **car license (Category B)** or a **bike/scooter license (Category A)** in Nepal, passing the **driving license written test** is the first hurdle. Many candidates fail not because they don't know how to drive, but because they're unprepared for the written exam's traffic signs and rules questions. This guide covers everything you need to practice with our **free driving license mock test** and pass on your first attempt.

## Why Take a Driving License Mock Test?

The written test (also called **Likhit exam**) tests your knowledge of:

- Traffic signs and signals (most questions)
- Traffic rules and regulations
- Road safety principles
- Vehicle safety requirements

A mock test helps you:

- **Familiarize yourself with question patterns** — DoTM repeats question structures
- **Memorize traffic signs** — there are 50+ signs to know
- **Build confidence** — reduce exam-day anxiety
- **Identify weak areas** — focus your study time

## Free Driving License Mock Test on Khojney

Our platform offers **free driving license mock tests** for all vehicle categories:

- **Category A** (Scooter/Motorcycle) — 15–20 MCQs
- **Category B** (Car/Jeep/Van) — 15–20 MCQs
- Real exam pattern with timed sections
- Instant scoring with detailed explanations
- Both Nepali and English language support
- Unlimited attempts

👉 **[Start your free driving license mock test →](/exams/driving-license-parent)**

## Nepal Driving License Categories

| Category | Vehicle Type | Min. Age | Common Vehicles |
|----------|-------------|----------|-----------------|
| A | Scooter/Motorcycle (≤125cc) | 16 | Activa, Ntorq, Pulsar, Apache |
| B | Car/Jeep/Van | 18 | Swift, WagonR, Nexon, Creta |
| C | Tempo/Auto-rickshaw | 18 | Tempo, auto-rickshaw |
| D | Tempo (electric) | 18 | Safa tempo |

## Written Test Details

### Exam Pattern

- **Number of questions**: 15–20 (varies by transport office)
- **Duration**: 15–20 minutes
- **Pass mark**: **60%** (e.g., 9/15 or 12/20)
- **Language**: Nepali or English
- **Format**: Computer-based or paper-based

### Question Distribution

- **Traffic signs** (40% of questions) — regulatory, warning, informatory
- **Traffic rules** (30%) — speed limits, right-of-way, lane discipline
- **Road safety** (15%) — pedestrian rules, school zones, emergency vehicles
- **Vehicle safety** (15%) — helmet, seatbelt, documents

## Essential Traffic Signs to Know

### Mandatory/Regulatory Signs (Must Obey)

- **Stop** (red octagon) — come to a complete stop
- **No Entry** — road closed to all traffic
- **Speed Limit** (number in red circle) — maximum speed
- **No Parking** — parking prohibited
- **No Overtaking** — overtaking prohibited
- **One Way** — traffic flows in one direction only

### Cautionary/Warning Signs

- **School Ahead** — slow down, watch for children
- **Sharp Turn** — reduce speed
- **Slippery Road** — drive carefully
- **Pedestrian Crossing** — watch for pedestrians
- **Hump/Bump Ahead** — slow down
- **T-Junction / Y-Junction** — intersection ahead

### Informatory Signs

- **Hospital** — medical facility ahead
- **Parking** — designated parking area
- **Fuel Station** — petrol pump ahead
- **First Aid Post** — emergency medical aid
- **Rest Area** — stop and rest facility

## How to Apply for a Driving License

### Step 1: Get a Learner's License

1. Visit your nearest **Transport Management Office**
2. Required documents:
   - Citizenship photocopy
   - Blood group certificate
   - 2 passport photos
3. Pay application fee (~NPR 500–1,000)
4. Get your **Learner's License** (valid for 3 months)

### Step 2: Practice Driving

Practice for at least 1 month with your learner's license:
- Display "L" sticker on your vehicle
- Always carry your learner's license
- Practice in different traffic conditions

### Step 3: Take the Written Test

1. Schedule your written test
2. Arrive 30 minutes early with documents
3. Take the 15–20 MCQ test
4. Get same-day results

### Step 4: Take the Trial Test (Practical)

After passing the written test:
- **Scooter/Bike**: Ride through a figure-8 or serpentine track
- **Car**: Drive through a marked course, including parking and reverse

### Step 5: Receive Your License

Your license will be printed within 1–2 weeks. Collect it from the transport office.

## Nepal Driving License Test Rules (2025 Update)

Recent changes to Nepal's driving license rules include:

- **Computer-based testing** being rolled out in major offices (Kathmandu, Pokhara, Chitwan)
- **Stricter trial test evaluation** — more cameras and observers
- **Online scheduling** available for written tests
- **Photo capture** at the test center for verification
- **Same-day written test results** in most offices

## Car Driving Test Rules

If you're applying for a **Category B (car) license**, additional trial test rules:

- Must demonstrate: parallel parking, reverse parking, hill start, U-turn
- Must use: seatbelt, indicators, rearview mirrors
- Must not: stall the engine, hit any markers, cross lane lines

## Tips to Pass on Your First Attempt

1. **Memorize traffic signs** — use our mock test daily for 1 week
2. **Read the driver's handbook** — available at transport offices
3. **Practice driving in traffic** — not just empty roads
4. **Arrive early** — reduce stress on test day
5. **Bring all documents** — citizenship, learner's license, photos
6. **Stay calm during the trial** — slow and steady wins

## FAQ

### Is the driving license mock test free on Khojney?
Yes, all driving license mock tests on Khojney are 100% free with unlimited attempts.

### How many questions are in the Nepal driving license written test?
The written test has **15–20 MCQs** depending on the transport office. You need 60% correct to pass.

### What is the pass mark for the driving written test in Nepal?
The pass mark is **60%** — typically 9 out of 15 or 12 out of 20 questions correct.

### Can I take the driving test in English?
Yes, the written test is available in **both Nepali and English**. Choose your language when applying.

### How much does a driving license cost in Nepal?
Total cost including learner's license, written test, trial, and license printing: **NPR 1,500–3,000** depending on the category and office.

### What happens if I fail the trial test?
You can retake the trial test after paying a re-examination fee (~NPR 300–500). Some offices require you to wait 1–2 weeks before retaking.

### Can I drive a car with a bike license?
No, **Category A (scooter/bike) license** does not allow you to drive a car. You need a separate **Category B (car) license**.

---

Ready to practice? Take our **[free driving license mock test](/exams/driving-license-parent)** now and pass your written exam on the first try. For the complete scooter license guide, read our **[scooter license written test guide](/blog/driving-license-written-test-nepal-scooter-complete-guide)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 10: IOE Entrance Preparation
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ioe-entrance-preparation-complete-guide-be-engineering-nepal",
    title: "IOE Entrance Preparation: Complete Guide to BE Engineering Exam 2025",
    excerpt:
      "Complete IOE entrance preparation guide for BE engineering in Nepal. Syllabus, best books, preparation institutes, study plan, and free online mock tests.",
    metaTitle: "IOE Entrance Preparation 2025 — Complete BE Guide | Khojney",
    metaDescription:
      "Complete IOE entrance preparation guide for BE engineering in Nepal. Syllabus, best books, preparation institutes, 6-month study plan, and free online mock tests.",
    categoryName: "Guides",
    categorySlug: "blog-guides",
    tags: ["ioe", "entrance", "engineering", "preparation", "nepal"],
    featured: false,
    readTimeMin: 9,
    content: `# IOE Entrance Preparation: Complete Guide to BE Engineering Exam

The **Institute of Engineering (IOE) entrance exam** is the gateway to engineering education in Nepal. Conducted by Tribhuvan University's IOE, it's the most competitive engineering entrance in the country — over 15,000 candidates compete for ~1,800 seats across TU-affiliated engineering colleges. This comprehensive **IOE entrance preparation guide** covers everything from syllabus and books to study plans and mock tests.

## IOE Entrance Exam Overview

| Detail | Information |
|--------|-------------|
| Conducted by | Institute of Engineering (IOE), TU |
| Frequency | Once per year (Bhadra–Ashwin) |
| Eligibility | +2 Science (or equivalent) with PCM |
| Exam pattern | 140 MCQs, 3 hours, 140 marks |
| Pass mark | 40% (56 marks) |
| Negative marking | None |
| Sections | Physics (40), Chemistry (40), Math (40), English (20) |

## IOE Syllabus Breakdown

### Physics (40 Questions)

The Physics section is the most scoring for well-prepared students:

**Mechanics (~30%)**
- Kinematics and dynamics
- Newton's laws of motion
- Work, energy, and power
- Rotational motion
- Gravitation
- Fluid mechanics

**Electricity & Magnetism (~25%)**
- Electrostatics (Coulomb's law, electric field, potential)
- Current electricity (Ohm's law, circuits)
- Magnetic effects of current
- Electromagnetic induction
- AC circuits

**Optics (~15%)**
- Reflection and refraction
- Lenses and mirrors
- Interference and diffraction
- Optical instruments

**Modern Physics (~10%)**
- Atomic structure
- Nuclear physics
- Semiconductors and diodes
- Photoelectric effect

**Thermodynamics & Waves (~20%)**
- Heat and temperature
- Laws of thermodynamics
- Wave motion
- Sound waves

### Chemistry (40 Questions)

**Physical Chemistry (~35%)**
- Atomic structure
- Chemical bonding
- Thermodynamics
- Chemical equilibrium
- Electrochemistry
- Mole concept and stoichiometry

**Organic Chemistry (~30%)**
- Hydrocarbons (alkanes, alkenes, alkynes)
- Functional groups (alcohols, aldehydes, ketones, acids)
- Reaction mechanisms
- Biomolecules
- Polymers

**Inorganic Chemistry (~35%)**
- Periodic table and periodicity
- s-block and p-block elements
- d-block and f-block elements
- Coordination compounds
- Qualitative analysis

### Mathematics (40 Questions)

Math is the highest-weightage section and often the differentiator:

**Algebra (~25%)**
- Quadratic equations
- Sequences and series
- Complex numbers
- Permutations and combinations
- Binomial theorem
- Matrices and determinants

**Calculus (~30%)**
- Limits and continuity
- Differentiation
- Application of derivatives
- Integration
- Application of integration
- Differential equations

**Coordinate Geometry (~15%)**
- Straight lines
- Circles
- Conic sections (parabola, ellipse, hyperbola)

**Trigonometry (~15%)**
- Trigonometric ratios and identities
- Inverse trigonometric functions
- Properties of triangles

**Vectors and 3D Geometry (~15%)**
- Vector algebra
- Scalar and vector products
- Lines and planes in 3D

### English (20 Questions)

Often underestimated but crucial:

- Grammar (tenses, articles, prepositions, voice)
- Vocabulary (synonyms, antonyms)
- Sentence correction
- Reading comprehension
- Para jumbles

## Best Books for IOE Preparation

### Physics
- **HC Verma** — Concepts of Physics (Vol 1 & 2) — best conceptual book
- **Resnick, Halliday, Walker** — for deeper understanding
- **IE Irodov** — for advanced problem-solving (optional)
- **NEB Physics textbook** — for syllabus coverage

### Chemistry
- **NCERT Chemistry** (Class 11–12) — foundation
- **Morrison & Boyd** — Organic Chemistry reference
- **JD Lee** — Inorganic Chemistry reference
- **Peter Atkins** — Physical Chemistry reference

### Mathematics
- **RD Sharma** — comprehensive coverage
- **ML Khanna** — IIT-level problems
- **Thomas' Calculus** — for calculus
- **SL Loney** — Coordinate Geometry and Trigonometry

### English
- **Wren & Martin** — grammar
- **Word Power Made Easy** — vocabulary

## IOE Preparation Institutes in Nepal

### Top Preparation Institutes

1. **Namuna College of Engineering** — established, experienced faculty
2. **VIBRANT Educational Foundation** — strong Physics and Chemistry
3. **PEA (Professional Engineering Academy)** — good all-rounder
4. **Entrance Nepal** — online + offline options
5. **Lalitpur Engineering Entrance** — small batch sizes
6. **Sankalpa** — affordable, good results

### Online Preparation Options

- **Khojney's free IOE mock tests** — instant scoring, unlimited attempts
- **YouTube channels** — many free tutorial videos
- **IOE official website** — past question papers

## 6-Month IOE Preparation Plan

### Month 1–2: Foundation (Concept Building)

- **Physics**: Complete Mechanics + Electricity (HC Verma)
- **Chemistry**: Complete Physical Chemistry (NCERT + Atkins)
- **Math**: Complete Algebra + start Calculus (RD Sharma)
- **English**: Start daily vocabulary (20 words/day)
- **Daily time**: 6–8 hours
- **Weekly mock tests**: 1 subject-wise mock

### Month 3–4: Comprehensive Study

- **Physics**: Optics + Modern Physics + Thermodynamics
- **Chemistry**: Organic + Inorganic Chemistry
- **Math**: Calculus + Coordinate Geometry + Trigonometry
- **English**: Grammar practice + comprehension
- **Daily time**: 8–10 hours
- **Weekly mock tests**: 2 subject-wise mocks

### Month 5: Intensive Practice

- Complete all remaining topics
- Start full-length mock tests (140 questions, 3 hours)
- Analyze every mock test for 30 minutes
- Focus on weak areas
- **Daily time**: 10–12 hours
- **Weekly mock tests**: 3 full-length mocks

### Month 6: Final Revision + Mock Test Marathon

- Take **1 full-length mock test daily**
- Revise all formulas, reactions, and concepts
- Solve past 10 years' IOE question papers
- Stay healthy — sleep 7+ hours, eat well
- **Daily time**: 8–10 hours (don't burn out)

## IOE Mock Test Strategy

### Take Our Free IOE Mock Test

👉 **[Start free IOE mock test →](/exams/ioe-entrance)**

### How to Analyze Mock Tests

After every mock test, spend 30 minutes:

1. **Review wrong answers** — understand why you got them wrong
2. **Review slow answers** — which questions took >2 minutes?
3. **Track subject-wise scores** — identify weak subjects
4. **Note recurring mistakes** — are you making the same errors?
5. **Calculate time per subject** — are you spending too long on one section?

## IOE Cutoff Marks for Top Colleges

| College | Approx. Cutoff (out of 140) |
|---------|---------------------------|
| Pulchowk (Computer) | 110+ |
| Pulchawok (Electronics) | 105+ |
| Pulchowk (Civil) | 95+ |
| Thapathali (all programs) | 85+ |
| Chitwan Engineering | 75+ |
| Pashchimanchal (Pokhara) | 80+ |

## Common IOE Preparation Mistakes

1. **Ignoring English** — 20 easy marks that many lose
2. **Not taking mock tests** — knowledge without practice = failure
3. **Cramming without understanding** — IOE tests concepts, not memorization
4. **Spending too much time on one subject** — balance is key
5. **Not managing exam time** — 140 questions in 180 minutes requires strategy
6. **Skipping rest** — burnout destroys performance

## FAQ

### How do I start IOE preparation?
Start with the NEB +2 syllabus. Use HC Verma for Physics, NCERT for Chemistry, RD Sharma for Math. Take **[free IOE mock tests](/exams/ioe-entrance)** weekly to track progress.

### How many marks do I need for Pulchowk?
For Pulchowk Campus, aim for **100+ out of 140**. Computer Engineering requires 110+, Civil Engineering requires 95+.

### Which is the best IOE preparation institute?
**Namuna**, **VIBRANT**, and **PEA** are the most popular and have good track records. Choose based on location, batch size, and budget.

### Can I prepare for IOE at home?
Yes, with discipline. Use standard books (HC Verma, NCERT, RD Sharma), watch YouTube tutorials, and take **[free IOE mock tests](/exams/ioe-entrance)** regularly.

### How many hours should I study for IOE?
6–10 hours daily for 4–6 months is ideal. Quality matters more than quantity — focused study beats distracted study.

### Is IOE easier than JEE (India)?
IOE is generally considered easier than JEE Main, but harder than state-level engineering entrances in India. The syllabus is similar but the question pattern differs.

---

Start your IOE preparation with our **[free IOE mock test](/exams/ioe-entrance)** and read our **[complete IOE mock test guide](/blog/ioe-mock-test-free-online-complete-guide)** for more tips. For college selection, check our **[best engineering colleges guide](/blog/best-engineering-colleges-nepal-2025-top-10-rankings)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 11: Top 10 Colleges in Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "top-10-colleges-nepal-2025-plus2-engineering-medical",
    title: "Top 10 Colleges in Nepal 2025: Best +2, Engineering & Medical Colleges",
    excerpt:
      "Complete guide to the top 10 colleges in Nepal 2025. Best +2, engineering, medical, and management colleges with rankings, fees, admission, and courses.",
    metaTitle: "Top 10 Colleges in Nepal 2025 — Best +2, Eng & Medical | Khojney",
    metaDescription:
      "Discover the top 10 colleges in Nepal 2025. Best +2, engineering, medical, and management colleges with rankings, fees, admission requirements, and courses offered.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["colleges", "nepal", "top-10", "plus-two", "rankings"],
    featured: true,
    readTimeMin: 10,
    content: `# Top 10 Colleges in Nepal 2025: Best +2, Engineering & Medical Colleges

Nepal has over 1,500 colleges across +2, bachelor's, and master's levels, affiliated to Tribhuvan University (TU), Kathmandu University (KU), Purbanchal University (PU), Pokhara University (PoU), and the National Examinations Board (NEB). Finding the **top 10 colleges in Nepal** can be overwhelming. This guide categorizes the best colleges by level and stream so you can make an informed decision.

## Top 10 +2 Colleges in Nepal

The +2 level (Class 11–12) is the foundation for higher education. Here are the top 10 +2 colleges:

### 1. St. Xavier's College, Maitighar
- **Streams**: Science, Management, Humanities
- **Affiliation**: NEB + TU (for bachelor's)
- **Reputation**: #1 in Nepal for decades
- **Notable**: Strict discipline, excellent results, Jesuit tradition
- **Admission**: Highly competitive entrance exam

### 2. Budhanilkantha School
- **Streams**: Science, Management, Humanities
- **Affiliation**: NEB + Cambridge A-Levels
- **Reputation**: National school, government-funded, boarding
- **Notable**: Scholarship quotas for all 77 districts

### 3. St. Mary's School (for girls)
- **Streams**: Science, Management
- **Affiliation**: NEB
- **Reputation**: Top girls' school in Nepal
- **Notable**: Excellent discipline and academic results

### 4. Premier College
- **Streams**: Science, Management (+BBA, BIM)
- **Affiliation**: NEB + TU
- **Reputation**: Strong in management + IT
- **Notable**: Central location (Nayabazar), active ECA

### 5. National Integrated College
- **Streams**: Science, Management
- **Affiliation**: NEB
- **Reputation**: Good science faculty
- **Notable**: Affordable fees, Dillibazar location

### 6. Xavier Academy
- **Streams**: Science, Management
- **Affiliation**: NEB
- **Reputation**: Strong in science, small batch sizes
- **Notable**: Patan location, personalized attention

### 7. Global College of Management
- **Streams**: Management (specialized)
- **Affiliation**: NEB + TU
- **Reputation**: #1 for management +2
- **Notable**: Excellent placement in BBA/BBS

### 8. Kathmandu Model College (KMC)
- **Streams**: Science, Management
- **Affiliation**: NEB + TU
- **Reputation**: Consistent results
- **Notable**: Multiple campuses across Kathmandu

### 9. Capital College and Research Center (CCRC)
- **Streams**: Science, Management
- **Affiliation**: NEB + TU
- **Reputation**: Strong in science
- **Notable**: Baluwatar location, modern facilities

### 10. Himalayan WhiteHouse College
- **Streams**: Science, Management, Humanities
- **Affiliation**: NEB + TU
- **Reputation**: Good all-round education
- **Notable**: Khumaltar Heights campus

## Top 10 Engineering Colleges in Nepal

For BE/B.Tech programs, the top engineering colleges are:

1. **Pulchowk Campus (IOE, TU)** — #1 engineering college
2. **Thapathali Campus (IOE, TU)**
3. **Kathmandu University School of Engineering**
4. **Chitwan Engineering Campus (IOE, TU)**
5. **Kantipur Engineering College (TU)**
6. **Pashchimanchal Campus, Pokhara (IOE, TU)**
7. **Nepal Engineering College (NEC) (PU)**
8. **Advanced College of Engineering (TU)**
9. **Khwopa College of Engineering (TU)**
10. **Cosmos College of Management and Technology (PU)**

Read our complete **[best engineering colleges guide →](/blog/best-engineering-colleges-nepal-2025-top-10-rankings)** for fees, cutoff, and admission details.

## Top 10 Medical Colleges in Nepal

For MBBS/BDS programs:

1. **IOM (Tribhuvan University Teaching Hospital)** — #1 government medical college
2. **BPKIHS (B.P. Koirala Institute of Health Sciences)** — Dharan
3. **KUSMS (Kathmandu University School of Medical Sciences)** — Dhulikhel
4. **NAIHS (Nepalese Army Institute of Health Sciences)**
5. **Patan Academy of Health Sciences (PAHS)**
6. **Nepal Medical College (NMC)** — private
7. **Manipal College of Medical Sciences (MCOMS)** — Pokhara
8. **Kathmandu Medical College (KMC)**
9. **Nobel Medical College** — Biratnagar
10. **Chitwan Medical College (CMC)**

Read our complete **[top medical colleges guide →](/blog/top-medical-colleges-nepal-2025-rankings)** for admission and fee details.

## Top 10 IT Colleges in Nepal

For BSc CSIT, BCA, BIM, BIT:

1. **Pulchowk Campus (IOE)** — BE Computer
2. **Kathmandu University School of Science** — BSc CS
3. **NCCS (National College of Computer Studies)** — BSc CSIT
4. **St. Xavier's College** — BSc CSIT, BIM
5. **Prime College** — BIM, BCA
6. **Herald College Kathmandu** — BSc IT (UK degree)
7. **Islington College** — BIT (UK degree)
8. **Deerwalk Institute of Technology** — BSc CSIT
9. **Kathmandu College of Technology** — BE Computer
10. **Kantipur City College** — BCA, BIM

Read our complete **[best IT colleges guide →](/blog/best-it-colleges-nepal-2025-top-10-rankings)** for program details and fees.

## Top 10 Management Colleges in Nepal

For BBA, BBS, BIM:

1. **Shanker Dev Campus** — TU's top management campus
2. **Prime College** — BBA, BIM
3. **Kathmandu College of Management (KCM)** — industry connections
4. **Apex College** — BBA, MBA
5. **King's College** — entrepreneurship focus
6. **National College** — DAV program
7. **Uniglobe College** — BBA
8. **Tribhuvan College** — BBS
9. **Global College of Management** — strong +2 → BBS pipeline
10. **Kathmandu Don Bosco College** — BBA

## How to Choose the Right College

### Step 1: Decide Your Stream

- **Science** → Engineering, Medical, IT, Pure Sciences
- **Management** → BBA, BBS, BIM, CA
- **Humanities** → Law, Journalism, Social Work, BA

### Step 2: Consider Your Career Goals

- Want to be an engineer? → Focus on +2 Science → IOE → Pulchowk
- Want to be a doctor? → Focus on +2 Science → CEE → IOM
- Want to be an IT professional? → +2 Science/Management → CSIT/BCA/BIM
- Want to be a manager? → +2 Management → BBA/BBS

### Step 3: Evaluate Colleges On

- **Academic reputation** — NEB results, university affiliation
- **Faculty** — qualifications, experience
- **Infrastructure** — labs, library, classrooms
- **Placement** — where do graduates go?
- **Fees** — can you afford it?
- **Location** — commute time matters
- **ECA** — sports, clubs, events

## FAQ

### Which is the #1 college in Nepal?
For +2: **St. Xavier's College, Maitighar** is widely considered #1. For engineering: **Pulchowk Campus**. For medical: **IOM (TU Teaching Hospital)**.

### What are the best +2 colleges in Kathmandu?
**St. Xavier's, Budhanilkantha, Premier, CCRC, KMC, Xavier Academy** are among the best +2 colleges in Kathmandu Valley.

### Which college is best for engineering in Nepal?
**Pulchowk Campus (IOE, TU)** is universally ranked as the best engineering college in Nepal.

### Which college is best for MBBS in Nepal?
**IOM (Tribhuvan University Teaching Hospital)** is the top government medical college. Among private colleges, **KUSMS, NMC, and MCOMS** are excellent.

### How do I get into St. Xavier's College?
St. Xavier's has a highly competitive entrance exam for +2 Science. Applications open in Bhadra–Ashoj. Prepare with past papers and interview practice.

### What is the fees for +2 in top colleges?
Top +2 colleges in Kathmandu charge NPR 3–6 lakh for 2 years. Government +2 colleges are much cheaper (~NPR 30K–60K per year).

---

Explore all colleges on our **[colleges directory](/colleges)** and prepare for entrance exams with our **[free mock tests](/exams)**. For more education guides, visit our **[blog](/blog)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 12: Best Schools in Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "best-schools-nepal-2025-top-10-rankings-admissions",
    title: "Best Schools in Nepal 2025: Top 10 School Rankings & Admissions",
    excerpt:
      "Complete guide to the best schools in Nepal 2025. Top 10 school rankings for primary, secondary, and higher secondary with fees, admission, and facilities.",
    metaTitle: "Best Schools in Nepal 2025 — Top 10 Rankings & Fees | Khojney",
    metaDescription:
      "Discover the best schools in Nepal 2025. Top 10 school rankings for primary, secondary, and higher secondary with fees, admission process, and facilities.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["schools", "nepal", "best", "rankings", "admission"],
    featured: false,
    readTimeMin: 8,
    content: `# Best Schools in Nepal 2025: Top 10 School Rankings & Admissions

Choosing the right school for your child is one of the most important decisions a parent makes. Nepal has over 35,000 schools — from community (government) schools to private boarding schools and international institutions. This guide ranks the **best schools in Nepal** based on academic results, infrastructure, faculty, extracurricular activities, and overall reputation.

## Top 10 Best Schools in Nepal 2025

### 1. Budhanilkantha School
- **Location**: Budhanilkantha, Kathmandu
- **Type**: National school (government-funded, boarding)
- **Levels**: Class 5–12 (+ A-Levels)
- **Established**: 1972
- **Why it's #1**: Merit-based admission from all 77 districts, full scholarships, consistently top SEE results, Cambridge A-Levels option
- **Admission**: National entrance exam in Class 5, highly competitive

### 2. St. Xavier's School, Godavari
- **Location**: Godavari, Lalitpur
- **Type**: Private (Jesuit)
- **Levels**: Class 1–10
- **Established**: 1951
- **Why it's top**: Oldest Jesuit school in Nepal, excellent discipline, strong academic record, beautiful campus
- **Admission**: Entrance exam + interview

### 3. St. Xavier's School, Jawalakhel
- **Location**: Jawalakhel, Lalitpur
- **Type**: Private (Jesuit)
- **Levels**: Class 1–10
- **Why it's top**: Same tradition as Godavari, central location, excellent faculty
- **Admission**: Competitive entrance exam

### 4. St. Mary's School
- **Location**: Jawalakhel, Lalitpur
- **Type**: Private (Catholic, girls only)
- **Levels**: Class 1–10
- **Why it's top**: Top girls' school in Nepal, excellent discipline and academics
- **Admission**: Entrance exam + interview

### 5. Lincoln School
- **Location**: Ravi Bhawan, Kathmandu
- **Type**: International (American curriculum)
- **Levels**: Pre-K–12
- **Why it's top**: American curriculum, international accreditation, diverse student body
- **Admission**: Application + assessment, international fees apply

### 6. Kathmandu International Study Center (KISC)
- **Location**: Dhobighat, Lalitpur
- **Type**: International (Christian)
- **Levels**: Pre-K–12
- **Why it's top**: International curriculum, small class sizes, strong community
- **Admission**: Assessment + interview

### 7. Gyanodaya Bal Batika School
- **Location**: Bafal, Kathmandu
- **Type**: Private
- **Levels**: Playgroup–12
- **Why it's top**: Consistent SEE results, good infrastructure, affordable compared to international schools
- **Admission**: Entrance test

### 8. Brihaspati Vidyasadan
- **Location**: Naxal, Kathmandu
- **Type**: Private
- **Levels**: Playgroup–12
- **Why it's top**: Strong in academics and ECA, modern facilities, good placement record
- **Admission**: Entrance exam + interview

### 9. DAV School
- **Location**: Jawalakhel, Lalitpur
- **Type**: Private (Indian curriculum influence)
- **Levels**: Playgroup–12
- **Why it's top**: Indian curriculum expertise, strong discipline, good CBSE-style results
- **Admission**: Entrance test

### 10. Ullens School
- **Location**: Khumaltar, Lalitpur
- **Type**: Private (IB World School)
- **Levels**: Pre-K–12 (+ IB Diploma)
- **Why it's top**: Only IB World School in Nepal, international curriculum, modern campus
- **Admission**: Assessment + interview, higher fees

## Types of Schools in Nepal

### 1. Community (Government) Schools
- **Fees**: Free or very low (NPR 0–500/month)
- **Curriculum**: National Curriculum (NEB)
- **Quality**: Varies widely — some excellent, many struggling
- **Best for**: Budget-conscious families, rural areas

### 2. Private Schools
- **Fees**: NPR 2,000–15,000/month
- **Curriculum**: National Curriculum (NEB)
- **Quality**: Generally good, competitive SEE results
- **Best for**: Most middle-class families

### 3. Boarding Schools
- **Fees**: NPR 15,000–50,000/month (including boarding)
- **Curriculum**: National Curriculum (some offer A-Levels/IB)
- **Quality**: High, with 24/7 supervision
- **Best for**: Families wanting residential education

### 4. International Schools
- **Fees**: NPR 30,000–100,000+/month
- **Curriculum**: IB, Cambridge A-Levels, American
- **Quality**: International standards, small classes
- **Best for**: Expat families, university-bound-abroad students

## How to Choose the Right School

### For Primary Level (Class 1–5)

Focus on:
- **Teacher-student ratio** — aim for 1:20 or better
- **Activity-based learning** — not just rote memorization
- **Safe, clean environment** — playground, clean toilets
- **Caring teachers** — emotional development matters at this age
- **Language foundation** — English + Nepali

### For Lower Secondary (Class 6–8)

Focus on:
- **STEM foundation** — math and science teaching quality
- **Computer labs** — basic IT literacy
- **Sports and arts** — holistic development
- **Discipline** — structured but not harsh

### For Secondary (Class 9–10, SEE)

Focus on:
- **SEE results** — check past 3 years' pass rates and GPA distributions
- **Subject teachers** — specialist teachers for each subject
- **Extra classes** — does the school offer SEE preparation sessions?
- **Past student placement** — where do SEE graduates go for +2?

### For Higher Secondary (+2, Class 11–12)

Focus on:
- **Stream availability** — Science, Management, Humanities, Education
- **Faculty qualifications** — master's/PhD teachers
- **College placement support** — help with university applications
- **ECA/CCA** — clubs, sports, debates

## School Admission Process in Nepal

### Typical Timeline

- **Magh–Falgun (Jan–Feb)**: Schools release admission notices
- **Falgun–Chaitra (Feb–Apr)**: Entrance exams and interviews
- **Chaitra–Baisakh (Apr–May)**: Admission decisions and enrollment
- **Baisakh (Apr–May)**: New academic year begins

### Required Documents

- Birth certificate
- Previous school's transfer certificate (if applicable)
- Report card from previous class
- 2 passport photos
- Parent's citizenship photocopy
- Immunization record (for younger children)

## School Fees in Nepal (Monthly Estimates)

| School Type | Monthly Fees | Annual Total |
|-------------|-------------|-------------|
| Community school | Free – NPR 500 | NPR 0–6,000 |
| Budget private | NPR 1,500–3,000 | NPR 18,000–36,000 |
| Mid-range private | NPR 3,000–8,000 | NPR 36,000–96,000 |
| Top private | NPR 8,000–15,000 | NPR 96,000–180,000 |
| Boarding school | NPR 15,000–50,000 | NPR 180,000–600,000 |
| International school | NPR 30,000–100,000+ | NPR 360,000–1,200,000+ |

## FAQ

### Which is the #1 school in Nepal?
**Budhanilkantha School** is widely considered the #1 school in Nepal due to its national merit-based admission, government funding, and consistently excellent results.

### What are the best schools in Kathmandu?
Top schools in Kathmandu Valley include **Budhanilkantha, St. Xavier's (Godavari & Jawalakhel), St. Mary's, Lincoln, Gyanodaya, Brihaspati, DAV, and Ullens**.

### What is the best school for SEE in Nepal?
Many private schools in Kathmandu achieve excellent SEE results. Budhanilkantha, St. Xavier's, and Gyanodaya consistently produce top SEE performers.

### How much does a good school cost in Nepal?
For a quality private school: NPR 5,000–15,000/month. For boarding schools: NPR 20,000–50,000/month. International schools: NPR 30,000–100,000+/month.

### When do school admissions start in Nepal?
Most schools begin admissions in **Magh–Falgun (January–February)** for the academic year starting in Baisakh (April–May).

### Are boarding schools better than day schools?
It depends on your child and family situation. Boarding schools offer structure and 24/7 supervision but can be expensive and emotionally challenging for young children.

---

Explore schools on our **[schools directory](/schools)** and find the best fit for your child. For +2 college selection, read our **[top 10 colleges guide](/blog/top-10-colleges-nepal-2025-plus2-engineering-medical)**. For more education guides, visit our **[blog](/blog)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 13: Top Medical Colleges in Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "top-medical-colleges-nepal-2025-rankings",
    title: "Top Medical Colleges in Nepal 2025: Best MBBS Colleges & Admissions",
    excerpt:
      "Complete guide to the top medical colleges in Nepal 2025. Best MBBS and BDS colleges with rankings, fees, CEE cutoff, admission requirements, and placements.",
    metaTitle: "Top Medical Colleges in Nepal 2025 — MBBS Rankings & Fees | Khojney",
    metaDescription:
      "Discover the top medical colleges in Nepal 2025. Best MBBS and BDS colleges with rankings, fees, CEE cutoff marks, admission requirements, and placement records.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["medical", "mbbs", "colleges", "nepal", "rankings"],
    featured: false,
    readTimeMin: 9,
    content: `# Top Medical Colleges in Nepal 2025: Best MBBS Colleges & Admissions

Becoming a doctor is a dream for thousands of Nepali students every year. With over 18,000 candidates appearing for the CEE (Common Entrance Examination) and only ~2,200 MBBS seats available, getting into a **top medical college in Nepal** requires excellent CEE scores. This guide ranks the best medical colleges for MBBS and BDS programs, with details on fees, cutoff, and admission process.

## How We Ranked Medical Colleges

Our rankings consider:

- **CEE cutoff trends** — historical admission scores
- **Nepal Medical Council (NMC) accreditation**
- **Infrastructure** — teaching hospital, labs, library
- **Faculty** — MD/MS/PhD-qualified professors
- **PG (postgraduate) programs** — MD/MS seats indicate research focus
- **International recognition** — WHO listing, ECFMG approval

## Top 10 Medical Colleges in Nepal 2025

### 1. IOM — Tribhuvan University Teaching Hospital (TUTH)

**The #1 government medical college in Nepal.**

- **Location**: Maharajgunj, Kathmandu
- **Affiliation**: Tribhuvan University (IOM)
- **Programs**: MBBS, BDS, MD/MS, MDS, MPbil, PhD
- **Annual MBBS intake**: ~75 (government seats)
- **CEE cutoff**: Top 100–200 rank
- **Fees**: NPR 3–5 lakh (government quota)
- **Why choose**: Best faculty, TUTH is Nepal's largest teaching hospital, strong PG programs

### 2. BPKIHS — B.P. Koirala Institute of Health Sciences

- **Location**: Dharan, Sunsari
- **Type**: Autonomous (government-funded)
- **Programs**: MBBS, BDS, MD/MS, BSc Nursing, BPH
- **Annual MBBS intake**: ~100
- **CEE cutoff**: Top 150–300 rank
- **Fees**: NPR 4–6 lakh
- **Why choose**: Autonomous institution, excellent Eastern Nepal coverage, strong research

### 3. NAIHS — Nepalese Army Institute of Health Sciences

- **Location**: Sanobharyang, Kathmandu
- **Type**: Military-affiliated (accepts civilians)
- **Programs**: MBBS, BSc Nursing, BPH
- **Annual MBBS intake**: ~100 (including army quota)
- **CEE cutoff**: Top 300–500 rank
- **Fees**: NPR 20–30 lakh
- **Why choose**: Military discipline, modern infrastructure, good placement

### 4. PAHS — Patan Academy of Health Sciences

- **Location**: Lagankhel, Lalitpur
- **Type**: Autonomous (government)
- **Programs**: MBBS, MD/MS, BSc Nursing, BPH
- **Annual MBBS intake**: ~60
- **CEE cutoff**: Top 200–400 rank
- **Fees**: NPR 4–6 lakh
- **Why choose**: Community-oriented curriculum, Patan Hospital affiliation

### 5. KUSMS — Kathmandu University School of Medical Sciences

- **Location**: Dhulikhel, Kavre
- **Affiliation**: Kathmandu University
- **Programs**: MBBS, BDS, MD/MS, BSc Nursing, BPH
- **Annual MBBS intake**: ~100
- **CEE cutoff**: Top 400–700 rank
- **Fees**: NPR 45–50 lakh
- **Why choose**: KU affiliation, international recognition, Dhulikhel Hospital

### 6. NMC — Nepal Medical College

- **Location**: Attarkhel, Jorpati, Kathmandu
- **Type**: Private (TU affiliated)
- **Programs**: MBBS, BDS, MD/MS
- **Annual MBBS intake**: ~100
- **CEE cutoff**: Top 500–900 rank
- **Fees**: NPR 45–50 lakh
- **Why choose**: Good teaching hospital, experienced faculty

### 7. MCOMS — Manipal College of Medical Sciences

- **Location**: Pokhara, Kaski
- **Type**: Private (KU affiliated)
- **Programs**: MBBS, BDS, MD/MS
- **Annual MBBS intake**: ~150
- **CEE cutoff**: Top 500–1000 rank
- **Fees**: NPR 45–52 lakh
- **Why choose**: Manipal Group reputation, Pokhara location, international students

### 8. KMC — Kathmandu Medical College

- **Location**: Sinamangal, Kathmandu
- **Type**: Private (TU affiliated)
- **Programs**: MBBS, BDS, MD/MS
- **Annual MBBS intake**: ~100
- **CEE cutoff**: Top 600–1000 rank
- **Fees**: NPR 45–50 lakh
- **Why choose**: Central location, good teaching hospital

### 9. CMC — Chitwan Medical College

- **Location**: Bharatpur, Chitwan
- **Type**: Private (TU affiliated)
- **Programs**: MBBS, BDS, MD/MS, BSc Nursing, BPH
- **Annual MBBS intake**: ~100
- **CEE cutoff**: Top 600–1100 rank
- **Fees**: NPR 45–50 lakh
- **Why choose**: Modern infrastructure, central location outside Kathmandu

### 10. Nobel Medical College

- **Location**: Biratnagar, Morang
- **Type**: Private (KU affiliated)
- **Programs**: MBBS, BDS, BSc Nursing
- **Annual MBBS intake**: ~100
- **CEE cutoff**: Top 700–1200 rank
- **Fees**: NPR 45–50 lakh
- **Why choose**: Eastern Nepal's premier private medical college

## MBBS Admission Process in Nepal

### Step 1: Complete +2 Science

- **Subjects**: Physics, Chemistry, Biology, English
- **Minimum marks**: 50% aggregate (C+ grade) in +2 or equivalent
- **Equivalent**: A-Levels with Physics, Chemistry, Biology; IB with Science subjects

### Step 2: Register for CEE

- **Conducted by**: Medical Education Commission (MEC)
- **Application opens**: Shrawan–Bhadra (July–August)
- **Exam date**: Typically Bhadra–Ashwin (September–October)
- **Application fee**: ~NPR 4,000

### Step 3: Take the CEE Exam

- **200 MCQs**: 50 Physics, 50 Chemistry, 50 Botany, 50 Zoology
- **Duration**: 3 hours
- **Pass mark**: 50% (100/200) for MBBS, 40% (80/200) for BDS
- **No negative marking**

Practice with our **[free CEE mock test →](/exams/mbbs-cee)**

### Step 4: Counseling and Admission

- Based on CEE rank, you'll be called for counseling
- Choose your college and program based on your rank
- Government seats go to top rankers; private seats require higher rank + higher fees
- Complete admission formalities within the given deadline

## MBBS Fees in Nepal

| College Type | Total Fees (4.5 years) |
|-------------|----------------------|
| Government (IOM, BPKIHS, PAHS) | NPR 3–6 lakh |
| NAIHS (Army) | NPR 20–30 lakh |
| Private (KU affiliated) | NPR 45–52 lakh |
| Private (TU affiliated) | NPR 45–50 lakh |

## MBBS Course Duration

- **Academic**: 4.5 years (9 semesters)
- **Internship**: 1 year (compulsory)
- **Total**: 5.5 years

## Medical Scholarships in Nepal

Several scholarship options exist:

- **Government quota seats** — heavily subsidized at government colleges
- **MEC scholarship** — based on CEE merit
- **College-level scholarships** — many private colleges offer merit discounts
- **Indian Embassy scholarships** — for Nepali students
- **WHO/UNICEF scholarships** — for specific demographics

Explore **[medical scholarships on Khojney →](/scholarships)**

## FAQ

### Which is the #1 medical college in Nepal?
**IOM (Tribhuvan University Teaching Hospital)** is universally ranked as the #1 medical college in Nepal based on reputation, faculty, and cutoff scores.

### How many marks do I need in CEE for MBBS in Nepal?
You need at least **100/200 (50%)** to pass CEE for MBBS. For government seats at IOM, aim for **150+**. For private colleges, 110+ is usually sufficient.

### What is the total fees for MBBS in Nepal?
Government colleges: NPR 3–6 lakh. Private colleges: NPR 45–52 lakh for 4.5 years.

### Is MBBS from Nepal valid in India?
Yes, MBBS from Nepal is recognized by the **National Medical Commission (NMC) of India**. Graduates can practice in India after clearing the FMGE/NExT exam.

### How many medical colleges are in Nepal?
There are approximately **20 medical colleges** in Nepal offering MBBS — 5 government/autonomous and 15 private.

### Can I study MBBS in Nepal after 12th from India?
Yes, Indian students with 12th Science (Physics, Chemistry, Biology) are eligible for CEE and MBBS admission in Nepal.

### What is the duration of MBBS in Nepal?
MBBS is a **5.5-year program**: 4.5 years of academic study + 1 year of compulsory rotating internship.

---

Prepare for CEE with our **[free MBBS mock test](/exams/mbbs-cee)** and read our **[complete CEE preparation guide](/blog/cee-mock-test-free-online-nepal-mbbs-entrance)**. For scholarship opportunities, explore **[medical scholarships](/scholarships)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 14: Top Universities in Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "top-universities-nepal-2025-rankings-programs",
    title: "Top Universities in Nepal 2025: Best University Rankings & Programs",
    excerpt:
      "Complete guide to the top universities in Nepal 2025. Best universities with rankings, programs offered, affiliations, admission process, and campus details.",
    metaTitle: "Top Universities in Nepal 2025 — Rankings & Programs | Khojney",
    metaDescription:
      "Discover the top universities in Nepal 2025. Best universities with rankings, programs offered, affiliations, admission process, and campus details for students.",
    categoryName: "Education",
    categorySlug: "blog-education",
    tags: ["universities", "nepal", "rankings", "tu", "ku"],
    featured: false,
    readTimeMin: 8,
    content: `# Top Universities in Nepal 2025: Best University Rankings & Programs

Nepal has **10 universities** recognized by the University Grants Commission (UGC) of Nepal. Each has its own strengths, affiliations, and program offerings. Whether you're looking for engineering, medicine, management, or humanities, this guide covers the **top universities in Nepal** to help you choose the right one for your higher education.

## List of Universities in Nepal

| # | University | Established | Type | Location |
|---|-----------|-------------|------|----------|
| 1 | Tribhuvan University (TU) | 1959 | Public | Kirtipur, Kathmandu |
| 2 | Kathmandu University (KU) | 1991 | Public (autonomous) | Dhulikhel, Kavre |
| 3 | Pokhara University (PoU) | 1997 | Public | Pokhara, Kaski |
| 4 | Purbanchal University (PU) | 1994 | Public | Biratnagar, Morang |
| 5 | Nepal Agriculture and Forestry University (NAFU) | 2010 | Public | Rampur, Chitwan |
| 6 | Lumbini Buddhist University (LBU) | 2005 | Public | Lumbini |
| 7 | Mid-Western University (MU) | 2010 | Public | Surkhet |
| 8 | Far-Western University (FU) | 2010 | Public | Kanchanpur |
| 9 | Nepal Sanskrit University (NSU) | 1986 | Public | Dang |
| 10 | Rajarshi Janak University (RJU) | 2017 | Public | Janakpur |

## Top 5 Universities in Nepal (Detailed)

### 1. Tribhuvan University (TU)

**The oldest and largest university in Nepal.**

- **Established**: 1959 (2016 BS)
- **Location**: Kirtipur, Kathmandu
- **Type**: Public (government-funded)
- **Affiliated colleges**: 1,000+ across Nepal
- **Constituent campuses**: 60+
- **Student enrollment**: ~500,000 (largest in Nepal)

**Key Institutes**:
- **Institute of Engineering (IOE)** — engineering programs
- **Institute of Medicine (IOM)** — medical programs
- **Faculty of Management (FOM)** — BBA, MBA, BBS, MBS
- **Faculty of Humanities and Social Sciences**
- **Faculty of Education** — teacher training
- **Faculty of Law** — LLB, LLM
- **Institute of Agriculture and Animal Science (IAAS)**
- **Institute of Forestry (IOF)**

**Strengths**: Largest network, affordable fees, recognized globally, widest range of programs

**Popular Programs**: BE, MBBS, BBA, BBS, LLB, BSc, BA, BEd

### 2. Kathmandu University (KU)

**The #1 autonomous university in Nepal.**

- **Established**: 1991
- **Location**: Dhulikhel, Kavre
- **Type**: Public (autonomous, self-governing)
- **Affiliated colleges**: ~50
- **Student enrollment**: ~20,000

**Key Schools**:
- **School of Engineering** — BE Computer, Civil, Electrical, Mechanical
- **School of Medical Sciences (KUSMS)** — MBBS, BDS, MD/MS
- **School of Management** — BBA, MBA
- **School of Science** — BSc CS, MSc programs
- **School of Arts** — BA, MA programs
- **School of Law** — LLB, LLM
- **School of Education** — BEd, MEd

**Strengths**: International recognition, modern curriculum, research focus, smaller class sizes

**Popular Programs**: BE, MBBS, BBA, BSc CS, MBA

### 3. Pokhara University (PoU)

- **Established**: 1997
- **Location**: Pokhara, Kaski (Lekhnath Municipality)
- **Type**: Public
- **Affiliated colleges**: ~50
- **Student enrollment**: ~50,000

**Key Programs**: BE, BBA, MBA, BCA, MCA, BPharm, BSc Nursing

**Strengths**: Modern campus, growing reputation, Pokhara location

### 4. Purbanchal University (PU)

- **Established**: 1994
- **Location**: Biratnagar, Morang (Gothgaon)
- **Type**: Public
- **Affiliated colleges**: ~100
- **Student enrollment**: ~80,000

**Key Programs**: BE, BBA, MBA, BSc CSIT, BNS, BPH

**Strengths**: Eastern Nepal coverage, affordable fees, growing engineering programs

### 5. Nepal Agriculture and Forestry University (NAFU)

- **Established**: 2010
- **Location**: Rampur, Chitwan
- **Type**: Public (specialized)
- **Student enrollment**: ~5,000

**Key Programs**: BSc Agriculture, BSc Forestry, MSc Agriculture, MSc Forestry, PhD

**Strengths**: Specialized in agriculture and forestry, research-focused, government-funded

## How to Choose the Right University

### 1. Consider Your Program

- **Engineering**: TU (IOE) or KU
- **Medicine**: TU (IOM) or KU (KUSMS)
- **Management**: TU (FOM) or KU (School of Management)
- **IT/Computer Science**: TU (IOE/IOST) or KU
- **Agriculture**: NAFU or TU (IAAS)
- **Law**: TU or KU
- **Education**: TU (Faculty of Education)

### 2. Consider Affiliation vs Constituent

- **Constituent campuses**: Run directly by the university (e.g., Pulchowk Campus by TU/IOE)
- **Affiliated colleges**: Private colleges affiliated to the university (e.g., Kantipur Engineering College affiliated to TU)

Constituent campuses are generally cheaper and more prestigious; affiliated colleges may have better infrastructure.

### 3. Consider Location

- **Kathmandu Valley**: Most options, but expensive and crowded
- **Pokhara**: Peaceful, growing academic hub
- **Chitwan**: Affordable, agriculture focus
- **Eastern Nepal (Biratnagar, Dharan)**: PU and BPKIHS
- **Western Nepal (Surkhet, Kanchanpur)**: Mid-Western and Far-Western Universities

### 4. Consider Cost

- **Government/constituent**: NPR 3–10 lakh for 4-year bachelor's
- **Private affiliated**: NPR 8–15 lakh
- **International programs (at KU)**: NPR 12–20 lakh

## University Admission Process

### For TU Programs

- **IOE (Engineering)**: IOE entrance exam → counseling
- **IOM (Medicine)**: CEE → counseling
- **FOM (Management)**: CMAT for MBA/MBS; direct admission for BBA/BBS
- **Other faculties**: Merit-based or entrance exam (varies by program)

### For KU Programs

- **Undergraduate**: KU entrance exam + interview
- **MBA/PG**: KUUMAT (Kathmandu University University Management Admission Test)
- **Medical (KUSMS)**: CEE (participates in MEC's CEE)

### For PU Programs

- Most programs: PU entrance exam or merit-based admission

### For PoU Programs

- Most programs: PoU entrance exam or merit-based admission

## FAQ

### Which is the best university in Nepal?
**Tribhuvan University (TU)** is the largest and most recognized. **Kathmandu University (KU)** is considered the best for quality education, international recognition, and modern curriculum.

### How many universities are there in Nepal?
Nepal has **10 universities** recognized by UGC Nepal: TU, KU, PoU, PU, NAFU, LBU, MU, FU, NSU, and RJU.

### Is TU or KU better?
Both are excellent. TU is larger, more affordable, and has a stronger alumni network. KU is more modern, internationally recognized, and research-focused. For most professional programs (engineering, medicine), both are equally good.

### Which university is best for engineering in Nepal?
**TU's Institute of Engineering (IOE)** — especially Pulchowk Campus — is the best for engineering. KU School of Engineering is the second best.

### Which university is best for MBBS in Nepal?
**TU's Institute of Medicine (IOM)** is the top choice. KU's KUSMS and autonomous institutions like BPKIHS are also excellent.

### Can I transfer between universities in Nepal?
Generally no — credit transfer between universities is not common in Nepal. You would need to start fresh if you switch universities.

### Are Nepali university degrees valid internationally?
Yes, degrees from TU and KU are recognized globally. Medical degrees (MBBS) from Nepal are WHO-listed and valid in India, USA (after USMLE), UK (after PLAB), and other countries.

---

Explore programs and colleges on our **[universities directory](/universities)** and prepare for entrance exams with our **[free mock tests](/exams)**. For college selection, read our **[top 10 colleges guide](/blog/top-10-colleges-nepal-2025-plus2-engineering-medical)**.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // ARTICLE 15: Engineering in Nepal
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "engineering-in-nepal-complete-guide-programs-colleges-careers",
    title: "Engineering in Nepal: Complete Guide to Programs, Colleges & Careers 2025",
    excerpt:
      "Complete guide to engineering in Nepal 2025. Types of engineering, best colleges, admission process, fees, career opportunities, and salary expectations.",
    metaTitle: "Engineering in Nepal 2025 — Complete Programs & Career Guide | Khojney",
    metaDescription:
      "Complete guide to engineering in Nepal. Types of engineering, best colleges, IOE admission process, fees, career opportunities, and salary expectations for 2025.",
    categoryName: "Career",
    categorySlug: "blog-career",
    tags: ["engineering", "nepal", "colleges", "career", "programs"],
    featured: true,
    readTimeMin: 11,
    content: `# Engineering in Nepal: Complete Guide to Programs, Colleges & Careers

**Engineering in Nepal** has evolved dramatically over the past two decades. From a handful of programs at Pulchowk Campus in the 1990s, Nepal now offers 15+ engineering specializations across 60+ colleges affiliated to TU, KU, PU, and PoU. Whether you're a +2 Science student planning your career or a parent researching options, this guide covers everything about engineering education in Nepal — programs, colleges, admission, fees, and career prospects.

## Types of Engineering in Nepal

### 1. Civil Engineering (BE Civil)

**The oldest and most traditional engineering field in Nepal.**

- **Duration**: 4 years (8 semesters)
- **Affiliation**: TU (IOE), KU, PU, PoU
- **Job scope**: Construction, infrastructure, roads, bridges, water supply, hydropower
- **Top recruiters**: Nepal Government (DPW, DOID), contractor companies (Kalika, Pappu), hydropower companies, consulting firms
- **Starting salary**: NPR 35,000–60,000/month
- **Career growth**: Site Engineer → Project Engineer → Project Manager → Contractor/Consultant

### 2. Computer Engineering (BE Computer)

**The most in-demand engineering field in Nepal.**

- **Duration**: 4 years
- **Affiliation**: TU (IOE), KU, PU, PoU
- **Job scope**: Software development, web development, mobile apps, AI/ML, cybersecurity, cloud computing
- **Top recruiters**: F1Soft, Deerwalk, Braindigit, Leapfrog, Verisk, Naamche, international remote companies
- **Starting salary**: NPR 40,000–80,000/month (higher with remote international jobs)
- **Career growth**: Junior Developer → Senior Developer → Tech Lead → CTO

### 3. Electronics & Communication Engineering (BE ECE)

- **Duration**: 4 years
- **Affiliation**: TU (IOE), KU, PU, PoU
- **Job scope**: Telecom (NTC, Ncell), embedded systems, IoT, electronics manufacturing, broadcasting
- **Top recruiters**: Nepal Telecom, Ncell, Smart Cell, broadcast stations, electronics importers
- **Starting salary**: NPR 35,000–55,000/month
- **Career growth**: Design Engineer → Project Engineer → R&D Manager

### 4. Electrical Engineering (BE Electrical)

- **Duration**: 4 years
- **Affiliation**: TU (IOE), KU, PU
- **Job scope**: Power generation (hydropower), transmission, distribution, electrical design, NEA
- **Top recruiters**: Nepal Electricity Authority (NEA), hydropower companies (Butwal Power, Chilime), consulting firms
- **Starting salary**: NPR 35,000–55,000/month
- **Career growth**: Electrical Engineer → Project Manager → Plant Manager

### 5. Mechanical Engineering (BE Mechanical)

- **Duration**: 4 years
- **Affiliation**: TU (IOE), KU, PU
- **Job scope**: Manufacturing, automotive, HVAC, industrial plants, hydropower (mechanical design)
- **Top recruiters**: Nepal Oil Corporation, cement factories (Huadiang, Hongshi), automotive workshops, BG Industries
- **Starting salary**: NPR 30,000–50,000/month
- **Career growth**: Design Engineer → Maintenance Manager → Plant Manager

### 6. Architecture (B.Arch)

- **Duration**: 5 years (10 semesters) — longer than other engineering programs
- **Affiliation**: TU (IOE), KU
- **Job scope**: Building design, urban planning, interior design, landscape architecture
- **Top recruiters**: Architecture firms (Avatar, Archeng, BBGL), real estate developers, government urban planning
- **Starting salary**: NPR 40,000–70,000/month
- **Career growth**: Junior Architect → Senior Architect → Principal Architect → Own firm

### 7. Geomatics Engineering (BE Geomatics)

- **Duration**: 4 years
- **Affiliation**: TU (IOE) — only at Pulchowk Campus
- **Job scope**: Surveying, mapping, GIS, remote sensing, land administration
- **Top recruiters**: Survey Department of Nepal, NGII, consulting firms, international NGOs
- **Starting salary**: NPR 40,000–60,000/month
- **Career growth**: Surveyor → GIS Specialist → Project Manager

### 8. Industrial Engineering (BE Industrial)

- **Duration**: 4 years
- **Affiliation**: TU (IOE) — Thapathali Campus
- **Job scope**: Manufacturing optimization, supply chain, quality control, operations management
- **Top recruiters**: Manufacturing companies, FMCG, logistics companies
- **Starting salary**: NPR 35,000–55,000/month

### 9. Automobile Engineering (BE Automobile)

- **Duration**: 4 years
- **Affiliation**: TU (IOE) — Thapathali Campus
- **Job scope**: Vehicle manufacturing, assembly, maintenance, automotive design
- **Top recruiters**: Automobile assembly plants (Hyundai, MG, Tata), service centers, importers
- **Starting salary**: NPR 30,000–50,000/month

### 10. Agriculture Engineering (BE Agriculture)

- **Duration**: 4 years
- **Affiliation**: TU (IOE) — Chitwan Engineering Campus, NAFU
- **Job scope**: Agricultural machinery, irrigation, farm design, agro-processing
- **Top recruiters**: Ministry of Agriculture, agro-based companies, NGOs
- **Starting salary**: NPR 35,000–50,000/month

### Other Emerging Fields

- **Biomedical Engineering** — medical equipment design (limited programs)
- **Aerospace Engineering** — not yet offered in Nepal (study abroad)
- **Chemical Engineering** — limited programs
- **Environmental Engineering** — growing demand
- **Energy Engineering** — hydropower focus
- **AI & Data Science** — new programs emerging

## How Many Engineering Colleges Are in Nepal?

Nepal has approximately **60+ engineering colleges** across all affiliations:

- **TU (IOE) affiliated**: ~35 colleges (5 constituent + 30 private affiliated)
- **KU affiliated**: ~10 colleges (constituent + affiliated)
- **PU affiliated**: ~10 colleges
- **PoU affiliated**: ~5 colleges

Read our complete **[best engineering colleges guide →](/blog/best-engineering-colleges-nepal-2025-top-10-rankings)** for rankings and fees.

## Engineering Admission Process in Nepal

### For TU (IOE) Programs

1. **Eligibility**: +2 Science (or equivalent) with Physics, Chemistry, Mathematics; minimum 45% (C grade)
2. **Apply for IOE entrance**: Application opens in Bhadra–Ashoj
3. **Take IOE entrance exam**: 140 MCQs (40 Physics, 40 Chemistry, 40 Math, 20 English) in 3 hours
4. **Counseling**: Based on IOE rank, choose college and program
5. **Admission**: Complete college formalities

Practice with our **[free IOE mock test →](/exams/ioe-entrance)**

### For KU Programs

1. **Eligibility**: +2 Science with PCM, minimum 50%
2. **Apply for KU entrance**: Application opens in Bhadra
3. **Take KU entrance exam**: Similar pattern to IOE
4. **Counseling and admission**

### For PU and PoU Programs

1. Similar eligibility (+2 Science with PCM)
2. University-specific entrance exam or merit-based admission
3. Direct admission at affiliated colleges (some have their own criteria)

## Engineering Fees in Nepal

| Affiliation | Government/Constituent | Private Affiliated |
|-------------|----------------------|-------------------|
| TU (IOE) | NPR 5–7 lakh | NPR 8–12 lakh |
| KU | NPR 12–15 lakh | NPR 12–18 lakh |
| PU | NPR 5–7 lakh | NPR 7–10 lakh |
| PoU | NPR 5–7 lakh | NPR 7–10 lakh |

## Engineering Career Opportunities in Nepal

### Top Employers by Sector

**Construction & Infrastructure**
- Government: Department of Roads, Department of Irrigation, DPW
- Private: Kalika Construction, Pappu Construction, Supreme, Lama
- Consulting: CEMB, ETC, SILT, Multi-Disciplinary Consultants

**Hydropower**
- NEA (Nepal Electricity Authority)
- Independent Power Producers (IPPs): Chilime, Butwal Power, Sanjen, Rasuwagadhi
- Consulting: ITD, Butwal Power Consulting

**Information Technology**
- Software companies: F1Soft, Deerwalk, Braindigit, Leapfrog, Verisk, Naamche, Cloud Factory
- Banks (IT departments): Nabil, NIC Asia, Global IME
- International remote work: Many Nepal engineers work remotely for US/EU companies

**Manufacturing**
- Cement: Huadiang, Hongshi, Arghakhachi, Sonapur
- FMCG: Dabur Nepal, Unilever Nepal, Chaudhary Group
- Steel: Panchakanya, Hama, Jagadamba

**Telecom**
- Nepal Telecom (NTC)
- Ncell
- Smart Cell, United Telecom

### Engineering Salary in Nepal (2025)

| Experience | Monthly Salary Range |
|-----------|---------------------|
| Fresh graduate | NPR 25,000–45,000 |
| 1–2 years | NPR 35,000–60,000 |
| 3–5 years | NPR 50,000–90,000 |
| 5–10 years | NPR 80,000–150,000 |
| 10+ years | NPR 120,000–300,000+ |
| Senior management | NPR 200,000–500,000+ |

Note: IT/Computer engineers with remote international jobs can earn significantly more (NPR 100,000–500,000+/month).

## Engineering Scholarships in Nepal

- **IOE merit scholarship** — top 10 IOE rankers get free tuition at Pulchowk
- **Government quota** — reservation for marginalized communities
- **College-level scholarships** — many private colleges offer 50–100% scholarships based on IOE rank
- **Indian Embassy scholarships** — for Nepali engineering students
- **International scholarships** — for MS/PhD abroad

Explore **[engineering scholarships on Khojney →](/scholarships)**

## Which Engineering is Best in Nepal?

This depends on your interests and career goals:

- **Highest demand + salary**: Computer Engineering
- **Most traditional + stable**: Civil Engineering
- **Growing niche**: Geomatics, Architecture
- **Government jobs**: Civil, Electrical, Mechanical
- **International remote work**: Computer Engineering

## FAQ

### How many engineering colleges are there in Nepal?
Nepal has approximately **60+ engineering colleges** across TU, KU, PU, and PoU affiliations. Read our **[best engineering colleges guide](/blog/best-engineering-colleges-nepal-2025-top-10-rankings)** for the top 10.

### Which engineering is best in Nepal?
**Computer Engineering** has the highest demand and salary. **Civil Engineering** is the most traditional and stable. Choose based on your interests.

### How much does engineering cost in Nepal?
Government colleges (IOE): NPR 5–7 lakh. Private colleges: NPR 8–15 lakh. KU: NPR 12–18 lakh for 4 years.

### What is the salary of an engineer in Nepal?
Fresh graduates earn NPR 25,000–45,000/month. With 5+ years of experience: NPR 80,000–150,000/month. IT engineers with remote jobs can earn much more.

### How do I get admission to Pulchowk Campus?
Crack the **IOE entrance exam** with a top rank (typically 100+/140 marks for Pulchowk). Take our **[free IOE mock test](/exams/ioe-entrance)** to check your level.

### Can I study engineering in Nepal after +2 Management?
No, +2 Science with PCM (Physics, Chemistry, Mathematics) is required for engineering admission. Management students can pursue BBA, BBS, BIM, or CA instead.

### Is Nepal engineering degree valid abroad?
Yes, engineering degrees from TU (IOE) and KU are recognized internationally. Graduates can pursue MS/PhD abroad and work globally.

---

Start your engineering journey with our **[free IOE mock test](/exams/ioe-entrance)** and explore colleges on our **[colleges directory](/colleges)**. For more guides, read our **[IOE preparation guide](/blog/ioe-entrance-preparation-complete-guide-be-engineering-nepal)** and visit our **[blog](/blog)**.`,
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
  console.log("\n📝 Seeding 15 SEO-optimized ranking articles...\n");

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
      // Update existing post
      await db.blogPost.update({
        where: { slug: article.slug },
        data,
      });
      // Update tags
      await db.blogPost.update({
        where: { slug: article.slug },
        data: { tags: { set: tagIds.map((id) => ({ id })) } },
      });
      updated++;
      console.log(`  ↻ Updated: ${article.slug}`);
    } else {
      // Create new post
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
