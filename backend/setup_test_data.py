"""
Creates both test data files programmatically.
Run once. Safe to re-run (overwrites).
"""

import json
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

os.makedirs("test_data", exist_ok=True)

# ─────────────────────────────────────────────────────────────
# BASELINE: 40 hand-curated cases (25 verbs + 15 negatives)
# ─────────────────────────────────────────────────────────────
baseline = {
    "metadata": {
        "version": "1.0",
        "reference": "Whitney, Sanskrit Grammar; Deshpande, Saṃskṛtasubodhinī",
    },
    "cases": [
        # गम् — to go
        {"form": "गच्छति",  "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "गच्छतः",   "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "law", "purusha": "praTama", "vachana": "dvi",  "gana": "BvAdi"}},
        {"form": "गच्छन्ति", "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "law", "purusha": "praTama", "vachana": "bahu", "gana": "BvAdi"}},
        {"form": "गच्छसि",  "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "law", "purusha": "maDyama","vachana": "eka",  "gana": "BvAdi"}},
        {"form": "गच्छामि", "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "law", "purusha": "uttama", "vachana": "eka",  "gana": "BvAdi"}},
        # पठ् — to read
        {"form": "पठति",   "expected": {"is_verb": True, "root_slp1": "paW", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "पठन्ति",  "expected": {"is_verb": True, "root_slp1": "paW", "lakara": "law", "purusha": "praTama", "vachana": "bahu", "gana": "BvAdi"}},
        {"form": "पठामि",   "expected": {"is_verb": True, "root_slp1": "paW", "lakara": "law", "purusha": "uttama", "vachana": "eka",  "gana": "BvAdi"}},
        # भू — to be
        {"form": "भवति",   "expected": {"is_verb": True, "root_slp1": "BU",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "भवन्ति",  "expected": {"is_verb": True, "root_slp1": "BU",  "lakara": "law", "purusha": "praTama", "vachana": "bahu", "gana": "BvAdi"}},
        # अस् — to be
        {"form": "अस्ति",   "expected": {"is_verb": True, "root_slp1": "as",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "adAdi"}},
        {"form": "सन्ति",   "expected": {"is_verb": True, "root_slp1": "as",  "lakara": "law", "purusha": "praTama", "vachana": "bahu", "gana": "adAdi"}},
        {"form": "अस्मि",   "expected": {"is_verb": True, "root_slp1": "as",  "lakara": "law", "purusha": "uttama", "vachana": "eka",  "gana": "adAdi"}},
        # पा — to drink
        {"form": "पिबति",  "expected": {"is_verb": True, "root_slp1": "pA",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "पिबामि",  "expected": {"is_verb": True, "root_slp1": "pA",  "lakara": "law", "purusha": "uttama", "vachana": "eka",  "gana": "BvAdi"}},
        # खाद् — to eat
        {"form": "खादति",  "expected": {"is_verb": True, "root_slp1": "KAd", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "खादन्ति", "expected": {"is_verb": True, "root_slp1": "KAd", "lakara": "law", "purusha": "praTama", "vachana": "bahu", "gana": "BvAdi"}},
        # हस् — to laugh
        {"form": "हसति",   "expected": {"is_verb": True, "root_slp1": "has", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "हसन्ति",  "expected": {"is_verb": True, "root_slp1": "has", "lakara": "law", "purusha": "praTama", "vachana": "bahu", "gana": "BvAdi"}},
        # वद् — to speak
        {"form": "वदति",   "expected": {"is_verb": True, "root_slp1": "vad", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "वदन्ति",  "expected": {"is_verb": True, "root_slp1": "vad", "lakara": "law", "purusha": "praTama", "vachana": "bahu", "gana": "BvAdi"}},
        # Past (laG)
        {"form": "अगच्छत्", "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "laG", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "अपठत्",  "expected": {"is_verb": True, "root_slp1": "paW", "lakara": "laG", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        # Future (lfw)
        {"form": "गमिष्यति","expected": {"is_verb": True, "root_slp1": "gam", "lakara": "lfw", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "पठिष्यति","expected": {"is_verb": True, "root_slp1": "paW", "lakara": "lfw", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},

        # Negative examples (nouns / pronouns)
        {"form": "रामः",    "expected": {"is_verb": False}},
        {"form": "वनम्",    "expected": {"is_verb": False}},
        {"form": "सीता",    "expected": {"is_verb": False}},
        {"form": "फलम्",    "expected": {"is_verb": False}},
        {"form": "पुस्तकम्","expected": {"is_verb": False}},
        {"form": "बालकः",   "expected": {"is_verb": False}},
        {"form": "बालिका",  "expected": {"is_verb": False}},
        {"form": "गृहम्",   "expected": {"is_verb": False}},
        {"form": "जलम्",    "expected": {"is_verb": False}},
        {"form": "अहम्",    "expected": {"is_verb": False}},
        {"form": "त्वम्",   "expected": {"is_verb": False}},
        {"form": "सः",      "expected": {"is_verb": False}},
        {"form": "सा",      "expected": {"is_verb": False}},
        {"form": "तत्",     "expected": {"is_verb": False}},
        {"form": "मित्रम्",  "expected": {"is_verb": False}},
    ],
}

# ─────────────────────────────────────────────────────────────
# DICTIONARY-DERIVED: 65 cases from your CSV
# ─────────────────────────────────────────────────────────────
dict_cases = {
    "metadata": {
        "source": "extracted from project dictionaries",
        "total_cases": 65,
    },
    "cases": [
        # ── Finite verbs (24) ─────────────────────────────────
        {"form": "गच्छति",     "category": "finite", "expected": {"is_verb": True, "root_slp1": "gam",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "आगच्छति",    "category": "finite", "expected": {"is_verb": True, "root_slp1": "gam",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}, "note": "with upasarga ā"},
        {"form": "तिष्ठति",    "category": "finite", "expected": {"is_verb": True, "root_slp1": "sTA",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "उपविशति",    "category": "finite", "expected": {"is_verb": True, "root_slp1": "viz",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}, "note": "with upasarga upa"},
        {"form": "शेते",       "category": "finite", "expected": {"is_verb": True, "root_slp1": "zI",   "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "adAdi"}},
        {"form": "पठति",       "category": "finite", "expected": {"is_verb": True, "root_slp1": "paW",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "लिखति",      "category": "finite", "expected": {"is_verb": True, "root_slp1": "liK",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "भाषते",      "category": "finite", "expected": {"is_verb": True, "root_slp1": "BAz",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "शृणोति",     "category": "finite", "expected": {"is_verb": True, "root_slp1": "zru",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "sunAdi"}},
        {"form": "पश्यति",     "category": "finite", "expected": {"is_verb": True, "root_slp1": "dRz",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "खादति",      "category": "finite", "expected": {"is_verb": True, "root_slp1": "KAd",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "पिबति",      "category": "finite", "expected": {"is_verb": True, "root_slp1": "pA",   "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "करोति",      "category": "finite", "expected": {"is_verb": True, "root_slp1": "kR",   "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "tanAdi"}},
        {"form": "गृह्णाति",    "category": "finite", "expected": {"is_verb": True, "root_slp1": "grah", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "kryAdi"}},
        {"form": "वदति",       "category": "finite", "expected": {"is_verb": True, "root_slp1": "vad",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "हसति",       "category": "finite", "expected": {"is_verb": True, "root_slp1": "has",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "रोदिति",     "category": "finite", "expected": {"is_verb": True, "root_slp1": "rud",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "adAdi"}},
        {"form": "अगच्छत्",    "category": "finite", "expected": {"is_verb": True, "root_slp1": "gam",  "lakara": "laG", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "चिन्तयति",   "category": "finite", "expected": {"is_verb": True, "root_slp1": "cint", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "curAdi"}},
        {"form": "ददाति",      "category": "finite", "expected": {"is_verb": True, "root_slp1": "dA",   "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "juhotyAdi"}},
        {"form": "जानाति",     "category": "finite", "expected": {"is_verb": True, "root_slp1": "jYA",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "kryAdi"}},
        {"form": "पाठयति",     "category": "finite", "expected": {"is_verb": True, "root_slp1": "paW",  "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "curAdi"}, "note": "causal"},
        {"form": "रक्षति",     "category": "finite", "expected": {"is_verb": True, "root_slp1": "rakz", "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "BvAdi"}},
        {"form": "अस्ति",      "category": "finite", "expected": {"is_verb": True, "root_slp1": "as",   "lakara": "law", "purusha": "praTama", "vachana": "eka",  "gana": "adAdi"}},

        # ── Imperatives (16) ─────────────────────────────────
        {"form": "गच्छ",       "category": "imperative", "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "आगच्छ",      "category": "imperative", "expected": {"is_verb": True, "root_slp1": "gam", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "उपविश",      "category": "imperative", "expected": {"is_verb": True, "root_slp1": "viz", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "तिष्ठ",      "category": "imperative", "expected": {"is_verb": True, "root_slp1": "sTA", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "वद",         "category": "imperative", "expected": {"is_verb": True, "root_slp1": "vad", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "शृणु",       "category": "imperative", "expected": {"is_verb": True, "root_slp1": "zru", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "sunAdi"}},
        {"form": "पिब",        "category": "imperative", "expected": {"is_verb": True, "root_slp1": "pA",  "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "कुरु",       "category": "imperative", "expected": {"is_verb": True, "root_slp1": "kR",  "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "tanAdi"}},
        {"form": "पठ",         "category": "imperative", "expected": {"is_verb": True, "root_slp1": "paW", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "लिख",        "category": "imperative", "expected": {"is_verb": True, "root_slp1": "liK", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "पश्य",       "category": "imperative", "expected": {"is_verb": True, "root_slp1": "dRz", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "स्वप",       "category": "imperative", "expected": {"is_verb": True, "root_slp1": "svap","lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "चर",         "category": "imperative", "expected": {"is_verb": True, "root_slp1": "car", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "धाव",        "category": "imperative", "expected": {"is_verb": True, "root_slp1": "DAv", "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "अश",         "category": "imperative", "expected": {"is_verb": True, "root_slp1": "aS",  "lakara": "loW", "purusha": "maDyama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "ददातु",      "category": "imperative", "expected": {"is_verb": True, "root_slp1": "dA",  "lakara": "loW", "purusha": "praTama", "vachana": "eka", "gana": "juhotyAdi"}},

        # ── Optatives (2) ────────────────────────────────────
        {"form": "दद्यात्",    "category": "optative", "expected": {"is_verb": True, "root_slp1": "dA",  "lakara": "viDiliG", "purusha": "praTama", "vachana": "eka", "gana": "juhotyAdi"}},
        {"form": "जानीयात्",   "category": "optative", "expected": {"is_verb": True, "root_slp1": "jYA", "lakara": "viDiliG", "purusha": "praTama", "vachana": "eka", "gana": "kryAdi"}},

        # ── Participles — NOT finite verbs (7) ───────────────
        {"form": "कृतम्",      "category": "participle", "expected": {"is_verb": False}},
        {"form": "चिन्तितम्",  "category": "participle", "expected": {"is_verb": False}},
        {"form": "दत्तम्",     "category": "participle", "expected": {"is_verb": False}},
        {"form": "पठितम्",     "category": "participle", "expected": {"is_verb": False}},
        {"form": "लिखितम्",    "category": "participle", "expected": {"is_verb": False}},
        {"form": "दृष्टम्",    "category": "participle", "expected": {"is_verb": False}},
        {"form": "ज्ञातम्",    "category": "participle", "expected": {"is_verb": False}},

        # ── Multi-word — excluded (3) ────────────────────────
        {"form": "सहायम् कर",     "category": "multi_word", "expected": {"is_verb": False}, "note": "excluded: two words"},
        {"form": "उष्णतया पक्ति",  "category": "multi_word", "expected": {"is_verb": False}, "note": "excluded: two words"},
        {"form": "भङ्गुरतया करोति","category": "multi_word", "expected": {"is_verb": False}, "note": "excluded: two words"},

        # ── Questionable / rare (13) ─────────────────────────
        {"form": "प्रार्थयति",  "category": "questionable", "expected": {"is_verb": True, "root_slp1": "prArT", "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "curAdi"}},
        {"form": "क्रोध्यति",   "category": "questionable", "expected": {"is_verb": True, "root_slp1": "kruD", "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "divAdi"}},
        {"form": "मन्ये",       "category": "questionable", "expected": {"is_verb": True, "root_slp1": "man",  "lakara": "law", "purusha": "uttama", "vachana": "eka", "gana": "divAdi"}},
        {"form": "भव्यति",      "category": "questionable", "expected": {"is_verb": True, "root_slp1": "BU",   "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "तलति",        "category": "questionable", "expected": {"is_verb": True, "root_slp1": "tal",  "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "भस्मीभवति",   "category": "questionable", "expected": {"is_verb": True, "root_slp1": "BU",   "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "सुदाम्यति",   "category": "questionable", "expected": {"is_verb": True, "root_slp1": "dAm",  "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "अनुक्षिपति",  "category": "questionable", "expected": {"is_verb": True, "root_slp1": "kzip", "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "मिशति",       "category": "questionable", "expected": {"is_verb": True, "root_slp1": "miz",  "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "कृणाति",      "category": "questionable", "expected": {"is_verb": True, "root_slp1": "kf",   "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "kryAdi"}},
        {"form": "छिनति",       "category": "questionable", "expected": {"is_verb": True, "root_slp1": "Cid",  "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "विभाजति",     "category": "questionable", "expected": {"is_verb": True, "root_slp1": "Baj",  "lakara": "law", "purusha": "praTama", "vachana": "eka", "gana": "BvAdi"}},
        {"form": "पक्षि",       "category": "questionable", "expected": {"is_verb": False}},
    ],
}

# ─────────────────────────────────────────────────────────────
# Write both files
# ─────────────────────────────────────────────────────────────
with open("test_data/paninian_testset.json", "w", encoding="utf-8") as f:
    json.dump(baseline, f, ensure_ascii=False, indent=2)

with open("test_data/paninian_dict_cases.json", "w", encoding="utf-8") as f:
    json.dump(dict_cases, f, ensure_ascii=False, indent=2)

# Merge
merged = {
    "metadata": {
        "baseline_count": len(baseline["cases"]),
        "dictionary_count": len(dict_cases["cases"]),
        "total": len(baseline["cases"]) + len(dict_cases["cases"]),
    },
    "cases": baseline["cases"] + dict_cases["cases"],
}

with open("test_data/paninian_full_testset.json", "w", encoding="utf-8") as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)

print(f"✅ Wrote test_data/paninian_testset.json      ({len(baseline['cases'])} cases)")
print(f"✅ Wrote test_data/paninian_dict_cases.json   ({len(dict_cases['cases'])} cases)")
print(f"✅ Wrote test_data/paninian_full_testset.json ({merged['metadata']['total']} cases)")