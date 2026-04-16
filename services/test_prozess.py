from prozesskosten import ProzessKosten
import json

p = ProzessKosten()

data = {
    'personalkosten': 350000,
    'sachkosten': 200000,
    'sonstige_kosten': 150000,
    'A': {
        'fertigungs_einzelkosten': 20,
        'produktionsmenge': 20000,
        'bauplanpositionen': 20,
    },
    'B': {
        'fertigungs_einzelkosten': 20,
        'produktionsmenge': 10000,
        'bauplanpositionen': 30,
    },
    'C': {
        'fertigungs_einzelkosten': 30,
        'produktionsmenge': 10000,
        'bauplanpositionen': 50,
    },
    'D': {
        'fertigungs_einzelkosten': 50,
        'produktionsmenge': 2000,
        'bauplanpositionen': 100,
    }
}

print(json.dumps(data, indent = 2))
print(json.dumps(p.get_solutions2(data), indent=2))

