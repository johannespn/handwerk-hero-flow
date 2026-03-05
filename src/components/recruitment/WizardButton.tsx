import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface WizardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const WizardButton = ({ variant = "primary", className, children, ...props }: WizardButtonProps) => {
  return (
    <button
      className={cn(
        "w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg",
        variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-muted border border-border",
        variant === "ghost" && "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
