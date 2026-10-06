from prakriya import Prakriya

p = Prakriya()
raw = p['gacCati']

print("TYPE:", type(raw))
print()

if isinstance(raw, list):
    print("LIST LENGTH:", len(raw))
    item = raw[0]
    print("ITEM TYPE:", type(item))
    print()
    if isinstance(item, dict):
        print("KEYS AND VALUES:")
        for k, v in item.items():
            print(f"  {k!r:25s} = {v!r}")
    elif hasattr(item, '__dict__'):
        print("ATTRIBUTES:")
        for k, v in vars(item).items():
            print(f"  {k!r:25s} = {v!r}")