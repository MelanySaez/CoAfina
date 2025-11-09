import csv
import difflib
import re
import io


COLUMNAS_VARIACIONES = {
    "pais": ["pais", "país", "country", "nation", "nacion"],
    "anio": ["año", "anio", "year", "yr"],
    "categoria": ["categoria", "categoría", "category", "type", "tipo", "waste_type"],
    "cantidad_total_toneladas": ["cantidad_total", "cantidad (ton)", "cantidad_total_toneladas",
                                 "total_tons", "total_weight", "amount", "quantity", "toneladas_totales"],
    "recolectado_toneladas": ["recolectado", "recolectado_toneladas", "collected_tons", "collected", "recogido"],
    "tratado_toneladas": ["tratado", "tratado_toneladas", "treated_tons", "processed_tons", "tratamiento"],
    "reciclado_toneladas": ["reciclado", "recycled_tons", "reciclado_toneladas", "recycling"],
    "poblacion": ["poblacion", "population", "habitantes", "inhabitants"],
    "ewaste_per_capita": ["ewaste_per_capita", "ewaste_pc", "ewaste/hab", "ewaste_pc_kg", "kg_per_capita", "kg_persona"],
    "fuente": ["fuente", "source", "data_source"],
    "region": ["region", "región", "area", "zone", "continent"],
    "codigo_pais": ["codigo_pais", "country_code", "iso", "iso3", "iso_code"],
}

LATAM_COUNTRIES = [
    "argentina", "bolivia", "brasil", "brasilia", "chile", "colombia", "costa_rica",
    "cuba", "ecuador", "el_salvador", "guatemala", "haiti", "honduras",
    "mexico", "nicaragua", "panama", "paraguay", "peru", "puerto_rico",
    "republica_dominicana", "uruguay", "venezuela"
]

def normalizar_columna(col):
    """Devuelve el nombre estandarizado de una columna según sus variaciones"""
    col_lower = col.lower().strip()

    for canonica, variaciones in COLUMNAS_VARIACIONES.items():
        if col_lower in variaciones:
            return canonica
        
        similar = difflib.get_close_matches(col_lower, variaciones, n=1, cutoff=0.7)
        if similar:
            return canonica

    return None


def mapear_columnas(columnas_encontradas):
    """Crea un mapeo entre columnas del CSV y sus nombres normalizados"""
    mapping = {}
    for col in columnas_encontradas:
        canonica = normalizar_columna(col)
        mapping[col] = canonica
    return mapping


def validar_nombres(file_name: str, columnas: list[str]) -> tuple[bool, str]:
    """
    Valida que el nombre del archivo tenga país o 'global', y año.
    Además, si es 'global', debe existir columna relacionada a país.
    """
    nombre = file_name.lower().replace("-", "_").replace(" ", "_")

    # Verificar si contiene un país o la palabra "global"
    contiene_pais = any(pais in nombre for pais in LATAM_COUNTRIES)
    es_global = any(term in nombre for term in ['global', 'latinoamerica', 'latam', 'america_latina', 'latin_america'])
 

    if not contiene_pais and not es_global:
        return False, "El nombre del archivo no contiene ningún país de Latinoamérica ni la palabra 'global'."

    # Si es "global", debe tener columna de país
    if es_global:
        columnas_normalizadas = [normalizar_columna(c) for c in columnas]
        if "pais" not in columnas_normalizadas:
            return False, "El archivo global debe contener una columna relacionada a país."

    # Buscar un año (4 dígitos entre 1900 y 2100)
    tiene_anio = re.search(r"\b(19[5-9]\d|20\d{2}|2100)\b", nombre)

    if not tiene_anio:
        columnas_normalizadas = [normalizar_columna(c) for c in columnas]
        if "anio" not in columnas_normalizadas:
            return False, "El nombre del archivo no tiene un año y tampoco existe una columna de año."

    return True, "Nombre válido."


def detect_delimiter(sample_text: str) -> str:
    """Detecta el delimitador evitando confusiones con puntos decimales."""
    candidates = [",", ";", "\t", "|", " "]
    sniffer = csv.Sniffer()

    try:
        dialect = sniffer.sniff(sample_text, delimiters=candidates)
        delimiter = dialect.delimiter
    except csv.Error:
        delimiter = ","

    # Validación extra: si el delimitador genera solo 1 campo → probar otro
    reader = csv.reader(io.StringIO(sample_text), delimiter=delimiter)
    first_row = next(reader, [])
    if len(first_row) <= 1:
        for alt in candidates:
            reader = csv.reader(io.StringIO(sample_text), delimiter=alt)
            first_row = next(reader, [])
            if len(first_row) > 1:
                return alt
    return delimiter

def is_valid_csv(file_path: str) -> tuple[bool, str]:
    """
    Verifica si el archivo CSV es coherente:
      - Si el nombre contiene un país, no se exige columna de país.
      - Si el nombre dice 'global', debe tener columna de país.
      - Si el nombre no tiene año, debe haber columna de año.
    No hay columnas fijas obligatorias.
    """
    try:
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader)
            columnas_normalizadas = [normalizar_columna(c) for c in headers]

        # Validar coherencia entre nombre y columnas
        valido_nombre, mensaje_nombre = validar_nombres(file_path.split("/")[-1], headers)
        if not valido_nombre:
            return False, mensaje_nombre

        # Validar que haya al menos algunas columnas de interés reconocibles
        columnas_reconocidas = set(filter(None, columnas_normalizadas))
        if len(columnas_reconocidas) < 2:
            return False, "El CSV no contiene suficientes columnas reconocidas para validarlo."

        # Si pasó todas las verificaciones anteriores
        return True, "CSV válido y coherente."

    except UnicodeDecodeError:
        return False, "Error: El archivo no está en formato UTF-8 o está dañado."
    except StopIteration:
        return False, "Error: El archivo CSV está vacío o no tiene encabezados."
    except Exception as e:
        return False, f"Error al validar CSV: {str(e)}"

if __name__ == "__main__":
    # Ejemplo de uso
    archivo_ejemplo = "C:\\Users\\Gsus\\Desktop\\Prog\\CoAfinia\\CoAfina\\backend\\data\\datos_aee_pom_raee_latinoamerica.csv"
    valido, mensaje = is_valid_csv(archivo_ejemplo)
    print(f"Validación de '{archivo_ejemplo}': {mensaje}")