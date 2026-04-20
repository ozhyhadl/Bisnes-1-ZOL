import coworkImage from "@/assets/skill-install-animation/co-work.avif";
import skillCardImage from "@/assets/skill-install-animation/skill-card.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const SkillInstallAnimation = () => {
  const { t } = useLanguage();

  return (
    <div className="skill-install-demo mx-auto max-w-3xl">
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

      <p className="skill-install-label">{t(landingCopy.skillInstall.label)}</p>
      <h3 className="skill-install-headline">{t(landingCopy.skillInstall.title)}</h3>
      <p className="skill-install-subcopy">
        {t(landingCopy.skillInstall.body)}
      </p>
    </div>
  );
};

export default SkillInstallAnimation;