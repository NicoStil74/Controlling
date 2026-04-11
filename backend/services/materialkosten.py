import random
from datetime import datetime, timedelta
from turtledemo.clock import current_day


def format_german_number(value, is_price=False):
    if value is None or value == "-":
        return "-"
    # Format: 1.200 or 4,50
    if is_price:
        try:
            val = float(value)
            return f"{val:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        except (ValueError, TypeError):
            return "-"
    else:
        return f"{value:,}".replace(",", ".")


class MaterialCostService:
    def __init__(self):
        self.process_types = ["Zugang", "Abgang"]

    def generate_scenario(self, num_movements: int = 5):
        """
        Generates raw numeric data (ints/floats) for a random scenario.
        This allows for mathematical calculations before formatting strings.
        """
        movements = []
        current_date = datetime(2026, 1, 1)
        current_stock = random.randint(1000, 2000)
        
        # Initial Stock (Anfangsbestand)
        movements.append({
            "id": 1,
            "process": "Anfangsbestand",
            "date": current_date.strftime("%d.%m"),
            "quantity": current_stock,
            "price": random.randint(30, 45)
        })

        for i in range(2, num_movements + 2):
            current_date += timedelta(days=random.randint(2, 7))
            process_type = random.choice(self.process_types)
            
            if process_type == "Zugang":
                quantity = random.randint(500, 1500)
                price = random.randint(30, 45)
                current_stock += quantity
            else: # Abgang
                # Ensure we don't withdraw more than we have
                quantity = random.randint(200, min(current_stock, 1000))
                price = None 
                current_stock -= quantity
            
            movements.append({
                "id": i,
                "process": process_type,
                "date": current_date.strftime("%d.%m"),
                "quantity": quantity,
                "price": price
            })
            
        return movements

    def calculate_valuation_results(self, movements: list):
        """
        Computes the valuation results using English keys for internal logic.
        """
        # TODO: Implement your calculation logic here using the raw numeric data
        curr_amount = 0
        weighted_average = 0
        additions = 0
        price_average = 0
        current_valuation = 0

        for m in movements:
            moved_quantity = m.get("quantity")
            process = m.get("process")
            if m.get("price"):
                price = m.get("price")

            if process == "Abgang":
                curr_amount -= moved_quantity
                current_valuation -= moved_quantity * price
            else:
                current_valuation += moved_quantity * price
                curr_amount += moved_quantity #
                additions += moved_quantity
                weighted_average += moved_quantity * price


        final_amount = curr_amount # save final amount

        # MOVING - AVERAGE
        curr_amount = 0
        valuation = 0
        for m in movements:
            qty = m.get('quantity')
            if m.get('process') in ['Anfangsbestand', 'Zugang']:
                valuation += qty * m.get('price')
                curr_amount += qty

                avg_price = valuation / curr_amount
            else:
                valuation -= qty * avg_price
                curr_amount -= qty

        # LIFO method
        init_amount = movements[0]["quantity"]
        if init_amount >= final_amount:
            final_value = final_amount * movements[0]["price"]
        else:
            final_value = init_amount * movements[0]["price"]
            left_amount = init_amount - final_amount
            for i in range(1, len(movements)):
                if movements[i]['process'] == 'Zugang':
                    if movements[i]['quantity'] > left_amount:
                        final_value += movements[i]['quantity'] * movements[i]['price']
                        break
                else:
                    continue




        #Materialkosten = bew. AB + bewertete Zugänge - bewerteter EB
        moving_average = round(avg_price * curr_amount, 2)
        weighted_average /= additions
        weighted_average *= curr_amount

        return {
            "closing_stock": curr_amount,
            "weighted_average": round(weighted_average, 2),
            "moving_average": moving_average,
            "lifo": final_value,
            "fifo": 0
        }

    def format_movements(self, movements: list):
        """
        Formats the raw numeric movements into German locale strings for the frontend table.
        """
        formatted = []
        for m in movements:
            formatted.append({
                "id": m["id"],
                "process": m["process"],
                "date": m["date"],
                "quantity": format_german_number(m["quantity"]),
                "price": format_german_number(m["price"], is_price=True)
            })
        return formatted

    def get_full_package(self):
        """
        Main entry point for the API to get both data and solutions for a single random scenario.
        """
        raw_data = self.generate_scenario()
        solutions = self.calculate_valuation_results(raw_data)
        table_data = self.format_movements(raw_data)

        prices = []
        quantities = []
        processes = []
        for r in raw_data:
            prices.append(r["price"])
            quantities.append(r['quantity'])
            processes.append(r['process'])

        dataframe = {
            "prices": prices,
            "quantities": quantities,
            "processes": processes
        }

        return {
            "table_data": table_data,
            "solutions": solutions
        }, dataframe
