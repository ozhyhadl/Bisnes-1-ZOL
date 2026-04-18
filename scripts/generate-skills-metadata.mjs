import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const bundleRoot = path.join(projectRoot, "src", "Claude Skills Ultimate Bundle");
const outputPath = path.join(projectRoot, "src", "data", "skillsMetadata.ts");

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeDescription(description) {
  let text = description.trim();

  text = text.replace(/^['\"]|['\"]$/g, "");
  text = text.replace(/\s+/g, " ");
  text = text.replace(/`+/g, "");
  text = text.replace(/\*\*/g, "");
  text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");

  const useWhenIndex = text.search(/\bUse when\b/i);
  if (useWhenIndex > 0) {
    text = text.slice(0, useWhenIndex).trim();
    if (!/[.!?]$/.test(text)) {
      text += ".";
    }
  }

  if (text.length > 220) {
    const firstSentence = text.match(/^.*?[.!?](?:\s|$)/);
    text = (firstSentence ? firstSentence[0] : `${text.slice(0, 217)}...`).trim();
  }

  return text;
}

function fallbackDescription(slug, category) {
  return `Creates a ${titleFromSlug(slug).toLowerCase()} workflow for ${category.toLowerCase()} needs.`;
}

const metadataEntries = [];

for (const category of fs.readdirSync(bundleRoot, { withFileTypes: true })) {
  if (!category.isDirectory()) {
    continue;
  }

  const categoryPath = path.join(bundleRoot, category.name);
  for (const skill of fs.readdirSync(categoryPath, { withFileTypes: true })) {
    if (!skill.isDirectory()) {
      continue;
    }

    const skillPath = path.join(categoryPath, skill.name, "SKILL.md");
    if (!fs.existsSync(skillPath)) {
      continue;
    }

    const source = fs.readFileSync(skillPath, "utf8");
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
    const descriptionMatch = frontmatter?.[1].match(/^description:\s*(.+)$/m);
    const titleMatch = source.match(/^#\s+(.+)$/m);

    metadataEntries.push({
      slug: skill.name,
      title: titleMatch?.[1]?.trim() || titleFromSlug(skill.name),
      category: category.name,
      shortDescription: descriptionMatch
        ? normalizeDescription(descriptionMatch[1])
        : fallbackDescription(skill.name, category.name),
    });
  }
}

metadataEntries.sort((a, b) => a.slug.localeCompare(b.slug));

const fileText = `export const skillsMetadata = {\n${metadataEntries
  .map(({ slug, title, category, shortDescription }) => {
    return `  ${JSON.stringify(slug)}: { title: ${JSON.stringify(title)}, category: ${JSON.stringify(category)}, shortDescription: ${JSON.stringify(shortDescription)} },`;
  })
  .join("\n")}\n} as const;\n\nexport type SkillSlug = keyof typeof skillsMetadata;\n`;

fs.writeFileSync(outputPath, fileText);

console.log(`Generated ${metadataEntries.length} entries at ${path.relative(projectRoot, outputPath)}`);