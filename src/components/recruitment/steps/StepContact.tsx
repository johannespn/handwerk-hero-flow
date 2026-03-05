import { WizardButton } from "../WizardButton";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { WizardData } from "../RecruitmentWizard";

interface StepContactProps {
  data: WizardData;
  onChange: (partial: Partial<WizardData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export const StepContact = ({ data, onChange, onSubmit, onBack, loading }: StepContactProps) => {
  const isValid = data.name.trim().length >= 2 && data.phone.trim().length >= 6 && data.consent;

  return (
    <div className="flex-1 flex flex-col gap-4">
      <button onClick={onBack} className="self-start text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">Fast geschafft!</h2>
      <p className="text-muted-foreground text-sm">Wie können wir dich erreichen?</p>

      <div className="flex flex-col gap-3 mt-2">
        <input
          type="text"
          placeholder="Vorname"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          maxLength={100}
          className="w-full py-4 px-5 rounded-xl text-lg bg-secondary text-secondary-foreground border-2 border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
        />
        <input
          type="tel"
          placeholder="Handynummer"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          maxLength={20}
          className="w-full py-4 px-5 rounded-xl text-lg bg-secondary text-secondary-foreground border-2 border-border focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
        />
      </div>

      <label className="flex items-start gap-3 mt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => onChange({ consent: e.target.checked })}
          className="mt-1 w-5 h-5 rounded accent-primary"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          Ich stimme zu, dass meine Daten zur Kontaktaufnahme gespeichert werden.{" "}
          <span className="text-foreground font-medium">Datenschutz</span>
        </span>
      </label>

      <div className="mt-auto pt-4">
        <WizardButton onClick={onSubmit} disabled={!isValid || loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Wird gesendet...
            </span>
          ) : (
            "Jetzt bewerben ✅"
          )}
        </WizardButton>
      </div>
    </div>
  );
};
