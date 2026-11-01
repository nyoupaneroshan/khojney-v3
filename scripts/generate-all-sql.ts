import fs from "fs";
import path from "path";
import {
  generateNepseSql,
  generateBanksSql,
  generateUniversitiesSql,
  generateCollegesSql,
  generateHospitalsSql,
  generateMutualFundsSql,
  generateInsuranceSql,
  generateGovernmentServicesSql,
  generateScholarshipsSql,
  generateExamsSqlStatements,
} from "./generate-sql";

const outDir = "/Users/nyoupane/.gemini/antigravity/brain/94060163-f289-47bb-a9b3-e5e18df3e2ec/scratch";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, "nepse.sql"), generateNepseSql());
fs.writeFileSync(path.join(outDir, "banks.sql"), generateBanksSql());
fs.writeFileSync(path.join(outDir, "universities.sql"), generateUniversitiesSql());
fs.writeFileSync(path.join(outDir, "colleges.sql"), generateCollegesSql());
fs.writeFileSync(path.join(outDir, "hospitals.sql"), generateHospitalsSql());
fs.writeFileSync(path.join(outDir, "mutual-funds.sql"), generateMutualFundsSql());
fs.writeFileSync(path.join(outDir, "insurance.sql"), generateInsuranceSql());
fs.writeFileSync(path.join(outDir, "government-services.sql"), generateGovernmentServicesSql());
fs.writeFileSync(path.join(outDir, "scholarships.sql"), generateScholarshipsSql());
fs.writeFileSync(path.join(outDir, "exams.json"), JSON.stringify(generateExamsSqlStatements(), null, 2));

console.log("Generated all SQL files in scratch directory!");
