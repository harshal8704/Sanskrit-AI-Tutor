from modules.nlp_processor import SanskritNLP

nlp = SanskritNLP()

tests = [
    ("रामः वनं गच्छति।", "correct simple sentence"),
    ("बालकः पुस्तकं पठति।", "correct sentence"),
    ("अहं विद्यालय गच्छामि।", "missing accusative on destination"),
    ("रामः वनम्।", "missing verb"),
    ("रामः वनं गच्छति", "missing purna virama"),
    ("भवति सः।", "unknown words + valid verb"),
]

for text, label in tests:
    print("=" * 72)
    print(f"TEST: {label}")
    print(f"INPUT: {text}")
    r = nlp.analyze_text(text)
    if "error" in r:
        print(f"ERROR: {r['error']}")
        continue
    print(f"Score   : {r['score']}")
    print(f"Mode    : {r['analysis_mode']}")
    print(f"Sources : {r.get('source_counts')}")
    print(f"Issues  : {r['issues']}")
    print(f"Corrected: {r['corrected_sentence']}")
    print(f"Translation: {r['translation']}")
    print("Breakdown:")
    for b in r['breakdown']:
        line = f"  {b['word']:14s} | {b['pos']:8s} | {b['source']:12s}"
        if b['pos'] == 'verb':
            a = b['analysis']
            line += f" | root={a.get('root')} lakara={a.get('lakara')} purusha={a.get('purusha')} vacana={a.get('vacana')}"
        elif b['pos'] == 'noun' and b['source'] == 'noun_rule':
            a = b['analysis']
            line += f" | stem={a.get('stem')} gender={a.get('gender')} case={a.get('case')} number={a.get('number')}"
        print(line)