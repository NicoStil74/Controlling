from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.kennzahlen import KennzahlenService
from services.materialkosten import MaterialCostService
from services.prozesskosten import ProzessKosten

app = FastAPI(title="Learning App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

materialkosten_service = MaterialCostService()
kennzahlen_service = KennzahlenService()

@app.get("/api/materialkosten")
@app.get("/materialkosten")
async def get_materialkosten():
    # Returns both table_data (formatted strings) and solutions (raw numbers)
    return materialkosten_service.get_full_package()

@app.get("/api/kennzahlen")
@app.get("/kennzahlen")
async def get_kennzahlen():
    return kennzahlen_service.get_package1()

@app.get("/api/kennzahlen2")
@app.get("/kennzahlen2")
async def get_kennzahlen2():
    return kennzahlen_service.get_package2()

@app.get("/api/kennzahlen3")
@app.get("/kennzahlen3")
async def get_kennzahlen3():
    return kennzahlen_service.get_package3()

@app.get("/api/prozesskosten")
@app.get("/prozesskosten")
async def get_prozesskosten():
    return ProzessKosten.generate_scenario()

@app.get("/")
async def health_check():
    return {"Connected": True}
