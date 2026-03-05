import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SelectionCardProps {
  label: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectionCard = ({ label, icon, selected, onClick }: SelectionCardProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "w-full py-4 px-5 rounded-xl text-left text-lg font-medium transition-all duration-200 border-2",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-md"
          : "bg-card text-card-foreground border-border hover:border-[hsl(var(--trade-steel))]"
      )}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </motion.button>
  );
};
