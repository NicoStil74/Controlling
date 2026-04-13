# KennzahlenService currently empty
import random
from datetime import datetime, timedelta

from pymupdf.mupdf import pint_assign


class KennzahlenService():
    def __init__(self):
        self.data = []
        self.figures = {}
        self.guv = []
        self.steuersatz = 0.3

    def generate1(self):
        balance_sum = random.randint(250, 5000)
        av_ratio = random.uniform(0.3, 0.6)
        uv_ratio = 1 -  av_ratio

        # AKTIVA
        activa = [
            {"type": "Anlagevermögen", "name": "Grundstücke u. Gebäude", "amount": round(balance_sum * av_ratio * 0.7, 2)},
            {"type": "Anlagevermögen", "name": "Fuhrpark", "amount": round(balance_sum * av_ratio * 0.2, 2)},
            {"type": "Anlagevermögen", "name": "Betriebs- u. Geschäftsausstattung", "amount": round(balance_sum * av_ratio * 0.1,2)},

            {"type": "Umlaufvermögen", "name": "Warenbestände", "amount": round(balance_sum * uv_ratio * 0.4,2)},
            {"type": "Umlaufvermögen", "name": "Forderungen aus LuL", "amount": round(balance_sum * uv_ratio * 0.3,2)},
            {"type": "Umlaufvermögen", "name": "Wertpapiere (nicht betriebsn.)", "amount": round(balance_sum * uv_ratio * 0.1,2)},
            {"type": "Umlaufvermögen", "name": "Bank", "amount": round(balance_sum * uv_ratio * 0.2,2)},
        ]

        ek_ratio = random.uniform(0.2, 0.4)
        fk_ratio = 1.0 - ek_ratio

        passiva = [
            {"type": "Eigenkapital", "name": "Gezeichnetes Kapital", "amount": round(balance_sum * ek_ratio * 0.8,2)},
            {"type": "Eigenkapital", "name": "Rücklagen", "amount": round(balance_sum * ek_ratio * 0.2,2)},

            {"type": "Fremdkapital", "name": "Steuerrückstellungen", "amount": round(balance_sum * fk_ratio * 0.05,2)},
            {"type": "Fremdkapital", "name": "lfr. Darlehen", "amount": round(balance_sum * fk_ratio * 0.5,2)},
            {"type": "Fremdkapital", "name": "kfr. Darlehen", "amount": round(balance_sum * fk_ratio * 0.2,2)},
            {"type": "Fremdkapital", "name": "Kundenanzahlungen", "amount": round(balance_sum * fk_ratio * 0.05,2)},
            {"type": "Fremdkapital", "name": "Verbindlichkeiten aus LuL", "amount": round(balance_sum * fk_ratio * 0.2,2)},
        ]

        # Calculate balance sheet components for GuV logic
        av_total = sum(item['amount'] for item in activa if item['type'] == 'Anlagevermögen')
        loans_total = sum(item['amount'] for item in passiva if 'Darlehen' in item['name'])
        liquid_total = sum(item['amount'] for item in activa if item['name'] in ['Bank', 'Wertpapiere (nicht betriebsn.)'])

        # Logical GUV generation
        revenue = round(balance_sum * random.uniform(0.8, 1.2), 2)
        warenaufwand = round(revenue * random.uniform(0.4, 0.5), 2)
        personalaufwand = round(revenue * random.uniform(0.15, 0.25), 2)
        abschreibungen = round(av_total * random.uniform(0.05, 0.1), 2)
        zinsaufwand = round(loans_total * random.uniform(0.03, 0.06), 2)
        zinsertrag = round(liquid_total * random.uniform(0.01, 0.03), 2)
        
        bestandsveraenderung = round(revenue * random.uniform(-0.02, 0.02), 2)
        versicherungen = round(revenue * random.uniform(0.02, 0.04), 2)
        sonst_aufwand = round(revenue * random.uniform(0.05, 0.1), 2)

        # Calculate EBT
        ertrag_sum = revenue + zinsertrag
        aufwand_sum = warenaufwand + personalaufwand + abschreibungen + zinsaufwand + versicherungen + sonst_aufwand + (bestandsveraenderung if bestandsveraenderung > 0 else 0)
        # Adjust bestandsveraenderung: if negative, it's like an expense (reduction), if positive it's like income
        # In German accounting: + is increase in stock (income-like), - is decrease (expense-like)
        
        ebt = ertrag_sum + (bestandsveraenderung if bestandsveraenderung > 0 else 0) - aufwand_sum + (bestandsveraenderung if bestandsveraenderung < 0 else 0)
        # Simplified: ebt = Revenue + Zinsertrag + Bestandsveränd - (rest of expenses)
        ebt = revenue + zinsertrag + bestandsveraenderung - warenaufwand - personalaufwand - abschreibungen - zinsaufwand - versicherungen - sonst_aufwand

        guv = [
            {"type": "Ertrag", "name": "Umsatzerlöse", "amount": revenue},
            {"type": "Ertrag", "name": "Zinsertrag", "amount": zinsertrag},

            {"type": "Aufwand", "name": "Bestandsveränderung", "amount": bestandsveraenderung},
            {"type": "Aufwand", "name": "Personalaufwand", "amount": personalaufwand},

            {"type": "Aufwand", "name": "Warenaufwand", "amount": warenaufwand},
            {"type": "Aufwand", "name": "Versicherungen", "amount": versicherungen},
            {"type": "Aufwand", "name": "Zinsaufwand", "amount": zinsaufwand},
            {"type": "Aufwand", "name": "Abschreibungen", "amount": abschreibungen},
            {"type": "Aufwand", "name": "sonst. betriebl. Aufwand", "amount": sonst_aufwand},

            {"type": "Ergebnis", "name": "Gewinn vor Steuer", "amount": round(ebt, 2)},
        ]


        self.data = activa + passiva
        self.guv = guv

        return self.data, self.guv


    def calculate_figures1(self, data, guv):

        balance_sum = sum(item['amount'] for item in data if item['type'] in ['Eigenkapital', 'Fremdkapital'])

        forderungen_types = ['Forderungen aus LuL','Wertpapiere (nicht betriebsn.)']

        ek = sum(item['amount'] for item in data if item['type'] == 'Eigenkapital')
        fk = balance_sum - ek
        av = sum(item['amount'] for item in data if item['type'] == 'Anlagevermögen')
        uv = balance_sum - av
        lang_darl = sum(item['amount'] for item in data if item['name'] == 'lfr. Darlehen')
        kurz_darl = sum(item['amount'] for item in data if item['name'] != 'lfr. Darlehen' and item['type'] == 'Fremdkapital')
        bank = sum(item['amount'] for item in data if item['name'] == 'Bank')
        forderungen = sum(item['amount'] for item in data if item['name'] in forderungen_types)
        gewinn_vorstr = sum(item['amount'] for item in guv if item ['name'] == 'Gewinn vor Steuer')
        fk_zinsen = sum(item['amount'] for item in guv if item ['name'] == 'Zinsaufwand')
        gewinn = gewinn_vorstr * (1-self.steuersatz)
        umsatz = sum(item['amount'] for item in guv if item['name'] == 'Umsatzerlöse')


        self.figures['Verschuldungsgrad'] = (fk / ek) * 100
        self.figures['Fremdkapitalquote'] = (fk / balance_sum) * 100
        self.figures['Eigenkapitalquote'] = (ek / balance_sum) * 100

        self.figures['ADG_I'] = (ek / av) * 100
        self.figures['ADG_II'] = (ek + lang_darl) / av * 100

        self.figures['LG_I'] = (bank / kurz_darl) * 100
        self.figures['LG_II'] = ((bank + forderungen) / kurz_darl) * 100
        self.figures['LG_III'] = (uv / kurz_darl) * 100

        self.figures['EBIT'] = gewinn_vorstr + fk_zinsen
        self.figures['EKRvST'] = (gewinn_vorstr / ek) * 100
        self.figures['EKRnST'] = (gewinn / ek) * 100

        self.figures['URnST'] = (gewinn / umsatz) * 100
        self.figures['GKRvST']  = ((gewinn_vorstr + fk_zinsen) / (ek + fk)) * 100

        # Round all to 2 decimals
        self.figures = {k: round(v, 2) for k,v in self.figures.items()}

        return self.figures


    def get_package1(self):
        data, guv = self.generate1()
        figures = self.calculate_figures1(data, guv)

        return {
            'balance': data,
            'guv': guv,
            'figures': figures
        }


    @staticmethod
    def generate2():
        import random

        # ===== Kapitalstruktur =====
        ek = random.randint(100_000, 1_000_000)
        fk = random.randint(100_000, 1_000_000)
        gk = ek + fk

        # ===== Umsatz =====
        umsatz = round(random.uniform(0.8, 3.0) * ek, 2)

        # ===== EBIT =====
        ebit_marge = random.uniform(0.03, 0.25)
        ebit = round(umsatz * ebit_marge, 2)

        # ===== Zinsen =====
        fk_zins = round(random.uniform(0.03, 0.10),2)
        zins = round(fk * fk_zins, 2)

        # ===== Gewinn vor Steuer / EBT =====
        ebt = round(ebit - zins, 2)

        steuersatz = random.uniform(0.15, 0.35)
        net_income = round(ebt * (1 - steuersatz), 2)

        # ===== Abschreibungen =====
        abschreibungen = round(umsatz * random.uniform(0.03, 0.15), 2)

        # ===== Cashflow-Elemente =====

        # Pensionsrückstellungen
        pens_change = round(random.uniform(-10_000, 50_000), 2)

        # Working Capital Change (% vom Umsatz)
        wc_change = round(umsatz * random.uniform(-0.05, 0.05), 2)

        # Investitionen (Capex)
        capex = round(umsatz * random.uniform(0.05, 0.20), 2)

        # ===== Kapitalkostensatz fr Eigenkapital =====
        capital_cost_eq = round(random.uniform(0.08, 0.14), 2)


        return {
            'ek': ek,
            'fk': fk,
            'gk': gk,
            'fk_zins': fk_zins,
            'umsatz': umsatz,
            'ebt': ebt,
            'steuer': round(ebt * steuersatz, 2),
            'net_income': net_income,
            'abschreibungen': abschreibungen,
            'pensionsrueckstellungen': pens_change,
            'working_capital': wc_change,
            'investitionen': capex,
            'kapitalkosten_ek': capital_cost_eq
        }

    @staticmethod
    def calculate_figures2(data):
        # ======================
        # Profitability
        # ======================

        umsatzrendite = round((data['net_income'] / data['umsatz']) * 100, 2)

        ekr = round((data['net_income'] / data['ek']) * 100, 2)
        gkr = round(((data['net_income'] + data['fk_zins'] * data['fk']) / data['gk']) * 100, 2)

        # ======================
        # EBITDA / EBIT / NOPAT
        # ======================

        ebit = data['ebt'] + data['fk'] * data['fk_zins']

        ebitda = ebit + data['abschreibungen']

        tax_rate = data['steuer'] / data['ebt'] if data['ebt'] != 0 else 0

        nopat = ebit - (data['ebt'] * tax_rate)

        # ======================
        # Cash Flow
        # ======================

        ocf = (
                data['net_income']
                + data['abschreibungen']
                + data['pensionsrueckstellungen']
                - data['working_capital']
        )

        fcf = ocf - data['investitionen']

        # ======================
        # Capital / WACC / EVA
        # ======================


        ek = data['ek']
        fk = data['fk']
        gk = data['gk']

        wacc_val = (
                (ek / gk) * data['kapitalkosten_ek']
                + (fk / gk) * data['fk_zins']
        )

        capital_charge = (wacc_val) * gk

        eva = nopat - capital_charge

        # ======================
        # Return
        # ======================

        return {
            'umsatzrendite': umsatzrendite,
            'ekr': ekr,
            'gkr': gkr,

            'ebit': round(ebit, 2),
            'ebitda': round(ebitda, 2),
            'nopat': round(nopat, 2),

            'ocf': round(ocf, 2),
            'fcf': round(fcf, 2),

            'wacc': round(wacc_val * 100, 2),
            'kapitalkosten': round(capital_charge, 2),
            'eva': round(eva, 2)
        }

    @staticmethod
    def get_package2():
        data = KennzahlenService().generate2()
        solutions = KennzahlenService.calculate_figures2(data)

        return{
            'data': data,
            'solutions': solutions
        }