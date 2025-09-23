import { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function GradientBackground({ children, className = "" }: GradientBackgroundProps) {
  return (
    <div className={`min-h-screen bg-gradient-background ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] animate-float" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}