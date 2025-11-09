from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from backend.utils.validations import *
import pandas as pd
from pathlib import Path
from typing import List, Optional

app = FastAPI(
    title="COAFINA API",
    description="API para datos de AEE, POM y RAEE en Latinoamérica",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta al archivo CSV
DATA_PATH = Path(__file__).parent / "data" / "datos_aee_pom_raee_latinoamerica.csv"

# Cargar datos al iniciar
df = None

def load_data():
    """Cargar datos CSV al iniciar la aplicación"""
    global df
    try:
        df = pd.read_csv(DATA_PATH)
        # Limpiar nombres de columnas y espacios
        df.columns = df.columns.str.strip()
        df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
        print(f"✅ Datos cargados: {len(df)} registros")
        print(f"Columnas: {df.columns.tolist()}")
    except Exception as e:
        print(f"❌ Error cargando datos: {e}")

# Cargar datos inmediatamente
load_data()


@app.get("/")
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "COAFINA API - Datos de residuos electrónicos en Latinoamérica",
        "version": "1.0.0",
        "endpoints": {
            "GET /": "Información de la API",
            "GET /health": "Estado de la API",
            "GET /data": "Obtener todos los datos",
            "GET /data/countries": "Lista de países disponibles",
            "GET /data/country/{country}": "Datos de un país específico",
            "GET /data/year/{year}": "Datos de un año específico",
            "GET /data/stats": "Estadísticas generales",
            "GET /data/comparison": "Comparar países por año"
        }
    }


@app.get("/health")
async def health_check():
    """Verificar el estado de la API"""
    return {
        "status": "healthy",
        "data_loaded": df is not None,
        "total_records": len(df) if df is not None else 0
    }


@app.get("/data")
async def get_all_data(
    skip: int = 0,
    limit: int = 100,
    country: Optional[str] = None,
    year: Optional[int] = None
):
    """
    Obtener todos los datos con paginación y filtros opcionales

    - **skip**: Número de registros a saltar (default: 0)
    - **limit**: Número máximo de registros a retornar (default: 100)
    - **country**: Filtrar por país (opcional)
    - **year**: Filtrar por año (opcional)
    """
    if df is None:
        raise HTTPException(status_code=500, detail="Datos no cargados")

    filtered_df = df.copy()

    # Aplicar filtros
    if country:
        filtered_df = filtered_df[filtered_df['Pais'].str.lower() == country.lower()]

    if year:
        filtered_df = filtered_df[filtered_df['Año'] == year]

    # Paginación
    total = len(filtered_df)
    data = filtered_df.iloc[skip:skip + limit].to_dict(orient="records")

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": data
    }


@app.get("/data/countries")
async def get_countries():
    """Obtener lista de países disponibles"""
    if df is None:
        raise HTTPException(status_code=500, detail="Datos no cargados")

    countries = sorted(df['Pais'].unique().tolist())

    return {
        "total": len(countries),
        "countries": countries
    }


@app.get("/data/country/{country}")
async def get_country_data(country: str):
    """
    Obtener todos los datos de un país específico

    - **country**: Nombre del país
    """
    if df is None:
        raise HTTPException(status_code=500, detail="Datos no cargados")

    country_df = df[df['Pais'].str.lower() == country.lower()]

    if country_df.empty:
        raise HTTPException(status_code=404, detail=f"País '{country}' no encontrado")

    return {
        "country": country,
        "total_records": len(country_df),
        "data": country_df.to_dict(orient="records")
    }


@app.get("/data/year/{year}")
async def get_year_data(year: int):
    """
    Obtener datos de todos los países para un año específico

    - **year**: Año
    """
    if df is None:
        raise HTTPException(status_code=500, detail="Datos no cargados")

    year_df = df[df['Año'] == year]

    if year_df.empty:
        raise HTTPException(status_code=404, detail=f"No hay datos para el año {year}")

    return {
        "year": year,
        "total_countries": len(year_df),
        "data": year_df.to_dict(orient="records")
    }


@app.get("/data/stats")
async def get_statistics():
    """Obtener estadísticas generales de los datos"""
    if df is None:
        raise HTTPException(status_code=500, detail="Datos no cargados")

    return {
        "total_records": len(df),
        "countries": {
            "total": df['Pais'].nunique(),
            "list": sorted(df['Pais'].unique().tolist())
        },
        "years": {
            "min": int(df['Año'].min()),
            "max": int(df['Año'].max()),
            "range": sorted(df['Año'].unique().tolist())
        },
        "aee_pom": {
            "mean": float(df['AEE_POM_kg_hab'].mean()),
            "min": float(df['AEE_POM_kg_hab'].min()),
            "max": float(df['AEE_POM_kg_hab'].max())
        },
        "raee_generados": {
            "mean": float(df['RAEE_generados_kg_hab'].mean()),
            "min": float(df['RAEE_generados_kg_hab'].min()),
            "max": float(df['RAEE_generados_kg_hab'].max())
        }
    }


@app.get("/data/comparison")
async def compare_countries(
    countries: str,
    year: Optional[int] = None
):
    """
    Comparar múltiples países

    - **countries**: Países separados por comas (ej: "Colombia,Mexico,Brasil")
    - **year**: Año específico (opcional, si no se proporciona devuelve todos los años)
    """
    if df is None:
        raise HTTPException(status_code=500, detail="Datos no cargados")

    # Separar países
    country_list = [c.strip() for c in countries.split(',')]

    # Filtrar datos
    filtered_df = df[df['Pais'].str.lower().isin([c.lower() for c in country_list])]

    if year:
        filtered_df = filtered_df[filtered_df['Año'] == year]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No se encontraron datos para la comparación")

    # Agrupar por país
    comparison = {}
    for country in country_list:
        country_data = filtered_df[filtered_df['Pais'].str.lower() == country.lower()]
        if not country_data.empty:
            comparison[country] = {
                "total_records": len(country_data),
                "aee_pom_avg": float(country_data['AEE_POM_kg_hab'].mean()),
                "raee_generados_avg": float(country_data['RAEE_generados_kg_hab'].mean()),
                "data": country_data.to_dict(orient="records")
            }

    return {
        "countries": country_list,
        "year": year,
        "comparison": comparison
    }

@app.post("/upload-csv")
def is_valid_csv(file: UploadFile) -> tuple[bool, str]:
    """Valida CSV subido con FastAPI, detectando correctamente el delimitador."""
    try:
        sample_bytes = file.file.read(4096)
        try:
            sample_text = sample_bytes.decode("utf-8-sig")
        except UnicodeDecodeError:
            return False, "Archivo no codificado en UTF-8 o con errores de formato."

        # Detectar delimitador confiable
        delimiter = detect_delimiter(sample_text)

        # Leer todo el contenido
        file.file.seek(0)
        decoded_text = file.file.read().decode("utf-8-sig")
        reader = csv.reader(io.StringIO(decoded_text), delimiter=delimiter)
        headers = next(reader)
        columnas_normalizadas = [normalizar_columna(c) for c in headers]

        valido_nombre, mensaje_nombre = validar_nombres(file.filename, headers)
        if not valido_nombre:
            return False, mensaje_nombre

        columnas_reconocidas = set(filter(None, columnas_normalizadas))
        if len(columnas_reconocidas) < 2:
            return False, "El CSV no contiene suficientes columnas reconocidas para validarlo."

        return True, f"CSV válido. Delimitador detectado: '{delimiter}'"

    except Exception as e:
        return False, f"Error al validar CSV: {e}"
    finally:
        file.file.seek(0)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
