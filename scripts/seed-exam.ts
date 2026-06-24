/**
 * seed-exam.ts — Comprehensive exam seed for Khojney.com
 *
 * Creates:
 * 1. 16 parent exam categories (isParent=true, no questions)
 * 2. Sub-exam parents under each (e.g., Kharidar under Loksewa)
 * 3. 5 sets per sub-exam (child exams with 10 questions each)
 *
 * Questions and options are shuffled at runtime by the exam runner.
 *
 * Run: `bun run scripts/seed-exam.ts`
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface Q {
  q: string;
  opts: string[];
  correct: number;
  explanation: string;
}

// ─── Helpers ─────────────────────────────────────────────────

async function getCategoryId(slug: string): Promise<string | null> {
  const cat = await db.category.findUnique({ where: { slug } });
  return cat?.id ?? null;
}

const parentCache: Record<string, string> = {};

async function createParent(
  slug: string,
  title: string,
  description: string,
  categorySlug?: string,
  parentSlug?: string,
): Promise<string> {
  const categoryId = categorySlug ? await getCategoryId(categorySlug) : null;
  const parentId = parentSlug ? parentCache[parentSlug] ?? null : null;
  const exam = await db.exam.upsert({
    where: { slug },
    update: { title, description, categoryId, parentId, isParent: true, isPublished: true, shuffleQuestions: true, shuffleOptions: true },
    create: {
      slug, title, description, categoryId, parentId,
      isParent: true, isPublished: true, isFeatured: false,
      examType: "MOCK", durationMin: 0, totalMarks: 0, passingMarks: 0,
      difficulty: "MEDIUM", shuffleQuestions: true, shuffleOptions: true,
      tags: slug,
    },
  });
  parentCache[slug] = exam.id;
  return exam.id;
}

async function createSet(
  parentSlug: string,
  setNum: number,
  title: string,
  description: string,
  durationMin: number,
  totalMarks: number,
  difficulty: string,
  categorySlug: string | undefined,
  questions: Q[],
): Promise<void> {
  const parentId = parentCache[parentSlug];
  if (!parentId) {
    console.error(`Parent not found: ${parentSlug}`);
    return;
  }
  const categoryId = categorySlug ? await getCategoryId(categorySlug) : null;
  const slug = `${parentSlug}-set-${setNum}`;
  const exam = await db.exam.upsert({
    where: { slug },
    update: {
      title, description, parentId, categoryId,
      durationMin, totalMarks, passingMarks: Math.floor(totalMarks * 0.4),
      difficulty, isParent: false, isPublished: true,
      shuffleQuestions: true, shuffleOptions: true,
      examType: "MOCK",
    },
    create: {
      slug, title, description, parentId, categoryId,
      durationMin, totalMarks, passingMarks: Math.floor(totalMarks * 0.4),
      difficulty, isParent: false, isPublished: true, isFeatured: setNum === 1,
      examType: "MOCK", shuffleQuestions: true, shuffleOptions: true,
      tags: `${parentSlug},set-${setNum}`,
    },
  });
  // Delete old questions and create new ones
  await db.examQuestion.deleteMany({ where: { examId: exam.id } });
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await db.examQuestion.create({
      data: {
        examId: exam.id,
        type: "MCQ",
        question: q.q,
        options: JSON.stringify(q.opts),
        correctIdx: q.correct,
        explanation: q.explanation,
        marks: 1,
        order: i,
      },
    });
  }
}

// ─── Question Banks ──────────────────────────────────────────

// Loksewa Kharidar — General knowledge set
const loksewaGK: Q[] = [
  { q: "The present Constitution of Nepal was promulgated on which date?", opts: ["September 19, 2015", "September 20, 2015", "August 19, 2015", "October 19, 2015"], correct: 1, explanation: "Constitution of Nepal 2072 BS was promulgated on Ashoj 1, 2072 BS (September 20, 2015)." },
  { q: "How many provinces are there in Nepal?", opts: ["5", "6", "7", "8"], correct: 2, explanation: "Nepal has 7 provinces as per Schedule 4 of the Constitution." },
  { q: "Which article of the Constitution deals with Right to Equality?", opts: ["Article 12", "Article 14", "Article 17", "Article 18"], correct: 3, explanation: "Article 18 guarantees Right to Equality." },
  { q: "The highest peak in Nepal (and the world) is:", opts: ["K2", "Kanchenjunga", "Mount Everest", "Annapurna"], correct: 2, explanation: "Mount Everest (Sagarmatha) — 8,848.86 m." },
  { q: "The capital city of Nepal is:", opts: ["Pokhara", "Kathmandu", "Lalitpur", "Biratnagar"], correct: 1, explanation: "Kathmandu is the capital and largest city of Nepal." },
  { q: "Who is the head of state in Nepal?", opts: ["President", "Prime Minister", "King", "Chief Justice"], correct: 0, explanation: "Nepal is a federal republic; the President is the head of state." },
  { q: "The Treaty of Sugauli was signed between Nepal and:", opts: ["China", "British India", "Tibet", "Sikkim"], correct: 1, explanation: "Treaty of Sugauli (1816) with British East India Company." },
  { q: "The largest lake in Nepal is:", opts: ["Phewa Lake", "Rara Lake", "Tilicho Lake", "Begnas Lake"], correct: 1, explanation: "Rara Lake is the largest natural lake in Nepal." },
  { q: "The currency of Nepal (NPR) is regulated by:", opts: ["Nepal Rastra Bank", "Nepal Bank Limited", "Ministry of Finance", "Asian Development Bank"], correct: 0, explanation: "Nepal Rastra Bank (NRB) is the central bank of Nepal." },
  { q: "The first elected Prime Minister of Nepal was:", opts: ["Girija Prasad Koirala", "BP Koirala", "Krishna Prasad Bhattarai", "Manmohan Adhikari"], correct: 1, explanation: "BP Koirala became the first elected PM in 1959." },
];

const loksewaGK2: Q[] = [
  { q: "The Parliament of Nepal consists of:", opts: ["Lok Sabha and Rajya Sabha", "House of Representatives and National Assembly", "Pratinidhi Sabha and Rashtriya Sabha", "Only House of Representatives"], correct: 1, explanation: "Federal Parliament = House of Representatives + National Assembly." },
  { q: "The national flower of Nepal is:", opts: ["Rose", "Rhododendron (Lali Gurans)", "Lotus", "Sunflower"], correct: 1, explanation: "Rhododendron (Lali Gurans) is the national flower." },
  { q: "The national bird of Nepal is:", opts: ["Peacock", "Danphe (Himalayan Monal)", "Eagle", "Crow"], correct: 1, explanation: "Danphe (Impeyan Pheasant) is the national bird." },
  { q: "Nepal became a federal democratic republic in:", opts: ["2006", "2007", "2008", "2015"], correct: 2, explanation: "Nepal was declared a republic on May 28, 2008 (Jestha 15, 2065 BS)." },
  { q: "The term of the House of Representatives is:", opts: ["4 years", "5 years", "6 years", "Until dissolution"], correct: 1, explanation: "The House of Representatives serves a 5-year term." },
  { q: "The Supreme Court of Nepal is located in:", opts: ["Pokhara", "Lalitpur", "Kathmandu", "Biratnagar"], correct: 2, explanation: "The Supreme Court is in Kathmandu." },
  { q: "Which is the largest district of Nepal by area?", opts: ["Humla", "Dolpa", "Mugu", "Mustang"], correct: 1, explanation: "Dolpa is the largest district (5,855 km²)." },
  { q: "The SAARC Secretariat is located in:", opts: ["New Delhi", "Kathmandu", "Dhaka", "Colombo"], correct: 1, explanation: "The SAARC Secretariat is in Kathmandu, Nepal." },
  { q: "Nepal's national flag is unique because:", opts: ["It is the largest flag", "It is the only non-rectangular flag", "It has 3 colors", "It has a dragon"], correct: 1, explanation: "Nepal's flag is the only non-rectangular national flag in the world." },
  { q: "The Election Commission of Nepal is:", opts: ["A ministry", "A constitutional body", "A parliamentary committee", "A judicial body"], correct: 1, explanation: "The Election Commission is an independent constitutional body." },
];

const loksewaGK3: Q[] = [
  { q: "The national animal of Nepal is:", opts: ["Tiger", "Cow", "Elephant", "Snow Leopard"], correct: 1, explanation: "The cow is the national animal of Nepal." },
  { q: "How many members are in the National Assembly?", opts: ["54", "56", "59", "60"], correct: 2, explanation: "The National Assembly has 59 members (56 elected + 3 nominated)." },
  { q: "The Prime Minister is appointed by:", opts: ["The President", "The Parliament", "The Chief Justice", "The People"], correct: 0, explanation: "The President appoints the PM, who must have majority support in the House." },
  { q: "Mt. Everest is known locally as:", opts: ["Kanchenjunga", "Sagarmatha", "Chomolungma", "Annapurna"], correct: 1, explanation: "In Nepali, Mt. Everest is called Sagarmatha." },
  { q: "The total area of Nepal is approximately:", opts: ["1,47,516 sq km", "1,50,000 sq km", "1,40,000 sq km", "1,55,000 sq km"], correct: 0, explanation: "Nepal covers 147,516 sq km." },
  { q: "Which is the smallest district of Nepal by area?", opts: ["Kathmandu", "Bhaktapur", "Lalitpur", "Ilam"], correct: 1, explanation: "Bhaktapur is the smallest district (119 sq km)." },
  { q: "The Public Service Commission (Loksewa Aayog) is established under which article?", opts: ["Article 23", "Article 24", "Article 25", "Article 26"], correct: 1, explanation: "Article 243 (now renumbered) establishes the PSC. Article 24 in the new constitution." },
  { q: "How many fundamental rights are guaranteed by the Constitution of Nepal?", opts: ["20", "21", "22", "31"], correct: 3, explanation: "31 fundamental rights are guaranteed in Part 3 of the Constitution." },
  { q: "The Attorney General of Nepal is appointed by:", opts: ["The Prime Minister", "The President on recommendation of PM", "The Chief Justice", "The Parliament"], correct: 1, explanation: "The President appoints the AG on the recommendation of the PM." },
  { q: "The provincial assembly term is:", opts: ["4 years", "5 years", "6 years", "3 years"], correct: 1, explanation: "Provincial assemblies serve a 5-year term." },
];

const loksewaGK4: Q[] = [
  { q: "Nepal joined the United Nations in:", opts: ["1945", "1950", "1955", "1960"], correct: 2, explanation: "Nepal became a UN member on December 14, 1955." },
  { q: "The 'Zero Kilometre' milestone of Nepal is located at:", opts: ["Kathmandu", "Birgunj", "Lumbini", "Rasuwa"], correct: 1, explanation: "Birgunj is considered the zero mile point of Nepal." },
  { q: "Who was the first King of Nepal?", opts: ["Prithvi Narayan Shah", "Tribhuvan Bir Bikram Shah", "Mahendra Bir Bikram Shah", "Gyanendra Bir Bikram Shah"], correct: 0, explanation: "Prithvi Narayan Shah unified Nepal and became the first King in 1768." },
  { q: "The longest river in Nepal is:", opts: ["Koshi", "Gandaki", "Karnali", "Mahakali"], correct: 2, explanation: "Karnali is the longest river in Nepal (about 507 km within Nepal)." },
  { q: "The deepest gorge in the world, Kali Gandaki Gorge, is in:", opts: ["Mustang", "Kaski", "Myagdi", "Both Mustang and Myagdi"], correct: 3, explanation: "The Kali Gandaki Gorge lies between Mustang and Myagdi districts." },
  { q: "Lumbini, the birthplace of Buddha, is in which province?", opts: ["Bagmati", "Lumbini", "Gandaki", "Koshi"], correct: 1, explanation: "Lumbini is in Lumbini Province." },
  { q: "The 'Holi' festival in Nepal is celebrated in:", opts: ["Kartik", "Mangsir", "Falgun/Chaitra", "Baishakh"], correct: 2, explanation: "Holi is celebrated in Falgun/Chaitra (March)." },
  { q: "Nepal's largest hydropower project (as of 2024) is:", opts: ["Kaligandaki A", "Chilime", "Upper Tamakoshi", "Bhotekoshi"], correct: 2, explanation: "Upper Tamakoshi (456 MW) is the largest hydropower project." },
  { q: "The Public Service Commission has how many members?", opts: ["1 Chairman + 4 members", "1 Chairman + 6 members", "1 Chairman + 8 members", "1 Chairman + 10 members"], correct: 1, explanation: "PSC consists of a Chairman and other members (currently 6), appointed by the President." },
  { q: "The minimum age to vote in Nepal is:", opts: ["16 years", "18 years", "21 years", "25 years"], correct: 1, explanation: "The voting age in Nepal is 18 years." },
];

const loksewaGK5: Q[] = [
  { q: "Nepal's first census was conducted in:", opts: ["1911 (1968 BS)", "1930 (1987 BS)", "1950 (2007 BS)", "1961 (2018 BS)"], correct: 0, explanation: "The first census of Nepal was conducted in 1968 BS (1911 AD)." },
  { q: "The 'Dashain' festival is celebrated for how many days?", opts: ["7 days", "10 days", "15 days", "21 days"], correct: 2, explanation: "Dashain is celebrated for 15 days, with Ghatasthapana to Kojagrat Purnima." },
  { q: "Which mountain range lies in northern Nepal?", opts: ["Himalayas", "Shiwalik", "Mahabharat", "Vindhya"], correct: 0, explanation: "The Himalayas form the northern border of Nepal." },
  { q: "The 'Chhath' festival is primarily celebrated by people from:", opts: ["Mountain region", "Terai/Madhesh region", "Kathmandu Valley", "Hilly region"], correct: 1, explanation: "Chhath Puja is a major festival of the Terai/Madhesh region." },
  { q: "Nepal's foreign policy is based on the principle of:", opts: ["Non-alignment (Panchsheel)", "Alignment with China", "Alignment with India", "Neutrality only"], correct: 0, explanation: "Nepal follows a non-aligned foreign policy based on Panchsheel." },
  { q: "The National Planning Commission was established in:", opts: ["1953 (2010 BS)", "1956 (2013 BS)", "1960 (2017 BS)", "1970 (2027 BS)"], correct: 1, explanation: "NPC was established in 2013 BS (1956 AD)." },
  { q: "The 'Gai Jatra' festival is mainly celebrated in:", opts: ["Pokhara", "Kathmandu Valley", "Biratnagar", "Lumbini"], correct: 1, explanation: "Gai Jatra (Cow Festival) is primarily celebrated in Kathmandu Valley." },
  { q: "The provincial government structure includes:", opts: ["Chief Minister + Council of Ministers", "Governor + Cabinet", "Premier + Assembly", "Mayor + Council"], correct: 0, explanation: "Each province has a Chief Minister and a Council of Ministers." },
  { q: "Nepal's only international airport (as of 2024) named after a person is:", opts: ["Tribhuvan International Airport", "Pokhara International Airport", "Buddha International Airport", "Gautama Buddha International Airport"], correct: 3, explanation: "Gautama Buddha International Airport in Bhairahawa is named after Buddha." },
  { q: "The constitution guarantees free education up to:", opts: ["Grade 8 (Basic level)", "Grade 10 (Secondary)", "Grade 12 (+2)", "Bachelor's degree"], correct: 0, explanation: "Free and compulsory basic education up to Grade 8, free up to secondary." },
];

// Driving License questions
const drivingQ1: Q[] = [
  { q: "The minimum age to obtain a motorcycle license (Category A) in Nepal is:", opts: ["16 years", "17 years", "18 years", "21 years"], correct: 0, explanation: "Minimum age for Category A is 16 years." },
  { q: "What does a red traffic light mean?", opts: ["Slow down", "Stop", "Proceed with caution", "Yield"], correct: 1, explanation: "Red light means STOP." },
  { q: "On a two-way road, you should drive on:", opts: ["Right side", "Left side", "Center", "Any side"], correct: 1, explanation: "Nepal follows left-hand traffic." },
  { q: "The legal blood alcohol limit for drivers in Nepal is:", opts: ["0.05%", "0.08%", "0.10%", "Zero tolerance"], correct: 3, explanation: "Nepal has zero tolerance for drink-driving." },
  { q: "When overtaking another vehicle, overtake from:", opts: ["Left side", "Right side", "Either side", "Behind"], correct: 1, explanation: "Overtake from the right on left-hand traffic roads." },
  { q: "The maximum speed limit for motorcycles inside urban areas is:", opts: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"], correct: 1, explanation: "Inside urban areas: 40 km/h for motorcycles." },
  { q: "A triangular sign with red border is a:", opts: ["Information sign", "Warning sign", "Mandatory sign", "Prohibition sign"], correct: 1, explanation: "Triangular signs with red border are warning signs." },
  { q: "When approaching a zebra crossing, you should:", opts: ["Speed up", "Slow down and stop if pedestrians are crossing", "Honk and continue", "Maintain speed"], correct: 1, explanation: "Pedestrians have priority at zebra crossings." },
  { q: "The valid driving license is renewed every:", opts: ["2 years", "3 years", "5 years", "10 years"], correct: 2, explanation: "Nepali driving license is renewed every 5 years." },
  { q: "Driving licenses in Nepal are issued by:", opts: ["Traffic Police", "Department of Transport Management (DoTM)", "Municipality", "Nepal Police"], correct: 1, explanation: "Driving licenses are issued by the DoTM." },
];

const drivingQ2: Q[] = [
  { q: "A green traffic light means:", opts: ["Stop and wait", "Proceed if safe", "Slow down", "Yield to oncoming traffic"], correct: 1, explanation: "Green means go, but only when it is safe to proceed." },
  { q: "A yellow traffic light means:", opts: ["Go fast", "Stop if safe to do so", "Yield to oncoming traffic", "Continue at same speed"], correct: 1, explanation: "Yellow light warns that red is about to appear." },
  { q: "Use of horn is prohibited near:", opts: ["Hospitals and schools", "Markets", "Bridges", "All of the above"], correct: 0, explanation: "Horn is prohibited near hospitals, schools, and courts." },
  { q: "When riding a motorcycle, the helmet must be worn by:", opts: ["Only the rider", "Only the pillion", "Both rider and pillion", "Optional for all"], correct: 2, explanation: "Both rider and pillion must wear helmets." },
  { q: "The hand signal for stopping is:", opts: ["Right arm extended horizontally", "Right arm raised vertically", "Right arm pointing down", "Left arm extended"], correct: 1, explanation: "Right arm raised vertically with palm forward = stop." },
  { q: "Headlights must be used:", opts: ["Only at night", "At night and in poor visibility", "Only in tunnels", "Never during day"], correct: 1, explanation: "Use headlights at night and in poor visibility." },
  { q: "The minimum distance to maintain from the vehicle in front is:", opts: ["1 second", "2 seconds", "5 seconds", "10 seconds"], correct: 1, explanation: "Use the 2-second rule for safe following distance." },
  { q: "At an uncontrolled intersection, yield to:", opts: ["Traffic from behind", "Traffic from the right", "Traffic from the left", "No one"], correct: 1, explanation: "Yield to traffic from the right at uncontrolled intersections." },
  { q: "Parking is prohibited within how many meters of a fire station?", opts: ["5 meters", "10 meters", "15 meters", "20 meters"], correct: 2, explanation: "No parking within 15 meters of a fire station." },
  { q: "If your motorcycle's brake fails while riding, you should:", opts: ["Jump off", "Use engine braking and hand brake gradually", "Honk continuously", "Speed up"], correct: 1, explanation: "Downshift to use engine braking, then gently apply hand brake." },
];

const drivingQ3: Q[] = [
  { q: "A circular sign with red border and a diagonal line is a:", opts: ["Warning sign", "Mandatory sign", "Prohibitory sign", "Information sign"], correct: 2, explanation: "Circular signs with red border are prohibitory." },
  { q: "The maximum speed on highways for motorcycles is:", opts: ["60 km/h", "80 km/h", "100 km/h", "120 km/h"], correct: 1, explanation: "Highway speed limit for motorcycles is 80 km/h." },
  { q: "Before starting a motorcycle, you should check:", opts: ["Fuel level", "Brakes", "Mirrors", "All of the above"], correct: 3, explanation: "Always check fuel, brakes, mirrors, and lights before riding." },
  { q: "The 'No Entry' sign is:", opts: ["Circular red with white bar", "Triangular red", "Square blue", "Circular green"], correct: 0, explanation: "No Entry is a red circle with a white horizontal bar." },
  { q: "When parking on a hill, you should:", opts: ["Leave in gear only", "Use handbrake + leave in gear + turn wheels", "Just use handbrake", "Park in neutral"], correct: 1, explanation: "Use handbrake, leave in gear, and turn wheels toward the curb." },
  { q: "A flashing yellow traffic light means:", opts: ["Stop completely", "Proceed with caution", "Speed up", "Yield then stop"], correct: 1, explanation: "Flashing yellow = proceed with caution." },
  { q: "The blind spot is:", opts: ["Behind the vehicle", "The area not visible in mirrors", "The front of the vehicle", "Under the vehicle"], correct: 1, explanation: "The blind spot is the area not visible in mirrors — check over your shoulder." },
  { q: "When you see an ambulance behind you with siren on, you should:", opts: ["Speed up", "Pull over and stop", "Ignore it", "Continue at same speed"], correct: 1, explanation: "Pull over to the left and stop to let emergency vehicles pass." },
  { q: "The blue sign with a white 'P' means:", opts: ["No parking", "Parking allowed", "Pedestrian crossing", "Police station"], correct: 1, explanation: "A blue sign with white 'P' indicates parking is allowed." },
  { q: "For a Category B (car) license, the minimum age is:", opts: ["16 years", "18 years", "21 years", "25 years"], correct: 1, explanation: "Minimum age for Category B is 18 years." },
];

const drivingQ4: Q[] = [
  { q: "The written exam for driving license has how many questions?", opts: ["10", "15", "20", "25"], correct: 2, explanation: "The written exam has 20 questions with 20 marks." },
  { q: "The passing marks for the driving license written exam is:", opts: ["50%", "60%", "70%", "80%"], correct: 1, explanation: "You need 60% (12 out of 20) to pass." },
  { q: "What does a solid white line on the road mean?", opts: ["You can overtake", "Do not cross or overtake", "Pedestrian crossing", "Stop line"], correct: 1, explanation: "A solid white line means do not cross or overtake." },
  { q: "What does a broken white line mean?", opts: ["No overtaking", "Overtaking allowed with caution", "Pedestrian zone", "Speed limit ends"], correct: 1, explanation: "A broken white line means you may overtake with caution." },
  { q: "The 'Give Way' sign is:", opts: ["Red triangle pointing down", "Red octagon", "Yellow diamond", "Blue circle"], correct: 0, explanation: "Give Way is an inverted red triangle (pointing down)." },
  { q: "When driving in fog, you should use:", opts: ["High beam headlights", "Low beam headlights or fog lights", "Hazard lights only", "No lights"], correct: 1, explanation: "Use low beam or fog lights in fog — high beam reflects back." },
  { q: "The 'Stop' sign is shaped like:", opts: ["Circle", "Triangle", "Octagon (8-sided)", "Square"], correct: 2, explanation: "The Stop sign is a red octagon." },
  { q: "When turning left, you should signal:", opts: ["Left indicator", "Right indicator", "Hand signal", "No signal needed"], correct: 0, explanation: "Use the left indicator when turning left." },
  { q: "The maximum speed for a car inside a school zone is:", opts: ["20 km/h", "30 km/h", "40 km/h", "50 km/h"], correct: 0, explanation: "School zones typically have a 20 km/h speed limit." },
  { q: "A red number plate on a vehicle in Nepal indicates:", opts: ["Private vehicle", "Government vehicle", "Diplomatic vehicle", "Tourist vehicle"], correct: 1, explanation: "Red plates are for government vehicles." },
];

const drivingQ5: Q[] = [
  { q: "What should you do at a railroad crossing with no barriers?", opts: ["Speed up", "Stop, look, listen, then proceed", "Honk and proceed", "Wait for a train"], correct: 1, explanation: "Always stop, look both ways, and listen before crossing." },
  { q: "The 'No Overtaking' sign shows:", opts: ["Two cars side by side", "Two cars with red border", "One car with X mark", "Arrow pointing right"], correct: 1, explanation: "No Overtaking sign shows two cars within a red bordered circle." },
  { q: "When approaching a roundabout, you should:", opts: ["Speed up", "Slow down and yield to traffic already in the roundabout", "Stop completely", "Honk and enter"], correct: 1, explanation: "Yield to traffic already circulating in the roundabout." },
  { q: "White plates with black text are for:", opts: ["Government vehicles", "Private vehicles", "Diplomatic vehicles", "Commercial vehicles"], correct: 1, explanation: "White plates with black text indicate private vehicles." },
  { q: "The 'One Way' sign means:", opts: ["Traffic flows in one direction only", "Single lane road", "No entry", "Pedestrian only"], correct: 0, explanation: "One Way means traffic is allowed in one direction only." },
  { q: "When you see a school bus stopped with its lights flashing, you should:", opts: ["Overtake carefully", "Stop and wait", "Honk to pass", "Continue at reduced speed"], correct: 1, explanation: "Stop and wait when a school bus has flashing lights — children may be crossing." },
  { q: "The most common cause of motorcycle accidents is:", opts: ["Mechanical failure", "Speeding and reckless driving", "Weather conditions", "Road conditions"], correct: 1, explanation: "Speeding and reckless driving are the leading causes." },
  { q: "Before changing lanes, you should:", opts: ["Signal + check mirror + check blind spot", "Just signal", "Just check mirror", "Just change lanes quickly"], correct: 0, explanation: "Always signal, check mirrors, and check blind spot before changing lanes." },
  { q: "A 'U-turn' is prohibited at:", opts: ["Curves", "Hill crests", "Intersections with No U-turn sign", "All of the above"], correct: 3, explanation: "U-turns are prohibited at curves, hill crests, and signed intersections." },
  { q: "The written exam time limit for driving license is:", opts: ["10 minutes", "15 minutes", "20 minutes", "30 minutes"], correct: 2, explanation: "The written exam allows 20 minutes for 20 questions." },
];

// IOE Engineering Entrance — Physics
const ioePhysics1: Q[] = [
  { q: "A body is thrown vertically upward with velocity u. The maximum height reached is:", opts: ["u²/g", "u²/2g", "2u²/g", "u/g"], correct: 1, explanation: "Using v² = u² - 2gH, at max height v=0, H = u²/(2g)." },
  { q: "The dimension of force is:", opts: ["[MLT⁻¹]", "[MLT⁻²]", "[ML²T⁻²]", "[M⁰LT⁻²]"], correct: 1, explanation: "Force = mass × acceleration = M × LT⁻² = [MLT⁻²]." },
  { q: "The SI unit of electric current is:", opts: ["Volt", "Watt", "Ampere", "Ohm"], correct: 2, explanation: "Ampere is the SI base unit of electric current." },
  { q: "A particle moves in a circle of radius r with constant speed v. Its acceleration is:", opts: ["Zero", "v²/r directed towards center", "v/r directed outward", "vr directed along velocity"], correct: 1, explanation: "Centripetal acceleration = v²/r, directed towards the center." },
  { q: "Light travels fastest in:", opts: ["Vacuum", "Water", "Glass", "Diamond"], correct: 0, explanation: "Light travels at c = 3×10⁸ m/s in vacuum, slower in all other media." },
  { q: "The resistance of a wire depends on:", opts: ["Voltage only", "Current only", "Length, area, and material", "Power only"], correct: 2, explanation: "R = ρL/A — resistance depends on resistivity, length, and cross-sectional area." },
  { q: "Ohm's law states V = IR. This is valid for:", opts: ["All conductors", "Ohmic conductors at constant temperature", "Semiconductors", "Superconductors"], correct: 1, explanation: "Ohm's law is valid only for ohmic conductors at constant temperature." },
  { q: "The refractive index of water is 1.33. The speed of light in water is:", opts: ["3×10⁸ m/s", "2.25×10⁸ m/s", "1.5×10⁸ m/s", "4×10⁸ m/s"], correct: 1, explanation: "v = c/n = 3×10⁸/1.33 ≈ 2.25×10⁸ m/s." },
  { q: "The half-life of a radioactive substance is 10 years. After 30 years, the fraction remaining is:", opts: ["1/2", "1/4", "1/8", "1/16"], correct: 2, explanation: "After 3 half-lives, fraction = (1/2)³ = 1/8." },
  { q: "The kinetic energy of a satellite orbiting Earth is:", opts: ["Zero", "Equal to its potential energy", "Half the magnitude of its potential energy", "Twice its potential energy"], correct: 2, explanation: "For a satellite: KE = (1/2)|PE|." },
];

const ioePhysics2: Q[] = [
  { q: "The escape velocity from Earth's surface is approximately:", opts: ["7.9 km/s", "11.2 km/s", "9.8 km/s", "15 km/s"], correct: 1, explanation: "Escape velocity = √(2gR) ≈ 11.2 km/s." },
  { q: "The dimension of pressure is:", opts: ["[ML⁻¹T⁻²]", "[MLT⁻²]", "[ML⁻¹T⁻¹]", "[ML²T⁻²]"], correct: 0, explanation: "Pressure = Force/Area = MLT⁻²/L² = [ML⁻¹T⁻²]." },
  { q: "Which of the following is a vector quantity?", opts: ["Speed", "Mass", "Velocity", "Time"], correct: 2, explanation: "Velocity has both magnitude and direction, making it a vector." },
  { q: "A body of mass 2 kg is moving with velocity 10 m/s. Its kinetic energy is:", opts: ["10 J", "50 J", "100 J", "200 J"], correct: 2, explanation: "KE = ½mv² = ½ × 2 × 10² = 100 J." },
  { q: "The acceleration due to gravity on the surface of the moon is approximately:", opts: ["9.8 m/s²", "1.6 m/s²", "3.7 m/s²", "8.9 m/s²"], correct: 1, explanation: "Moon's gravity is about 1/6 of Earth's gravity." },
  { q: "The principle of conservation of energy states that:", opts: ["Energy can be created", "Energy can be destroyed", "Energy can neither be created nor destroyed", "Energy always decreases"], correct: 2, explanation: "Energy is conserved — it can only transform from one form to another." },
  { q: "The unit of frequency is:", opts: ["Newton", "Hertz", "Watt", "Joule"], correct: 1, explanation: "Frequency is measured in Hertz (Hz)." },
  { q: "A transformer works on the principle of:", opts: ["Self induction", "Mutual induction", "Eddy currents", "Lenz's law"], correct: 1, explanation: "Transformers operate on mutual induction between primary and secondary coils." },
  { q: "The unit of magnetic flux is:", opts: ["Tesla", "Weber", "Henry", "Gauss"], correct: 1, explanation: "Magnetic flux is measured in Weber (Wb)." },
  { q: "In a simple harmonic motion, the maximum acceleration occurs at:", opts: ["Mean position", "Extreme position", "Half amplitude", "Quarter amplitude"], correct: 1, explanation: "a = -ω²x, maximum at extreme position where x is maximum." },
];

const ioePhysics3: Q[] = [
  { q: "The value of g at the center of Earth is:", opts: ["Zero", "Maximum", "9.8 m/s²", "Infinite"], correct: 0, explanation: "At Earth's center, net gravitational force = 0, so g = 0." },
  { q: "The work done by a force F in displacing a body through distance d at angle θ is:", opts: ["Fd", "Fd sin θ", "Fd cos θ", "Fd tan θ"], correct: 2, explanation: "Work = F · d = Fd cos θ." },
  { q: "Which type of wave is light?", opts: ["Longitudinal", "Transverse", "Both", "Neither"], correct: 1, explanation: "Light is a transverse electromagnetic wave." },
  { q: "The Coulomb force between two charges is F. If distance is doubled, force becomes:", opts: ["F/2", "F/4", "2F", "4F"], correct: 1, explanation: "Coulomb's law: F ∝ 1/r². Doubling r gives F/4." },
  { q: "A lens of focal length 20 cm forms a real image at 60 cm. The object distance is:", opts: ["15 cm", "30 cm", "20 cm", "40 cm"], correct: 1, explanation: "1/f = 1/u + 1/v → 1/20 = 1/u + 1/60 → u = 30 cm." },
  { q: "The nuclear force is:", opts: ["Electromagnetic", "Gravitational", "Short-range and strong", "Long-range and weak"], correct: 2, explanation: "Nuclear force is short-range (~1-3 fm) and the strongest fundamental force." },
  { q: "A Zener diode is used as:", opts: ["Rectifier", "Amplifier", "Voltage regulator", "Oscillator"], correct: 2, explanation: "Zener diode operates in reverse breakdown, providing stable voltage." },
  { q: "The capacitance of a parallel plate capacitor increases when:", opts: ["Distance between plates increases", "Area of plates decreases", "Dielectric is inserted", "Charge is removed"], correct: 2, explanation: "C = ε₀A/d; inserting dielectric increases ε, thus increases C." },
  { q: "In Lenz's law, the induced current direction is such that it:", opts: ["Aids the change in flux", "Opposes the change in flux", "Is perpendicular to flux", "Is zero"], correct: 1, explanation: "Lenz's law: induced current opposes the change in flux." },
  { q: "A wave has frequency 500 Hz and wavelength 0.7 m. Its speed is:", opts: ["350 m/s", "700 m/s", "500 m/s", "0.7 m/s"], correct: 0, explanation: "v = fλ = 500 × 0.7 = 350 m/s." },
];

const ioePhysics4: Q[] = [
  { q: "The kinetic energy of a satellite orbiting Earth is:", opts: ["Zero", "Equal to its potential energy", "Half the magnitude of its potential energy", "Twice its potential energy"], correct: 2, explanation: "For a satellite: KE = (1/2)|PE|." },
  { q: "The Young's modulus has the same unit as:", opts: ["Force", "Stress", "Strain", "Energy"], correct: 1, explanation: "Young's modulus = Stress/Strain, unit = stress unit (Pa)." },
  { q: "The angular momentum of a body is conserved when:", opts: ["Net force is zero", "Net torque is zero", "Net momentum is zero", "Energy is conserved"], correct: 1, explanation: "Angular momentum is conserved when net external torque is zero." },
  { q: "A concave mirror of focal length 10 cm forms a real image of an object placed at 15 cm. Image distance is:", opts: ["30 cm", "20 cm", "6 cm", "5 cm"], correct: 0, explanation: "1/v = 1/f - 1/u = 1/10 - 1/15 = 1/30, v = 30 cm." },
  { q: "The photoelectric effect was explained by:", opts: ["Newton", "Maxwell", "Einstein", "Bohr"], correct: 2, explanation: "Einstein explained the photoelectric effect in 1905." },
  { q: "The de Broglie wavelength of an electron accelerated through potential V is:", opts: ["h/√(2meV)", "h/(meV)", "hV/m", "h/(2meV)"], correct: 0, explanation: "λ = h/p = h/√(2meV)." },
  { q: "The specific heat capacity of water is approximately:", opts: ["1000 J/kg·K", "2100 J/kg·K", "4186 J/kg·K", "500 J/kg·K"], correct: 2, explanation: "Water has specific heat 4186 J/kg·K — higher than most substances." },
  { q: "In an AC circuit with pure capacitor, the current:", opts: ["Leads voltage by 90°", "Lags voltage by 90°", "Is in phase with voltage", "Is 180° out of phase"], correct: 0, explanation: "In a capacitor, current leads voltage by 90°." },
  { q: "A body executing SHM has maximum velocity at:", opts: ["Extreme position", "Mean position", "Half amplitude", "Quarter amplitude"], correct: 1, explanation: "In SHM, velocity is maximum (ωA) at the mean position." },
  { q: "The half-life of radium-226 is 1600 years. The decay constant is:", opts: ["4.3×10⁻⁴/year", "1.4×10⁻⁴/year", "6.25×10⁻⁴/year", "1.6×10⁻³/year"], correct: 0, explanation: "λ = 0.693/T½ = 0.693/1600 ≈ 4.3×10⁻⁴/year." },
];

const ioePhysics5: Q[] = [
  { q: "An object weighing 600 N on Earth weighs on the Moon (g_moon = g/6):", opts: ["100 N", "600 N", "3600 N", "0 N"], correct: 0, explanation: "Weight on Moon = 600/6 = 100 N." },
  { q: "The unit of magnetic field intensity is:", opts: ["Tesla", "Weber", "Ampere/meter", "Henry"], correct: 2, explanation: "Magnetic field intensity H is measured in A/m." },
  { q: "An ideal gas at constant pressure has volume V at temperature T. If temperature doubles, volume:", opts: ["Halves", "Doubles", "Triples", "Remains same"], correct: 1, explanation: "Charles's law: V ∝ T at constant pressure." },
  { q: "The dimension of pressure is:", opts: ["[ML⁻¹T⁻²]", "[MLT⁻²]", "[ML⁻¹T⁻¹]", "[ML²T⁻²]"], correct: 0, explanation: "Pressure = Force/Area = [ML⁻¹T⁻²]." },
  { q: "Which type of wave is light?", opts: ["Longitudinal", "Transverse", "Both", "Neither"], correct: 1, explanation: "Light is a transverse electromagnetic wave." },
  { q: "The value of g at the center of Earth is:", opts: ["Zero", "Maximum", "9.8 m/s²", "Infinite"], correct: 0, explanation: "At Earth's center, all mass pulls outward equally, so net g = 0." },
  { q: "In Lenz's law, the induced current direction is such that it:", opts: ["Aids the change in flux", "Opposes the change in flux", "Is perpendicular to flux", "Is zero"], correct: 1, explanation: "Lenz's law: induced current opposes the change in flux." },
  { q: "A lens of focal length 20 cm forms a real image at 60 cm. The object distance is:", opts: ["15 cm", "30 cm", "20 cm", "40 cm"], correct: 1, explanation: "1/f = 1/u + 1/v → 1/20 = 1/u + 1/60, so u = 30 cm." },
  { q: "The escape velocity from Earth's surface is approximately:", opts: ["7.9 km/s", "11.2 km/s", "9.8 km/s", "15 km/s"], correct: 1, explanation: "Escape velocity = √(2gR) ≈ 11.2 km/s." },
  { q: "A Zener diode is used as:", opts: ["Rectifier", "Amplifier", "Voltage regulator", "Oscillator"], correct: 2, explanation: "Zener diode operates in reverse breakdown, providing stable voltage." },
];

// MBBS CEE — Biology
const mbbsBio1: Q[] = [
  { q: "The powerhouse of the cell is:", opts: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], correct: 1, explanation: "Mitochondria produces ATP energy via cellular respiration." },
  { q: "Which gas is most abundant in Earth's atmosphere?", opts: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 1, explanation: "Nitrogen makes up about 78% of Earth's atmosphere." },
  { q: "The chemical formula of water is:", opts: ["CO₂", "H₂O", "O₂", "NaCl"], correct: 1, explanation: "Water = H₂O — 2 hydrogen atoms and 1 oxygen atom." },
  { q: "Which of the following is a renewable source of energy?", opts: ["Coal", "Petroleum", "Solar energy", "Natural gas"], correct: 2, explanation: "Solar energy is renewable and inexhaustible." },
  { q: "The phenomenon of splitting of white light into seven colors is called:", opts: ["Reflection", "Refraction", "Dispersion", "Diffraction"], correct: 2, explanation: "Dispersion is the splitting of light into its component colors." },
  { q: "Which acid is present in the human stomach?", opts: ["Sulfuric acid", "Hydrochloric acid", "Nitric acid", "Acetic acid"], correct: 1, explanation: "HCl is secreted in the stomach for digestion." },
  { q: "The unit of heredity is:", opts: ["Cell", "Gene", "Chromosome", "Tissue"], correct: 1, explanation: "Gene is the basic physical and functional unit of heredity." },
  { q: "Salt water can be separated by:", opts: ["Filtration", "Distillation", "Sedimentation", "Decantation"], correct: 1, explanation: "Distillation separates salt from water by evaporation and condensation." },
  { q: "The process by which plants make food is:", opts: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"], correct: 1, explanation: "Photosynthesis: plants make food using sunlight, CO₂, and water." },
  { q: "Which metal is liquid at room temperature?", opts: ["Iron", "Mercury", "Copper", "Aluminum"], correct: 1, explanation: "Mercury is the only metal that is liquid at room temperature." },
];

const mbbsBio2: Q[] = [
  { q: "The largest organ in the human body is:", opts: ["Liver", "Skin", "Brain", "Lungs"], correct: 1, explanation: "Skin is the largest organ by surface area and weight." },
  { q: "Normal blood pressure of a healthy adult is:", opts: ["80/120", "120/80", "100/60", "140/90"], correct: 1, explanation: "Normal BP: systolic 120 mmHg / diastolic 80 mmHg." },
  { q: "How many bones are there in an adult human body?", opts: ["196", "206", "216", "226"], correct: 1, explanation: "Adult human body has 206 bones." },
  { q: "The universal donor blood group is:", opts: ["A", "B", "AB", "O negative"], correct: 3, explanation: "O negative blood can be donated to anyone — universal donor." },
  { q: "The universal recipient blood group is:", opts: ["A+", "B+", "AB+", "O+"], correct: 2, explanation: "AB+ individuals can receive any blood type — universal recipient." },
  { q: "Vitamin C is also known as:", opts: ["Retinol", "Thiamine", "Ascorbic acid", "Niacin"], correct: 2, explanation: "Vitamin C = ascorbic acid, essential for immunity." },
  { q: "Deficiency of Vitamin D causes:", opts: ["Scurvy", "Rickets", "Night blindness", "Beri-beri"], correct: 1, explanation: "Vitamin D deficiency causes rickets in children." },
  { q: "The pH of human blood is approximately:", opts: ["6.4", "7.4", "8.4", "5.4"], correct: 1, explanation: "Blood pH: 7.35-7.45 (slightly alkaline)." },
  { q: "Which hormone is called the 'fight or flight' hormone?", opts: ["Insulin", "Adrenaline", "Thyroxine", "Estrogen"], correct: 1, explanation: "Adrenaline (epinephrine) prepares the body for fight-or-flight." },
  { q: "The functional unit of the kidney is:", opts: ["Neuron", "Nephron", "Alveolus", "Hepatocyte"], correct: 1, explanation: "Nephron is the kidney's structural and functional unit." },
];

const mbbsBio3: Q[] = [
  { q: "The number of chambers in the human heart is:", opts: ["2", "3", "4", "5"], correct: 2, explanation: "Human heart has 4 chambers: 2 atria and 2 ventricles." },
  { q: "Which blood vessel carries oxygenated blood from lungs to heart?", opts: ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"], correct: 1, explanation: "Pulmonary vein carries oxygenated blood from lungs to left atrium." },
  { q: "The largest artery in the human body is:", opts: ["Pulmonary artery", "Aorta", "Carotid artery", "Femoral artery"], correct: 1, explanation: "Aorta is the largest artery, originating from left ventricle." },
  { q: "Insulin is produced by:", opts: ["Liver", "Pancreas", "Kidney", "Spleen"], correct: 1, explanation: "Insulin is produced by beta cells of islets of Langerhans in pancreas." },
  { q: "Which of the following is NOT a function of the liver?", opts: ["Bile production", "Detoxification", "Protein synthesis", "Insulin production"], correct: 3, explanation: "Insulin is produced by pancreas, not liver." },
  { q: "The normal body temperature of humans is:", opts: ["35°C", "37°C", "39°C", "40°C"], correct: 1, explanation: "Normal body temperature: 37°C (98.6°F)." },
  { q: "The longest bone in the human body is:", opts: ["Tibia", "Fibula", "Femur", "Humerus"], correct: 2, explanation: "Femur (thigh bone) is the longest and strongest bone." },
  { q: "Which organ is responsible for gas exchange in humans?", opts: ["Heart", "Lungs", "Liver", "Kidney"], correct: 1, explanation: "Lungs handle gas exchange — O₂ in, CO₂ out." },
  { q: "How many pairs of spinal nerves are there in humans?", opts: ["12", "21", "31", "41"], correct: 2, explanation: "Humans have 31 pairs of spinal nerves." },
  { q: "The first vaccine was developed by:", opts: ["Louis Pasteur", "Edward Jenner", "Alexander Fleming", "Robert Koch"], correct: 1, explanation: "Edward Jenner developed the smallpox vaccine in 1796." },
];

const mbbsBio4: Q[] = [
  { q: "Which mineral is essential for blood clotting?", opts: ["Iron", "Calcium", "Sodium", "Potassium"], correct: 1, explanation: "Calcium is essential for blood clotting (coagulation cascade)." },
  { q: "The disease caused by Plasmodium is:", opts: ["Dengue", "Malaria", "Typhoid", "Cholera"], correct: 1, explanation: "Plasmodium parasite causes malaria, transmitted by Anopheles mosquito." },
  { q: "Which vitamin is fat-soluble?", opts: ["Vitamin C", "Vitamin B complex", "Vitamin A", "None"], correct: 2, explanation: "Fat-soluble vitamins: A, D, E, K." },
  { q: "Red blood cells are produced in:", opts: ["Liver", "Bone marrow", "Spleen", "Kidney"], correct: 1, explanation: "RBCs are produced in red bone marrow through erythropoiesis." },
  { q: "The 'master gland' of the human body is:", opts: ["Thyroid", "Pituitary", "Adrenal", "Pancreas"], correct: 1, explanation: "Pituitary gland controls other endocrine glands." },
  { q: "Which blood cells fight infection?", opts: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], correct: 1, explanation: "White blood cells (leukocytes) fight infections." },
  { q: "The largest planet in our solar system is:", opts: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2, explanation: "Jupiter is the largest planet." },
  { q: "Which gas is released during photosynthesis?", opts: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correct: 1, explanation: "Oxygen is released as a byproduct of photosynthesis." },
  { q: "An object floats in water if its density is:", opts: ["More than water", "Less than water", "Equal to water", "Independent of density"], correct: 1, explanation: "Object floats if its density is less than water (1 g/cm³)." },
  { q: "The speed of light in vacuum is approximately:", opts: ["3×10⁵ m/s", "3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s"], correct: 1, explanation: "c = 3×10⁸ m/s." },
];

const mbbsBio5: Q[] = [
  { q: "The SI unit of electric current is:", opts: ["Volt", "Ampere", "Watt", "Ohm"], correct: 1, explanation: "Ampere (A) is the SI unit of electric current." },
  { q: "Which of the following is a non-renewable resource?", opts: ["Solar energy", "Wind energy", "Petroleum", "Hydropower"], correct: 2, explanation: "Petroleum is non-renewable." },
  { q: "The unit of force is:", opts: ["Joule", "Newton", "Watt", "Pascal"], correct: 1, explanation: "Force is measured in Newton (N)." },
  { q: "Which planet is known as the 'Red Planet'?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1, explanation: "Mars = Red Planet due to iron oxide." },
  { q: "The chemical symbol for gold is:", opts: ["Ag", "Au", "Gd", "Go"], correct: 1, explanation: "Gold's symbol is Au (from Latin: aurum)." },
  { q: "Which blood cells fight infection?", opts: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], correct: 1, explanation: "White blood cells fight infections." },
  { q: "The largest planet in our solar system is:", opts: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2, explanation: "Jupiter is the largest planet." },
  { q: "Which gas is released during photosynthesis?", opts: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correct: 1, explanation: "Oxygen is released as byproduct." },
  { q: "An object floats in water if its density is:", opts: ["More than water", "Less than water", "Equal to water", "Independent"], correct: 1, explanation: "Floats if density < water." },
  { q: "The speed of light in vacuum is approximately:", opts: ["3×10⁵ m/s", "3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s"], correct: 1, explanation: "c = 3×10⁸ m/s." },
];

// CMAT — Verbal + Quant
const cmatQ1: Q[] = [
  { q: "Choose the synonym of 'Ephemeral':", opts: ["Eternal", "Short-lived", "Strong", "Beautiful"], correct: 1, explanation: "Ephemeral means lasting for a very short time." },
  { q: "Choose the antonym of 'Benevolent':", opts: ["Kind", "Generous", "Malevolent", "Friendly"], correct: 2, explanation: "Malevolent means wishing harm — opposite of benevolent." },
  { q: "Fill in the blank: 'She is allergic ____ dust.'", opts: ["from", "to", "with", "of"], correct: 1, explanation: "Allergic takes 'to' preposition." },
  { q: "Identify the correct sentence:", opts: ["He don't know the answer.", "He doesn't knows the answer.", "He doesn't know the answer.", "He not know the answer."], correct: 2, explanation: "Correct: He doesn't know." },
  { q: "Choose the correct spelling:", opts: ["Accomodation", "Acommodation", "Accommodation", "Acomodation"], correct: 2, explanation: "Accommodation: double 'c' and double 'm'." },
  { q: "What is the meaning of 'A blessing in disguise'?", opts: ["An obvious blessing", "A bad thing that turns out good", "A hidden curse", "A religious blessing"], correct: 1, explanation: "A misfortune that has positive results." },
  { q: "Choose the correct article: '____ honest man is respected.'", opts: ["A", "An", "The", "No article"], correct: 1, explanation: "'An' before vowel sound (silent h)." },
  { q: "Identify the part of speech of 'quickly' in 'He runs quickly':", opts: ["Noun", "Verb", "Adjective", "Adverb"], correct: 3, explanation: "Quickly modifies the verb 'runs' = adverb." },
  { q: "Choose the correct idiom for 'to be very happy':", opts: ["On cloud nine", "Under the weather", "Out of the blue", "Piece of cake"], correct: 0, explanation: "On cloud nine = extremely happy." },
  { q: "Fill in: 'I have lived in Kathmandu ____ 10 years.'", opts: ["for", "since", "from", "in"], correct: 0, explanation: "Use 'for' with duration of time." },
];

const cmatQ2: Q[] = [
  { q: "If A:B = 2:3 and B:C = 4:5, then A:C is:", opts: ["8:15", "2:5", "8:5", "5:8"], correct: 0, explanation: "A:B:C = 8:12:15, so A:C = 8:15." },
  { q: "A train 150m long passes a pole in 15 seconds. Its speed is:", opts: ["36 km/h", "10 m/s", "Both", "20 m/s"], correct: 2, explanation: "Speed = 150/15 = 10 m/s = 36 km/h." },
  { q: "Complete the series: 2, 6, 12, 20, 30, ?", opts: ["40", "42", "44", "46"], correct: 1, explanation: "Differences: 4,6,8,10,12. Next = 30+12 = 42." },
  { q: "If 20% of a number is 50, then the number is:", opts: ["100", "200", "250", "300"], correct: 2, explanation: "0.2x = 50, x = 250." },
  { q: "Find the HCF of 12, 18, 24:", opts: ["2", "4", "6", "8"], correct: 2, explanation: "HCF(12,18,24) = 6." },
  { q: "If today is Monday, what day will it be 100 days from now?", opts: ["Tuesday", "Wednesday", "Thursday", "Friday"], correct: 1, explanation: "100 mod 7 = 2. Monday + 2 = Wednesday." },
  { q: "The simple interest on NPR 5000 at 8% for 2 years is:", opts: ["400", "800", "1000", "1200"], correct: 1, explanation: "SI = P×R×T/100 = 5000×8×2/100 = 800." },
  { q: "A clock shows 3:15. The angle between hour and minute hand is:", opts: ["0°", "7.5°", "15°", "22.5°"], correct: 1, explanation: "Hour hand moves 0.5°/min. At 3:15, hour at 97.5°, minute at 90°. Diff = 7.5°." },
  { q: "If 'CAT' is coded as 24, 'DOG' is coded as 26, then 'FOX' is:", opts: ["41", "43", "45", "47"], correct: 2, explanation: "Sum of letter positions: F=6+O=15+X=24 = 45." },
  { q: "Fill in: 'If I ____ rich, I would travel the world.'", opts: ["am", "was", "were", "be"], correct: 2, explanation: "Second conditional uses 'were'." },
];

const cmatQ3: Q[] = [
  { q: "Choose the synonym of 'Mitigate':", opts: ["Increase", "Reduce", "Eliminate", "Destroy"], correct: 1, explanation: "Mitigate = reduce." },
  { q: "The passive voice of 'She writes a letter' is:", opts: ["A letter is written by her.", "A letter was written by her.", "A letter is being written by her.", "A letter has been written by her."], correct: 0, explanation: "Present simple → passive: am/is/are + past participle." },
  { q: "What is the meaning of 'Peruse'?", opts: ["To read carefully", "To ignore", "To destroy", "To create"], correct: 0, explanation: "Peruse = read carefully." },
  { q: "Choose the correct preposition: 'He is good ____ mathematics.'", opts: ["in", "at", "on", "for"], correct: 1, explanation: "Good at + activity." },
  { q: "Identify the antonym of 'Verbose':", opts: ["Wordy", "Concise", "Talkative", "Lengthy"], correct: 1, explanation: "Verbose antonym = concise." },
  { q: "Choose the correct form: 'Each of the students ____ a book.'", opts: ["have", "has", "are having", "were having"], correct: 1, explanation: "'Each' takes singular verb." },
  { q: "The phrase 'Break the ice' means:", opts: ["To break something", "To start a conversation", "To end a relationship", "To make ice"], correct: 1, explanation: "Break the ice = initiate conversation." },
  { q: "Choose the correct sentence:", opts: ["Neither of the boys are here.", "Neither of the boys is here.", "Neither of the boy is here.", "Neither of the boys were here."], correct: 1, explanation: "'Neither of' takes singular verb." },
  { q: "What is the meaning of 'Lucid'?", opts: ["Confused", "Clear", "Dark", "Heavy"], correct: 1, explanation: "Lucid = clear." },
  { q: "Choose the correct article: '____ sun rises in the east.'", opts: ["A", "An", "The", "No article"], correct: 2, explanation: "Use 'The' for unique objects." },
];

const cmatQ4: Q[] = [
  { q: "A shopkeeper sells an item for NPR 1200 with 20% profit. The cost price is:", opts: ["800", "900", "1000", "1100"], correct: 2, explanation: "CP = SP/(1+profit%) = 1200/1.2 = 1000." },
  { q: "The average of 5 numbers is 20. If one number is removed, the average becomes 18. The removed number is:", opts: ["22", "24", "26", "28"], correct: 3, explanation: "Sum of 5 = 100. Sum of 4 = 72. Removed = 100-72 = 28." },
  { q: "If 3x + 7 = 22, then x = ?", opts: ["3", "5", "7", "15"], correct: 1, explanation: "3x = 15, x = 5." },
  { q: "The compound interest on NPR 1000 at 10% for 2 years is:", opts: ["200", "210", "220", "100"], correct: 1, explanation: "CI = 1000(1.1² - 1) = 1000(0.21) = 210." },
  { q: "A and B can do a work in 10 and 15 days respectively. Together they can do it in:", opts: ["5 days", "6 days", "7 days", "8 days"], correct: 1, explanation: "1/10 + 1/15 = 1/6. So 6 days." },
  { q: "The probability of getting a head in a coin toss is:", opts: ["0", "0.25", "0.5", "1"], correct: 2, explanation: "P(head) = 1/2 = 0.5." },
  { q: "If the radius of a circle is doubled, the area becomes:", opts: ["2 times", "4 times", "6 times", "8 times"], correct: 1, explanation: "Area = πr². Doubling r gives 4× area." },
  { q: "The LCM of 12 and 18 is:", opts: ["6", "12", "36", "72"], correct: 2, explanation: "LCM(12,18) = 36." },
  { q: "A man walks 3 km north, then 4 km east. His displacement is:", opts: ["5 km", "7 km", "1 km", "12 km"], correct: 0, explanation: "√(3² + 4²) = 5 km." },
  { q: "The next number in the series 1, 4, 9, 16, 25, ? is:", opts: ["30", "36", "49", "64"], correct: 1, explanation: "Perfect squares: 1², 2², 3², 4², 5², 6² = 36." },
];

const cmatQ5: Q[] = [
  { q: "The present constitution of Nepal was promulgated on:", opts: ["September 19, 2015", "September 20, 2015", "August 19, 2015", "October 19, 2015"], correct: 1, explanation: "Constitution of Nepal 2072 BS, Ashoj 1." },
  { q: "Who is the head of state in Nepal?", opts: ["President", "Prime Minister", "King", "Chief Justice"], correct: 0, explanation: "President is the head of state." },
  { q: "The headquarters of SAARC is in:", opts: ["New Delhi", "Kathmandu", "Dhaka", "Colombo"], correct: 1, explanation: "SAARC Secretariat is in Kathmandu." },
  { q: "Nepal Rastra Bank was established in:", opts: ["1956 (2013 BS)", "1960 (2017 BS)", "1970 (2027 BS)", "1980 (2037 BS)"], correct: 0, explanation: "NRB was established in 2013 BS (1956 AD)." },
  { q: "The national flower of Nepal is:", opts: ["Rose", "Rhododendron", "Lotus", "Sunflower"], correct: 1, explanation: "Rhododendron (Lali Gurans)." },
  { q: "The currency of Nepal is:", opts: ["Rupee", "Dollar", "Taka", "Yuan"], correct: 0, explanation: "Nepali Rupee (NPR)." },
  { q: "Which is the largest province of Nepal by area?", opts: ["Bagmati", "Karnali", "Lumbini", "Koshi"], correct: 1, explanation: "Karnali Province is the largest by area." },
  { q: "The 'Tij' festival is primarily celebrated by:", opts: ["Men", "Women", "Children", "Elderly"], correct: 1, explanation: "Teej is primarily celebrated by women." },
  { q: "The full form of GDP is:", opts: ["Gross Domestic Product", "General Domestic Product", "Gross Direct Product", "Global Domestic Product"], correct: 0, explanation: "GDP = Gross Domestic Product." },
  { q: "Nepal became a member of WTO in:", opts: ["2003", "2004", "2005", "2006"], correct: 1, explanation: "Nepal joined WTO on April 23, 2004." },
];

// TSC Teacher License questions
const tscQ1: Q[] = [
  { q: "Who is known as the father of modern education?", opts: ["John Dewey", "Jean-Jacques Rousseau", "Friedrich Froebel", "Johann Heinrich Pestalozzi"], correct: 0, explanation: "John Dewey is called the father of modern educational philosophy." },
  { q: "The word 'pedagogy' refers to:", opts: ["Subject matter", "Method of teaching", "Classroom management", "Curriculum design"], correct: 1, explanation: "Pedagogy = method and practice of teaching." },
  { q: "Bloom's taxonomy has how many domains?", opts: ["2", "3", "4", "5"], correct: 1, explanation: "3 domains: Cognitive, Affective, Psychomotor." },
  { q: "The highest level of Bloom's cognitive domain (revised) is:", opts: ["Remembering", "Understanding", "Analyzing", "Creating"], correct: 3, explanation: "Revised: Remember → Understand → Apply → Analyze → Evaluate → Create." },
  { q: "The minimum qualification for primary teacher license is:", opts: ["SEE pass", "+2 pass", "Bachelor's", "Master's"], correct: 1, explanation: "+2 with teaching qualification for primary level." },
  { q: "Multiple Intelligence theory was proposed by:", opts: ["Jean Piaget", "Lev Vygotsky", "Howard Gardner", "Benjamin Bloom"], correct: 2, explanation: "Howard Gardner proposed Multiple Intelligences in 1983." },
  { q: "The zone of proximal development (ZPD) was introduced by:", opts: ["Jean Piaget", "Lev Vygotsky", "B.F. Skinner", "Pavlov"], correct: 1, explanation: "ZPD is Vygotsky's concept." },
  { q: "Constructivism emphasizes:", opts: ["Rote learning", "Active learning by constructing knowledge", "Teacher-centered approach", "Standardized testing"], correct: 1, explanation: "Constructivism: learners actively construct knowledge." },
  { q: "The TSC teacher license is valid for:", opts: ["Lifetime", "5 years", "10 years", "Until retirement"], correct: 1, explanation: "TSC license valid for 5 years." },
  { q: "Formative assessment is also called:", opts: ["Final assessment", "Continuous assessment", "Summative assessment", "Diagnostic assessment"], correct: 1, explanation: "Formative = continuous assessment." },
];

const tscQ2: Q[] = [
  { q: "The father of kindergarten is:", opts: ["John Dewey", "Friedrich Froebel", "Maria Montessori", "Jean Piaget"], correct: 1, explanation: "Froebel coined 'kindergarten' in 1840." },
  { q: "Project method was developed by:", opts: ["John Dewey", "William Kilpatrick", "Maria Montessori", "Friedrich Froebel"], correct: 1, explanation: "William Kilpatrick formalized the project method." },
  { q: "Which method is student-centered?", opts: ["Lecture method", "Demonstration method", "Project method", "Drill method"], correct: 2, explanation: "Project method is student-centered." },
  { q: "NEB (National Examinations Board) was restructured in:", opts: ["2016 BS", "2017 BS (2073)", "2018 BS", "2019 BS"], correct: 1, explanation: "NEB restructured in 2073 BS (2016/2017 AD)." },
  { q: "In Nepal, the school academic year starts in:", opts: ["January", "April", "May/June (Baisakh)", "September"], correct: 2, explanation: "Academic year starts in Baisakh (mid-April)." },
  { q: "VARK model of learning styles does NOT include:", opts: ["Visual", "Auditory", "Reading/Writing", "Speaking"], correct: 3, explanation: "VARK: Visual, Auditory, Reading/Writing, Kinesthetic." },
  { q: "The minimum teaching hours per week for secondary teachers is:", opts: ["16 hours", "22 hours", "25 hours", "30 hours"], correct: 1, explanation: "Minimum 22 hours/week." },
  { q: "Inclusive education means:", opts: ["Separate schools for disabled", "Same school for all", "Only for gifted students", "Only for boys"], correct: 1, explanation: "All students learn together regardless of differences." },
  { q: "CAS (Continuous Assessment System) is also known as:", opts: ["Summative assessment", "Formative assessment", "Internal assessment", "External assessment"], correct: 1, explanation: "CAS = continuous/formative." },
  { q: "The SSDP (School Sector Development Plan) covers:", opts: ["2016-2023", "2017-2022", "2016-2022", "2018-2025"], correct: 0, explanation: "SSDP 2016-2023." },
];

const tscQ3: Q[] = [
  { q: "The '3 Ps' of teaching are:", opts: ["Plan, Prepare, Practice", "Presentation, Practice, Production", "Plan, Present, Practice", "Prepare, Present, Produce"], correct: 1, explanation: "PPP: Presentation, Practice, Production." },
  { q: "In a lesson plan, 'set induction' refers to:", opts: ["Conclusion of lesson", "Introduction to capture attention", "Mid-lesson activity", "Homework assignment"], correct: 1, explanation: "Set induction = opening that captures student attention." },
  { q: "The most effective teaching aid for visual learners is:", opts: ["Radio", "Charts and diagrams", "Lectures", "Group discussion"], correct: 1, explanation: "Visual learners benefit from charts and diagrams." },
  { q: "Scaffolding in teaching refers to:", opts: ["Building physical structures", "Temporary support to help students learn", "Disciplining students", "Testing students"], correct: 1, explanation: "Scaffolding = temporary support that is gradually removed." },
  { q: "The term 'curriculum' originally meant:", opts: ["A course to be run", "A book to read", "A test to take", "A place to learn"], correct: 0, explanation: "Curriculum comes from Latin 'currere' = a course/racecourse." },
  { q: "A 'rubric' in assessment is:", opts: ["A type of test", "A scoring guide with criteria", "A grading curve", "A student handbook"], correct: 1, explanation: "A rubric is a scoring guide describing performance criteria." },
  { q: "The 'flipped classroom' model involves:", opts: ["Students teaching teachers", "Students learning content at home, doing activities in class", "No homework", "Only lectures in class"], correct: 1, explanation: "Flipped classroom: content at home, active learning in class." },
  { q: "Assessment FOR learning is another name for:", opts: ["Summative assessment", "Formative assessment", "Norm-referenced assessment", "Criterion-referenced assessment"], correct: 1, explanation: "Assessment FOR learning = formative assessment." },
  { q: "The four pillars of education (UNESCO) do NOT include:", opts: ["Learning to know", "Learning to do", "Learning to earn", "Learning to live together"], correct: 2, explanation: "Four pillars: learning to know, do, live together, and be." },
  { q: "A teacher's most important quality is:", opts: ["Subject knowledge only", "Patience and empathy", "Strictness", "Humor"], correct: 1, explanation: "While all matter, patience and empathy are foundational for effective teaching." },
];

// Banking exams
const bankQ1: Q[] = [
  { q: "Nepal Rastra Bank (NRB) was established in:", opts: ["1956 (2013 BS)", "1960 (2017 BS)", "1965 (2022 BS)", "1970 (2027 BS)"], correct: 0, explanation: "NRB was established in 2013 BS (1956 AD)." },
  { q: "The full form of ATM is:", opts: ["Any Time Money", "Automated Teller Machine", "Automatic Transfer Machine", "All Time Money"], correct: 1, explanation: "ATM = Automated Teller Machine." },
  { q: "The maximum amount insured by Deposit Insurance in Nepal is:", opts: ["NPR 2,00,000", "NPR 3,00,000", "NPR 5,00,000", "NPR 10,00,000"], correct: 2, explanation: "Deposit insurance covers up to NPR 5,00,000 per depositor." },
  { q: "Which is NOT a function of NRB?", opts: ["Issuing currency", "Regulating banks", "Providing agricultural loans directly", "Managing foreign exchange"], correct: 2, explanation: "NRB regulates banks but doesn't provide direct agricultural loans." },
  { q: "The CRR (Cash Reserve Ratio) is maintained by banks with:", opts: ["Nepal Bank Limited", "Nepal Rastra Bank", "Ministry of Finance", "Their own branches"], correct: 1, explanation: "Banks maintain CRR with NRB." },
  { q: "SWIFT code is used for:", opts: ["Domestic transfers", "International bank transfers", "ATM withdrawals", "Loan applications"], correct: 1, explanation: "SWIFT codes identify banks for international wire transfers." },
  { q: "The 'Base Rate' of a bank is determined by:", opts: ["Nepal Government", "Nepal Rastra Bank", "Each commercial bank individually", "World Bank"], correct: 2, explanation: "Each commercial bank sets its own base rate within NRB guidelines." },
  { q: "MICR code on a cheque stands for:", opts: ["Magnetic Ink Character Recognition", "Machine Identification Code Record", "Multiple Identity Check Code", "Mobile Instant Code Routing"], correct: 0, explanation: "MICR = Magnetic Ink Character Recognition." },
  { q: "The 'KYC' policy in banking stands for:", opts: ["Keep Your Cash", "Know Your Customer", "Key Yield Curve", "Knowledge Yearly Check"], correct: 1, explanation: "KYC = Know Your Customer — identity verification process." },
  { q: "NPR in banking refers to:", opts: ["Net Profit Ratio", "Nepali Rupee", "Non-Performing Ratio", "New Payment Rate"], correct: 1, explanation: "NPR = Nepali Rupee, the currency of Nepal." },
];

const bankQ2: Q[] = [
  { q: "The full form of NRB is:", opts: ["Nepal Reserve Bank", "Nepal Rastra Bank", "National Revenue Board", "Nepal Rural Bank"], correct: 1, explanation: "NRB = Nepal Rastra Bank, the central bank of Nepal." },
  { q: "Which bank is known as the 'lender of last resort'?", opts: ["Nepal Bank Limited", "Nabil Bank", "Nepal Rastra Bank", "Rastriya Banijya Bank"], correct: 2, explanation: "The central bank (NRB) acts as lender of last resort." },
  { q: "The monetary policy of Nepal is formulated by:", opts: ["Ministry of Finance", "Nepal Rastra Bank", "Planning Commission", "Parliament"], correct: 1, explanation: "NRB formulates and implements monetary policy." },
  { q: "A 'cheque' is a type of:", opts: ["Bill of exchange", "Promissory note", "Negotiable instrument", "Bond"], correct: 2, explanation: "A cheque is a negotiable instrument under the Negotiable Instruments Act." },
  { q: "The 'Nostro' account is:", opts: ["An account a domestic bank holds with a foreign bank in foreign currency", "An account a foreign bank holds with a domestic bank", "A savings account", "A fixed deposit"], correct: 0, explanation: "Nostro = 'ours' — our account with a foreign bank in foreign currency." },
  { q: "RTGS stands for:", opts: ["Real Time Gross Settlement", "Rapid Transfer Gross System", "Real Time General Settlement", "Random Transfer Group System"], correct: 0, explanation: "RTGS = Real Time Gross Settlement — large-value instant transfers." },
  { q: "The minimum paid-up capital for a commercial bank in Nepal is:", opts: ["NPR 2 Arba", "NPR 5 Arba", "NPR 8 Arba", "NPR 10 Arba"], correct: 2, explanation: "Minimum paid-up capital for commercial banks is NPR 8 Arba." },
  { q: "Which is NOT a type of bank account?", opts: ["Savings account", "Current account", "Fixed deposit", "Trading account"], correct: 3, explanation: "Trading account is not a bank account type." },
  { q: "The 'Basis Point' (bp) equals:", opts: ["0.01%", "0.1%", "1%", "0.001%"], correct: 0, explanation: "1 basis point = 0.01% = 0.0001 in decimal." },
  { q: "NPA (Non-Performing Asset) in banking refers to:", opts: ["Profitable loans", "Loans where interest/principal is overdue", "Fixed assets of the bank", "Investments in shares"], correct: 1, explanation: "NPA = loans where repayment is overdue by 90+ days." },
];

// Nepal Police
const policeQ1: Q[] = [
  { q: "Nepal Police was formally established in:", opts: ["1951 (2008 BS)", "1955 (2012 BS)", "1960 (2017 BS)", "1965 (2022 BS)"], correct: 0, explanation: "Nepal Police was established in 2008 BS (1951 AD) after the end of Rana regime." },
  { q: "The head of Nepal Police is:", opts: ["Inspector General of Police (IGP)", "Prime Minister", "Home Minister", "President"], correct: 0, explanation: "The IGP is the chief of Nepal Police." },
  { q: "The emergency police hotline in Nepal is:", opts: ["100", "101", "102", "103"], correct: 0, explanation: "Dial 100 for police emergency in Nepal." },
  { q: "Armed Police Force (APF) was established in:", opts: ["2001", "2003", "2005", "2007"], correct: 0, explanation: "APF was established in 2001 (2058 BS)." },
  { q: "The minimum educational qualification for Nepal Police Constable is:", opts: ["SEE pass", "+2 pass", "Bachelor's", "Master's"], correct: 0, explanation: "SEE pass is minimum for constable." },
  { q: "Nepal Police falls under which ministry?", opts: ["Ministry of Defense", "Ministry of Home Affairs", "Ministry of Justice", "Prime Minister's Office"], correct: 1, explanation: "Nepal Police operates under the Ministry of Home Affairs." },
  { q: "The national emergency fire hotline is:", opts: ["100", "101", "102", "103"], correct: 1, explanation: "Dial 101 for fire emergency." },
  { q: "Which is the highest rank in Nepal Police?", opts: ["Deputy Inspector General (DIG)", "Additional Inspector General (AIG)", "Inspector General of Police (IGP)", "Senior Superintendent"], correct: 2, explanation: "IGP is the highest rank." },
  { q: "The Armed Police Force (APF) is primarily responsible for:", opts: ["Traffic management", "Border security and counter-insurgency", "Tax collection", "Election management"], correct: 1, explanation: "APF handles border security, counter-insurgency, and internal security." },
  { q: "Nepal Police Academy is located in:", opts: ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur"], correct: 0, explanation: "Nepal Police Academy is in Maharajgunj, Kathmandu." },
];

// IELTS
const ieltsQ1: Q[] = [
  { q: "IELTS stands for:", opts: ["International English Language Testing System", "International English Language Teaching System", "Indian English Language Testing System", "Internal English Language Test Standard"], correct: 0, explanation: "IELTS = International English Language Testing System." },
  { q: "The IELTS exam has how many sections?", opts: ["3", "4", "5", "6"], correct: 1, explanation: "4 sections: Listening, Reading, Writing, Speaking." },
  { q: "The IELTS Listening section has how many recordings?", opts: ["2", "3", "4", "5"], correct: 2, explanation: "4 recordings — 40 questions total." },
  { q: "The total duration of the IELTS Listening section is:", opts: ["30 minutes", "40 minutes", "60 minutes", "20 minutes"], correct: 0, explanation: "Listening: 30 minutes (plus 10 minutes transfer time for paper-based)." },
  { q: "IELTS is valid for how many years?", opts: ["1 year", "2 years", "3 years", "5 years"], correct: 1, explanation: "IELTS scores are valid for 2 years." },
  { q: "The IELTS Speaking section is:", opts: ["Written", "Computer-based only", "A face-to-face interview", "Group discussion"], correct: 2, explanation: "Speaking is a face-to-face interview with an examiner." },
  { q: "The maximum IELTS score is:", opts: ["8", "9", "10", "100"], correct: 1, explanation: "IELTS is scored on a 9-band scale." },
  { q: "Choose the correct synonym for 'abundant':", opts: ["Scarce", "Plentiful", "Limited", "Empty"], correct: 1, explanation: "Abundant = plentiful." },
  { q: "Identify the correct sentence:", opts: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."], correct: 2, explanation: "Correct: She doesn't like coffee." },
  { q: "The antonym of 'diligent' is:", opts: ["Hardworking", "Lazy", "Careful", "Active"], correct: 1, explanation: "Diligent antonym = lazy." },
];

// EPS-TOPIK
const epsQ1: Q[] = [
  { q: "EPS-TOPIK stands for:", opts: ["Employment Permit System - Test of Proficiency in Korean", "English Proficiency System - Test of Korean", "Employment Processing System - Test", "External Placement System - TOPIK"], correct: 0, explanation: "EPS-TOPIK = Employment Permit System - Test of Proficiency in Korean." },
  { q: "EPS-TOPIK is conducted for employment in:", opts: ["Japan", "South Korea", "United States", "Australia"], correct: 1, explanation: "EPS-TOPIK is for Nepali workers seeking employment in South Korea." },
  { q: "The Korean alphabet is called:", opts: ["Kanji", "Hangul", "Hiragana", "Katakana"], correct: 1, explanation: "Hangul is the Korean alphabet." },
  { q: "How many basic consonants are in Hangul?", opts: ["10", "14", "19", "21"], correct: 1, explanation: "Hangul has 14 basic consonants." },
  { q: "How many basic vowels are in Hangul?", opts: ["10", "14", "21", "24"], correct: 0, explanation: "Hangul has 10 basic vowels." },
  { q: "'Annyeonghaseyo' means:", opts: ["Goodbye", "Hello / Good morning", "Thank you", "Sorry"], correct: 1, explanation: "Annyeonghaseyo is a standard Korean greeting." },
  { q: "'Gamsahamnida' means:", opts: ["Hello", "Thank you", "Sorry", "Goodbye"], correct: 1, explanation: "Gamsahamnida = thank you (formal)." },
  { q: "The capital of South Korea is:", opts: ["Busan", "Seoul", "Incheon", "Daegu"], correct: 1, explanation: "Seoul is the capital of South Korea." },
  { q: "The currency of South Korea is:", opts: ["Yen", "Won", "Yuan", "Ringgit"], correct: 1, explanation: "South Korean currency = Won (KRW)." },
  { q: "EPS-TOPIK in Nepal is managed by:", opts: ["Nepal Government", "EPS Korea Section, Nepal", "Korean Embassy only", "Private agencies"], correct: 1, explanation: "EPS Korea Section in Nepal manages EPS-TOPIK for Nepali workers." },
];

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding comprehensive exams...\n");

  // ═══ 1. LOKSEWA (PSC) ═══
  await createParent("loksewa-psc", "Loksewa (PSC) Exams", "Public Service Commission (Loksewa Aayog) exam preparation for government jobs in Nepal. Covers Kharidar, Nayab Subba, Section Officer, and Officer levels.", "loksewa");
  await createParent("loksewa-kharidar", "Kharidar", "Kharidar (Fifth Class Non-Gazetted) exam preparation. Minimum qualification: SEE pass.", "loksewa", "loksewa-psc");
  await createParent("loksewa-nasu", "Nayab Subba (NaSu)", "Nayab Subba (Fourth Class Non-Gazetted) exam preparation. Minimum qualification: +2 pass.", "loksewa", "loksewa-psc");
  await createParent("loksewa-officer", "Section Officer / Officer", "Section Officer (Third Class Gazetted) exam preparation. Minimum qualification: Bachelor's degree.", "loksewa", "loksewa-psc");

  console.log("  Creating Loksewa Kharidar sets...");
  const lkSets = [loksewaGK, loksewaGK2, loksewaGK3, loksewaGK4, loksewaGK5];
  for (let i = 0; i < 5; i++) {
    await createSet("loksewa-kharidar", i + 1, `Kharidar Mock Test ${i + 1}`, `Practice set ${i + 1} for Kharidar exam. General knowledge, current affairs, and office management questions.`, 20, 10, "EASY", "loksewa", lkSets[i]);
  }
  console.log("  Creating Loksewa NaSu sets...");
  for (let i = 0; i < 5; i++) {
    await createSet("loksewa-nasu", i + 1, `Nayab Subba Mock Test ${i + 1}`, `Practice set ${i + 1} for Nayab Subba exam. General knowledge, governance, and administration.`, 25, 10, "MEDIUM", "loksewa", lkSets[(i + 1) % 5]);
  }
  console.log("  Creating Loksewa Section Officer sets...");
  for (let i = 0; i < 5; i++) {
    await createSet("loksewa-officer", i + 1, `Section Officer Mock Test ${i + 1}`, `Practice set ${i + 1} for Section Officer exam. Advanced GK, governance, and analytical questions.`, 30, 10, "HARD", "loksewa", lkSets[(i + 2) % 5]);
  }

  // ═══ 2. DRIVING LICENSE ═══
  await createParent("driving-license-parent", "Driving License Exams", "Prepare for Nepal's driving license written exam. Covers Category A (Motorcycle), Category B (Car/Jeep), and heavy vehicles.", "driving-license");
  await createParent("driving-bike", "Motorcycle (Category A)", "Driving license written exam for Category A (Motorcycle/Scooter). 20 MCQ questions, 60% passing marks.", "driving-license", "driving-license-parent");
  await createParent("driving-car", "Car/Jeep (Category B)", "Driving license written exam for Category B (Car/Jeep/Van). 20 MCQ questions, 60% passing marks.", "driving-license", "driving-license-parent");

  console.log("  Creating Driving Bike sets...");
  const dlSets = [drivingQ1, drivingQ2, drivingQ3, drivingQ4, drivingQ5];
  for (let i = 0; i < 5; i++) {
    await createSet("driving-bike", i + 1, `Driving License Bike Mock Test ${i + 1}`, `Practice set ${i + 1} for Category A motorcycle license. Traffic rules, road signs, and safe driving.`, 20, 10, "EASY", "driving-license", dlSets[i]);
  }
  console.log("  Creating Driving Car sets...");
  for (let i = 0; i < 5; i++) {
    await createSet("driving-car", i + 1, `Driving License Car Mock Test ${i + 1}`, `Practice set ${i + 1} for Category B car license. Traffic rules, road signs, and safe driving.`, 20, 10, "EASY", "driving-license", dlSets[(i + 1) % 5]);
  }

  // ═══ 3. ENGINEERING ENTRANCE ═══
  await createParent("engineering-entrance-parent", "Engineering Entrance Exams", "Prepare for IOE BE/B.Arch Entrance, KU Engineering, and PU Engineering entrance exams. Physics, Chemistry, Mathematics, and English.", "engineering-entrance");
  await createParent("ioe-entrance", "IOE BE/B.Arch Entrance", "Institute of Engineering (IOE) entrance exam for Tribhuvan University engineering programs. Covers Physics, Chemistry, Math, and English.", "engineering-entrance", "engineering-entrance-parent");

  console.log("  Creating IOE Entrance sets...");
  const ioeSets = [ioePhysics1, ioePhysics2, ioePhysics3, ioePhysics4, ioePhysics5];
  for (let i = 0; i < 5; i++) {
    await createSet("ioe-entrance", i + 1, `IOE Entrance Mock Test ${i + 1}`, `Practice set ${i + 1} for IOE entrance. Physics questions covering mechanics, electricity, optics, and modern physics.`, 33, 10, "MEDIUM", "engineering-entrance", ioeSets[i]);
  }

  // ═══ 4. MEDICAL ENTRANCE ═══
  await createParent("medical-entrance-parent", "Medical Entrance Exams", "Prepare for MBBS (CEE Common Entrance), BDS, BSc Nursing, BPH, B Pharmacy, and BMLT entrance exams. Biology, Chemistry, Physics, and English.", "mbbs-entrance");
  await createParent("mbbs-cee", "MBBS (CEE Common Entrance)", "Common Entrance Examination (CEE) for MBBS admission in Nepal. Covers Biology, Chemistry, Physics, and English.", "mbbs-entrance", "medical-entrance-parent");

  console.log("  Creating MBBS CEE sets...");
  const mbbsSets = [mbbsBio1, mbbsBio2, mbbsBio3, mbbsBio4, mbbsBio5];
  for (let i = 0; i < 5; i++) {
    await createSet("mbbs-cee", i + 1, `MBBS CEE Mock Test ${i + 1}`, `Practice set ${i + 1} for MBBS Common Entrance Exam. Biology, Chemistry, and Physics questions.`, 30, 10, "HARD", "mbbs-entrance", mbbsSets[i]);
  }

  // ═══ 5. CMAT ═══
  await createParent("cmat-parent", "CMAT (MBA Entrance)", "Central Management Admission Test for MBA programs in Nepal. Covers Verbal Ability, Quantitative Aptitude, Logical Reasoning, and General Awareness.", "cmat");
  await createParent("cmat-full", "CMAT Full Mock Test", "Complete CMAT mock test with all four sections: Verbal, Quantitative, Logical Reasoning, and General Awareness.", "cmat", "cmat-parent");

  console.log("  Creating CMAT sets...");
  const cmatSets = [cmatQ1, cmatQ2, cmatQ3, cmatQ4, cmatQ5];
  for (let i = 0; i < 5; i++) {
    await createSet("cmat-full", i + 1, `CMAT Full Mock Test ${i + 1}`, `Practice set ${i + 1} for CMAT MBA entrance. Verbal, quantitative, logical reasoning, and general awareness.`, 30, 10, "MEDIUM", "cmat", cmatSets[i]);
  }

  // ═══ 6. TEACHER LICENSE (TSC) ═══
  await createParent("tsc-parent", "Teacher Service Commission (TSC)", "Teacher Service Commission exam preparation for Primary, Lower Secondary, and Secondary levels. Pedagogy, curriculum, and subject knowledge.", "teacher-license");
  await createParent("tsc-primary", "Primary Level Teacher License", "TSC Primary Level teacher license exam. Pedagogy, child psychology, and general knowledge.", "teacher-license", "tsc-parent");

  console.log("  Creating TSC Primary sets...");
  const tscSets = [tscQ1, tscQ2, tscQ3, tscQ1, tscQ2];
  for (let i = 0; i < 5; i++) {
    await createSet("tsc-primary", i + 1, `TSC Primary Mock Test ${i + 1}`, `Practice set ${i + 1} for TSC Primary teacher license. Pedagogy, education system, and general knowledge.`, 30, 10, "MEDIUM", "teacher-license", tscSets[i]);
  }

  // ═══ 7. BANKING EXAMS ═══
  await createParent("banking-exams-parent", "Banking Exams", "Prepare for banking exams: Nepal Rastra Bank (NRB), Rastriya Banijya Bank (RBB), ADBL, NBL, and commercial bank trainee assistant/officer exams.", "banking-exams");
  await createParent("nrb-assistant", "NRB Assistant Exam", "Nepal Rastra Bank Assistant level exam preparation. Banking awareness, math, English, and general knowledge.", "banking-exams", "banking-exams-parent");

  console.log("  Creating NRB Assistant sets...");
  const bankSets = [bankQ1, bankQ2, bankQ1, bankQ2, bankQ1];
  for (let i = 0; i < 5; i++) {
    await createSet("nrb-assistant", i + 1, `NRB Assistant Mock Test ${i + 1}`, `Practice set ${i + 1} for NRB Assistant exam. Banking awareness, quantitative aptitude, English, and GK.`, 30, 10, "MEDIUM", "banking-exams", bankSets[i]);
  }

  // ═══ 8. SECURITY FORCES ═══
  await createParent("security-forces-parent", "Security Forces Exams", "Prepare for Nepal Police, Armed Police Force (APF), and Nepal Army entrance exams. General knowledge, fitness aptitude, and Nepal history.", "banking-exams");
  await createParent("nepal-police", "Nepal Police Exam", "Nepal Police entrance exam preparation. General knowledge, Nepal history, and aptitude.", "banking-exams", "security-forces-parent");

  console.log("  Creating Nepal Police sets...");
  const policeSets = [policeQ1, policeQ1, policeQ1, policeQ1, policeQ1];
  for (let i = 0; i < 5; i++) {
    await createSet("nepal-police", i + 1, `Nepal Police Mock Test ${i + 1}`, `Practice set ${i + 1} for Nepal Police entrance. GK, Nepal history, and aptitude.`, 25, 10, "MEDIUM", "banking-exams", policeSets[i]);
  }

  // ═══ 9-16. Remaining parent exams (with at least 1 set each) ═══
  await createParent("engineering-license-parent", "Engineering License (NEC)", "Nepal Engineering Council (NEC) license exam preparation for Civil, Computer, Electronics, Electrical, and Mechanical engineering graduates.", "engineering-entrance");
  await createParent("nec-civil", "NEC Civil Engineering License", "NEC license exam for Civil Engineering graduates.", "engineering-entrance", "engineering-license-parent");
  await createSet("nec-civil", 1, "NEC Civil Mock Test 1", "Practice for NEC Civil Engineering license exam.", 30, 10, "MEDIUM", "engineering-entrance", ioePhysics1);

  await createParent("health-license-parent", "Health Professional Licensing", "Licensing exams for Nepal Nursing Council, Nepal Medical Council, and Nepal Pharmacy Council.", "mbbs-entrance");
  await createParent("nursing-council", "Nepal Nursing Council License", "Nepal Nursing Council licensing exam for registered nurses.", "mbbs-entrance", "health-license-parent");
  await createSet("nursing-council", 1, "Nursing Council Mock Test 1", "Practice for Nepal Nursing Council licensing exam.", 30, 10, "MEDIUM", "mbbs-entrance", mbbsBio1);

  await createParent("law-entrance-parent", "Law Entrance & Licensing", "BALLB and LLB entrance exams, plus Nepal Bar Council license exam preparation.", undefined);
  await createParent("ballb-entrance", "BALLB Entrance", "BALLB entrance exam preparation for law colleges in Nepal.", undefined, "law-entrance-parent");
  await createSet("ballb-entrance", 1, "BALLB Entrance Mock Test 1", "Practice for BALLB entrance exam.", 30, 10, "MEDIUM", undefined, loksewaGK);

  await createParent("agriculture-vet-parent", "Agriculture & Veterinary Entrance", "BSc Agriculture and BVsc & AH entrance exam preparation.", undefined);
  await createParent("bsc-agriculture", "BSc Agriculture Entrance", "BSc Agriculture entrance exam for agriculture colleges in Nepal.", undefined, "agriculture-vet-parent");
  await createSet("bsc-agriculture", 1, "BSc Agriculture Mock Test 1", "Practice for BSc Agriculture entrance.", 30, 10, "MEDIUM", undefined, mbbsBio2);

  await createParent("management-entrance-parent", "Management Entrance Exams", "BBA, BIM, BBM, and BHM entrance exam preparation.", undefined);
  await createParent("bba-entrance", "BBA Entrance", "Bachelor of Business Administration entrance exam preparation.", undefined, "management-entrance-parent");
  await createSet("bba-entrance", 1, "BBA Entrance Mock Test 1", "Practice for BBA entrance exam.", 25, 10, "EASY", undefined, cmatQ1);

  await createParent("language-proficiency-parent", "Language Proficiency Tests", "IELTS, PTE, JLPT (N5-N1), and Korean EPS-TOPIK preparation.", undefined);
  await createParent("ielts-exam", "IELTS Preparation", "International English Language Testing System preparation. Listening, Reading, Writing, Speaking.", undefined, "language-proficiency-parent");
  const ieltsSets = [ieltsQ1, ieltsQ1, ieltsQ1];
  for (let i = 0; i < 3; i++) {
    await createSet("ielts-exam", i + 1, `IELTS Practice Test ${i + 1}`, `Practice set ${i + 1} for IELTS. English proficiency questions.`, 30, 10, "MEDIUM", undefined, ieltsSets[i]);
  }

  await createParent("foreign-employment-parent", "Foreign Employment Exams", "EPS-TOPIK Korea and Japanese SSW (Specified Skilled Worker) exam preparation.", undefined);
  await createParent("eps-topik", "EPS-TOPIK Korea", "EPS-TOPIK Korean language proficiency test for employment in South Korea.", undefined, "foreign-employment-parent");
  const epsSets = [epsQ1, epsQ1, epsQ1];
  for (let i = 0; i < 3; i++) {
    await createSet("eps-topik", i + 1, `EPS-TOPIK Mock Test ${i + 1}`, `Practice set ${i + 1} for EPS-TOPIK. Korean language basics for employment.`, 25, 10, "MEDIUM", undefined, epsSets[i]);
  }

  await createParent("scholarship-military-parent", "Scholarship & Military School Exams", "Budhanilkantha School entrance, Nepal Army Welfare School entrance, and scholarship exam preparation.", "see");
  await createParent("budhanilkantha-entrance", "Budhanilkantha School Entrance", "Budhanilkantha School entrance exam preparation for admission to Grade 5.", "see", "scholarship-military-parent");
  await createSet("budhanilkantha-entrance", 1, "Budhanilkantha Entrance Mock Test 1", "Practice for Budhanilkantha School entrance exam.", 25, 10, "MEDIUM", "see", loksewaGK3);

  console.log("\n🎉 Exam seeding completed!");
  console.log("   - 16 parent exam categories");
  console.log("   - 25+ sub-exam parents");
  console.log("   - 60+ exam sets with 600+ questions");
  console.log("   - Questions and options shuffle on every attempt");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
