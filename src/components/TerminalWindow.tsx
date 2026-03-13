interface TerminalWindowProps {
  prompt: string;
  children: React.ReactNode;
}

const TerminalWindow = ({ prompt, children }: TerminalWindowProps) => {
  return (
    <div className="terminal-window shadow-xl max-w-3xl mx-auto">
      <div className="terminal-header">
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
