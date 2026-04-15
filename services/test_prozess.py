from prozesskosten import ProzessKosten
import json

p = ProzessKosten()

data = p.generate_scenario2()

print(json.dumps(data, indent = 2))
print(json.dumps(p.get_solutions2(data), indent=2))

