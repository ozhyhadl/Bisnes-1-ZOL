import coworkImage from "@/assets/skill-install-animation/co-work.avif";
import skillCardImage from "@/assets/skill-install-animation/skill-card.png";

const SkillInstallAnimation = () => {
  return (
    <div className="skill-install-demo mx-auto max-w-4xl">
      <div className="skill-install-stage" aria-hidden="true">
        <img
          decoding="async"
          className="skill-install-cowork"
          src={coworkImage}
          alt=""
        />
        <div className="skill-install-drop-zone" />
        <img
          decoding="async"
          className="skill-install-card"
          src={skillCardImage}
          alt=""
        />
      </div>

      <p className="skill-install-label">// drag. drop. done.</p>
      <h3 className="skill-install-headline">Install a skill like a file.</h3>
      <p className="skill-install-subcopy">
        Drag any skill card straight into Claude Cowork, Claude on the Web, add it to Claude Code, or use it via VS Code Copilot.
      </p>
    </div>
  );
};

export default SkillInstallAnimation;