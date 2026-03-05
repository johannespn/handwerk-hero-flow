#!/usr/bin/env node
/**
 * Generates public/registry/recruitment-wizard.json from source files.
 * Run with: node scripts/build-registry.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function readSrc(relPath) {
  return readFileSync(join(root, "src", relPath), "utf-8");
}

function file(path, type = "registry:component") {
  return { path, content: readSrc(path), type };
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "recruitment-wizard",
  type: "registry:block",
  title: "Recruitment Wizard",
  description:
    "Animated 5-step recruitment wizard for collecting candidate leads. Submits to a Supabase `recruitment_leads` table. Pass your supabaseClient, clientId, and tradeType as props.",
  dependencies: ["framer-motion"],
  registryDependencies: ["utils"],
  files: [
    file("components/recruitment/RecruitmentWizard.tsx"),
    file("components/recruitment/ProgressBar.tsx"),
    file("components/recruitment/SelectionCard.tsx"),
    file("components/recruitment/WizardButton.tsx"),
    file("components/recruitment/steps/StepIntro.tsx"),
    file("components/recruitment/steps/StepQualification.tsx"),
    file("components/recruitment/steps/StepBenefits.tsx"),
    file("components/recruitment/steps/StepAvailability.tsx"),
    file("components/recruitment/steps/StepContact.tsx"),
    file("components/recruitment/steps/StepSuccess.tsx"),
  ],
};

const outDir = join(root, "public", "registry");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "recruitment-wizard.json");
writeFileSync(outPath, JSON.stringify(registry, null, 2) + "\n");
console.log("✓ Registry built →", outPath.replace(root + "/", ""));
