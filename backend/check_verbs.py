"""
Verify whether the candidates JSON actually contains valid Devanagari,
or whether it was corrupted during writing.
"""

import json
import sys

# Force UTF-8 output on Windows
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

with open("test_data/candidates_verbs.json", "r", encoding="utf-8") as f:
    verbs = json.load(f)

print(f"Loaded {len(verbs)} verb candidates\n")
print(f"{'#':<4} {'Devanagari':<20} {'Meaning'}")
print("-" * 60)

for i, v in enumerate(verbs, 1):
    dev = v.get("devanagari", "")
    meaning = v.get("meaning", "")
    # Show code points for first entry to detect corruption
    if i == 1:
        codepoints = " ".join(f"U+{ord(c):04X}" for c in dev[:8])
        print(f"[debug] first entry codepoints: {codepoints}")
        print(f"[debug] devanagari repr: {dev!r}")
        print()
    print(f"{i:<4} {dev:<20} {meaning}")