import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SupabaseClient } from "@supabase/supabase-js";
import { StepIntro } from "./steps/StepIntro";
import { StepQualification } from "./steps/StepQualification";
import { StepBenefits } from "./steps/StepBenefits";
import { StepAvailability } from "./steps/StepAvailability";
import { StepContact } from "./steps/StepContact";
import { StepSuccess } from "./steps/StepSuccess";
import { ProgressBar } from "./ProgressBar";

interface RecruitmentWizardProps {
  clientId: string;
  tradeType: string;
  supabaseClient: SupabaseClient;
}

export interface WizardData {
  qualification: string;
  benefits: string[];
  availability: string;
  name: string;
  phone: string;
  consent: boolean;
}

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export const RecruitmentWizard = ({ clientId, tradeType, supabaseClient }: RecruitmentWizardProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<WizardData>({
    qualification: "",
    benefits: [],
    availability: "",
    name: "",
    phone: "",
    consent: false,
  });

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const updateData = (partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.from("recruitment_leads").insert({
        client_id: clientId,
        trade_type: tradeType,
        qualification: data.qualification,
        benefits_selected: data.benefits,
        availability: data.availability,
        candidate_name: data.name,
        candidate_phone: data.phone,
      });
      if (error) throw error;
      setSubmitted(true);
      setStep(TOTAL_STEPS);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (submitted) return <StepSuccess tradeType={tradeType} />;
    switch (step) {
      case 0:
        return <StepIntro tradeType={tradeType} onNext={next} />;
      case 1:
        return <StepQualification value={data.qualification} onChange={(v) => updateData({ qualification: v })} onNext={next} onBack={back} />;
      case 2:
        return <StepBenefits value={data.benefits} onChange={(v) => updateData({ benefits: v })} onNext={next} onBack={back} />;
      case 3:
        return <StepAvailability value={data.availability} onChange={(v) => updateData({ availability: v })} onNext={next} onBack={back} />;
      case 4:
        return <StepContact data={data} onChange={updateData} onSubmit={submit} onBack={back} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          {!submitted && <ProgressBar current={step} total={TOTAL_STEPS} />}
          <div className="p-6 sm:p-8 min-h-[420px] flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step + (submitted ? "-done" : "")}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-1 flex flex-col"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4 opacity-60">
          Powered by professionelles Recruiting
        </p>
      </div>
    </div>
  );
};
