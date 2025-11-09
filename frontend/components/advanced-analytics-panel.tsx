"use client"

import React, { useState, useEffect } from "react"
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, BarChart3, Award, GitCompare, Map, ChevronDown } from "lucide-react"
import { API_CONFIG, buildApiUrl } from "@/lib/api-config"

interface CountryData {
  Pais: string
  Año: number
  AEE_POM_kg_hab: number
  RAEE_generados_kg_hab: number
}

interface CountryStats {
  country: string
  avg_aee: number
  avg_raee: number
  max_aee: number
  max_raee: number
  growth_rate_aee: number
  growth_rate_raee: number
}

export function AdvancedAnalyticsPanel() {
  const [allData, setAllData] = useState<CountryData[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"timeline" | "comparison" | "ranking" | "correlation" | "map">("timeline")
  const [selectedYear, setSelectedYear] = useState<number>(2019)
  const [rankingMetric, setRankingMetric] = useState<"aee" | "raee">("raee")

  // Cargar todos los datos al iniciar
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        // Primero obtener la lista de países
        const countriesResponse = await fetch(buildApiUrl(API_CONFIG.endpoints.countries))
        const countriesData = await countriesResponse.json()
        const countries = countriesData.countries
        setAvailableCountries(countries)

        // Cargar datos de todos los países
        const dataPromises = countries.map(async (country: string) => {
          try {
            const response = await fetch(buildApiUrl(API_CONFIG.endpoints.countryData(country)))
            const data = await response.json()
            return data.data.map((record: any) => ({
              Pais: country,
              Año: record.Año,
              AEE_POM_kg_hab: record.AEE_POM_kg_hab,
              RAEE_generados_kg_hab: record.RAEE_generados_kg_hab
            }))
          } catch (error) {
            console.error(`Error loading data for ${country}:`, error)
            return []
          }
        })

        const results = await Promise.all(dataPromises)
        const flatData = results.flat()
        setAllData(flatData)
        
        // Seleccionar algunos países por defecto
        setSelectedCountries(countries.slice(0, 3))
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Preparar datos para gráfico de línea temporal
  const getTimelineData = () => {
    if (selectedCountries.length === 0) return []
    
    const years = Array.from(new Set(allData.map(d => d.Año))).sort()
    return years.map(year => {
      const yearData: any = { year }
      selectedCountries.forEach(country => {
        const countryYearData = allData.find(d => d.Pais === country && d.Año === year)
        if (countryYearData) {
          yearData[`${country}_AEE`] = countryYearData.AEE_POM_kg_hab
          yearData[`${country}_RAEE`] = countryYearData.RAEE_generados_kg_hab
        }
      })
      return yearData
    })
  }

  // Preparar datos para barras comparativas
  const getComparisonData = () => {
    return selectedCountries.map(country => {
      const countryData = allData.filter(d => d.Pais === country)
      const avg_aee = countryData.reduce((sum, d) => sum + d.AEE_POM_kg_hab, 0) / countryData.length
      const avg_raee = countryData.reduce((sum, d) => sum + d.RAEE_generados_kg_hab, 0) / countryData.length
      return {
        country,
        avg_aee: parseFloat(avg_aee.toFixed(2)),
        avg_raee: parseFloat(avg_raee.toFixed(2))
      }
    })
  }

  // Preparar datos para ranking
  const getRankingData = () => {
    const yearData = allData.filter(d => d.Año === selectedYear)
    const sorted = [...yearData].sort((a, b) => {
      if (rankingMetric === "aee") {
        return b.AEE_POM_kg_hab - a.AEE_POM_kg_hab
      }
      return b.RAEE_generados_kg_hab - a.RAEE_generados_kg_hab
    })
    return sorted
  }

  // Preparar datos para scatter plot (correlación)
  const getCorrelationData = () => {
    return allData.map(d => ({
      x: d.AEE_POM_kg_hab,
      y: d.RAEE_generados_kg_hab,
      country: d.Pais,
      year: d.Año
    }))
  }

  // Calcular intensidad de color para mapa
  const getCountryIntensity = (country: string) => {
    const countryData = allData.filter(d => d.Pais === country && d.Año === selectedYear)
    if (countryData.length === 0) return 0
    const raee = countryData[0].RAEE_generados_kg_hab
    const maxRaee = Math.max(...allData.filter(d => d.Año === selectedYear).map(d => d.RAEE_generados_kg_hab))
    return (raee / maxRaee) * 100
  }

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        {/* Header con selector de países */}
        <div className="gradient-card rounded-2xl border-2 border-border/30 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Análisis Avanzado de Datos
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Visualizaciones dinámicas de AEE POM y RAEE generados (2009-2019)
              </p>
            </div>
          </div>

          {/* Selector de países */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Países seleccionados para análisis:</label>
            <div className="flex flex-wrap gap-2">
              {availableCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    if (selectedCountries.includes(country)) {
                      setSelectedCountries(selectedCountries.filter(c => c !== country))
                    } else {
                      setSelectedCountries([...selectedCountries, country])
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCountries.includes(country)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navegación de vistas */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveView("timeline")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeView === "timeline"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-card border-2 border-border hover:border-primary text-foreground"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Línea Temporal
          </button>
          <button
            onClick={() => setActiveView("comparison")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeView === "comparison"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                : "bg-card border-2 border-border hover:border-primary text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Comparación
          </button>
          <button
            onClick={() => setActiveView("ranking")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeView === "ranking"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                : "bg-card border-2 border-border hover:border-primary text-foreground"
            }`}
          >
            <Award className="w-4 h-4" />
            Ranking
          </button>
          <button
            onClick={() => setActiveView("correlation")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeView === "correlation"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-card border-2 border-border hover:border-primary text-foreground"
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Correlación
          </button>
          <button
            onClick={() => setActiveView("map")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeView === "map"
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                : "bg-card border-2 border-border hover:border-primary text-foreground"
            }`}
          >
            <Map className="w-4 h-4" />
            Mapa Interactivo
          </button>
        </div>

        {/* Vista: Línea Temporal */}
        {activeView === "timeline" && (
          <div className="gradient-card rounded-2xl border-2 border-border/30 p-6 shadow-xl">
            <h3 className="text-xl font-black text-foreground mb-4">
              📈 Evolución Temporal (2009-2019)
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tendencias de AEE POM y RAEE generados para los países seleccionados
            </p>
            {selectedCountries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Selecciona al menos un país para ver el gráfico
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getTimelineData()}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'kg/hab', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Legend />
                  {selectedCountries.map((country, index) => (
                    <React.Fragment key={country}>
                      <Line 
                        type="monotone" 
                        dataKey={`${country}_AEE`} 
                        stroke={colors[index % colors.length]} 
                        strokeWidth={2}
                        name={`${country} - AEE POM`}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={`${country}_RAEE`} 
                        stroke={colors[index % colors.length]} 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name={`${country} - RAEE`}
                        dot={{ r: 3 }}
                      />
                    </React.Fragment>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Vista: Comparación */}
        {activeView === "comparison" && (
          <div className="gradient-card rounded-2xl border-2 border-border/30 p-6 shadow-xl">
            <h3 className="text-xl font-black text-foreground mb-4">
              Comparación de Promedios (2009-2019)
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Promedios históricos de AEE POM y RAEE generados por país
            </p>
            {selectedCountries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Selecciona al menos un país para ver el gráfico
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getComparisonData()}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="country" />
                  <YAxis label={{ value: 'kg/hab', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="avg_aee" fill="#3b82f6" name="AEE POM (promedio)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="avg_raee" fill="#10b981" name="RAEE Generados (promedio)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Vista: Ranking */}
        {activeView === "ranking" && (
          <div className="gradient-card rounded-2xl border-2 border-border/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-foreground mb-1">
                  🥇 Ranking de Países
                </h3>
                <p className="text-sm text-muted-foreground">
                  Clasificación por generación de residuos electrónicos
                </p>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg border-2 border-border bg-card text-foreground font-medium"
                >
                  {[2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  value={rankingMetric}
                  onChange={(e) => setRankingMetric(e.target.value as "aee" | "raee")}
                  className="px-3 py-2 rounded-lg border-2 border-border bg-card text-foreground font-medium"
                >
                  <option value="raee">RAEE Generados</option>
                  <option value="aee">AEE POM</option>
                </select>
              </div>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {getRankingData().map((item, index) => {
                const value = rankingMetric === "aee" ? item.AEE_POM_kg_hab : item.RAEE_generados_kg_hab
                const maxValue = Math.max(...getRankingData().map(d => rankingMetric === "aee" ? d.AEE_POM_kg_hab : d.RAEE_generados_kg_hab))
                const percentage = (value / maxValue) * 100

                return (
                  <div key={item.Pais} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg" 
                         style={{ width: `${percentage}%` }} 
                    />
                    <div className="relative flex items-center justify-between p-4 rounded-lg border-2 border-border/50 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-4">
                        <span className={`text-2xl font-black ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          index === 2 ? 'text-orange-600' : 
                          'text-muted-foreground'
                        }`}>
                          #{index + 1}
                        </span>
                        <span className="font-bold text-foreground">{item.Pais}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-primary">{value.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">kg/hab</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Vista: Correlación */}
        {activeView === "correlation" && (
          <div className="gradient-card rounded-2xl border-2 border-border/30 p-6 shadow-xl">
            <h3 className="text-xl font-black text-foreground mb-4">
              🔄 Correlación AEE POM vs RAEE Generados
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Relación entre equipos puestos en mercado y residuos generados (todos los años)
            </p>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="AEE POM" 
                  label={{ value: 'AEE POM (kg/hab)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="RAEE" 
                  label={{ value: 'RAEE Generados (kg/hab)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-black/90 p-3 rounded-lg border border-primary/30">
                          <p className="font-bold text-white">{data.country}</p>
                          <p className="text-xs text-gray-300">Año: {data.year}</p>
                          <p className="text-sm text-blue-400">AEE POM: {data.x.toFixed(2)} kg/hab</p>
                          <p className="text-sm text-green-400">RAEE: {data.y.toFixed(2)} kg/hab</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter name="Todos los países" data={getCorrelationData()} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Vista: Mapa Interactivo */}
        {activeView === "map" && (
          <div className="gradient-card rounded-2xl border-2 border-border/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-foreground mb-1">
                Mapa Interactivo de Latinoamérica
                </h3>
                <p className="text-sm text-muted-foreground">
                  Intensidad de generación de RAEE por país
                </p>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border-2 border-border bg-card text-foreground font-medium"
              >
                {[2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Grid de países como "mapa" */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableCountries.map((country) => {
                const countryData = allData.find(d => d.Pais === country && d.Año === selectedYear)
                const intensity = getCountryIntensity(country)
                const raee = countryData?.RAEE_generados_kg_hab || 0
                const aee = countryData?.AEE_POM_kg_hab || 0

                return (
                  <div
                    key={country}
                    onClick={() => {
                      if (selectedCountries.includes(country)) {
                        setSelectedCountries(selectedCountries.filter(c => c !== country))
                      } else {
                        setSelectedCountries([...selectedCountries, country])
                      }
                    }}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedCountries.includes(country)
                        ? "border-primary shadow-lg shadow-primary/30 scale-105"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, rgba(239, 68, 68, ${intensity / 100}) 0%, rgba(59, 130, 246, ${intensity / 200}) 100%)`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-foreground text-sm">{country}</h4>
                      <span className="text-xs font-bold px-2 py-1 bg-background/80 rounded-md">
                        {selectedYear}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">AEE POM:</span>
                        <span className="font-bold text-blue-600">{aee.toFixed(1)} kg/hab</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">RAEE:</span>
                        <span className="font-bold text-red-600">{raee.toFixed(1)} kg/hab</span>
                      </div>
                    </div>
                    {/* Barra de intensidad */}
                    <div className="mt-3 h-2 bg-background/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${intensity}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Leyenda */}
            <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Intensidad de RAEE generados:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500/30 to-red-500/30"></div>
                    <span className="text-xs text-muted-foreground">Bajo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-red-500/70 to-red-500"></div>
                    <span className="text-xs text-muted-foreground">Alto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
