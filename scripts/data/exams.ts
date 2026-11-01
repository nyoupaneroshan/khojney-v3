/**
 * Extra Exams & Real Mock Questions Data for Nepal
 * Covering Banking (RBB, NBL), Loksewa Computer Operator, BSc CSIT Entrance,
 * Medical Licensing (NMCLE), Pharmacy Licensing (NPC), and KUUMAT.
 */

export interface ExamQuestionSeed {
  question: string;
  options: string[]; // 4 options
  correctIdx: number; // 0 to 3
  explanation: string;
  marks: number;
}

export interface ExamSeedGroup {
  parent: {
    slug: string;
    title: string;
    description: string;
    categoryId?: string;
    parentId?: string; // root parent
    durationMin: number;
    totalMarks: number;
    tags: string;
  };
  child: {
    slug: string;
    title: string;
    description: string;
    categoryId?: string;
    durationMin: number;
    totalMarks: number;
    passingMarks: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tags: string;
  };
  questions: ExamQuestionSeed[];
}

export const EXTRA_EXAMS_DATA: ExamSeedGroup[] = [
  // ─── 1. RASTRIYA BANIJYA BANK (RBB LEVEL 4) ────────────────
  {
    parent: {
      slug: "rbb-assistant",
      title: "Rastriya Banijya Bank (RBB) Level 4 Assistant",
      description: "Comprehensive competitive exam preparation for Rastriya Banijya Bank Limited Level 4 Assistant position, covering banking acts, accounting principles, economics, and general knowledge.",
      categoryId: "cmqzecmzk000alqf3tczbx9n0",
      parentId: "cmqzeqflu00sdlqmj5myph56l", // banking-exams-parent
      durationMin: 45,
      totalMarks: 50,
      tags: "RBB,Banking,Level 4,Assistant,Loksewa Banking",
    },
    child: {
      slug: "rbb-assistant-mock-set-1",
      title: "RBB Assistant Level 4 Mock Test — Set 1",
      description: "Timed mock test for Rastriya Banijya Bank Level 4 Assistant recruitment with authentic questions on Nepal Rastra Bank Act, BAFIA, and banking principles.",
      categoryId: "cmqzecmzk000alqf3tczbx9n0",
      durationMin: 30,
      totalMarks: 20,
      passingMarks: 10,
      difficulty: "MEDIUM",
      tags: "RBB,Banking,Mock Test,Level 4",
    },
    questions: [
      {
        question: "According to the Bank and Financial Institutions Act (BAFIA) 2073, what is the minimum promoter shareholding lock-in period after commercial operation?",
        options: ["2 Years", "5 Years", "7 Years", "10 Years"],
        correctIdx: 1,
        explanation: "Under Section 9 of BAFIA 2073, promoter shares cannot be sold or transferred for at least 5 years from the date of commercial commencement.",
        marks: 2,
      },
      {
        question: "When was Rastriya Banijya Bank Limited established in Nepal?",
        options: ["2022 Magh 10 BS", "1994 Kartik 30 BS", "2031 Ashoj 12 BS", "2013 Chaitra 21 BS"],
        correctIdx: 0,
        explanation: "Rastriya Banijya Bank was established on Magh 10, 2022 BS (January 23, 1966 AD) under the Rastriya Banijya Bank Act 2021.",
        marks: 2,
      },
      {
        question: "Under the Nepal Rastra Bank Act 2058, who appoints the Governor of Nepal Rastra Bank?",
        options: ["President of Nepal", "Government of Nepal, Council of Ministers", "Finance Minister", "Public Service Commission"],
        correctIdx: 1,
        explanation: "According to Section 15 of NRB Act 2058, the Government of Nepal, Council of Ministers appoints the Governor based on the recommendation of a three-member committee.",
        marks: 2,
      },
      {
        question: "What is the Cash Reserve Ratio (CRR) requirement maintained by commercial banks with Nepal Rastra Bank as of recent monetary policy directives?",
        options: ["3.0%", "4.0%", "5.5%", "6.0%"],
        correctIdx: 1,
        explanation: "Commercial banks in Nepal are required to maintain a Cash Reserve Ratio (CRR) of 4.0% of their total domestic deposit liabilities with the central bank.",
        marks: 2,
      },
      {
        question: "Which of the following is considered an intangible asset in accounting for banks?",
        options: ["Cash in Vault", "Treasury Bills", "Banking Software and Goodwill", "ATM Machines"],
        correctIdx: 2,
        explanation: "Goodwill, core banking software licenses, and patents lack physical substance and are classified as intangible assets under NAS 38 / IFRS 38.",
        marks: 2,
      },
      {
        question: "In double-entry bookkeeping, what is the golden rule for Personal Accounts?",
        options: ["Debit what comes in, credit what goes out", "Debit all expenses and losses, credit all incomes and gains", "Debit the receiver, credit the giver", "Debit all assets, credit all liabilities"],
        correctIdx: 2,
        explanation: "The golden rule for Personal Accounts (individuals, firms, banks) is 'Debit the receiver, Credit the giver'.",
        marks: 2,
      },
      {
        question: "What is the primary objective of KYC (Know Your Customer) compliance in banking?",
        options: ["Increasing bank interest margins", "Preventing money laundering and terrorism financing (AML/CFT)", "Selling credit cards", "Reducing operating costs"],
        correctIdx: 1,
        explanation: "KYC guidelines are mandatory under the Anti-Money Laundering Act 2064 to establish customer identity, beneficial ownership, and prevent illicit financial transactions.",
        marks: 2,
      },
      {
        question: "Which electronic payment system operated by Nepal Rastra Bank enables high-value real-time gross settlements?",
        options: ["IPS (Interbank Payment System)", "connectIPS", "RTGS (Real Time Gross Settlement)", "NCHL-ECC"],
        correctIdx: 2,
        explanation: "RTGS is owned and operated by NRB for continuous, real-time settlement of high-value interbank and customer transactions without netting.",
        marks: 2,
      },
      {
        question: "In banking terminology, what does 'NPL' stand for?",
        options: ["Net Profit Limit", "Non-Performing Loan", "National Payment Ledger", "Net Portfolio Liability"],
        correctIdx: 1,
        explanation: "NPL stands for Non-Performing Loan, defined by NRB directives as loans overdue past 90 days (classified as Substandard, Doubtful, or Loss).",
        marks: 2,
      },
      {
        question: "What is the maximum single borrower limit (funded facility) set by NRB for commercial banks?",
        options: ["15% of Core Capital", "25% of Core Capital", "35% of Total Capital", "50% of Core Capital"],
        correctIdx: 1,
        explanation: "Under NRB Unified Directives on single obligor limits, banks cannot extend funded credit exposure exceeding 25% of their core capital to a single borrower or group.",
        marks: 2,
      },
    ],
  },

  // ─── 2. LOKSEWA COMPUTER OPERATOR ───────────────────────────
  {
    parent: {
      slug: "loksewa-computer-operator",
      title: "Loksewa Computer Operator (Technical 5th Level)",
      description: "Dedicated preparation for Public Service Commission (Lok Sewa Aayog) Computer Operator and Assistant Computer Operator written and practical exams.",
      categoryId: "cmqzecjgf0001lqf30uf1n6pn",
      parentId: "cmqzei8jp0001lqmjjoxj5r3v", // loksewa-psc
      durationMin: 45,
      totalMarks: 50,
      tags: "Loksewa,Computer Operator,IT,Technical PSC",
    },
    child: {
      slug: "loksewa-computer-operator-set-1",
      title: "Loksewa Computer Operator Mock Test — Set 1",
      description: "High-yield multiple choice questions following the exact syllabus of PSC Computer Operator covering MS Office, operating systems, hardware, and networking.",
      categoryId: "cmqzecjgf0001lqf30uf1n6pn",
      durationMin: 30,
      totalMarks: 20,
      passingMarks: 10,
      difficulty: "MEDIUM",
      tags: "Computer Operator,Loksewa,Technical,Mock Test",
    },
    questions: [
      {
        question: "Which shortcut key in Microsoft Word is used to insert a page break immediately?",
        options: ["Ctrl + Enter", "Alt + Enter", "Shift + Enter", "Ctrl + Shift + Enter"],
        correctIdx: 0,
        explanation: "Pressing Ctrl + Enter inserts a hard page break at the cursor position in MS Word.",
        marks: 2,
      },
      {
        question: "In Microsoft Excel, which function is used to count non-empty cells in a range?",
        options: ["COUNT()", "COUNTA()", "COUNTBLANK()", "COUNTIF()"],
        correctIdx: 1,
        explanation: "COUNTA() counts all cells containing any type of information (numbers, text, errors, formulas), whereas COUNT() counts only numeric values.",
        marks: 2,
      },
      {
        question: "In Nepali typing using traditional fonts like Preeti, which key combination is pressed to produce the letter 'त्र'?",
        options: ["Alt + 0170", "Shift + 4", "Shift + 5", "Ctrl + Alt + T"],
        correctIdx: 1,
        explanation: "In the Preeti and Kantipur keyboard layouts, pressing Shift + 4 generates the conjunct character 'त्र'.",
        marks: 2,
      },
      {
        question: "Which OSI model layer is responsible for routing data packets based on IP addresses?",
        options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
        correctIdx: 1,
        explanation: "The Network Layer (Layer 3) handles logical addressing (IP addresses), packet routing, and subnet management across interconnected networks.",
        marks: 2,
      },
      {
        question: "What is the default port number used by the HTTPS (Hypertext Transfer Protocol Secure) protocol?",
        options: ["21", "25", "80", "443"],
        correctIdx: 3,
        explanation: "HTTPS encrypts communications over SSL/TLS and listens on TCP port 443 by default (port 80 is used by unencrypted HTTP).",
        marks: 2,
      },
      {
        question: "In relational database management systems (RDBMS), what ensures entity integrity in a table?",
        options: ["Foreign Key", "Primary Key", "Index", "Composite View"],
        correctIdx: 1,
        explanation: "Entity integrity requires that every table has a Primary Key that is unique and cannot contain null values.",
        marks: 2,
      },
      {
        question: "Which command in the Windows Command Prompt displays the IP configuration and MAC address of all network adapters?",
        options: ["ping localhost", "ipconfig /all", "netstat -a", "tracert 8.8.8.8"],
        correctIdx: 1,
        explanation: "Running 'ipconfig /all' displays detailed network information including IPv4/IPv6 addresses, subnet masks, default gateways, and physical MAC addresses.",
        marks: 2,
      },
      {
        question: "In MS PowerPoint, which function key starts the slide show from the very first slide?",
        options: ["F2", "F5", "Shift + F5", "F7"],
        correctIdx: 1,
        explanation: "F5 begins the presentation from slide 1, whereas Shift + F5 starts the presentation from the currently active slide.",
        marks: 2,
      },
      {
        question: "What type of computer memory is volatile and loses its contents when power is turned off?",
        options: ["ROM (Read Only Memory)", "Flash EEPROM", "RAM (Random Access Memory)", "Hard Disk Drive"],
        correctIdx: 2,
        explanation: "RAM is volatile memory; data is stored as electrical charges in capacitors/transistors that dissipate immediately when electrical power is disconnected.",
        marks: 2,
      },
      {
        question: "Under Nepal's Electronic Transactions Act (ETA) 2063, what is the legal validity of digital signatures?",
        options: ["Invalid in courts", "Same legal status as handwritten signatures", "Valid only for government officials", "Requires notarization on stamp paper"],
        correctIdx: 1,
        explanation: "Section 7 of the Electronic Transaction Act 2063 confers identical legal effect, validity, and enforceability upon verified digital signatures as handwritten signatures.",
        marks: 2,
      },
    ],
  },

  // ─── 3. TU BSC CSIT ENTRANCE EXAM ───────────────────────────
  {
    parent: {
      slug: "bsc-csit-entrance",
      title: "TU BSc CSIT Entrance Examination",
      description: "Complete preparation for Tribhuvan University Institute of Science and Technology (IoST) Bachelor of Science in Computer Science and Information Technology (BSc CSIT) Entrance.",
      categoryId: "cmqzeckin0004lqf3pf8jxy7p",
      parentId: "cmqzen4pl00fplqmjoudhgywx", // engineering-entrance-parent
      durationMin: 60,
      totalMarks: 100,
      tags: "BSc CSIT,IoST,TU,Computer Science,Entrance Exam",
    },
    child: {
      slug: "bsc-csit-entrance-mock-set-1",
      title: "BSc CSIT Entrance Mock Test — Set 1",
      description: "Model entrance exam for TU BSc CSIT candidates with representative questions in Physics, Mathematics, Chemistry, Computer, and English.",
      categoryId: "cmqzeckin0004lqf3pf8jxy7p",
      durationMin: 30,
      totalMarks: 20,
      passingMarks: 7,
      difficulty: "HARD",
      tags: "CSIT,TU IoST,Mock Test,Science Entrance",
    },
    questions: [
      {
        question: "If a matrix A has dimensions 3 x 4 and matrix B has dimensions 4 x 2, what are the dimensions of the product matrix AB?",
        options: ["4 x 4", "3 x 2", "2 x 3", "Undefined product"],
        correctIdx: 1,
        explanation: "When multiplying an (m x n) matrix with an (n x p) matrix, the resulting matrix has dimensions (m x p). Here: (3 x 4) * (4 x 2) = 3 x 2.",
        marks: 2,
      },
      {
        question: "What is the limit of (sin 3x) / x as x approaches 0?",
        options: ["0", "1", "3", "Undefined"],
        correctIdx: 2,
        explanation: "lim_{x->0} (sin 3x)/x = 3 * lim_{x->0} (sin 3x)/(3x) = 3 * 1 = 3.",
        marks: 2,
      },
      {
        question: "A projectile is launched with initial velocity v at an angle of 45 degrees to the horizontal. What is its maximum horizontal range in terms of g?",
        options: ["v^2 / g", "v^2 / 2g", "2v^2 / g", "v / g"],
        correctIdx: 0,
        explanation: "Range R = (v^2 * sin 2θ) / g. For θ = 45°, sin(2*45°) = sin 90° = 1. Therefore, maximum range R_max = v^2 / g.",
        marks: 2,
      },
      {
        question: "Which logic gate outputs 0 ONLY when both of its inputs are 1?",
        options: ["NOR gate", "NAND gate", "XOR gate", "AND gate"],
        correctIdx: 1,
        explanation: "A NAND gate is the inverse of an AND gate; its output is 1 for (0,0), (0,1), (1,0) and 0 only when both inputs are 1.",
        marks: 2,
      },
      {
        question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (AVL tree) with n nodes?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIdx: 1,
        explanation: "In a balanced BST, height h = O(log n). Since each comparison traverses down one level, search takes O(log n) time.",
        marks: 2,
      },
      {
        question: "What is the pH of a 0.001 M solution of Hydrochloric Acid (HCl)?",
        options: ["1", "2", "3", "4"],
        correctIdx: 2,
        explanation: "HCl is a strong acid that fully dissociates: [H+] = 10^-3 M. pH = -log10[H+] = -log10(10^-3) = 3.",
        marks: 2,
      },
      {
        question: "In C programming, what will be the output of `printf(\"%d\", 5 >> 1);`?",
        options: ["10", "2", "2.5", "5"],
        correctIdx: 1,
        explanation: "The right-shift operator (>>) shifts binary bits to the right by 1, which performs integer division by 2. Binary 101 >> 1 = 010 (decimal 2).",
        marks: 2,
      },
      {
        question: "Two capacitors of capacitance 6 µF and 3 µF are connected in series. What is their equivalent capacitance?",
        options: ["9 µF", "2 µF", "18 µF", "4.5 µF"],
        correctIdx: 1,
        explanation: "In series: 1/C_eq = 1/C1 + 1/C2 = 1/6 + 1/3 = 3/6 = 1/2. Therefore, C_eq = 2 µF.",
        marks: 2,
      },
      {
        question: "Which normal form in relational database design removes transitive functional dependencies?",
        options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
        correctIdx: 2,
        explanation: "3NF requires the table to be in 2NF and ensures that no non-prime attribute is transitively dependent on any candidate key (X -> Y and Y -> Z).",
        marks: 2,
      },
      {
        question: "Choose the correct antonym of the word 'EPHEMERAL':",
        options: ["Transient", "Fleeting", "Permanent", "Ambiguous"],
        correctIdx: 2,
        explanation: "'Ephemeral' means lasting for a very short time. Its direct opposite is 'Permanent' or 'Eternal'.",
        marks: 2,
      },
    ],
  },

  // ─── 4. NEPAL MEDICAL COUNCIL LICENSING (NMCLE) ─────────────
  {
    parent: {
      slug: "nmcle-doctor-licensing",
      title: "Nepal Medical Council Licensing Examination (NMCLE)",
      description: "Essential national licensing examination conducted by the Nepal Medical Council (NMC) for MBBS and BDS graduates to obtain medical practitioner registration in Nepal.",
      categoryId: "cmqzeckqk0005lqf3iu5hbhmx",
      parentId: "cmqzerv5i00zflqmjl1ek0pwr", // health-license-parent
      durationMin: 60,
      totalMarks: 100,
      tags: "NMCLE,NMC,Medical License,MBBS,Doctor Licensing Nepal",
    },
    child: {
      slug: "nmcle-mock-test-set-1",
      title: "NMCLE Medical License Mock Test — Set 1",
      description: "Clinical vignette-based mock questions designed by medical education guidelines for Nepal Medical Council licensing candidates.",
      categoryId: "cmqzeckqk0005lqf3iu5hbhmx",
      durationMin: 30,
      totalMarks: 20,
      passingMarks: 10,
      difficulty: "HARD",
      tags: "NMCLE,Clinical,Medicine,License Mock",
    },
    questions: [
      {
        question: "A 45-year-old male presents to the emergency room with acute retrosternal crushing chest pain radiating to the left arm. ECG demonstrates ST elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?",
        options: ["Left Anterior Descending (LAD)", "Right Coronary Artery (RCA)", "Left Circumflex (LCx)", "Left Main Coronary Artery"],
        correctIdx: 1,
        explanation: "Leads II, III, and aVF correspond to the inferior myocardial wall, supplied in ~85% of individuals (right-dominant circulation) by the Right Coronary Artery (RCA).",
        marks: 2,
      },
      {
        question: "What is the drug of choice for immediate treatment of acute anaphylactic shock in adults?",
        options: ["Intravenous Hydrocortisone", "Intramuscular Epinephrine (Adrenaline) 1:1,000", "Intravenous Chlorpheniramine", "Subcutaneous Salbutamol"],
        correctIdx: 1,
        explanation: "Intramuscular Epinephrine (1:1000 dilution, 0.5 mg in the anterolateral thigh) is the first-line lifesaving medication for anaphylaxis.",
        marks: 2,
      },
      {
        question: "A 28-year-old female presents with fever, right lower quadrant abdominal pain, anorexia, and tenderness at McBurney's point with rebound tenderness. What is the most likely diagnosis?",
        options: ["Acute Cholecystitis", "Acute Appendicitis", "Acute Pancreatitis", "Renal Calculi"],
        correctIdx: 1,
        explanation: "Fever, migratory right iliac fossa pain, anorexia, and localized tenderness at McBurney's point are classic pathognomonic signs of Acute Appendicitis.",
        marks: 2,
      },
      {
        question: "In Nepal's National Tuberculosis Program (NTP), what is the standard intensive phase antibiotic regimen for newly diagnosed pulmonary tuberculosis?",
        options: ["2HRZE (2 months Isoniazid, Rifampicin, Pyrazinamide, Ethambutol)", "4HR (4 months Isoniazid, Rifampicin)", "6HREZ", "2HR + 4E"],
        correctIdx: 0,
        explanation: "The standard NTP Nepal protocol for new drug-susceptible TB cases is 2 months intensive phase with 4 drugs (2HRZE: Isoniazid, Rifampicin, Pyrazinamide, Ethambutol) followed by 4 months continuation (4HR).",
        marks: 2,
      },
      {
        question: "Which cranial nerve lesion causes Bell's Palsy (unilateral lower motor neuron facial muscle paralysis)?",
        options: ["Trigeminal Nerve (CN V)", "Facial Nerve (CN VII)", "Glossopharyngeal Nerve (CN IX)", "Vagus Nerve (CN X)"],
        correctIdx: 1,
        explanation: "Bell's Palsy is acute lower motor neuron paralysis of the Facial Nerve (CN VII), causing inability to close the eye, loss of nasolabial fold, and facial drooping on the affected side.",
        marks: 2,
      },
      {
        question: "What is the recommended first-line intravenous fluid for resuscitation of a patient with severe hypovolemic shock?",
        options: ["5% Dextrose Water", "0.9% Normal Saline or Ringer's Lactate (Balanced Crystalloid)", "3% Hypertonic Saline", "Fresh Frozen Plasma"],
        correctIdx: 1,
        explanation: "Balanced crystalloid solutions such as Ringer's Lactate or 0.9% Normal Saline are the first-line crystalloids for rapid volume expansion in hypovolemia.",
        marks: 2,
      },
      {
        question: "Which pathogen is the most frequent cause of community-acquired bacterial pneumonia (CAP) in adults?",
        options: ["Streptococcus pneumoniae", "Mycoplasma pneumoniae", "Klebsiella pneumoniae", "Pseudomonas aeruginosa"],
        correctIdx: 0,
        explanation: "Streptococcus pneumoniae (pneumococcus) remains the predominant bacterial pathogen causing community-acquired pneumonia globally.",
        marks: 2,
      },
      {
        question: "In pediatric Advanced Life Support, what is the compression-to-ventilation ratio for two-rescuer CPR on a child?",
        options: ["30:2", "15:2", "5:1", "20:2"],
        correctIdx: 1,
        explanation: "For two-rescuer pediatric CPR (infants and children up to puberty), the compression-to-ventilation ratio is 15:2 (single rescuer is 30:2).",
        marks: 2,
      },
      {
        question: "Which hormone is secreted by the beta cells of the Islets of Langerhans in the pancreas?",
        options: ["Glucagon", "Somatostatin", "Insulin", "Pancreatic Polypeptide"],
        correctIdx: 2,
        explanation: "Insulin is synthesized and secreted by beta cells, while alpha cells secrete glucagon and delta cells secrete somatostatin.",
        marks: 2,
      },
      {
        question: "What is the antidote used to treat acute paracetamol (acetaminophen) toxicity and prevent acute liver failure?",
        options: ["Naloxone", "N-acetylcysteine (NAC)", "Flumazenil", "Atropine"],
        correctIdx: 1,
        explanation: "N-acetylcysteine (NAC) replenishes intracellular glutathione stores and detoxifies NAPQI, preventing paracetamol-induced hepatic centrilobular necrosis.",
        marks: 2,
      },
    ],
  },

  // ─── 5. KUUMAT (KU BBA / BBIS ENTRANCE) ─────────────────────
  {
    parent: {
      slug: "kuumat-management-entrance",
      title: "KUUMAT (Kathmandu University Undergraduate Management Admission Test)",
      description: "Official entrance exam conducted by Kathmandu University School of Management (KUSOM) for admission into BBA, BBIS, and professional management degrees.",
      categoryId: "cmqzecjw70003lqf3lg3efvtu",
      parentId: "cmqzesc74011llqmjab7nzeyj", // management-entrance-parent
      durationMin: 90,
      totalMarks: 100,
      tags: "KUUMAT,KUSOM,BBA Entrance,KU Management",
    },
    child: {
      slug: "kuumat-mock-test-set-1",
      title: "KUUMAT Mock Test — Set 1",
      description: "Rigorous aptitude test simulating the KUSOM KUUMAT covering Verbal Reasoning, Quantitative Aptitude, and Critical Analysis.",
      categoryId: "cmqzecjw70003lqf3lg3efvtu",
      durationMin: 30,
      totalMarks: 20,
      passingMarks: 10,
      difficulty: "HARD",
      tags: "KUUMAT,KUSOM,Mock Test,BBA Aptitude",
    },
    questions: [
      {
        question: "A shopkeeper marks an item 40% above the cost price and then offers a discount of 25% on the marked price. What is the net profit percentage?",
        options: ["5%", "10%", "15%", "20%"],
        correctIdx: 0,
        explanation: "Let Cost Price = 100. Marked Price = 140. Selling Price = 140 - (25% of 140) = 140 - 35 = 105. Net Profit = 105 - 100 = 5%.",
        marks: 2,
      },
      {
        question: "Complete the analogy: CATALYST : REACTION :: ?",
        options: ["Spark : Explosion", "Incentive : Productivity", "Fuel : Car", "Food : Hunger"],
        correctIdx: 1,
        explanation: "A catalyst stimulates and accelerates a reaction just as an incentive stimulates and accelerates employee productivity.",
        marks: 2,
      },
      {
        question: "If 12 men can complete a project in 18 days working together, how many days will 9 men take to complete the same project?",
        options: ["20 days", "24 days", "22 days", "26 days"],
        correctIdx: 1,
        explanation: "Total work = 12 * 18 = 216 man-days. Time required by 9 men = 216 / 9 = 24 days.",
        marks: 2,
      },
      {
        question: "Select the sentence with correct grammatical agreement:",
        options: [
          "Neither the CEO nor the directors was present at the shareholder summit.",
          "Neither the CEO nor the directors were present at the shareholder summit.",
          "Neither the CEO or the directors has been present at the shareholder summit.",
          "Neither the CEO nor the directors is present at the shareholder summit."
        ],
        correctIdx: 1,
        explanation: "When subjects are joined by 'neither... nor', the verb agrees with the nearer subject ('directors' is plural, so plural verb 'were' is correct).",
        marks: 2,
      },
      {
        question: "The sum of three consecutive odd integers is 147. What is the largest of these integers?",
        options: ["47", "49", "51", "53"],
        correctIdx: 2,
        explanation: "Let the integers be x-2, x, x+2. Sum = 3x = 147 => x = 49. The integers are 47, 49, 51. The largest integer is 51.",
        marks: 2,
      },
      {
        question: "Which of the following best defines 'Opportunity Cost' in economic theory?",
        options: [
          "The monetary cost incurred in buying a commodity",
          "The value of the next best alternative forgone when making a decision",
          "The accounting cost of depreciation",
          "The total variable expense of production"
        ],
        correctIdx: 1,
        explanation: "Opportunity cost represents the potential benefits an individual or business misses out on when choosing one alternative over another.",
        marks: 2,
      },
      {
        question: "What is the probability of rolling a sum of 8 with two fair six-sided dice?",
        options: ["5/36", "1/6", "7/36", "1/9"],
        correctIdx: 0,
        explanation: "Pairs summing to 8 are: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes out of 36 total outcomes = 5/36.",
        marks: 2,
      },
      {
        question: "Identify the word that is closest in meaning to 'UBIQUITOUS':",
        options: ["Rare", "Omnipresent", "Threatening", "Obsolete"],
        correctIdx: 1,
        explanation: "'Ubiquitous' means present, appearing, or found everywhere simultaneously; synonymous with 'Omnipresent'.",
        marks: 2,
      },
      {
        question: "In a class of 60 students, 40 play football and 30 play cricket. If 15 students play both games, how many students play neither game?",
        options: ["5", "10", "15", "0"],
        correctIdx: 0,
        explanation: "Total playing at least one = n(F ∪ C) = n(F) + n(C) - n(F ∩ C) = 40 + 30 - 15 = 55. Students playing neither = 60 - 55 = 5.",
        marks: 2,
      },
      {
        question: "Find the missing term in the sequence: 3, 7, 15, 31, 63, ?",
        options: ["95", "127", "125", "129"],
        correctIdx: 1,
        explanation: "Each term is obtained by multiplying the previous term by 2 and adding 1: (63 * 2) + 1 = 126 + 1 = 127.",
        marks: 2,
      },
    ],
  },
];
