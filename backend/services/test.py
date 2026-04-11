import json
import pandas as pd
from materialkosten import MaterialCostService


def printj(item):
    print(json.dumps(item, indent=4))

m = MaterialCostService()

# package, dataframe = m.get_full_package()
movements = [
    {"process": "Anfangsbestand", "date": "01.03", "quantity": 150, "price": 40.00},
    {"process": "Zugang",         "date": "02.03", "quantity": 250, "price": 42.00},
    {"process": "Abgang",         "date": "03.03", "quantity": 100, "price": None},
    {"process": "Zugang",         "date": "06.03", "quantity": 200, "price": 38.00},
    {"process": "Abgang",         "date": "08.03", "quantity": 400, "price": None},
    {"process": "Zugang",         "date": "12.03", "quantity": 150, "price": 43.00},
    {"process": "Abgang",         "date": "13.03", "quantity": 50,  "price": None}
]

solution = m.calculate_valuation_results(movements)

printj(solution)