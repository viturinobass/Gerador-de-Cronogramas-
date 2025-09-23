import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
}

export function GradientCard({ children, className }: GradientCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl shadow-elegant border border-white/20 backdrop-blur-sm",
      className
    )}>
      {children}
    </div>
  );
}