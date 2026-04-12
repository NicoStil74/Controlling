# KennzahlenService currently empty
import random
from datetime import datetime, timedelta

from pymupdf.mupdf import pint_assign


class KennzahlenService():
    def __init__(self):
        self.data = []
        self.balance_sum = random.randint(250, 2500)
        self.figures = {}
        self.guv = []
        self.steuersatz = 0.3

    def generate(self):

        av_ratio = random.uniform(0.3, 0.6)
        uv_ratio = 1 -  av_ratio

        # AKTIVA
        activa = [
            {"type": "Anlagevermögen", "name": "Grundstücke u. Gebäude", "amount": round(self.balance_sum * av_ratio * 0.7)},
            {"type": "Anlagevermögen", "name": "Fuhrpark", "amount": round(self.balance_sum * av_ratio * 0.2)},
            {"type": "Anlagevermögen", "name": "Betriebs- u. Geschäftsausstattung", "amount": round(self.balance_sum * av_ratio * 0.1)},

            {"type": "Umlaufvermögen", "name": "Warenbestände", "amount": round(self.balance_sum * uv_ratio * 0.4)},
            {"type": "Umlaufvermögen", "name": "Forderungen aus LuL", "amount": round(self.balance_sum * uv_ratio * 0.3)},
            {"type": "Umlaufvermögen", "name": "Wertpapiere (nicht betriebsn.)", "amount": round(self.balance_sum * uv_ratio * 0.1)},
            {"type": "Umlaufvermögen", "name": "Bank", "amount": round(self.balance_sum * uv_ratio * 0.2)},
        ]

        ek_ratio = random.uniform(0.2, 0.4)
        fk_ratio = 1.0 - ek_ratio

        passiva = [
            {"type": "Eigenkapital", "name": "Gezeichnetes Kapital", "amount": round(self.balance_sum * ek_ratio * 0.8)},
            {"type": "Eigenkapital", "name": "Rücklagen", "amount": round(self.balance_sum * ek_ratio * 0.2)},

            {"type": "Fremdkapital", "name": "Steuerrückstellungen", "amount": round(self.balance_sum * fk_ratio * 0.05)},
            {"type": "Fremdkapital", "name": "lfr. Darlehen", "amount": round(self.balance_sum * fk_ratio * 0.5)},
            {"type": "Fremdkapital", "name": "kfr. Darlehen", "amount": round(self.balance_sum * fk_ratio * 0.2)},
            {"type": "Fremdkapital", "name": "Kundenanzahlungen", "amount": round(self.balance_sum * fk_ratio * 0.05)},
            {"type": "Fremdkapital", "name": "Verbindlichkeiten aus LuL", "amount": round(self.balance_sum * fk_ratio * 0.2)},
        ]

        guv = [
            {"type": "Ertrag", "name": "Umsatzerlöse", "amount": 1730},
            {"type": "Ertrag", "name": "Zinsertrag", "amount": 3},

            {"type": "Aufwand", "name": "Bestandsveränderung", "amount": 20},
            {"type": "Aufwand", "name": "Personalaufwand", "amount": 280},

            {"type": "Aufwand", "name": "Warenaufwand", "amount": 700},
            {"type": "Aufwand", "name": "Versicherungen", "amount": 50},
            {"type": "Aufwand", "name": "Zinsaufwand", "amount": 5},
            {"type": "Aufwand", "name": "Abschreibungen", "amount": 50},
            {"type": "Aufwand", "name": "sonst. betriebl. Aufwand", "amount": 514},

            {"type": "Ergebnis", "name": "Gewinn vor Steuer", "amount": 114},
        ]


        self.data = activa + passiva
        self.guv = guv

        return self.data, self.guv


    def calculate_figures(self, data, guv):

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


    def get_package(self):
        data, guv = self.generate()
        figures = self.calculate_figures(data, guv)

        return {
            'balance': data,
            'guv': guv,
            'figures': figures
        }


