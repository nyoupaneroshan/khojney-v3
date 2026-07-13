/**
 * mock-exam-seo-seed.ts — Populates rich SEO content for top mock exams.
 *
 * Updates existing parent exams with:
 *   - Hero title + description
 *   - Benefits (JSON array)
 *   - Instructions (JSON array)
 *   - SEO content (500-1500 word markdown)
 *   - FAQs (JSON array)
 *   - SEO title + description + keywords
 *   - CTA text
 *   - Related resources
 *
 * Run: `bun run scripts/mock-exam-seo-seed.ts`
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface ExamSeoData {
  slug: string;
  heroTitle?: string;
  heroDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  ctaText?: string;
  benefits?: string[];
  instructions?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  relatedResources?: Array<{ title: string; url: string }>;
  seoContent?: string;
}

const examSeoData: ExamSeoData[] = [
  // ─── IOE Entrance ─────────────────────────────────────────
  {
    slug: "ioe-entrance",
    heroTitle: "IOE Free Mock Exam — Online Practice Test for Engineering Entrance",
    heroDescription:
      "Prepare for your IOE entrance examination with our completely free online mock exams. Practice real exam-style questions, improve your speed, identify weak areas, and boost your confidence before the actual entrance examination.",
    seoTitle: "IOE Mock Test Free Online 2025 — Instant Scoring | Khojney",
    seoDescription:
      "Take free IOE mock tests online with real exam patterns. Complete IOE entrance preparation guide with syllabus, tips, and instant scoring. Start practicing now.",
    keywords:
      "ioe mock test, ioe mock test free, ioe entrance mock test, free ioe mock test, ioe free mock test, mock test for ioe, mock test ioe, engineering mock test, ioe online test, ioe mock test free online",
    ctaText: "Start Free IOE Mock Exam",
    benefits: [
      "Real IOE exam simulation with 140 questions in 3 hours",
      "Instant scoring with subject-wise breakdown",
      "Detailed explanations for every question",
      "Performance analysis to identify weak areas",
      "Unlimited practice attempts — completely free",
      "Mobile-friendly — practice on any device",
      "Shuffled questions and options every attempt",
      "Rank prediction based on historical data",
    ],
    instructions: [
      "The exam has 140 MCQs: 40 Physics, 40 Chemistry, 40 Math, 20 English",
      "Total duration is 3 hours (180 minutes)",
      "Each correct answer awards 1 mark",
      "There is no negative marking — attempt every question",
      "Timer starts immediately when you click Start",
      "Do not refresh the page during the exam",
      "Results appear instantly after submission",
      "You can review detailed explanations after submitting",
    ],
    faqs: [
      {
        question: "Is the IOE mock test on Khojney free?",
        answer:
          "Yes, all IOE mock tests on Khojney are 100% free. You can take unlimited attempts with instant scoring and detailed explanations.",
      },
      {
        question: "How many questions are in the IOE entrance exam?",
        answer:
          "The IOE exam has 140 MCQs — 40 Physics, 40 Chemistry, 40 Math, and 20 English — to be completed in 3 hours.",
      },
      {
        question: "What is the passing mark for IOE?",
        answer:
          "The passing mark is 40% (56 out of 140). However, to get into Pulchowk Campus, you typically need 100+ marks.",
      },
      {
        question: "Is there negative marking in IOE?",
        answer:
          "No, there is no negative marking in the IOE entrance exam. You should attempt every question.",
      },
      {
        question: "Can I retake the mock test?",
        answer:
          "Yes, you can take the mock test unlimited times. Questions and options are shuffled on each attempt for realistic practice.",
      },
    ],
    relatedResources: [
      { title: "IOE Entrance Preparation Complete Guide", url: "/blog/ioe-entrance-preparation-complete-guide-be-engineering-nepal" },
      { title: "Best Engineering Colleges in Nepal", url: "/blog/best-engineering-colleges-nepal-2025-top-10-rankings" },
      { title: "Engineering in Nepal: Complete Guide", url: "/blog/engineering-in-nepal-complete-guide-programs-colleges-careers" },
      { title: "IOE Mock Test Free Online Guide", url: "/blog/ioe-mock-test-free-online-complete-guide" },
    ],
    seoContent: `## About the IOE Entrance Exam

The **Institute of Engineering (IOE) entrance exam** is the most competitive engineering entrance examination in Nepal, conducted by Tribhuvan University (TU). Every year, over 15,000 students compete for approximately 1,800 seats across TU-affiliated engineering colleges. The exam is the gateway to prestigious institutions like Pulchowk Campus, Thapathali Campus, Chitwan Engineering Campus, and Pashchimanchal Campus.

## IOE Exam Pattern

The IOE entrance exam consists of **140 multiple-choice questions** worth 140 total marks, to be completed in **3 hours**. The subject breakdown is:

- **Physics**: 40 questions (40 marks)
- **Chemistry**: 40 questions (40 marks)
- **Mathematics**: 40 questions (40 marks)
- **English**: 20 questions (20 marks)

There is **no negative marking**, so you should attempt every question. The passing mark is 40% (56 marks), but to secure admission to top colleges like Pulchowk, you need 100+ marks.

## IOE Eligibility

To be eligible for the IOE entrance exam, you must:

- Have completed +2 Science (or equivalent like A-Levels, IB) with Physics, Chemistry, and Mathematics as compulsory subjects
- Achieve a minimum of 45% aggregate (C grade) in +2
- Be at least 16 years old at the time of application

## IOE Syllabus

The IOE syllabus is based on the NEB Class 11–12 curriculum:

### Physics
Mechanics (kinematics, Newton's laws, work-energy, rotational motion), Electricity & Magnetism (current electricity, magnetic effects, electromagnetic induction), Optics (reflection, refraction, lenses), Modern Physics (atomic structure, nuclear physics, semiconductors), Thermodynamics.

### Chemistry
Physical Chemistry (atomic structure, chemical bonding, thermodynamics, equilibrium), Organic Chemistry (hydrocarbons, functional groups, reaction mechanisms), Inorganic Chemistry (periodic table, coordination compounds, qualitative analysis).

### Mathematics
Algebra (quadratic equations, sequences, complex numbers, matrices), Calculus (limits, differentiation, integration, differential equations), Coordinate Geometry (lines, circles, conic sections), Trigonometry, Vectors and 3D Geometry.

### English
Grammar (tenses, articles, prepositions), Vocabulary (synonyms, antonyms), Sentence correction, Reading comprehension.

## Why Mock Tests Are Important for IOE

Taking regular mock tests is the single most effective way to prepare for IOE:

1. **Time management**: 140 questions in 180 minutes means ~77 seconds per question. Mock tests train you to solve fast.
2. **Exam temperament**: Sitting for 3 hours of intense concentration requires practice.
3. **Weak area identification**: Subject-wise analysis shows where you lose marks.
4. **Question pattern familiarity**: IOE repeats question structures year after year.
5. **Confidence building**: Scoring well in mock tests boosts your confidence for the real exam.

## How to Use This Mock Test

1. Click "Start Free IOE Mock Exam" above
2. You'll have 3 hours to complete 140 questions
3. Questions are shuffled on each attempt for realistic practice
4. After submitting, you'll see your score, subject-wise breakdown, and detailed explanations
5. Review wrong answers and retake the test to track improvement

Start your IOE preparation journey today with our free mock tests. Consistent practice is the key to cracking one of Nepal's most competitive entrance exams.`,
  },

  // ─── MBBS CEE ─────────────────────────────────────────────
  {
    slug: "mbbs-cee",
    heroTitle: "CEE Free Mock Exam — MBBS Entrance Online Practice Test",
    heroDescription:
      "Prepare for your MBBS entrance examination (CEE) with our completely free online mock exams. Practice 200 real exam-style questions in 3 hours, get instant scoring, and detailed explanations for every answer.",
    seoTitle: "CEE Mock Test Free Online Nepal 2025 — MBBS Entrance | Khojney",
    seoDescription:
      "Take free CEE mock tests online for MBBS entrance in Nepal. Complete Common Entrance Examination preparation guide with syllabus, tips, and instant scoring.",
    keywords:
      "cee mock test, cee mock test free, cee online mock test free, cee free mock test, free cee mock test, free mock test for cee, mock test for cee, online mock test for cee, cee mock test online, mbbs mock test, mock test for mbbs entrance nepal",
    ctaText: "Start Free CEE Mock Exam",
    benefits: [
      "Real CEE exam simulation with 200 questions in 3 hours",
      "Instant scoring with subject-wise breakdown",
      "Detailed explanations for every question",
      "Covers Physics, Chemistry, Botany, and Zoology",
      "Unlimited practice — completely free",
      "Mobile-friendly platform",
      "Shuffled questions and options every attempt",
      "Performance tracking to monitor progress",
    ],
    instructions: [
      "The exam has 200 MCQs: 50 Physics, 50 Chemistry, 50 Botany, 50 Zoology",
      "Total duration is 3 hours (180 minutes)",
      "Each correct answer awards 1 mark",
      "There is no negative marking — attempt every question",
      "Timer starts immediately when you click Start",
      "Do not refresh the page during the exam",
      "Results appear instantly after submission",
      "Review detailed explanations after submitting",
    ],
    faqs: [
      {
        question: "Is the CEE mock test free on Khojney?",
        answer:
          "Yes, all CEE mock tests on Khojney are 100% free with unlimited attempts and instant scoring.",
      },
      {
        question: "How many questions are in the CEE exam?",
        answer:
          "The CEE has 200 MCQs — 50 Physics, 50 Chemistry, 50 Botany, and 50 Zoology — to be completed in 3 hours.",
      },
      {
        question: "What is the pass mark for CEE MBBS?",
        answer:
          "The pass mark is 50% (100/200) for MBBS. For BDS, it's 40% (80/200).",
      },
      {
        question: "Is there negative marking in CEE?",
        answer:
          "No, there is no negative marking in CEE. You should attempt every question.",
      },
      {
        question: "How many marks do I need for IOM?",
        answer:
          "To secure a government seat at IOM (Tribhuvan University Teaching Hospital), you typically need 150+ out of 200.",
      },
    ],
    relatedResources: [
      { title: "CEE Mock Test Free Online Guide", url: "/blog/cee-mock-test-free-online-nepal-mbbs-entrance" },
      { title: "MBBS Mock Test Nepal Guide", url: "/blog/mbbs-mock-test-nepal-free-online-practice" },
      { title: "Top Medical Colleges in Nepal", url: "/blog/top-medical-colleges-nepal-2025-rankings" },
    ],
    seoContent: `## About the CEE (Common Entrance Examination)

The **Common Entrance Examination (CEE)** is the entrance exam for MBBS and BDS programs in Nepal, conducted by the Medical Education Commission (MEC). Over 18,000 students compete for approximately 2,200 MBBS seats across Nepal's medical colleges. The CEE is mandatory for admission to all government and most private medical colleges in Nepal.

## CEE Exam Pattern

The CEE exam consists of **200 multiple-choice questions** worth 200 marks, to be completed in **3 hours**:

- **Physics**: 50 questions (50 marks)
- **Chemistry**: 50 questions (50 marks)
- **Botany**: 50 questions (50 marks)
- **Zoology**: 50 questions (50 marks)

Each correct answer awards 1 mark. There is **no negative marking**. The pass mark is 50% (100/200) for MBBS and 40% (80/200) for BDS.

## CEE Eligibility

To be eligible for CEE:

- Complete +2 Science (or equivalent) with Biology, Physics, and Chemistry as main subjects
- Achieve a minimum of 50% aggregate in +2
- Be registered with MEC for the CEE exam

## CEE Syllabus

### Physics (50 Questions)
Mechanics (~30%), Electricity & Magnetism (~25%), Optics (~15%), Modern Physics (~10%), Thermodynamics & Waves (~20%).

### Chemistry (50 Questions)
Physical Chemistry (35%): atomic structure, chemical bonding, thermodynamics, equilibrium, electrochemistry. Organic Chemistry (30%): hydrocarbons, functional groups, biomolecules. Inorganic Chemistry (35%): periodic table, coordination compounds, qualitative analysis.

### Botany (50 Questions)
Plant Physiology (~20%), Genetics (~15%), Plant Diversity (~15%), Ecology (~10%), Biotechnology.

### Zoology (50 Questions)
Human Physiology (~30%): digestion, circulation, respiration, excretion, nervous, endocrine. Animal Diversity (~15%), Genetics & Evolution (~10%), Reproductive Health (~10%).

## Top Medical Colleges Under CEE

Your CEE score determines which medical college you get into:

- **IOM (Tribhuvan University Teaching Hospital)** — #1 government medical college
- **BPKIHS (B.P. Koirala Institute of Health Sciences)** — Dharan, autonomous
- **NAIHS (Nepalese Army Institute of Health Sciences)** — military-affiliated
- **Patan Academy of Health Sciences** — growing reputation
- **KUSMS (Kathmandu University School of Medical Sciences)** — Dhulikhel

## Why Take CEE Mock Tests?

The CEE exam is not just about knowledge — it's about speed, accuracy, and stamina. You need to answer **200 questions in 3 hours**, which means roughly 54 seconds per question. Without mock test practice, even the most knowledgeable students struggle to finish on time.

Mock tests help you:
1. **Build exam stamina** — 3 hours of intense concentration requires practice
2. **Improve speed** — learn shortcuts and quick-solving techniques
3. **Reduce silly mistakes** — train your brain to read questions carefully
4. **Track improvement** — quantify your progress over weeks

## How to Prepare for CEE

1. **Start 8–10 months before the exam** — the syllabus is vast
2. **Use standard reference books** — HC Verma for Physics, NCERT for Chemistry and Biology
3. **Take weekly mock tests** — start subject-wise, then full-length
4. **Analyze every mock test** — spend 30 minutes reviewing wrong answers
5. **Focus on high-yield topics** — Genetics and Human Physiology in Biology, Mechanics in Physics

Start your CEE preparation today with our free mock tests and track your progress toward becoming a doctor.`,
  },

  // ─── CMAT Full ────────────────────────────────────────────
  {
    slug: "cmat-full",
    heroTitle: "CMAT Free Mock Exam — Online Practice Test for MBA Entrance",
    heroDescription:
      "Prepare for your CMAT (Central Management Admission Test) with our completely free online mock exams. Practice 100 real exam-style questions in 90 minutes, get instant scoring, and detailed explanations.",
    seoTitle: "CMAT Mock Test Nepal Free 2025 — Practice Online | Khojney",
    seoDescription:
      "Take free CMAT mock tests online in Nepal. Complete CMAT preparation guide with syllabus, question pattern, tips, and instant scoring. Start practicing today.",
    keywords:
      "cmat mock test, cmat mock test nepal, cmat mock test free, free cmat mock test, cmat mock test online free, mock test for cmat, cmat practice test, cmat online test, cmat mock, mock test cmat, cmat test online, cmat exam mock test",
    ctaText: "Start Free CMAT Mock Exam",
    benefits: [
      "Real CMAT exam simulation with 100 questions in 90 minutes",
      "Instant scoring with section-wise breakdown",
      "Detailed explanations for every question",
      "Covers Verbal, Quantitative, Logical Reasoning, and General Awareness",
      "Unlimited practice — completely free",
      "Mobile-friendly — practice anywhere",
      "Shuffled questions every attempt",
      "Performance tracking to identify weak sections",
    ],
    instructions: [
      "The exam has 100 MCQs across 4 sections: 25 Verbal, 25 Quantitative, 25 Logical, 25 GK",
      "Total duration is 90 minutes",
      "Each correct answer awards 1 mark",
      "There is no negative marking — attempt every question",
      "Timer starts immediately when you click Start",
      "Do not refresh the page during the exam",
      "Results appear instantly after submission",
      "Review detailed explanations after submitting",
    ],
    faqs: [
      {
        question: "Is the CMAT mock test free on Khojney?",
        answer:
          "Yes, all CMAT mock tests on Khojney are completely free with unlimited attempts.",
      },
      {
        question: "How many questions are in the CMAT exam?",
        answer:
          "The CMAT exam has 100 MCQs across 4 sections (Verbal, Quantitative, Logical Reasoning, General Awareness) to be completed in 90 minutes.",
      },
      {
        question: "What is the pass mark for CMAT?",
        answer:
          "There is no formal pass mark, but you need at least 40+ to get into a decent college and 60+ for top colleges.",
      },
      {
        question: "How many times can I take CMAT?",
        answer:
          "CMAT is conducted once per year, typically in Bhadra–Ashwin (September–October).",
      },
      {
        question: "What is the full form of CMAT?",
        answer:
          "CMAT stands for Central Management Admission Test, conducted by TU's Faculty of Management.",
      },
    ],
    relatedResources: [
      { title: "CMAT Mock Test Nepal Guide", url: "/blog/cmat-mock-test-nepal-free-preparation-guide" },
      { title: "Top 10 Colleges in Nepal", url: "/blog/top-10-colleges-nepal-2025-plus2-engineering-medical" },
      { title: "Top Universities in Nepal", url: "/blog/top-universities-nepal-2025-rankings-programs" },
    ],
    seoContent: `## About the CMAT Exam

The **Central Management Admission Test (CMAT)** is the entrance exam for MBA and MBS programs at Tribhuvan University (TU) and its affiliated colleges in Nepal. Conducted by the Faculty of Management (FOM), CMAT is mandatory for admission to all TU-affiliated management colleges.

## CMAT Exam Pattern

The CMAT exam consists of **100 multiple-choice questions** worth 100 marks, to be completed in **90 minutes**:

- **Verbal Ability**: 25 questions (25 marks)
- **Quantitative Aptitude**: 25 questions (25 marks)
- **Logical Reasoning**: 25 questions (25 marks)
- **General Awareness**: 25 questions (25 marks)

There is **no negative marking** in CMAT, so you should attempt every question.

## CMAT Syllabus

### Verbal Ability (25 Questions)
Reading comprehension, vocabulary (synonyms, antonyms, analogies), grammar (sentence correction, fill in the blanks), para jumbles.

### Quantitative Aptitude (25 Questions)
Arithmetic (percentages, profit & loss, time & work, ratios), Algebra (equations, inequalities, progressions), Geometry and mensuration, Data interpretation.

### Logical Reasoning (25 Questions)
Series completion, coding-decoding, blood relations, direction sense, syllogisms, puzzles and seating arrangements.

### General Awareness (25 Questions)
Nepali current affairs, international current affairs, business and economics, history, geography, science.

## Best Management Colleges Under CMAT

Your CMAT score determines which college you get into:

- **Shanker Dev Campus** — top-ranked TU campus for management
- **Prime College** — known for BBA and MBA programs
- **Kathmandu College of Management (KCM)** — industry connections
- **Apex College** — strong MBA program
- **King's College** — entrepreneurship focus

## CMAT Preparation Strategy

### 8-Week Study Plan

**Week 1–2: Foundation**
- Learn the syllabus and exam pattern
- Take a diagnostic mock test
- Begin daily vocabulary and current affairs prep

**Week 3–4: Concept Building**
- Study each section systematically
- Practice 50 questions per section daily
- Take 2 mock tests per week

**Week 5–6: Intensive Practice**
- Take 3–4 mock tests per week
- Analyze every mock test for 30 minutes
- Focus on weak sections

**Week 7–8: Mock Test Marathon**
- Take 1 full-length mock test daily
- Revise all formulas and vocabulary
- Stay calm and confident

## Why Take CMAT Mock Tests?

Mock tests are essential for CMAT success because:

1. **Time management**: 100 questions in 90 minutes requires strategy
2. **Section balance**: You need to perform well across all 4 sections
3. **Speed**: Logical Reasoning puzzles can consume too much time
4. **Accuracy**: GK questions are either known or not — practice helps with recall speed

Start your CMAT preparation today with our free mock tests and secure admission to a top management college in Nepal.`,
  },

  // ─── Loksewa Kharidar ─────────────────────────────────────
  {
    slug: "loksewa-kharidar",
    heroTitle: "Loksewa Kharidar Free Mock Exam — Online Practice Test",
    heroDescription:
      "Prepare for your Loksewa Kharidar exam with our completely free online mock tests. Practice General Knowledge, Intelligence Test, and subject-specific questions with instant scoring.",
    seoTitle: "Loksewa Mock Test Nepal Free 2025 — PSC Preparation | Khojney",
    seoDescription:
      "Take free Loksewa mock tests online. Complete Loksewa Aayog (PSC) preparation guide with syllabus, age limit, exam pattern, tips, and practice tests.",
    keywords:
      "loksewa mock test, loksewa test, loksewa quiz, free online loksewa preparation, loksewa preparation, loksewa exam questions, loksewa online test, loksewa gk online test, loksewa practice, loksewa practice questions, pretest loksewa",
    ctaText: "Start Free Loksewa Mock Exam",
    benefits: [
      "Real Loksewa exam pattern with GK and Intelligence Test",
      "Instant scoring with section-wise breakdown",
      "Detailed explanations for every question",
      "Covers General Knowledge, Intelligence, and subject-specific topics",
      "Unlimited practice — completely free",
      "Mobile-friendly — study anywhere",
      "Both Nepali and English content",
      "Regular question updates",
    ],
    instructions: [
      "Read every question carefully before answering",
      "Timer starts immediately when you click Start",
      "Do not refresh the page during the exam",
      "Results appear instantly after submission",
      "Review detailed explanations after submitting",
      "You can retake the test unlimited times",
    ],
    faqs: [
      {
        question: "Is the Loksewa mock test free on Khojney?",
        answer:
          "Yes, all Loksewa mock tests on Khojney are completely free with unlimited attempts.",
      },
      {
        question: "What is the age limit for Loksewa in Nepal?",
        answer:
          "For general (male): 21–35 years. For women, Dalits, and disabled: 21–40 years. For existing government employees: 21–45 years.",
      },
      {
        question: "Can we give Loksewa exam in English?",
        answer:
          "Yes, Loksewa exams can be taken in either Nepali or English. Choose your preferred language when applying.",
      },
      {
        question: "What is the pass mark for Loksewa?",
        answer:
          "The pass mark is 40% of total marks for written exams. However, you need to score much higher to be in the merit list.",
      },
      {
        question: "What is the qualification for Kharidar?",
        answer:
          "SEE (SLC) pass is the minimum qualification for Kharidar.",
      },
    ],
    relatedResources: [
      { title: "Loksewa Mock Test Nepal Guide", url: "/blog/loksewa-mock-test-nepal-free-preparation-guide" },
      { title: "Loksewa Aayog Complete Guide", url: "/blog/loksewa-aayog-exam-complete-guide-2080" },
    ],
    seoContent: `## About the Loksewa Kharidar Exam

The **Loksewa Kharidar exam** is the entry-level examination conducted by the **Lok Sewa Aayog** (Public Service Commission — PSC) of Nepal. It is the first step toward a government job in Nepal, requiring only SEE (SLC) as the minimum qualification. Thousands of candidates appear for this exam every year to secure stable government employment.

## Loksewa Exam Pattern

The Kharidar exam consists of three papers:

### First Paper: General Knowledge (सामान्य ज्ञान)
- **Marks**: 100
- **Type**: Objective (MCQ)
- **Topics**: Nepal's history, geography, constitution, current affairs, sports, international organizations

### Second Paper: Intelligence Test (बुद्धि परीक्षण)
- **Marks**: 50
- **Type**: Objective
- **Topics**: Series completion, coding-decoding, blood relations, direction sense, syllogisms, puzzles

### Third Paper: Subject-specific (विषयगत)
- **Marks**: 100
- **Type**: Written (long answer)
- **Topics**: Depends on the position (administration, accounting, engineering, etc.)

## Loksewa Eligibility & Age Limit

### Educational Qualification
- **Kharidar**: SEE (SLC) pass
- **Nasu**: +2 (or equivalent) pass
- **Officer (Gazetted 3rd)**: Bachelor's degree

### Age Limit
| Category | Age Limit |
|----------|-----------|
| General (Male) | 21–35 years |
| General (Female) | 21–40 years |
| Dalit/Disabled | 21–40 years |
| Existing government employees | 21–45 years |

## Loksewa Preparation Strategy

### 1. Know the Syllabus
Download the official syllabus from the PSC website (pscnepal.gov.np). The syllabus is detailed — read it multiple times.

### 2. Read Standard Reference Books
- **General Knowledge**: Nepal Parichaya, Mero Loksewa Magazine
- **Constitution**: Constitution of Nepal 2072
- **Intelligence Test**: RS Aggarwal's reasoning book
- **Current Affairs**: The Kathmandu Post, Gorkhapatra daily

### 3. Take Weekly Mock Tests
- Start with subject-wise mock tests
- Gradually move to full-length mock tests
- Analyze every mock test for weak areas

### 4. Stay Updated on Current Affairs
- Read one national newspaper daily
- Watch news bulletins
- Follow Nepal government's official announcements
- Review the national budget and monetary policy

## Why Take Loksewa Mock Tests?

Mock tests are crucial for Loksewa preparation because:

1. **Familiarity with question patterns** — PSC repeats question structures
2. **Time management** — the exam has strict time limits
3. **Self-assessment** — identify your strong and weak subjects
4. **Confidence building** — reduce exam-day anxiety
5. **Current affairs revision** — GK questions test recent events

## Loksewa Pass Mark

| Level | Pass Mark |
|-------|-----------|
| Kharidar (written) | 40% of total |
| Nasu (written) | 40% of total |
| Officer (written) | 40% per paper |
| Interview | Must pass to be considered |

Note: Just passing isn't enough — you need to score high enough to be in the merit list for the available vacancies.

Start your Loksewa preparation today with our free mock tests and take the first step toward a secure government career in Nepal.`,
  },

  // ─── Driving License ──────────────────────────────────────
  {
    slug: "driving-license-parent",
    heroTitle: "Driving License Mock Exam — Free Online Practice Test Nepal",
    heroDescription:
      "Prepare for your driving license written test (Likhit exam) in Nepal with our completely free online mock tests. Practice traffic signs, rules, and road safety questions with instant scoring.",
    seoTitle: "Driving License Mock Test Nepal Free 2025 — Car & Bike | Khojney",
    seoDescription:
      "Take free driving license mock tests online in Nepal. Practice car, bike, and scooter license exam questions with traffic signs, rules, and instant scoring.",
    keywords:
      "driving license mock test, mock test driving license, driving test, mock test for driving license, mock test of driving licence, driving license quiz test, license mock test, license exam practice test, driving license online test practice, mock test license, license practice test, license written test, license exam test, driving license test questions, driving license exam questions",
    ctaText: "Start Free Driving License Mock Exam",
    benefits: [
      "Real driving license written test pattern",
      "Practice traffic signs, signals, and road rules",
      "Instant scoring with detailed explanations",
      "Covers both Category A (scooter/bike) and Category B (car)",
      "Available in both Nepali and English",
      "Unlimited practice — completely free",
      "Mobile-friendly — practice on your phone",
      "Updated with latest traffic rules",
    ],
    instructions: [
      "The written test has 15–20 MCQs on traffic signs and rules",
      "Duration is 15–20 minutes",
      "Pass mark is 60% (e.g., 9 out of 15 correct)",
      "Read every question carefully",
      "Do not refresh the page during the exam",
      "Results appear instantly after submission",
      "Review detailed explanations after submitting",
    ],
    faqs: [
      {
        question: "How many questions are in the driving license written test in Nepal?",
        answer:
          "The written test has 15–20 MCQs depending on the transport office. You need 60% correct to pass.",
      },
      {
        question: "What is the pass mark for the driving written test in Nepal?",
        answer:
          "The pass mark is 60% — typically 9 out of 15 or 12 out of 20 questions correct.",
      },
      {
        question: "What is the age for a scooter license in Nepal?",
        answer:
          "The minimum age for a Category A scooter/motorcycle license is 16 years.",
      },
      {
        question: "Can I give the written test in English?",
        answer:
          "Yes, the written test is available in both Nepali and English. Choose your language when applying.",
      },
      {
        question: "How much does a scooter license cost in Nepal?",
        answer:
          "Total cost including learner's license, written test, trial, and license printing: NPR 1,500–3,000 depending on the office.",
      },
    ],
    relatedResources: [
      { title: "Driving License Written Test Nepal Guide", url: "/blog/driving-license-written-test-nepal-scooter-complete-guide" },
      { title: "Driving License Mock Test Car & Bike Guide", url: "/blog/driving-license-mock-test-nepal-car-bike-practice" },
      { title: "Driving License Nepal Complete Process", url: "/blog/driving-license-nepal-complete-process-2080" },
    ],
    seoContent: `## About the Driving License Written Test in Nepal

Getting a **driving license in Nepal** involves passing two tests: the **written test (Likhit exam)** and the **trial test (practical driving test)**. The written test is often underestimated, but many candidates fail it on their first attempt. Our free mock tests help you prepare thoroughly and pass on your first try.

## Driving License Categories in Nepal

| Category | Vehicle Type | Minimum Age |
|----------|-------------|-------------|
| A | Scooter/Motorcycle (≤125cc) | 16 years |
| B | Car/Jeep/Van | 18 years |
| C | Tempo/Auto-rickshaw | 18 years |
| D | Tempo (electric) | 18 years |

## Written Test (Likhit Exam) Pattern

The written test is conducted by the **Department of Transport Management (DoTM)**:

- **Number of questions**: 15–20 MCQs (varies by office)
- **Duration**: 15–20 minutes
- **Pass mark**: **60%** (e.g., 9 out of 15 correct)
- **Language**: Available in Nepali and English
- **Format**: Computer-based or paper-based

### Topics Covered

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

## How to Apply for a Driving License

### Step 1: Get a Learner's License
1. Visit your nearest Transport Management Office
2. Bring: Citizenship photocopy, 2 passport photos, blood group certificate
3. Pay the fee (~NPR 500–1,000)
4. Get your Learner's License (valid for 3 months)

### Step 2: Practice Driving
Practice for at least 1 month with your learner's license. Display an "L" sticker on your vehicle.

### Step 3: Take the Written Test
1. Schedule your written test
2. Arrive 30 minutes early with documents
3. Take the 15–20 MCQ test
4. Get same-day results

### Step 4: Take the Trial Test
After passing the written test:
- **Scooter/Bike**: Ride through a figure-8 or serpentine track
- **Car**: Drive through a marked course, including parking and reverse

### Step 5: Get Your License
Your license will be printed within 1–2 weeks. Collect it from the transport office.

## Essential Traffic Signs to Know

### Mandatory Signs (Must Obey)
- **Stop** (red octagon) — come to a complete stop
- **No Entry** — road closed to all traffic
- **Speed Limit** (number in red circle) — maximum speed
- **No Parking** — parking prohibited
- **One Way** — traffic flows in one direction only

### Cautionary Signs
- **School Ahead** — slow down, watch for children
- **Sharp Turn** — reduce speed
- **Slippery Road** — drive carefully
- **Pedestrian Crossing** — watch for pedestrians
- **Hump/Bump Ahead** — slow down

### Informatory Signs
- **Hospital** — medical facility ahead
- **Parking** — designated parking area
- **Fuel Station** — petrol pump ahead
- **First Aid Post** — emergency medical aid

## Why Take Driving License Mock Tests?

1. **Memorize traffic signs** — there are 50+ signs to know
2. **Familiarize with question patterns** — DoTM repeats question structures
3. **Build confidence** — reduce exam-day anxiety
4. **Identify weak areas** — focus your study time
5. **Save money** — retaking the exam costs NPR 200–500 per attempt

Start practicing today with our free driving license mock tests and pass your written exam on the first attempt.`,
  },
];

async function main() {
  console.log("\n📝 Seeding SEO content for mock exams...\n");

  let updated = 0;
  let skipped = 0;

  for (const data of examSeoData) {
    const existing = await db.exam.findUnique({
      where: { slug: data.slug },
      select: { id: true, title: true },
    });

    if (!existing) {
      console.log(`  ⚠ Skipped (not found): ${data.slug}`);
      skipped++;
      continue;
    }

    const updateData: Record<string, unknown> = {};
    if (data.heroTitle) updateData.heroTitle = data.heroTitle;
    if (data.heroDescription) updateData.heroDescription = data.heroDescription;
    if (data.seoTitle) updateData.seoTitle = data.seoTitle;
    if (data.seoDescription) updateData.seoDescription = data.seoDescription;
    if (data.keywords) updateData.keywords = data.keywords;
    if (data.ctaText) updateData.ctaText = data.ctaText;
    if (data.benefits) updateData.benefits = JSON.stringify(data.benefits);
    if (data.instructions) updateData.instructions = JSON.stringify(data.instructions);
    if (data.faqs) updateData.faqs = JSON.stringify(data.faqs);
    if (data.relatedResources) updateData.relatedResources = JSON.stringify(data.relatedResources);
    if (data.seoContent) updateData.seoContent = data.seoContent;

    await db.exam.update({
      where: { slug: data.slug },
      data: updateData,
    });

    console.log(`  ✓ Updated: ${data.slug} (${existing.title})`);
    updated++;
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   ${updated} exams updated with SEO content`);
  console.log(`   ${skipped} exams skipped (not found)\n`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
