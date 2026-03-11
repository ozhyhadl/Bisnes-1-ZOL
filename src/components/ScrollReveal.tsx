import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const ScrollReveal = ({ children, className }: ScrollRevealProps) => {
  return <div className={className}>{children}</div>;
};

export default ScrollReveal;
