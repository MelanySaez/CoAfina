// Interfaces para el manejo de países y métricas

export interface CountryPlacement {
  id: string
  name: string
  flag: string
  code: string
  side: "left" | "right" | null
}

export interface CountryMetrics {
  aee_pom_avg: number
  raee_generados_avg: number
}

export interface CountryData {
  Pais: string
  Año: number
  AEE_POM_kg_hab: number
  RAEE_generados_kg_hab: number
}

export interface ApiCountryResponse {
  country: string
  total_records: number
  data: CountryData[]
}

export interface ApiCountriesResponse {
  total: number
  countries: string[]
}
