"use client"

import React, { useState, useEffect } from "react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Play, Pause, Trophy, TrendingUp, TrendingDown, Zap, AlertTriangle, Award } from "lucide-react"
import { API_CONFIG, buildApiUrl } from "@/lib/api-config"

interface CountryData {
  Año: number
  AEE_POM_kg_hab: number
  RAEE_generados_kg_hab: number
}

interface ComparisonMetrics {
  country: string
  avgAEE: number
  avgRAEE: number
  totalAEE: number
  totalRAEE: number
  efficiency: number
  cagr_aee: number
  cagr_raee: number
  score: number
}

interface VSComparisonPanelProps {
  leftCountries: Array<{ name: string; code: string }>
  rightCountries: Array<{ name: string; code: string }>
}

export function VSComparisonPanel({ leftCountries, rightCountries }: VSComparisonPanelProps) {
  const [leftData, setLeftData] = useState<Record<string, CountryData[]>>({})
  const [rightData, setRightData] = useState<Record<string, CountryData[]>>({})
  const [selectedYear, setSelectedYear] = useState(2019)
  const [isAnimating, setIsAnimating] = useState(false)
  const [leftMetrics, setLeftMetrics] = useState<ComparisonMetrics | null>(null)
  const [rightMetrics, setRightMetrics] = useState<ComparisonMetrics | null>(null)
  const [viewMode, setViewMode] = useState<"bars" | "heatmap" | "metrics">("bars")

  const years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]

  // Cargar datos de países
  useEffect(() => {
    const loadCountryData = async (countries: Array<{ name: string }>, setSide: (data: any) => void) => {
      const dataMap: Record<string, CountryData[]> = {}
      for (const country of countries) {
        try {
          const response = await fetch(buildApiUrl(API_CONFIG.endpoints.countryData(country.name)))
          const result = await response.json()
          dataMap[country.name] = result.data
        } catch (error) {
          console.error(`Error loading ${country.name}:`, error)
        }
      }
      setSide(dataMap)
    }

    if (leftCountries.length > 0) loadCountryData(leftCountries, setLeftData)
    if (rightCountries.length > 0) loadCountryData(rightCountries, setRightData)
  }, [leftCountries, rightCountries])

  // Calcular métricas avanzadas
  useEffect(() => {
    const calculateMetrics = (data: Record<string, CountryData[]>, countries: Array<{ name: string }>) => {
      if (countries.length === 0) return null

      let totalAEE = 0, totalRAEE = 0, totalYears = 0
      const allData: CountryData[] = []

      countries.forEach(country => {
        const countryData = data[country.name] || []
        allData.push(...countryData)
        countryData.forEach(d => {
          totalAEE += d.AEE_POM_kg_hab
          totalRAEE += d.RAEE_generados_kg_hab
          totalYears++
        })
      })

      const avgAEE = totalYears > 0 ? totalAEE / totalYears : 0
      const avgRAEE = totalYears > 0 ? totalRAEE / totalYears : 0
      const efficiency = avgAEE > 0 ? (avgRAEE / avgAEE) * 100 : 0

      // Calcular CAGR (Compound Annual Growth Rate)
      const firstYear = allData.filter(d => d.Año === 2009)
      const lastYear = allData.filter(d => d.Año === 2019)
      
      const initialAEE = firstYear.reduce((sum, d) => sum + d.AEE_POM_kg_hab, 0) / (firstYear.length || 1)
      const finalAEE = lastYear.reduce((sum, d) => sum + d.AEE_POM_kg_hab, 0) / (lastYear.length || 1)
      const initialRAEE = firstYear.reduce((sum, d) => sum + d.RAEE_generados_kg_hab, 0) / (firstYear.length || 1)
      const finalRAEE = lastYear.reduce((sum, d) => sum + d.RAEE_generados_kg_hab, 0) / (lastYear.length || 1)

      const cagr_aee = initialAEE > 0 ? ((Math.pow(finalAEE / initialAEE, 1/10) - 1) * 100) : 0
      const cagr_raee = initialRAEE > 0 ? ((Math.pow(finalRAEE / initialRAEE, 1/10) - 1) * 100) : 0

      // Sistema de puntuación (menor generación = mejor)
      const score = Math.max(0, 100 - avgRAEE * 5 + (efficiency < 80 ? 10 : 0))

      return {
        country: countries.map(c => c.name).join(" + "),
        avgAEE,
        avgRAEE,
        totalAEE,
        totalRAEE,
        efficiency,
        cagr_aee,
        cagr_raee,
        score
      }
    }

    setLeftMetrics(calculateMetrics(leftData, leftCountries))
    setRightMetrics(calculateMetrics(rightData, rightCountries))
  }, [leftData, rightData, leftCountries, rightCountries])

  // Animación automática de años
  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setSelectedYear(prev => {
        if (prev >= 2019) {
          setIsAnimating(false)
          return 2019
        }
        return prev + 1
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isAnimating])

  // Obtener datos del año seleccionado
  const getYearData = () => {
    const leftYearData = leftCountries.map(country => {
      const data = leftData[country.name]?.find(d => d.Año === selectedYear)
      return {
        country: country.name,
        AEE: data?.AEE_POM_kg_hab || 0,
        RAEE: data?.RAEE_generados_kg_hab || 0
      }
    })

    const rightYearData = rightCountries.map(country => {
      const data = rightData[country.name]?.find(d => d.Año === selectedYear)
      return {
        country: country.name,
        AEE: data?.AEE_POM_kg_hab || 0,
        RAEE: data?.RAEE_generados_kg_hab || 0
      }
    })

    return { left: leftYearData, right: rightYearData }
  }

  // Obtener insignias
  const getBadges = (metrics: ComparisonMetrics | null) => {
    if (!metrics) return []
    
    const badges = []
    if (metrics.avgRAEE < 5) badges.push({ icon: "🥇", text: "Mejor gestión de RAEE", color: "text-yellow-500" })
    if (metrics.cagr_raee < 0) badges.push({ icon: "⚡", text: "Reducción sostenida", color: "text-green-500" })
    if (metrics.efficiency < 70) badges.push({ icon: "🌟", text: "Alta eficiencia circular", color: "text-blue-500" })
    if (metrics.avgRAEE > 10) badges.push({ icon: "🚨", text: "Mayor riesgo ambiental", color: "text-red-500" })
    if (Math.abs(metrics.cagr_aee) > 5) badges.push({ icon: "📈", text: "Crecimiento acelerado", color: "text-orange-500" })
    
    return badges
  }

  // Función para obtener color de intensidad (estilo cod)
  const getIntensityColor = (value: number) => {
    if (value < 4) return "from-green-500 to-green-600"
    if (value < 7) return "from-yellow-500 to-yellow-600"
    if (value < 10) return "from-orange-500 to-orange-600"
    return "from-red-500 to-red-600"
  }

  const yearData = getYearData()

  if (leftCountries.length === 0 && rightCountries.length === 0) {
    return (
      <div className="gradient-card rounded-2xl border-2 border-border/30 p-12 text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-bold text-muted-foreground mb-2">
          Modo Comparación VS
        </h3>
        <p className="text-sm text-muted-foreground">
          Arrastra países a ambos lados para activar la comparación avanzada
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Control de navegación */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={() => setViewMode("bars")}
          className={`flex-1 px-4 py-3 text-sm font-bold transition-all rounded-full relative text-center ${
            viewMode === "bars"
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/50"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border-2 border-muted/50"
          }`}
        >
          Barras Comparativas
        </button>
        <button
          onClick={() => setViewMode("heatmap")}
          className={`flex-1 px-4 py-3 text-sm font-bold transition-all rounded-full relative text-center ${
            viewMode === "heatmap"
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/50"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border-2 border-muted/50"
          }`}
        >
          Mapa de Calor
        </button>
        <button
          onClick={() => setViewMode("metrics")}
          className={`flex-1 px-4 py-3 text-sm font-bold transition-all rounded-full relative text-center ${
            viewMode === "metrics"
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/50"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border-2 border-muted/50"
          }`}
        >
          Métricas Avanzadas
        </button>
      </div>

      {/* Vista de Barras Comparativas */}
      {viewMode === "bars" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-muted-foreground">Año de comparación:</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isAnimating) {
                    setIsAnimating(false)
                  } else {
                    setSelectedYear(2009)
                    setIsAnimating(true)
                  }
                }}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                {isAnimating ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-bold text-muted-foreground min-w-fit">2009</span>
                <input
                  type="range"
                  min={2009}
                  max={2019}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-primary to-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                />
                <span className="text-sm font-bold text-muted-foreground min-w-fit">{selectedYear}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex items-center gap-3 bg-gradient-to-r from-secondary/20 to-accent/20 px-6 py-3 rounded-full border-2 border-secondary/30">
                <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-xl font-black text-secondary">{selectedYear}</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-black text-foreground">Comparación Año</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-6 border-2 border-primary/30 shadow-lg">
                <h4 className="text-lg font-black text-primary mb-4">Análisis A</h4>
                <div className="space-y-4">
                  {yearData.left.map((data, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-foreground">{data.country}</span>
                        <span className="text-lg font-black text-primary">{data.RAEE.toFixed(1)} <span className="text-xs font-normal">kg/hab</span></span>
                      </div>
                      <div className="h-4 bg-background/50 rounded-lg overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-lg shadow-md transition-all duration-500"
                          style={{ width: `${Math.min((data.RAEE / 15) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-secondary/10 to-green-500/10 rounded-2xl p-6 border-2 border-secondary/30 shadow-lg">
                <h4 className="text-lg font-black text-secondary mb-4">Análisis B</h4>
                <div className="space-y-4">
                  {yearData.right.map((data, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-foreground">{data.country}</span>
                        <span className="text-lg font-black text-secondary">{data.RAEE.toFixed(1)} <span className="text-xs font-normal">kg/hab</span></span>
                      </div>
                      <div className="h-4 bg-background/50 rounded-lg overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-secondary to-green-400 rounded-lg shadow-md transition-all duration-500"
                          style={{ width: `${Math.min((data.RAEE / 15) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Promedio Análisis A</p>
              <p className="text-2xl font-black text-primary">
                {leftMetrics ? leftMetrics.avgRAEE.toFixed(1) : "0.0"} kg/hab
              </p>
            </div>
            <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
              <p className="text-xs text-muted-foreground mb-1">Promedio Análisis B</p>
              <p className="text-2xl font-black text-secondary">
                {rightMetrics ? rightMetrics.avgRAEE.toFixed(1) : "0.0"} kg/hab
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Mapa de Calor */}
      {viewMode === "heatmap" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-muted-foreground">Año de comparación:</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isAnimating) {
                    setIsAnimating(false)
                  } else {
                    setSelectedYear(2009)
                    setIsAnimating(true)
                  }
                }}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                {isAnimating ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-bold text-muted-foreground min-w-fit">2009</span>
                <input
                  type="range"
                  min={2009}
                  max={2019}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-primary to-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                />
                <span className="text-sm font-bold text-muted-foreground min-w-fit">{selectedYear}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex items-center gap-3 bg-gradient-to-r from-secondary/20 to-accent/20 px-6 py-3 rounded-full border-2 border-secondary/30">
                <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-xl font-black text-secondary">{selectedYear}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground">Mapa Dinamico de Comparación</h3>
            <p className="text-sm text-muted-foreground mt-2">Visualiza la intensidad de RAEE generados por país</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-black text-primary mb-4">Análisis A</h4>
              <div className="grid grid-cols-2 gap-3">
                {leftCountries.map((country) => {
                  const data = leftData[country.name]?.find(d => d.Año === selectedYear)
                  const raee = data?.RAEE_generados_kg_hab || 0
                  return (
                    <div key={country.name} className={`p-4 rounded-xl bg-gradient-to-br ${getIntensityColor(raee)} text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
                      <h5 className="font-bold text-sm mb-2">{country.name}</h5>
                      <p className="text-2xl font-black">{raee.toFixed(1)}</p>
                      <p className="text-xs opacity-90">kg/hab</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black text-secondary mb-4">Análisis B</h4>
              <div className="grid grid-cols-2 gap-3">
                {rightCountries.map((country) => {
                  const data = rightData[country.name]?.find(d => d.Año === selectedYear)
                  const raee = data?.RAEE_generados_kg_hab || 0
                  return (
                    <div key={country.name} className={`p-4 rounded-xl bg-gradient-to-br ${getIntensityColor(raee)} text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
                      <h5 className="font-bold text-sm mb-2">{country.name}</h5>
                      <p className="text-2xl font-black">{raee.toFixed(1)}</p>
                      <p className="text-xs opacity-90">kg/hab</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="bg-card border-2 border-border rounded-xl p-4">
            <h4 className="text-sm font-bold mb-3">Leyenda de Intensidad</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
                <span className="text-xs">Baja (&lt;4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-500 to-yellow-600"></div>
                <span className="text-xs">Media (4-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-600"></div>
                <span className="text-xs">Alta (7-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
                <span className="text-xs">Muy alta (&gt;10)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Métricas Avanzadas */}
      {viewMode === "metrics" && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-foreground">Título</h3>
          <div className="grid grid-cols-2 gap-6">
            {leftMetrics && (
              <div className="space-y-4">
                <h4 className="text-lg font-black text-primary mb-4">Análisis A</h4>
                <div className="space-y-3 bg-card rounded-xl p-6 border-2 border-primary/30">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Eficiencia circular</span>
                    <span className="text-xl font-black text-primary">{leftMetrics.efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">CAGR RAEE</span>
                    <span className={`text-xl font-black ${leftMetrics.cagr_raee > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {leftMetrics.cagr_raee > 0 ? '+' : ''}{leftMetrics.cagr_raee.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Promedio RAEE</span>
                    <span className="text-xl font-black text-primary">{leftMetrics.avgRAEE.toFixed(2)} kg/hab</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">CAGR AEE</span>
                    <span className="text-xl font-black text-primary">{leftMetrics.cagr_aee.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-6 border-2 border-primary/30">
                  <h5 className="text-sm font-bold mb-3">Insignias</h5>
                  <div className="flex flex-wrap gap-2">
                    {getBadges(leftMetrics).map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                        <span>{badge.icon}</span>
                        <span className="text-xs font-bold">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {rightMetrics && (
              <div className="space-y-4">
                <h4 className="text-lg font-black text-secondary mb-4">Análisis B</h4>
                <div className="space-y-3 bg-card rounded-xl p-6 border-2 border-secondary/30">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Eficiencia circular</span>
                    <span className="text-xl font-black text-secondary">{rightMetrics.efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">CAGR RAEE</span>
                    <span className={`text-xl font-black ${rightMetrics.cagr_raee > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {rightMetrics.cagr_raee > 0 ? '+' : ''}{rightMetrics.cagr_raee.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Promedio RAEE</span>
                    <span className="text-xl font-black text-secondary">{rightMetrics.avgRAEE.toFixed(2)} kg/hab</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">CAGR AEE</span>
                    <span className="text-xl font-black text-secondary">{rightMetrics.cagr_aee.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-6 border-2 border-secondary/30">
                  <h5 className="text-sm font-bold mb-3">Insignias</h5>
                  <div className="flex flex-wrap gap-2">
                    {getBadges(rightMetrics).map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-accent/20 border border-secondary/30">
                        <span>{badge.icon}</span>
                        <span className="text-xs font-bold">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
