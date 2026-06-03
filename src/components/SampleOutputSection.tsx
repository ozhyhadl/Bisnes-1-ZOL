import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import ScrollReveal from "./ScrollReveal";
import TerminalWindow from "./TerminalWindow";

const samples = [
  {
    title: salesCopy.sampleOutputs.contractTitle,
    body: salesCopy.sampleOutputs.contractBody,
  },
  {
    title: salesCopy.sampleOutputs.postTitle,
    body: salesCopy.sampleOutputs.postBody,
  },
];

const SampleOutputSection = () => {
  const { t } = useLanguage();

  return (
    <section className="px-4 py-16" aria-label={t(salesCopy.sampleOutputs.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat sample-output.md">
          <h2 className="mb-4 text-2xl font-bold text-terminal-foreground md:text-4xl">{t(salesCopy.sampleOutputs.title)}</h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-terminal-foreground/70">{t(salesCopy.sampleOutputs.subtitle)}</p>
          <div className="space-y-4">
            {samples.map((sample) => (
              <details key={t(sample.title)} className="rounded-xl border border-terminal-foreground/10 bg-black/10 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-terminal-foreground">{t(sample.title)}</summary>
                <pre className="mt-4 whitespace-pre-wrap text-xs leading-6 text-terminal-green/95">{t(sample.body)}</pre>
              </details>
            ))}
          </div>
        </TerminalWindow>
      </ScrollReveal>
    </section>
  );
};

export default SampleOutputSection;
