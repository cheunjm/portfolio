import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface GhRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: { name: string } | null;
  updatedAt: string;
}

const OUT_DIR = join(process.cwd(), "src/content/projects");
const force = process.argv.includes("--force");

function fetchRepos(): GhRepo[] {
  const raw = execFileSync(
    "gh",
    [
      "repo",
      "list",
      "cheunjm",
      "--source",
      "--no-archived",
      "--visibility",
      "public",
      "--limit",
      "200",
      "--json",
      "name,description,url,stargazerCount,primaryLanguage,updatedAt",
    ],
    { encoding: "utf-8" },
  );
  return JSON.parse(raw) as GhRepo[];
}

function toFrontmatter(repo: GhRepo): string {
  const fields: Record<string, string> = {
    title: JSON.stringify(repo.name),
    description: JSON.stringify(repo.description ?? ""),
    repoUrl: JSON.stringify(repo.url),
    stars: String(repo.stargazerCount ?? 0),
    language: repo.primaryLanguage
      ? JSON.stringify(repo.primaryLanguage.name)
      : "null",
    updatedAt: JSON.stringify(repo.updatedAt),
    featured: "false",
    hidden: "false",
  };

  const lines = Object.entries(fields).map(
    ([key, value]) => `${key}: ${value}`,
  );
  return `---\n${lines.join("\n")}\n---\n`;
}

function main() {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log("Fetching repos from gh repo list cheunjm...");
  const repos = fetchRepos();
  console.log(`Found ${repos.length} repos.`);

  let created = 0;
  let skipped = 0;

  for (const repo of repos) {
    // Repos with a leading-dot name (e.g. ".github", ".claude") are config/
    // template repos, not portfolio-worthy projects, and their generated
    // filenames wouldn't be picked up by the content collection's glob
    // pattern anyway (dotfiles are excluded by default glob semantics).
    if (repo.name.startsWith(".")) {
      skipped += 1;
      continue;
    }

    const filePath = join(OUT_DIR, `${repo.name}.md`);

    if (existsSync(filePath) && !force) {
      skipped += 1;
      continue;
    }

    writeFileSync(filePath, toFrontmatter(repo), "utf-8");
    created += 1;
  }

  console.log(
    `Sync complete: ${created} file(s) created${
      force ? " (--force, overwrote existing)" : ""
    }, ${skipped} skipped (already existed).`,
  );
  if (!force && skipped > 0) {
    console.log("Run with --force to overwrite existing files.");
  }
}

main();
