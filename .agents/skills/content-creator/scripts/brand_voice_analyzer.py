#!/usr/bin/env python3
"""
Brand Voice Analyzer
Analyzes text content for voice characteristics, readability, sentence structure, and consistency.
Usage:
    python scripts/brand_voice_analyzer.py <file> [json|text]
"""

import sys
import os
import re
import json
import math
from collections import Counter

def count_syllables(word: str) -> int:
    word = word.lower().strip()
    if not word:
        return 0
    if len(word) <= 3:
        return 1
    # Strip common suffixes that don't add syllables
    word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
    word = re.sub(r'^y', '', word)
    matches = re.findall(r'[aeiouy]{1,2}', word)
    return max(1, len(matches))

def analyze_text(text: str) -> dict:
    # Clean text (remove markdown formatting headers, links, etc.)
    clean_text = re.sub(r'#+\s*', '', text)
    clean_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', clean_text)
    clean_text = re.sub(r'[*_`]', '', clean_text)

    # Tokenize sentences
    raw_sentences = re.split(r'[.!?]+(?:\s+|\n+|$)', clean_text)
    sentences = [s.strip() for s in raw_sentences if s.strip()]
    sentence_count = max(1, len(sentences))

    # Tokenize words
    words = re.findall(r'\b[A-Za-z0-9\'-]+\b', clean_text)
    word_count = max(1, len(words))

    # Syllables and complex words
    syllables = [count_syllables(w) for w in words]
    total_syllables = sum(syllables)
    complex_words = [w for w, s in zip(words, syllables) if s >= 3]
    complex_word_count = len(complex_words)

    # Readability Metrics
    words_per_sentence = word_count / sentence_count
    syllables_per_word = total_syllables / word_count
    flesch_reading_ease = 206.835 - (1.015 * words_per_sentence) - (84.6 * syllables_per_word)
    flesch_reading_ease = max(0.0, min(100.0, round(flesch_reading_ease, 2)))

    flesch_kincaid_grade = (0.39 * words_per_sentence) + (11.8 * syllables_per_word) - 15.59
    flesch_kincaid_grade = max(0.0, round(flesch_kincaid_grade, 1))

    # Readability interpretation
    if flesch_reading_ease >= 80:
        reading_level = "Easy (6th grade / Casual)"
    elif flesch_reading_ease >= 60:
        reading_level = "Standard (8th-9th grade / Conversational)"
    elif flesch_reading_ease >= 50:
        reading_level = "Fairly Difficult (High School)"
    elif flesch_reading_ease >= 30:
        reading_level = "Difficult (College level)"
    else:
        reading_level = "Very Difficult (Academic / Specialized)"

    # Sentence Structure Analysis
    sentence_lengths = [len(re.findall(r'\b\w+\b', s)) for s in sentences]
    avg_sentence_len = round(sum(sentence_lengths) / sentence_count, 1)
    variance = sum((l - avg_sentence_len) ** 2 for l in sentence_lengths) / sentence_count
    std_dev_sentence_len = round(math.sqrt(variance), 1)

    # Point of View Analysis
    words_lower = [w.lower() for w in words]
    first_person_singular = sum(1 for w in words_lower if w in {'i', 'me', 'my', 'mine', 'myself'})
    first_person_plural = sum(1 for w in words_lower if w in {'we', 'us', 'our', 'ours', 'ourselves'})
    second_person = sum(1 for w in words_lower if w in {'you', 'your', 'yours', 'yourself', 'yourselves'})
    third_person = sum(1 for w in words_lower if w in {'he', 'him', 'his', 'she', 'her', 'hers', 'they', 'them', 'their', 'theirs', 'it', 'its'})

    pov_scores = {
        'first_person': first_person_singular + first_person_plural,
        'second_person': second_person,
        'third_person': third_person
    }
    primary_pov = max(pov_scores, key=pov_scores.get) if any(pov_scores.values()) else 'neutral'

    # Formality Analysis
    formal_markers = {'furthermore', 'moreover', 'therefore', 'consequently', 'subsequently', 'thus', 'hence', 'notwithstanding', 'accordingly', 'demonstrates', 'indicates', 'utilize', 'commence', 'implement'}
    informal_markers = {'gonna', 'wanna', 'kinda', 'awesome', 'cool', 'super', 'lots', 'tons', 'stuff', 'yeah', 'hey', 'btw', 'fyi', 'props'}
    contractions = len(re.findall(r"\b\w+'(?:t|re|ve|ll|d|m|s)\b", clean_text, re.IGNORECASE))

    formal_count = sum(1 for w in words_lower if w in formal_markers)
    informal_count = sum(1 for w in words_lower if w in informal_markers)

    formality_score = 50 + (formal_count * 5) - (informal_count * 6) - (contractions * 2) + ((avg_sentence_len - 15) * 1.5)
    formality_score = max(0, min(100, round(formality_score)))

    if formality_score >= 75:
        formality_class = "Formal / Academic"
    elif formality_score >= 50:
        formality_class = "Professional / Authoritative"
    elif formality_score >= 30:
        formality_class = "Conversational / Engaging"
    else:
        formality_class = "Casual / Colloquial"

    # Tone detection
    tone_markers = {
        'Authoritative/Confident': {'proven', 'guaranteed', 'essential', 'critical', 'expert', 'evidence', 'definitive', 'master'},
        'Empathetic/Helpful': {'understand', 'feel', 'help', 'support', 'journey', 'struggle', 'easy', 'guide', 'together'},
        'Action-Oriented/Urgent': {'now', 'start', 'discover', 'today', 'unlock', 'action', 'boost', 'transform', 'create'},
        'Analytical/Objective': {'data', 'analysis', 'metric', 'statistic', 'research', 'measure', 'result', 'finding'}
    }

    tone_scores = {}
    for tone, keywords in tone_markers.items():
        score = sum(1 for w in words_lower if w in keywords)
        tone_scores[tone] = score
    detected_tones = [t for t, s in sorted(tone_scores.items(), key=lambda x: x[1], reverse=True) if s > 0][:2]
    if not detected_tones:
        detected_tones = ["Balanced / Informative"]

    # Passive voice check (heuristic: form of 'be' + past participle)
    passive_pattern = re.compile(r'\b(am|is|are|was|were|been|being)\s+([a-z]+ed|[a-z]+en)\b', re.IGNORECASE)
    passive_matches = passive_pattern.findall(clean_text)
    passive_ratio = round((len(passive_matches) / sentence_count) * 100, 1)

    # Recommendations
    recommendations = []
    if avg_sentence_len > 22:
        recommendations.append(f"Average sentence length is {avg_sentence_len} words. Break down long sentences to improve flow (target: 14-18 words).")
    elif avg_sentence_len < 10:
        recommendations.append(f"Sentences are very short (avg {avg_sentence_len} words). Combine some sentences for better rhythm.")
    
    if std_dev_sentence_len < 4.0:
        recommendations.append("Sentence length variety is low. Mix short, punchy sentences with longer descriptive sentences for better cadence.")

    if flesch_reading_ease < 55:
        recommendations.append(f"Readability is low ({flesch_reading_ease}/100). Consider simplifying vocabulary and shortening sentences.")
    
    if passive_ratio > 15:
        recommendations.append(f"Passive voice detected in ~{passive_ratio}% of sentences. Convert passive constructions into active voice for punchier copy.")

    if primary_pov == 'third_person' and formality_score < 40:
        recommendations.append("Casual tone combined with third-person POV can feel detached. Consider using second-person ('you') to engage readers.")

    if not recommendations:
        recommendations.append("Brand voice and sentence structure are well-balanced and clear.")

    return {
        "voice_profile": {
            "formality_score": formality_score,
            "formality_class": formality_class,
            "primary_perspective": primary_pov,
            "detected_tones": detected_tones,
            "active_voice_ratio": f"{max(0, 100 - int(passive_ratio))}%"
        },
        "readability": {
            "flesch_reading_ease": flesch_reading_ease,
            "flesch_kincaid_grade": flesch_kincaid_grade,
            "reading_level": reading_level
        },
        "sentence_structure": {
            "word_count": word_count,
            "sentence_count": sentence_count,
            "avg_sentence_length_words": avg_sentence_len,
            "sentence_variety_std_dev": std_dev_sentence_len,
            "complex_words_percentage": f"{round((complex_word_count / word_count) * 100, 1)}%"
        },
        "recommendations": recommendations
    }

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/brand_voice_analyzer.py <file> [json|text]")
        sys.exit(1)

    file_path = sys.argv[1]
    output_format = sys.argv[2].lower() if len(sys.argv) > 2 else "text"

    if not os.path.isfile(file_path):
        print(f"Error: File '{file_path}' not found.", file=sys.stderr)
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    results = analyze_text(content)

    if output_format == "json":
        print(json.dumps(results, indent=2))
    else:
        vp = results["voice_profile"]
        rd = results["readability"]
        ss = results["sentence_structure"]

        print("==================================================")
        print("           BRAND VOICE & TONE ANALYSIS            ")
        print("==================================================")
        print(f"File: {file_path}")
        print("\n--- VOICE PROFILE ---")
        print(f"Formality:            {vp['formality_class']} ({vp['formality_score']}/100)")
        print(f"Dominant Tone:        {', '.join(vp['detected_tones'])}")
        print(f"Primary Perspective:  {vp['primary_perspective'].replace('_', ' ').title()}")
        print(f"Active Voice Ratio:   {vp['active_voice_ratio']}")

        print("\n--- READABILITY ---")
        print(f"Flesch Reading Ease:  {rd['flesch_reading_ease']} / 100")
        print(f"Grade Level:          Grade {rd['flesch_kincaid_grade']}")
        print(f"Target Level:         {rd['reading_level']}")

        print("\n--- SENTENCE STRUCTURE ---")
        print(f"Total Words:          {ss['word_count']}")
        print(f"Total Sentences:      {ss['sentence_count']}")
        print(f"Avg Sentence Length:  {ss['avg_sentence_length_words']} words")
        print(f"Length Variety (SD):  {ss['sentence_variety_std_dev']}")
        print(f"Complex Words:        {ss['complex_words_percentage']}")

        print("\n--- RECOMMENDATIONS ---")
        for idx, rec in enumerate(results["recommendations"], 1):
            print(f"{idx}. {rec}")
        print("==================================================")

if __name__ == "__main__":
    main()
