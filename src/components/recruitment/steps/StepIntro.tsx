import { WizardButton } from "../WizardButton";
import { Wrench } from "lucide-react";

interface StepIntroProps {
  tradeType: string;
  onNext: () => void;
}

export const StepIntro = ({ tradeType, onNext }: StepIntroProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
        <Wrench className="w-8 h-8 text-accent" />
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          Bereit für einen Tapetenwechsel?
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg">
          Prüfe in 60 Sekunden, ob wir als {tradeType} zusammenpassen.
        </p>
      </div>
      <div className="w-full mt-auto pt-6">
        <WizardButton onClick={onNext}>Los geht's 🚀</WizardButton>
      </div>
    </div>
  );
};
