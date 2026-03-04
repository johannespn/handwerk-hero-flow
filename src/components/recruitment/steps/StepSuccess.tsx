import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface StepSuccessProps {
  tradeType: string;
}

export const StepSuccess = ({ tradeType }: StepSuccessProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 className="w-20 h-20 text-[hsl(var(--trade-success))]" />
      </motion.div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Top, das hat geklappt! 🎉</h2>
        <p className="mt-3 text-muted-foreground text-base">
          Wir melden uns schnellstmöglich bei dir. Dein neuer Job als {tradeType} wartet!
        </p>
      </div>
    </div>
  );
};
