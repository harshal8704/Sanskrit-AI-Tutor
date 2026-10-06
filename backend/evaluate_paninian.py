"""
Paninian Analyzer — Evaluation Harness

Loads test_data/paninian_full_testset.json, runs the PaninianAnalyzer
on each case, and computes:

  - Verb recognition: Precision, Recall, F1, Confusion Matrix
  - Root accuracy
  - Lakara accuracy + confusion matrix
  - Purusha accuracy + confusion matrix
  - Vachana accuracy + confusion matrix
  - Gana accuracy (top-N)

Outputs:
  - confusion_verb_recognition.png
  - confusion_lakara.png
  - confusion_purusha.png
  - confusion_vachana.png
  - paninian_eval_report.md
"""

import json
import os
import sys
from collections import Counter, defaultdict
from typing import Dict, List, Any

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

import matplotlib
matplotlib.use("Agg")  # headless
import matplotlib.pyplot as plt
import numpy as np

from modules.paninian_analyzer import PaninianAnalyzer


# ─────────────────────────────────────────────────────────────
# Comparison helpers
# ─────────────────────────────────────────────────────────────

# Some Prakriya outputs use slightly different casing / spelling.
# Normalize before comparison.

_LAKARA_ALIASES = {
    "law": "law", "laW": "law", "lat": "law",
    "laG": "laG", "laN": "laG",
    "lfw": "lfw", "lfW": "lfw",
    "loW": "loW", "loT": "loW",
    "viDiliG": "viDiliG",
    "viDiliN": "viDiliG",   # ← ADD THIS LINE
    "vidhiling": "viDiliG",
}

_PURUSHA_ALIASES = {
    "praTama": "praTama", "prathama": "praTama", "prathama_purusha": "praTama",
    "maDyama": "maDyama", "madhyama": "maDyama",
    "uttama": "uttama",
}

_VACHANA_ALIASES = {
    "eka": "eka", "ekavacana": "eka", "singular": "eka",
    "dvi": "dvi", "dvivacana": "dvi", "dual": "dvi",
    "bahu": "bahu", "bahuvacana": "bahu", "plural": "bahu",
}


def _scalar(value):
    """
    Flatten a value to a hashable scalar.
    Prakriya sometimes returns single-element lists.
    """
    if value is None:
        return None
    if isinstance(value, list):
        if len(value) == 0:
            return None
        if len(value) == 1:
            return _scalar(value[0])
        # multi-valued: join into a stable string
        return "|".join(str(_scalar(v)) for v in value)
    if isinstance(value, dict):
        return str(value)
    return value


def _norm(value, alias_map):
    value = _scalar(value)
    if value is None:
        return None
    s = str(value).strip()
    return alias_map.get(s, alias_map.get(s.lower(), s))


def _norm_root(slp1) -> str:
    """Strip trailing markers / spaces from SLP1 root for comparison."""
    slp1 = _scalar(slp1)
    if not slp1:
        return ""
    s = str(slp1).strip()
    # Prakriya keeps IT markers like ~ after some roots; drop them
    for marker in ["~", "\\", "'", "^"]:
        s = s.replace(marker, "")
    return s.strip().lower()


# ─────────────────────────────────────────────────────────────
# Evaluation
# ─────────────────────────────────────────────────────────────

