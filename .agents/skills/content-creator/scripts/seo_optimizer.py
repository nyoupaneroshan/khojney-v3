#!/usr/bin/env python3
"""
SEO Optimizer
Analyzes Markdown or HTML content for SEO best practices, keyword density,
heading hierarchy, links, and produces an SEO score (0-100) with actionable recommendations.
Usage:
    python scripts/seo_optimizer.py <file> [primary_keyword] [secondary_keywords]
"""

import sys
import os
import re
import json

def analyze_seo(file_path: str, primary_kw: str = "", secondary_kws_str: str = "") -> dict:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    primary_kw = primary_kw.strip().lower()
    secondary_kws = [k.strip().lower() for k in secondary_kws_str.split(',') if k.strip()]

    # Extract headings
    h1_matches = re.findall(r'^#\s+(.+)$', content, re.MULTILINE) + re.findall(r'<h1>(.*?)</h1>', content, re.IGNORECASE)
    h2_matches = re.findall(r'^##\s+(.+)$', content, re.MULTILINE) + re.findall(r'<h2>(.*?)</h2>', content, re.IGNORECASE)
    h3_matches = re.findall(r'^###\s+(.+)$', content, re.MULTILINE) + re.findall(r'<h3>(.*?)</h3>', content, re.IGNORECASE)

    # Extract links
    md_links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
    html_links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', content, re.IGNORECASE)
    
    internal_links = []
    external_links = []
    for text, url in md_links:
        if url.startswith('http://') or url.startswith('https://'):
            external_links.append((text, url))
        elif url.startswith('/') or url.startswith('./') or url.startswith('../'):
            internal_links.append((text, url))
    for url, text in html_links:
        if url.startswith('http://') or url.startswith('https://'):
            external_links.append((text, url))
        elif url.startswith('/') or url.startswith('./') or url.startswith('../'):
            internal_links.append((text, url))

    # Images and alt text
    md_images = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', content)
    images_missing_alt = [img for img in md_images if not img[0].strip()]

    # First paragraph
    # Strip markdown headers and frontmatter
    body_no_fm = re.sub(r'^---[\s\S]*?---\n', '', content)
    paragraphs = [p.strip() for p in body_no_fm.split('\n\n') if p.strip() and not p.strip().startswith('#')]
    first_paragraph = paragraphs[0] if paragraphs else ""

    # Word count
    plain_text = re.sub(r'#+\s*', '', body_no_fm)
    plain_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', plain_text)
    plain_text = re.sub(r'[*_`]', '', plain_text)
    words = re.findall(r'\b[A-Za-z0-9\'-]+\b', plain_text)
    word_count = max(1, len(words))

    # Keyword density calculation
    text_lower = plain_text.lower()
    def calculate_density(kw: str) -> dict:
        if not kw:
            return {"keyword": "", "count": 0, "density": "0%"}
        kw_pattern = re.compile(r'\b' + re.escape(kw) + r'\b', re.IGNORECASE)
        occurrences = len(kw_pattern.findall(text_lower))
        kw_word_len = len(kw.split())
        density = (occurrences * kw_word_len / word_count) * 100
        return {
            "keyword": kw,
            "count": occurrences,
            "density": f"{round(density, 2)}%"
        }

    primary_density_data = calculate_density(primary_kw) if primary_kw else None
    secondary_density_data = [calculate_density(k) for k in secondary_kws]

    # Scoring calculation (0 to 100)
    score = 100
    deductions = []
    checks = []

    # 1. H1 Check (15 pts)
    if len(h1_matches) == 1:
        checks.append("Single H1 tag present (+15)")
        if primary_kw:
            if primary_kw in h1_matches[0].lower():
                checks.append("Primary keyword present in H1 (+10)")
            else:
                score -= 10
                deductions.append(f"Primary keyword '{primary_kw}' not found in H1 title.")
    elif len(h1_matches) == 0:
        score -= 20
        deductions.append("Missing H1 heading. Add exactly one H1 tag.")
    else:
        score -= 10
        deductions.append(f"Multiple H1 tags ({len(h1_matches)}) found. Use exactly one H1 per article.")

    # 2. Content Length Check (20 pts)
    if word_count >= 1500:
        checks.append(f"Comprehensive content length: {word_count} words (+20)")
    elif word_count >= 1000:
        score -= 5
        checks.append(f"Good content length: {word_count} words (Target: 1,500+ for pillar posts)")
    elif word_count >= 600:
        score -= 10
        deductions.append(f"Moderate length ({word_count} words). Aim for 1,200-2,000 words for competitive ranking.")
    else:
        score -= 20
        deductions.append(f"Content is thin ({word_count} words). Search engines prioritize detailed guides (1,000+ words).")

    # 3. First Paragraph Check (10 pts)
    if primary_kw:
        if primary_kw in first_paragraph.lower():
            checks.append("Primary keyword found in first paragraph (+10)")
        else:
            score -= 10
            deductions.append(f"Primary keyword '{primary_kw}' is missing from the opening paragraph.")

    # 4. H2/Subheading Structure (15 pts)
    if len(h2_matches) >= 3:
        checks.append(f"Strong subheading structure: {len(h2_matches)} H2 tags (+15)")
        if primary_kw:
            h2_with_kw = sum(1 for h2 in h2_matches if primary_kw in h2.lower())
            if h2_with_kw >= 1:
                checks.append(f"Primary keyword appears in {h2_with_kw} H2 heading(s)")
            else:
                score -= 5
                deductions.append(f"Primary keyword '{primary_kw}' does not appear in any H2 subheadings.")
    else:
        score -= 10
        deductions.append(f"Only {len(h2_matches)} H2 tags found. Add more H2 sections to break up content.")

    # 5. Keyword Density Range (1-3% is ideal) (15 pts)
    if primary_density_data:
        density_val = float(primary_density_data["density"].rstrip('%'))
        if 1.0 <= density_val <= 3.0:
            checks.append(f"Primary keyword density optimal: {density_val}% (+15)")
        elif 0.5 <= density_val < 1.0:
            score -= 5
            deductions.append(f"Keyword density slightly low ({density_val}%). Target 1.0% - 2.5%.")
        elif density_val > 3.5:
            score -= 15
            deductions.append(f"Keyword stuffing risk! Density is {density_val}%. Reduce to under 3.0%.")
        else:
            score -= 10
            deductions.append(f"Keyword density too low ({density_val}%). Mention '{primary_kw}' more frequently naturally.")

    # 6. Links (15 pts)
    if len(internal_links) >= 2 and len(external_links) >= 1:
        checks.append(f"Healthy link profile ({len(internal_links)} internal, {len(external_links)} external) (+15)")
    else:
        if len(internal_links) < 2:
            score -= 5
            deductions.append(f"Insufficient internal links ({len(internal_links)} found). Add 2-5 links to related pages.")
        if len(external_links) < 1:
            score -= 5
            deductions.append("No external links found. Link to authoritative sources or studies.")

    # 7. Images and Alt Text (10 pts)
    if md_images:
        if not images_missing_alt:
            checks.append(f"All {len(md_images)} images include descriptive alt text (+10)")
        else:
            score -= 5
            deductions.append(f"{len(images_missing_alt)} images are missing alt text.")
    else:
        checks.append("No images detected. Consider adding diagrams or infographics.")

    final_score = max(0, min(100, score))

    # Meta tag suggestions
    h1_text = h1_matches[0] if h1_matches else (primary_kw.title() if primary_kw else "Marketing Guide")
    clean_h1 = re.sub(r'[*_`]', '', h1_text)
    suggested_title = clean_h1[:55]
    if primary_kw and primary_kw.lower() not in suggested_title.lower():
        suggested_title = f"{primary_kw.title()}: {clean_h1}"[:55]

    first_sentence = first_paragraph.split('.')[0] if first_paragraph else ""
    suggested_meta_desc = f"{first_sentence.strip()} Learn how to master {primary_kw or 'this topic'} with actionable tips and best practices."[:155]

    return {
        "file": file_path,
        "seo_score": final_score,
        "word_count": word_count,
        "primary_keyword": primary_density_data,
        "secondary_keywords": secondary_density_data,
        "structure": {
            "h1_count": len(h1_matches),
            "h1_text": h1_matches[0] if h1_matches else None,
            "h2_count": len(h2_matches),
            "h3_count": len(h3_matches),
            "internal_links": len(internal_links),
            "external_links": len(external_links),
            "images_count": len(md_images),
            "images_missing_alt": len(images_missing_alt)
        },
        "meta_suggestions": {
            "title_tag": suggested_title,
            "title_length": len(suggested_title),
            "meta_description": suggested_meta_desc,
            "meta_description_length": len(suggested_meta_desc)
        },
        "positive_signals": checks,
        "recommendations": deductions if deductions else ["Content meets standard SEO benchmarks! Ready for publication."]
    }

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/seo_optimizer.py <file> [primary_keyword] [secondary_keywords]")
        sys.exit(1)

    file_path = sys.argv[1]
    primary_kw = sys.argv[2] if len(sys.argv) > 2 else ""
    secondary_kws = sys.argv[3] if len(sys.argv) > 3 else ""

    if not os.path.isfile(file_path):
        print(f"Error: File '{file_path}' not found.", file=sys.stderr)
        sys.exit(1)

    results = analyze_seo(file_path, primary_kw, secondary_kws)

    print("==================================================")
    print("                SEO CONTENT REPORT                ")
    print("==================================================")
    print(f"File:               {results['file']}")
    print(f"Overall SEO Score:  {results['seo_score']} / 100")
    print(f"Word Count:         {results['word_count']} words")

    if results['primary_keyword']:
        pk = results['primary_keyword']
        print(f"\n--- KEYWORD ANALYSIS ---")
        print(f"Primary Keyword:    '{pk['keyword']}' (Count: {pk['count']}, Density: {pk['density']})")
        if results['secondary_keywords']:
            print("Secondary Keywords:")
            for sk in results['secondary_keywords']:
                print(f"  - '{sk['keyword']}': Count: {sk['count']}, Density: {sk['density']}")

    st = results['structure']
    print("\n--- CONTENT STRUCTURE ---")
    print(f"H1 Headings:        {st['h1_count']} ({st['h1_text'] or 'None'})")
    print(f"H2 Subheadings:     {st['h2_count']}")
    print(f"H3 Subheadings:     {st['h3_count']}")
    print(f"Internal Links:     {st['internal_links']}")
    print(f"External Links:     {st['external_links']}")
    print(f"Images (Total/NoAlt): {st['images_count']} / {st['images_missing_alt']}")

    meta = results['meta_suggestions']
    print("\n--- SUGGESTED META TAGS ---")
    print(f"Title ({meta['title_length']} chars):       {meta['title_tag']}")
    print(f"Meta Desc ({meta['meta_description_length']} chars):   {meta['meta_description']}")

    print("\n--- POSITIVE SIGNALS ---")
    for sig in results['positive_signals']:
        print(f"  ✓ {sig}")

    print("\n--- ACTIONABLE RECOMMENDATIONS ---")
    for idx, rec in enumerate(results['recommendations'], 1):
        print(f"  {idx}. {rec}")
    print("==================================================")

if __name__ == "__main__":
    main()
