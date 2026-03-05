import { SelectionCard } from "../SelectionCard";
import { WizardButton } from "../WizardButton";
import { ArrowLeft } from "lucide-react";

interface StepBenefitsProps {
  value: string[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const options = [
  { label: "4-Tage-Woche", icon: "📅" },
  { label: "Firmenwagen", icon: "🚗" },
  { label: "Modernes Werkzeug", icon: "🛠️" },
  { label: "Übertarifliches Gehalt", icon: "💰" },
];

export const StepBenefits = ({ value, onChange, onNext, onBack }: StepBenefitsProps) => {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <button onClick={onBack} className="self-start text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">Was ist dir wichtig?</h2>
      <p className="text-muted-foreground text-sm">Wähle alles aus, was zutrifft.</p>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <SelectionCard
            key={opt.label}
            label={opt.label}
            icon={opt.icon}
            selected={value.includes(opt.label)}
            onClick={() => toggle(opt.label)}
          />
        ))}
      </div>
      <div className="mt-auto pt-4">
        <WizardButton onClick={onNext} disabled={value.length === 0}>
          Weiter
        </WizardButton>
      </div>
    </div>
  );
};
