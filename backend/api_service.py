from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.materialkosten import MaterialCostService

app = FastAPI(title="Learning App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

service = MaterialCostService()

@app.get("/api/materialkosten")
async def get_materialkosten():
    return service.get_full_package()
