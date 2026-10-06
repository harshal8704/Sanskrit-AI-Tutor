"""
One-shot patch: correct wrong root annotations in test data.
Safe to run multiple times.
"""
import json
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


# Form → corrected root_slp1
FIXES = {
    "शेते":     "SI",
    "शृणोति":   "Sru",
    "पश्यति":   "dfS",
    "करोति":    "kf",
    # Also fix imperative forms (won't affect current metrics but keeps data consistent)
    "शृणु":     "Sru",
    "पश्य":     "dfS",
    "कुरु":     "kf",
    "पाठयति":   "paW",   # keep, but flagged for future review
}


def patch(path):
    if not os.path.exists(path):
        print(f"  skip (not found): {path}")
        return 0

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    cases = data.get("cases", [])
    n_fixed = 0

    for case in cases:
        form = case.get("form")
        if form in FIXES:
            expected = case.get("expected", {})
            old = expected.get("root_slp1")
            new = FIXES[form]
            if old and old != new:
                expected["root_slp1"] = new
                n_fixed += 1
                print(f"  {form}: {old} -> {new}")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return n_fixed


def main():
    print("Applying annotation fixes...\n")
    total = 0
    for path in [
        "test_data/paninian_testset.json",
        "test_data/paninian_dict_cases.json",
        "test_data/paninian_full_testset.json",
    ]:
        print(f"Patching {path}")
        total += patch(path)
        print()

    print(f"Total fixes applied: {total}")


if __name__ == "__main__":
    main()