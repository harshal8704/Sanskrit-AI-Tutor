"""
Merge baseline hand-curated set with dictionary-derived cases.
Outputs test_data/paninian_full_testset.json
"""

import json
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    baseline = load("test_data/paninian_testset.json")
    dictcases = load("test_data/paninian_dict_cases.json")

    merged = {
        "metadata": {
            "baseline_count": len(baseline.get("cases", [])),
            "dictionary_count": len(dictcases.get("cases", [])),
            "total": len(baseline.get("cases", [])) + len(dictcases.get("cases", [])),
        },
        "cases": baseline.get("cases", []) + dictcases.get("cases", []),
    }

    with open("test_data/paninian_full_testset.json", "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print(f"Merged: {merged['metadata']['total']} cases")
    print("Wrote: test_data/paninian_full_testset.json")


if __name__ == "__main__":
    main()