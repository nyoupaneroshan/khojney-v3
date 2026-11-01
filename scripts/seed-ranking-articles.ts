/**
 * seed-ranking-articles.ts — Seeds all articles from scripts/articles/*.md into Khojney database
 *
 * Run: `bun run scripts/seed-ranking-articles.ts`
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const db = new PrismaClient();

interface ParsedArticle {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  categorySlug: string;
  tags: string[];
  coverImage?: string;
  readTimeMin: number;
  featured: boolean;
  content: string;
}

function parseMarkdownArticle(filePath: string): ParsedArticle {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Invalid markdown frontmatter in: ${filePath}`);
  }

  const rawYaml = match[1];
  const content = match[2].trim();

  // Basic YAML parser for simple frontmatter
  const data: Record<string, any> = {};
  let currentKey = "";
  let isList = false;

  for (const line of rawYaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("- ") && isList) {
      data[currentKey].push(trimmed.substring(2).trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx !== -1) {
      const key = trimmed.substring(0, colonIdx).trim();
      const val = trimmed.substring(colonIdx + 1).trim();

      if (val === "" || val === "[]") {
        currentKey = key;
        data[key] = [];
        isList = true;
      } else if (val.startsWith("[") && val.endsWith("]")) {
        currentKey = key;
        data[key] = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
        isList = false;
      } else {
        currentKey = key;
        isList = false;
        if (val === "true") data[key] = true;
        else if (val === "false") data[key] = false;
        else if (!isNaN(Number(val))) data[key] = Number(val);
        else data[key] = val.replace(/^["']|["']$/g, "");
      }
    }
  }

  return {
    slug: data.slug || path.basename(filePath, ".md"),
    title: data.title || "Untitled",
    excerpt: data.excerpt || "",
    metaTitle: data.metaTitle || data.title,
    metaDescription: data.metaDescription || data.excerpt,
    categorySlug: data.categorySlug || "blog-guides",
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage,
    readTimeMin: data.readTimeMin || 8,
    featured: Boolean(data.featured),
    content,
  };
}

async function main() {
  console.log("🌱 Loading articles from scripts/articles/...");

  const articlesDir = path.join(__dirname, "articles");
  if (!fs.existsSync(articlesDir)) {
    throw new Error(`Directory ${articlesDir} does not exist.`);
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));
  console.log(`Found ${files.length} article files to seed.`);

  // Find author
  let admin = await db.user.findFirst({
    where: {
      OR: [{ email: "admin@khojney.com" }, { role: "SUPER_ADMIN" }, { role: "ADMIN" }],
    },
  });

  if (!admin) {
    admin = await db.user.findFirst();
  }

  if (!admin) {
    throw new Error("No user found in database to set as author.");
  }

  console.log(`Using author: ${admin.name || admin.email} (${admin.id})`);

  for (const file of files) {
    const fullPath = path.join(articlesDir, file);
    const article = parseMarkdownArticle(fullPath);

    // 1. Ensure category exists
    let category = await db.category.findUnique({
      where: { slug: article.categorySlug },
    });

    if (!category) {
      console.log(`Creating category: ${article.categorySlug}`);
      category = await db.category.create({
        data: {
          slug: article.categorySlug,
          name: article.categorySlug.replace("blog-", "").replace("-", " ").toUpperCase(),
          module: "BLOG",
        },
      });
    }

    // 2. Connect or create tags
    const tagConnects: { id: string }[] = [];
    for (const tagName of article.tags) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
      const tag = await db.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { slug: tagSlug, name: tagName.replace("-", " ").toUpperCase() },
      });
      tagConnects.push({ id: tag.id });
    }

    // 3. Upsert BlogPost
    const existing = await db.blogPost.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      await db.blogPost.update({
        where: { slug: article.slug },
        data: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          coverImage: article.coverImage,
          readTimeMin: article.readTimeMin,
          featured: article.featured,
          status: "PUBLISHED",
          categoryId: category.id,
          tags: {
            set: tagConnects,
          },
        },
      });
      console.log(`✓ Updated: "${article.title}" (${article.slug})`);
    } else {
      await db.blogPost.create({
        data: {
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          coverImage: article.coverImage,
          readTimeMin: article.readTimeMin,
          featured: article.featured,
          status: "PUBLISHED",
          authorId: admin.id,
          categoryId: category.id,
          tags: {
            connect: tagConnects,
          },
        },
      });
      console.log(`✓ Created: "${article.title}" (${article.slug})`);
    }
  }

  console.log("\n🎉 All articles successfully processed and active in the database!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
