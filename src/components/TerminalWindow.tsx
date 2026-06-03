import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  prompt: string;
  children: React.ReactNode;
  className?: string;
}

const TerminalWindow = ({ prompt, children, className }: TerminalWindowProps) => {
  return (
    <div className={cn("terminal-window mx-auto max-w-3xl shadow-xl", className)}>
      <div className="terminal-header hidden md:flex">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="ml-3 text-xs md:text-sm text-terminal-foreground/70 truncate">{prompt}</span>
      </div>
      <div className="p-4 md:p-6 lg:p-7">{children}</div>
    </div>
  );
};

export default TerminalWindow;
