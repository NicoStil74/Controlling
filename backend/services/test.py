import json

from materialkosten import MaterialCostService


def printj(item):
    print(json.dumps(item, indent=4))

m = MaterialCostService()

package = m.get_full_package()
printj(package["table_data"])
printj(package["solutions"])

