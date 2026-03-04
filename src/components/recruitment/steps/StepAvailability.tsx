import { SelectionCard } from "../SelectionCard";
import { ArrowLeft } from "lucide-react";

interface StepAvailabilityProps {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const options = [
  { label: "Sofort", icon: "⚡" },
  { label: "In 1 Monat", icon: "📆" },
  { label: "Nur mal umschauen", icon: "👀" },
];

export const StepAvailability = ({ value, onChange, onNext, onBack }: StepAvailabilityProps) => {
  const handleSelect = (opt: string) => {
    onChange(opt);
    setTimeout(onNext, 300);
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <button onClick={onBack} className="self-start text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">Ab wann wärst du startklar?</h2>
      <div className="flex flex-col gap-3 mt-2">
        {options.map((opt) => (
          <SelectionCard
            key={opt.label}
            label={opt.label}
            icon={opt.icon}
            selected={value === opt.label}
            onClick={() => handleSelect(opt.label)}
          />
        ))}
      </div>
    </div>
  );
};
