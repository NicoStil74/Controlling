from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from services.kennzahlen import KennzahlenService
from services.materialkosten import MaterialCostService

app = FastAPI(title="Learning App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

materialkosten_service = MaterialCostService()
kennzahlen_service = KennzahlenService()
@app.get("/materialkosten")
async def get_materialkosten():
    # Returns both table_data (formatted strings) and solutions (raw numbers)
    return materialkosten_service.get_full_package()

@app.get("/kennzahlen")
async def get_kennzahlen():
    return kennzahlen_service.get_package()

@app.get("/")
async def health_check():
    return {"Connected": True}

handler = Mangum(app)
