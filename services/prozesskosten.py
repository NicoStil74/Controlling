import json
import random as rd

def get_cost_rate(amount: int, cost: int):
    return round(amount / cost,2)


def get_umlagesatz(cost_rate, umlagesatz):
# Umlagesatz = Summe lmn Kosten / Summe lmi Kosten 
    return round(cost_rate * umlagesatz,2)

def get_gesamtkostensatz(kostensatz, umlagesatz):
    return kostensatz * umlagesatz

class ProzessKosten():
    
    @staticmethod
    def generate_scenario():

        # ===== Applications ===== 
        rcvd_applications = rd.randint(800, 4500)
        application_cost = rcvd_applications * rd.randint(40,100)

        # ===== Interview ===== 
        interviews = int(round(rcvd_applications * rd.uniform(0.05, 0.15),0))
        interview_cost = interviews * rd.randint(300,500)

        # ===== Psych ===== 
        psych_tests = round(rcvd_applications / rd.randint(100, 400))
        psych_cost = psych_tests * rd.randint(800,1100)


        # ===== Abteilung ===== 
        department_cost = rd.randint(30,60) * 1000

        # ===== Summen ===== 
        summe_lmi = application_cost + interview_cost + psych_cost
        summe_lmn = department_cost

        umlagesatz = summe_lmn / summe_lmi

        # Calculation of solutions
        appl_kostensatz = get_cost_rate(rcvd_applications, application_cost)
        appl_umlagesatz = get_umlagesatz(appl_kostensatz, umlagesatz)
        appl_gesamtkostensatz = get_gesamtkostensatz(appl_kostensatz, appl_umlagesatz)

        interview_cost_rate = get_cost_rate(interviews, interview_cost)
        interview_umlagesatz = get_umlagesatz(interview_cost_rate, umlagesatz)
        interview_gesamtkostensatz = get_gesamtkostensatz(interview_cost_rate, interview_umlagesatz)

        psych_kostensatz = get_cost_rate(psych_tests, psych_cost)
        psych_umlagesatz = get_umlagesatz(psych_kostensatz, umlagesatz)
        psych_gesamtkostensatz = get_gesamtkostensatz(psych_kostensatz, psych_umlagesatz)

        return {
            # ===== Applications ===== 
            'application_amt': rcvd_applications,
            'application_cost': application_cost,
            'application_cost_rate': appl_kostensatz,
            'appl_umlagesatz': appl_umlagesatz,
            'appl_gesamt': appl_gesamtkostensatz,

            # ===== Interview ===== 
            'interview_amt': interviews,
            'interview_cost': int(interview_cost),
            'interview_cost_rate': interview_cost_rate,
            'interview_umlagesatz': interview_umlagesatz,
            'interview_gesamt': interview_gesamtkostensatz,

            # ===== Psychologische Tests ===== 
            'psych_amt': psych_tests,
            'psych_cost': psych_cost,
            'psych_cost_rate': psych_kostensatz,
            'psych_umlagesatz': psych_umlagesatz,
            'psych_gesamt': psych_gesamtkostensatz,

            # ===== Abteilungsleiter ===== 
            'abteilung_umlagesatz':umlagesatz

        }



    


    

if __name__ == '__main__': 
    data = ProzessKosten.generate_scenario()
    print(json.dumps(data, indent=2))