class PaninianEvaluator:
    def __init__(self, test_file="test_data/paninian_full_testset.json"):
        self.test_file = test_file
        self.analyzer = PaninianAnalyzer()

        # Counters
        self.results = []
        self.verb_tp = 0   # correctly recognized as verb
        self.verb_fp = 0   # non-verb flagged as verb
        self.verb_fn = 0   # verb missed
        self.verb_tn = 0   # non-verb correctly rejected

        self.root_correct = 0
        self.root_total = 0

        # Confusion matrices for categorical fields
        self.lakara_cm = Counter()   # (expected, predicted)
        self.purusha_cm = Counter()
        self.vachana_cm = Counter()
        self.gana_cm = Counter()

    def load(self) -> Dict[str, Any]:
        with open(self.test_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def evaluate_case(self, case: Dict[str, Any]) -> Dict[str, Any]:
        form = case.get("form", "")
        expected = case.get("expected", {})

        # Run analyzer
        got = self.analyzer.analyze_verb(form) if form else {"is_verb": False}
        predicted_is_verb = bool(got.get("is_verb", False))
        expected_is_verb = bool(expected.get("is_verb", False))

        # Verb recognition confusion
        if expected_is_verb and predicted_is_verb:
            self.verb_tp += 1
        elif not expected_is_verb and predicted_is_verb:
            self.verb_fp += 1
        elif expected_is_verb and not predicted_is_verb:
            self.verb_fn += 1
        else:
            self.verb_tn += 1

        record = {
            "form": form,
            "expected": expected,
            "predicted": {
                "is_verb": predicted_is_verb,
                "root_slp1": _scalar(got.get("root_slp1", "")),
                "lakara": _scalar(got.get("tense", None)),
                "purusha": _scalar(got.get("person", None)),
                "vachana": _scalar(got.get("number", None)),
                "gana": _scalar(got.get("class", None)),
            },
            "match": {},
        }

        # Only compare detailed fields when both expect and predict as verb
        if expected_is_verb and predicted_is_verb:
            # Root
            exp_root = _norm_root(expected.get("root_slp1", ""))
            pred_root = _norm_root(got.get("root_slp1", ""))
            root_ok = bool(exp_root and pred_root and exp_root == pred_root)
            record["match"]["root"] = root_ok
            if root_ok:
                self.root_correct += 1
            self.root_total += 1

            # Lakara
            exp_lak = _norm(expected.get("lakara"), _LAKARA_ALIASES)
            pred_lak = _norm(got.get("tense"), _LAKARA_ALIASES)
            self.lakara_cm[(exp_lak, pred_lak)] += 1
            record["match"]["lakara"] = (exp_lak == pred_lak)

            # Purusha
            exp_pur = _norm(expected.get("purusha"), _PURUSHA_ALIASES)
            pred_pur = _norm(got.get("person"), _PURUSHA_ALIASES)
            self.purusha_cm[(exp_pur, pred_pur)] += 1
            record["match"]["purusha"] = (exp_pur == pred_pur)

            # Vachana
            exp_vac = _norm(expected.get("vachana"), _VACHANA_ALIASES)
            pred_vac = _norm(got.get("number"), _VACHANA_ALIASES)
            self.vachana_cm[(exp_vac, pred_vac)] += 1
            record["match"]["vachana"] = (exp_vac == pred_vac)

            # Gana
            exp_gan = _scalar(expected.get("gana"))
            pred_gan = _scalar(got.get("class"))
            self.gana_cm[(exp_gan, pred_gan)] += 1
            record["match"]["gana"] = (exp_gan == pred_gan)

        self.results.append(record)
        return record

    def run(self):
        data = self.load()
        cases = data.get("cases", [])
        print(f"Loaded {len(cases)} test cases\n")
        print("Running evaluation...")

        for i, case in enumerate(cases, 1):
            self.evaluate_case(case)
            if i % 20 == 0:
                print(f"  ... {i}/{len(cases)}")

        print(f"  Done: {len(cases)}/{len(cases)}\n")

    # ─────────────────────────────────────────────────────────
    # Metrics
    # ─────────────────────────────────────────────────────────
    def compute_metrics(self):
        def prf(tp, fp, fn):
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            recall    = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f1        = (2 * precision * recall / (precision + recall)) \
                        if (precision + recall) > 0 else 0.0
            return precision, recall, f1

        p, r, f = prf(self.verb_tp, self.verb_fp, self.verb_fn)

        total = self.verb_tp + self.verb_fp + self.verb_fn + self.verb_tn
        accuracy = (self.verb_tp + self.verb_tn) / total if total > 0 else 0.0

        def cm_accuracy(cm: Counter):
            correct = sum(v for (e, p), v in cm.items() if e == p)
            tot = sum(cm.values())
            return (correct / tot) if tot > 0 else 0.0

        root_acc = self.root_correct / self.root_total if self.root_total > 0 else 0.0

        return {
            "verb_recognition": {
                "precision": p, "recall": r, "f1": f, "accuracy": accuracy,
                "tp": self.verb_tp, "fp": self.verb_fp,
                "fn": self.verb_fn, "tn": self.verb_tn,
            },
            "root_accuracy": root_acc,
            "lakara_accuracy": cm_accuracy(self.lakara_cm),
            "purusha_accuracy": cm_accuracy(self.purusha_cm),
            "vachana_accuracy": cm_accuracy(self.vachana_cm),
            "gana_accuracy": cm_accuracy(self.gana_cm),
            "root_total": self.root_total,
        }

    # ─────────────────────────────────────────────────────────
    # Confusion matrix plotting
    # ─────────────────────────────────────────────────────────
    def plot_confusion_matrix(self, cm: Counter, base_labels: List[str],
                              title: str, out_path: str):
        # Build a dynamic label set starting with base_labels + any extras
        labels = list(base_labels)
        for (e, p) in cm.keys():
            for lab in (e, p):
                key = lab if lab is not None else "<none>"
                if key not in labels:
                    labels.append(key)

        idx = {lab: i for i, lab in enumerate(labels)}
        n = len(labels)
        matrix = np.zeros((n, n), dtype=int)

        for (e, p), v in cm.items():
            ek = e if e is not None else "<none>"
            pk = p if p is not None else "<none>"
            matrix[idx[ek], idx[pk]] += v

        fig_size = (max(6, n * 0.8 + 2), max(5, n * 0.6 + 2))
        fig, ax = plt.subplots(figsize=fig_size)
        im = ax.imshow(matrix, cmap="Blues")
        ax.set_xticks(range(n))
        ax.set_yticks(range(n))
        ax.set_xticklabels(labels, rotation=45, ha="right", fontsize=9)
        ax.set_yticklabels(labels, fontsize=9)
        ax.set_xlabel("Predicted")
        ax.set_ylabel("Expected")
        ax.set_title(title)

        max_val = matrix.max() if matrix.size else 0
        for i in range(n):
            for j in range(n):
                val = matrix[i, j]
                if val > 0:
                    ax.text(j, i, str(val), ha="center", va="center",
                            color="white" if val > max_val / 2 else "black",
                            fontsize=9)

        fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        plt.tight_layout()
        plt.savefig(out_path, dpi=140, bbox_inches="tight")
        plt.close()
        print(f"  saved {out_path}")

    def generate_confusion_matrices(self):
        print("\nGenerating confusion matrices...")

        self.plot_confusion_matrix(
            self.lakara_cm,
            ["law", "laG", "lfw", "loW", "viDiliG"],
            "Lakara — Confusion Matrix",
            "confusion_lakara.png",
        )
        self.plot_confusion_matrix(
            self.purusha_cm,
            ["praTama", "maDyama", "uttama"],
            "Purusha — Confusion Matrix",
            "confusion_purusha.png",
        )
        self.plot_confusion_matrix(
            self.vachana_cm,
            ["eka", "dvi", "bahu"],
            "Vachana — Confusion Matrix",
            "confusion_vachana.png",
        )

        # Verb recognition — 2x2
        matrix = np.array([[self.verb_tp, self.verb_fn],
                           [self.verb_fp, self.verb_tn]])
        fig, ax = plt.subplots(figsize=(5, 4.5))
        im = ax.imshow(matrix, cmap="Blues")
        labels = ["Verb", "Not Verb"]
        ax.set_xticks([0, 1]); ax.set_yticks([0, 1])
        ax.set_xticklabels(labels); ax.set_yticklabels(labels)
        ax.set_xlabel("Predicted"); ax.set_ylabel("Expected")
        ax.set_title("Verb Recognition — Confusion Matrix")
        max_val = matrix.max()
        for i in range(2):
            for j in range(2):
                ax.text(j, i, str(matrix[i, j]), ha="center", va="center",
                        color="white" if matrix[i, j] > max_val / 2 else "black",
                        fontsize=12)
        fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        plt.tight_layout()
        plt.savefig("confusion_verb_recognition.png", dpi=140, bbox_inches="tight")
        plt.close()
        print("  saved confusion_verb_recognition.png")

    # ─────────────────────────────────────────────────────────
    # Markdown report
    # ─────────────────────────────────────────────────────────
    def generate_report(self, metrics: Dict[str, Any]):
        path = "paninian_eval_report.md"
        with open(path, "w", encoding="utf-8") as f:
            f.write("# Paninian Analyzer — Evaluation Report\n\n")

            # Verb recognition
            vr = metrics["verb_recognition"]
            f.write("## 1. Verb Recognition\n\n")
            f.write(f"- True Positives  : {vr['tp']}\n")
            f.write(f"- False Positives : {vr['fp']}\n")
            f.write(f"- False Negatives : {vr['fn']}\n")
            f.write(f"- True Negatives  : {vr['tn']}\n\n")
            f.write(f"- **Precision** : {vr['precision']:.3f}\n")
            f.write(f"- **Recall**    : {vr['recall']:.3f}\n")
            f.write(f"- **F1-Score**  : {vr['f1']:.3f}\n")
            f.write(f"- **Accuracy**  : {vr['accuracy']:.3f}\n\n")
            f.write("![Verb recognition](confusion_verb_recognition.png)\n\n")

            # Per-field
            f.write("## 2. Morphological Field Accuracy\n\n")
            f.write("| Field   | Accuracy |\n")
            f.write("|---------|----------|\n")
            f.write(f"| Root    | {metrics['root_accuracy']:.3f} "
                    f"({self.root_correct}/{self.root_total}) |\n")
            f.write(f"| Lakara  | {metrics['lakara_accuracy']:.3f} |\n")
            f.write(f"| Purusha | {metrics['purusha_accuracy']:.3f} |\n")
            f.write(f"| Vachana | {metrics['vachana_accuracy']:.3f} |\n")
            f.write(f"| Gana    | {metrics['gana_accuracy']:.3f} |\n\n")

            # Confusion matrices
            f.write("## 3. Confusion Matrices\n\n")
            f.write("### Lakara\n\n")
            f.write("![Lakara](confusion_lakara.png)\n\n")
            f.write("### Purusha\n\n")
            f.write("![Purusha](confusion_purusha.png)\n\n")
            f.write("### Vachana\n\n")
            f.write("![Vachana](confusion_vachana.png)\n\n")

            # Errors
            f.write("## 4. Detailed Errors\n\n")
            f.write("| Form | Exp Root | Got Root | Exp Lakara | Got Lakara "
                    "| Exp Purusha | Got Purusha |\n")
            f.write("|------|----------|----------|------------|------------"
                    "|-------------|-------------|\n")
            for r in self.results:
                exp = r["expected"]
                pred = r["predicted"]
                if not exp.get("is_verb"):
                    continue
                if r["match"].get("root") and r["match"].get("lakara") \
                   and r["match"].get("purusha") and r["match"].get("vachana"):
                    continue
                f.write(
                    f"| {r['form']} "
                    f"| {exp.get('root_slp1','')} | {pred.get('root_slp1','')} "
                    f"| {exp.get('lakara','')} | {pred.get('lakara','')} "
                    f"| {exp.get('purusha','')} | {pred.get('purusha','')} |\n"
                )
            f.write("\n")

        print(f"  saved {path}")

    # ─────────────────────────────────────────────────────────
    # Summary to console
    # ─────────────────────────────────────────────────────────
    def print_summary(self, metrics: Dict[str, Any]):
        vr = metrics["verb_recognition"]
        print("\n" + "=" * 64)
        print("PANINIAN ANALYZER — EVALUATION SUMMARY")
        print("=" * 64)
        print("Verb recognition:")
        print(f"  Precision : {vr['precision']:.3f}")
        print(f"  Recall    : {vr['recall']:.3f}")
        print(f"  F1        : {vr['f1']:.3f}")
        print(f"  Accuracy  : {vr['accuracy']:.3f}")
        print(f"  (TP={vr['tp']}, FP={vr['fp']}, FN={vr['fn']}, TN={vr['tn']})")
        print()
        print(f"Root accuracy    : {metrics['root_accuracy']:.3f} "
              f"({self.root_correct}/{self.root_total})")
        print(f"Lakara accuracy  : {metrics['lakara_accuracy']:.3f}")
        print(f"Purusha accuracy : {metrics['purusha_accuracy']:.3f}")
        print(f"Vachana accuracy : {metrics['vachana_accuracy']:.3f}")
        print(f"Gana accuracy    : {metrics['gana_accuracy']:.3f}")
        print("=" * 64)


# ─────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────

def main():
    if not os.path.exists("test_data/paninian_full_testset.json"):
        print("Missing test_data/paninian_full_testset.json")
        print("Run: python setup_test_data.py")
        sys.exit(1)

    evaluator = PaninianEvaluator()
    evaluator.run()
    metrics = evaluator.compute_metrics()
    evaluator.print_summary(metrics)
    evaluator.generate_confusion_matrices()
    evaluator.generate_report(metrics)
    print("\nDone.")


if __name__ == "__main__":
    main()