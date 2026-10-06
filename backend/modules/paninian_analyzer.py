"""
Paninian Grammar Analyzer
-------------------------
A wrapper around the `prakriya` Sanskrit verb analyzer.

Scope (deliberately limited):
- Devanagari → SLP1 via indic-transliteration.
- Uses Prakriya's documented get_info() API.
- Recognizes finite (tiṅanta) verb forms.
- Extracts: dhatu, lakara, purusha, vacana, gana, pada, suffix,
  derivation sutras.
- Does NOT do: subanta analysis, sandhi splitting, samasa, karaka,
  or syntactic parsing.
"""

from __future__ import annotations

import re
import unicodedata
from typing import Any, Dict, List, Optional

try:
    from prakriya import Prakriya
    PRAKRIYA_AVAILABLE = True
except ImportError:
    PRAKRIYA_AVAILABLE = False

try:
    from indic_transliteration import sanscript
    SANSCRIPT_AVAILABLE = True
except ImportError:
    SANSCRIPT_AVAILABLE = False


class PaninianAnalyzer:

    # Characters that can appear in Prakriya's `verb` field but are NOT
    # part of the SLP1 phonetic inventory. Safe to strip.
    _IT_MARKERS = ("x", "X", "~", "\\", "'", "^", "|", "#", "@", "!", "$", "%", "&", "*")

    def __init__(self):
        self.prakriya: Optional[Any] = None
        self._init_error: Optional[str] = None

        if PRAKRIYA_AVAILABLE:
            try:
                self.prakriya = Prakriya()
                try:
                    self.prakriya.input_translit("slp1")
                    self.prakriya.output_translit("slp1")
                except Exception:
                    pass
                print("✅ Paninian Analyzer: Prakriya initialized")
            except Exception as exc:
                self._init_error = str(exc)
                print(f"⚠️ Prakriya init failed: {exc}")
        else:
            self._init_error = "prakriya not installed"
            print("⚠️ prakriya not installed")

        if not SANSCRIPT_AVAILABLE:
            print("⚠️ indic-transliteration not installed")

    # ─────────────────────────────────────────────────────────────
    # Normalization & transliteration
    # ─────────────────────────────────────────────────────────────
    @staticmethod
    def _normalize(text: str) -> str:
        text = unicodedata.normalize("NFC", text)
        return (text.replace("\u200c", "")
                    .replace("\u200d", "")
                    .replace("\ufeff", "")
                    .strip())

    @staticmethod
    def _strip_punct(word: str) -> str:
        return word.strip("।॥|.,!?;:()[]{}\"'“”‘’").strip()

    def to_slp1(self, devanagari: str) -> str:
        text = self._normalize(devanagari)
        text = text.replace("।", "").replace("॥", "").replace("|", "").strip()
        if not text:
            return ""
        if not SANSCRIPT_AVAILABLE:
            raise RuntimeError("indic-transliteration is not installed")
        return sanscript.transliterate(text, sanscript.DEVANAGARI, sanscript.SLP1)

    def to_devanagari(self, slp1: str) -> str:
        if not slp1:
            return ""
        if not SANSCRIPT_AVAILABLE:
            raise RuntimeError("indic-transliteration is not installed")
        return sanscript.transliterate(slp1, sanscript.SLP1, sanscript.DEVANAGARI)

    # ─────────────────────────────────────────────────────────────
    # Prakriya field access (with list unwrapping)
    # ─────────────────────────────────────────────────────────────
    @staticmethod
    def _unwrap(value: Any) -> Any:
        if isinstance(value, list):
            if len(value) == 0:
                return None
            if len(value) == 1:
                return value[0]
            return value
        return value

    def _get_field(self, slp1_form: str, field: str) -> Any:
        if not self.prakriya:
            return None
        try:
            raw = self.prakriya.get_info(slp1_form, field)
            return self._unwrap(raw)
        except Exception:
            return None

    def _get_derivation(self, slp1_form: str) -> List[Dict[str, str]]:
        """Return flat list of {'sutra','sutra_num','form'} steps."""
        if not self.prakriya:
            return []
        try:
            raw = self.prakriya.get_info(slp1_form, "prakriya")
            if (isinstance(raw, list) and len(raw) == 1
                    and isinstance(raw[0], list)):
                raw = raw[0]
            if not isinstance(raw, list):
                return []
            steps = []
            for s in raw:
                if isinstance(s, dict):
                    steps.append({
                        "sutra":     str(s.get("sutra", "")),
                        "sutra_num": str(s.get("sutra_num", "")),
                        "form":      str(s.get("form", "")),
                    })
            return steps
        except Exception:
            return []

    # ─────────────────────────────────────────────────────────────
    # Root extraction
    # ─────────────────────────────────────────────────────────────
    @classmethod
    def _extract_root(cls, derivation: List[Dict[str, str]], raw_verb: Any) -> str:
        """
        Extract the clean root.
        Strategy: take the form IMMEDIATELY BEFORE the first derivation step
        whose form contains '+' (i.e. before suffix attachment begins).
        """
        clean_root = ""
        for step in derivation:
            form = step.get("form", "")
            if "+" in form:
                break
            if form:
                clean_root = form

        if clean_root:
            return clean_root

        # Fallback: strip known non-phoneme markers from the raw verb field
        if raw_verb:
            s = str(raw_verb)
            for m in cls._IT_MARKERS:
                s = s.replace(m, "")
            return s.strip()

        return ""

    # ─────────────────────────────────────────────────────────────
    # Verb analysis
    # ─────────────────────────────────────────────────────────────
    def analyze_verb_direct(self, slp1_form: str) -> Dict[str, Any]:
        slp1_form = self._normalize(slp1_form).strip()

        if not slp1_form:
            return {"is_verb": False, "error": "Empty input", "slp1_used": ""}

        if not self.prakriya:
            return {"is_verb": False,
                    "error": self._init_error or "Prakriya unavailable",
                    "slp1_used": slp1_form}

        raw_verb = self._get_field(slp1_form, "verb")
        derivation = self._get_derivation(slp1_form)

        # Gate 1: Prakriya must return a root
        if raw_verb is None:
            return {"is_verb": False,
                    "error": "Not a verb form (no root returned)",
                    "slp1_used": slp1_form}

        # Gate 2: derivation must end at the exact input form
        if derivation:
            final_form = derivation[-1].get("form", "")
            if final_form and final_form != slp1_form:
                return {"is_verb": False,
                        "error": f"Invalid verb form (derivation ended at '{final_form}')",
                        "slp1_used": slp1_form}

        root_slp1 = self._extract_root(derivation, raw_verb)
        root_deva = self.to_devanagari(root_slp1) if root_slp1 else ""

        rules_applied = [s["sutra_num"] for s in derivation if s.get("sutra_num")]

        return {
            "is_verb": True,
            "root": root_deva,
            "root_slp1": root_slp1,
            "raw_verb_with_markers": str(raw_verb),
            "meaning": self._get_field(slp1_form, "meaning"),
            "tense": self._get_field(slp1_form, "lakara"),
            "person": self._get_field(slp1_form, "purusha"),
            "number": self._get_field(slp1_form, "vachana"),
            "class": self._get_field(slp1_form, "gana"),
            "pada": self._get_field(slp1_form, "padadecider_id"),
            "suffix": self._get_field(slp1_form, "suffix"),
            "derivation": derivation,
            "rules_applied": rules_applied,
            "slp1_used": slp1_form,
        }

    def analyze_verb(self, dev_form: str) -> Dict[str, Any]:
        cleaned = self._strip_punct(self._normalize(dev_form))
        if not cleaned:
            return {"is_verb": False, "error": "Empty input"}

        try:
            slp1 = self.to_slp1(cleaned)
        except Exception as exc:
            return {"is_verb": False, "error": str(exc), "dev_input": cleaned}

        result = self.analyze_verb_direct(slp1)
        result["dev_input"] = cleaned
        return result

    # ─────────────────────────────────────────────────────────────
    # Sentence analysis
    # ─────────────────────────────────────────────────────────────
    @staticmethod
    def tokenize(text: str) -> List[str]:
        text = PaninianAnalyzer._normalize(text)
        return re.findall(r"[\u0900-\u097F]+", text)

    def analyze_sentence(self, text: str) -> Dict[str, Any]:
        tokens = self.tokenize(text)
        word_analyses = []
        has_verb = False
        verb_count = 0

        for token in tokens:
            result = self.analyze_verb(token)
            entry = {
                "surface": token,
                "is_verb": result.get("is_verb", False),
                "morphology": result if result.get("is_verb") else None,
            }
            if entry["is_verb"]:
                has_verb = True
                verb_count += 1
            word_analyses.append(entry)

        return {
            "text": text,
            "tokens": tokens,
            "word_analyses": word_analyses,
            "word_count": len(tokens),
            "verb_count": verb_count,
            "has_verb": has_verb,
            "prakriya_available": self.prakriya is not None,
        }

    # ─────────────────────────────────────────────────────────────
    # Derivation trace
    # ─────────────────────────────────────────────────────────────
    def get_derivation_trace(self, dev_form: str) -> str:
        result = self.analyze_verb(dev_form)

        if not result.get("is_verb"):
            return f"❌ {dev_form}: {result.get('error', 'unknown error')}"

        lines = [
            f"🔍 {result['dev_input']}  (SLP1: {result['slp1_used']})",
            "",
            "Morphology:",
            f"  Dhatu   : {result['root']}  ({result['root_slp1']})",
            f"  Lakara  : {result['tense']}",
            f"  Purusha : {result['person']}",
            f"  Vacana  : {result['number']}",
            f"  Gana    : {result['class']}",
            f"  Pada    : {result['pada']}",
            f"  Suffix  : {result['suffix']}",
            "",
            f"Derivation ({len(result['derivation'])} steps):",
        ]
        for i, step in enumerate(result["derivation"], 1):
            lines.append(
                f"  {i:2d}. [{step['sutra_num']:>6s}]  "
                f"{step['sutra']}  →  {step['form']}"
            )
        return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────
