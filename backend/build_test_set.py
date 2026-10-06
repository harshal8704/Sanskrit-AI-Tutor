"""
Phase 3A: Extract test-set candidates from the project's dictionaries.

Outputs:
  test_data/candidates_verbs.json     — entries with pos == 'verb'
  test_data/candidates_negatives.json — sample of noun/pronoun entries
"""

import csv
import json
import os
import random

DICT_FILES = [
    "data/sanskrit_translation_db.csv",
    "data/sanskrit_words.csv",
]

VERB_POS = {"verb", "Verb", "VERB"}
NOUN_POS = {"noun", "Noun", "NOUN", "pronoun", "Pronoun", "PRONOUN"}


def _row_get(row, keys, default=""):
    for k in keys:
        if k in row and row[k]:
            return row[k]
    return default


def load_csv(path):
    if not os.path.exists(path):
        print(f"  missing: {path}")
        return []
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def extract_candidates():
    verbs, nouns, seen = [], [], set()

    for path in DICT_FILES:
        print(f"Reading {path}")
        for row in load_csv(path):
            dev = _row_get(row, ["devanagari", "sanskrit", "sanskrit_word"])
            pos = _row_get(row, ["pos", "word_type"])
            meaning = _row_get(row, ["meaning", "english", "english_meaning"])

            if not dev:
                continue
            key = (dev, pos)
            if key in seen:
                continue
            seen.add(key)

            entry = {
                "devanagari": dev,
                "pos": pos,
                "meaning": meaning,
            }

            if pos in VERB_POS:
                verbs.append(entry)
            elif pos in NOUN_POS:
                nouns.append(entry)

    return verbs, nouns


def main():
    print("Building test-set candidates...\n")
    verbs, nouns = extract_candidates()

    # Dedupe by devanagari
    verbs = list({v["devanagari"]: v for v in verbs}.values())
    nouns = list({n["devanagari"]: n for n in nouns}.values())

    random.seed(42)
    negatives = random.sample(nouns, min(40, len(nouns))) if nouns else []

    print(f"\nSummary:")
    print(f"  Verb candidates   : {len(verbs)}")
    print(f"  Negative examples : {len(negatives)}")

    os.makedirs("test_data", exist_ok=True)

    with open("test_data/candidates_verbs.json", "w", encoding="utf-8") as f:
        json.dump(verbs, f, ensure_ascii=False, indent=2)

    with open("test_data/candidates_negatives.json", "w", encoding="utf-8") as f:
        json.dump(negatives, f, ensure_ascii=False, indent=2)

    print("\nWrote:")
    print("  test_data/candidates_verbs.json")
    print("  test_data/candidates_negatives.json")


if __name__ == "__main__":
    main()