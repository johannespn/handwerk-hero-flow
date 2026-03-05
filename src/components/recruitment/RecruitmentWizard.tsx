import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import type { SupabaseClient } from "@supabase/supabase-js";
import { StepIntro } from "./steps/StepIntro";
import { StepQualification } from "./steps/StepQualification";
import { StepBenefits } from "./steps/StepBenefits";
import { StepAvailability } from "./steps/StepAvailability";
import { StepContact } from "./steps/StepContact";
import { StepSuccess } from "./steps/StepSuccess";
import { StepExperience } from "./steps/StepExperience";
import { StepDriversLicense } from "./steps/StepDriversLicense";
import { ProgressBar } from "./ProgressBar";

interface RecruitmentWizardProps {
  clientId: string;
  tradeType: string;
  supabaseClient: SupabaseClient;
  isAutoPilot?: boolean;
}

export interface WizardData {
  qualification: string;
  experience: string;
  driversLicense: string;
  benefits: string[];
  availability: string;
  name: string;
  phone: string;
  consent: boolean;
}

const TOTAL_STEPS = 7;

const INITIAL_DATA: WizardData = {
  qualification: "",
  experience: "",
  driversLicense: "",
  benefits: [],
  availability: "",
  name: "",
  phone: "",
  consent: false,
};

// Demo data injected per step in auto-pilot mode
const AUTO_PILOT_DATA: Record<number, Partial<WizardData>> = {
  1: { qualification: "Geselle" },
  2: { experience: "5–10 Jahre" },
  3: { driversLicense: "Klasse B" },
  4: { benefits: ["Firmenwagen", "Übertarifliches Gehalt"] },
  5: { availability: "Sofort" },
  6: { name: "Max M.", phone: "0151 12345678", consent: true },
};

// SelectionCard label to target per step; null = target the WizardButton instead
const AUTO_PILOT_CARD_LABEL: Record<number, string | null> = {
  0: null,
  1: "Geselle",
  2: "5–10 Jahre",
  3: "Klasse B",
  4: null,
  5: "Sofort",
  6: null,
};

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

export const RecruitmentWizard = ({
  clientId,
  tradeType,
  supabaseClient,
  isAutoPilot = false,
}: RecruitmentWizardProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [thumbClicking, setThumbClicking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbX = useMotionValue(-100);
  const thumbY = useMotionValue(-100);
  const thumbOpacity = useMotionValue(0);

  useEffect(() => {
    if (!isAutoPilot) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timers.push(t);
    };

    const isSuccess = submitted || step >= TOTAL_STEPS;

    if (isSuccess) {
      after(() => {
        // Gently fade thumb out
        animate(thumbOpacity, 0, { duration: 0.8, ease: "easeInOut" });
        // Once invisible, snap position off-screen then restart
        setTimeout(() => {
          thumbX.set(-100);
          thumbY.set(-100);
          setThumbClicking(false);
          setStep(0);
          setDirection(1);
          setSubmitted(false);
          setData(INITIAL_DATA);
        }, 900);
      }, 3000);
      return () => timers.forEach(clearTimeout);
    }

    // Inject demo data immediately so any disabled buttons become enabled
    const demoData = AUTO_PILOT_DATA[step];
    if (demoData) {
      setData((prev) => ({ ...prev, ...demoData }));
    }

    // After DOM settles (500ms covers layout + slide animations), find target and animate thumb
    after(() => {
      if (!containerRef.current) return;

      const cardLabel = AUTO_PILOT_CARD_LABEL[step];
      let target: Element | null = null;

      if (cardLabel) {
        const buttons = Array.from(containerRef.current.querySelectorAll("button"));
        target = buttons.find((btn) => btn.textContent?.includes(cardLabel)) ?? null;
      }
      if (!target) {
        target = containerRef.current.querySelector("[data-wizard-btn]");
      }

      if (target) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elRect = target.getBoundingClientRect();
        const cx = elRect.left + elRect.width / 2 - containerRect.left - 22;
        const cy = elRect.top + elRect.height / 2 - containerRect.top - 22;

        if (thumbOpacity.get() < 0.1) {
          // Thumb is hidden: snap to target position first, then gently fade in
          thumbX.set(cx);
          thumbY.set(cy);
          animate(thumbOpacity, 1, { duration: 0.7, ease: "easeIn" });
        } else {
          // Thumb is visible: slide smoothly to next target
          animate(thumbX, cx, { duration: 0.5, ease: "easeInOut" });
          animate(thumbY, cy, { duration: 0.5, ease: "easeInOut" });
        }
      }
    }, 500);

    // Simulate "click": ripple + advance step
    after(() => {
      setThumbClicking(true);
      after(() => setThumbClicking(false), 400);

      if (step === 6) {
        // Demo mode: skip API, go straight to success
        setSubmitted(true);
        setStep(TOTAL_STEPS);
      } else {
        setDirection(1);
        setStep((s) => s + 1);
      }
    }, 2000);

    return () => timers.forEach(clearTimeout);
  }, [isAutoPilot, step, submitted]);

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
        years_of_experience: data.experience,
        drivers_license_class: data.driversLicense,
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
        return <StepExperience value={data.experience} onChange={(v) => updateData({ experience: v })} onNext={next} onBack={back} />;
      case 3:
        return <StepDriversLicense value={data.driversLicense} onChange={(v) => updateData({ driversLicense: v })} onNext={next} onBack={back} />;
      case 4:
        return <StepBenefits value={data.benefits} onChange={(v) => updateData({ benefits: v })} onNext={next} onBack={back} />;
      case 5:
        return <StepAvailability value={data.availability} onChange={(v) => updateData({ availability: v })} onNext={next} onBack={back} />;
      case 6:
        return <StepContact data={data} onChange={updateData} onSubmit={submit} onBack={back} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* containerRef lives here, outside overflow:hidden, so thumb positions are measured correctly */}
      <div ref={containerRef} className="w-full max-w-lg relative">
        <motion.div
          layout
          transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
          className="bg-card rounded-2xl shadow-xl overflow-hidden"
          style={isAutoPilot ? { pointerEvents: "none" } : undefined}
        >
          {!submitted && <ProgressBar current={step} total={TOTAL_STEPS} />}
          <div className="p-6 sm:p-8 flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step + (submitted ? "-done" : "")}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-4 opacity-60">
          Powered by professionelles Recruiting
        </p>

        {/* Auto-pilot thumb — rendered outside overflow:hidden so it's never clipped */}
        {isAutoPilot && (
          <>
            {/* Ripple ring on "click" */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                x: thumbX,
                y: thumbY,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.35)",
                pointerEvents: "none",
                zIndex: 49,
              }}
              animate={thumbClicking ? { scale: 2.5, opacity: 0 } : { scale: 1, opacity: 0 }}
              transition={{ duration: thumbClicking ? 0.45 : 0 }}
            />
            {/* Thumb circle */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                x: thumbX,
                y: thumbY,
                opacity: thumbOpacity,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.22)",
                backdropFilter: "blur(4px)",
                border: "2.5px solid rgba(255,255,255,0.8)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
                pointerEvents: "none",
                zIndex: 50,
              }}
              animate={{ scale: thumbClicking ? 0.82 : 1 }}
              transition={{ duration: 0.12 }}
            />
          </>
        )}
      </div>
    </div>
  );
};