# Self-test
# ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    analyzer = PaninianAnalyzer()

    print("\n--- SLP1 Conversion ---")
    for w in ["गच्छति", "पठति", "रामः", "भवति", "दृश्"]:
        try:
            print(f"  {w} -> {analyzer.to_slp1(w)}")
        except Exception as e:
            print(f"  {w} -> ERROR: {e}")

    print("\n--- SLP1 -> Devanagari ---")
    for s in ["gam", "gacCati", "paWati", "rAmaH", "dfS"]:
        try:
            print(f"  {s} -> {analyzer.to_devanagari(s)}")
        except Exception as e:
            print(f"  {s} -> ERROR: {e}")

    print("\n--- Verb Analysis ---")
    for w in ["गच्छति", "पठति", "करोति", "भवति", "पिबति", "खादति",
              "रामः", "वनम्"]:
        r = analyzer.analyze_verb(w)
        if r.get("is_verb"):
            print(
                f"  {w:10s} → root={r['root']:8s} "
                f"lakara={str(r['tense']):6s} purusha={str(r['person']):8s} "
                f"vacana={str(r['number']):5s} gana={str(r['class']):8s}"
            )
        else:
            print(f"  {w:10s} → not verb  ({r.get('error')})")

    print("\n--- Derivation Trace ---")
    print(analyzer.get_derivation_trace("गच्छति"))

    print("\n--- Sentence Analysis ---")
    r = analyzer.analyze_sentence("रामः वनं गच्छति।")
    print(f"  Tokens     : {r['tokens']}")
    print(f"  Has verb   : {r['has_verb']}")
    print(f"  Verb count : {r['verb_count']}")
    for entry in r["word_analyses"]:
        if entry["is_verb"]:
            m = entry["morphology"]
            print(f"    {entry['surface']} → root={m['root']}, "
                  f"purusha={m['person']}, vacana={m['number']}")