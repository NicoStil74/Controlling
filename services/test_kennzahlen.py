from kennzahlen import KennzahlenService
import json
def printj(item):
    print(json.dumps(item, indent=4))


k = KennzahlenService()

data = [
    # AKTIVA
    {"type": "Anlagevermögen", "name": "Grundstücke u. Gebäude", "amount": 300},
    {"type": "Anlagevermögen", "name": "Fuhrpark", "amount": 100},
    {"type": "Anlagevermögen", "name": "Betriebs- u. Geschäftsausstattung", "amount": 50},

    {"type": "Umlaufvermögen", "name": "Warenbestände", "amount": 70},
    {"type": "Umlaufvermögen", "name": "Forderungen aus LuL", "amount": 50},
    {"type": "Umlaufvermögen", "name": "Wertpapiere (nicht betriebsn.)", "amount": 50},
    {"type": "Umlaufvermögen", "name": "Bank", "amount": 30},

    # PASSIVA
    {"type": "Eigenkapital", "name": "Gezeichnetes Kapital", "amount": 200},
    {"type": "Eigenkapital", "name": "Rücklagen", "amount": 190},

    {"type": "Fremdkapital", "name": "Steuerrückstellungen", "amount": 10},
    {"type": "Fremdkapital", "name": "lfr. Darlehen", "amount": 190},
    {"type": "Fremdkapital", "name": "kfr. Darlehen", "amount": 10},
    {"type": "Fremdkapital", "name": "Kundenanzahlungen", "amount": 20},
    {"type": "Fremdkapital", "name": "Verbindlichkeiten aus LuL", "amount": 30},
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

figures = k.calculate_figures(data, guv)

printj(figures)
