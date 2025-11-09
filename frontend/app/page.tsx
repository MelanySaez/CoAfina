"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { DataPanelTab } from "@/components/data-panel-tab"
import { FlagIcon } from "@/components/flag-icon"
import { VSComparisonPanel } from "@/components/vs-comparison-panel"
import { API_CONFIG, buildApiUrl } from "@/lib/api-config"
import type { CountryPlacement, CountryMetrics } from "@/utils/interfaces"
import { getCountryCode, getCountryFlag } from "@/utils/helpers"

export default function Home() {
  const [activeTab, setActiveTab] = useState("comparison")
  const [countries, setCountries] = useState<CountryPlacement[]>([])
  const [draggedCountry, setDraggedCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countryMetrics, setCountryMetrics] = useState<Record<string, CountryMetrics>>({})
  const carouselRef = useRef<HTMLDivElement>(null)

  // Funciones para controlar el scroll del carrusel
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Función para reiniciar el estado (devolver todos los países al carrusel)
  const resetCountries = () => {
    setCountries(countries.map((country) => ({ ...country, side: null })))
  }

  // Cargar países desde la API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const response = await fetch(buildApiUrl(API_CONFIG.endpoints.countries))
        if (!response.ok) {
          throw new Error("Error al cargar los países")
        }
        const data = await response.json()

        // Transformar los países de la API al formato necesario
        const transformedCountries: CountryPlacement[] = data.countries.map((countryName: string, index: number) => ({
          id: (index + 1).toString(),
          name: countryName,
          code: getCountryCode(countryName),
          flag: getCountryFlag(countryName),
          side: null,
        }))

        setCountries(transformedCountries)
        setError(null)
      } catch (err) {
        console.error("Error fetching countries:", err)
        setError("No se pudieron cargar los países. Verifica que el backend esté ejecutándose.")
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Cargar métricas desde la API para cada país
  useEffect(() => {
    const fetchMetrics = async () => {
      if (countries.length === 0) return

      try {
        const metricsPromises = countries.map(async (country) => {
          try {
            const response = await fetch(buildApiUrl(API_CONFIG.endpoints.countryData(country.name)))
            if (!response.ok) return null
            const data = await response.json()

            // Calcular promedios de las métricas
            const totalRecords = data.data.length
            if (totalRecords === 0) return null

            const aee_pom_avg = data.data.reduce((sum: number, record: any) => sum + record.AEE_POM_kg_hab, 0) / totalRecords
            const raee_generados_avg = data.data.reduce((sum: number, record: any) => sum + record.RAEE_generados_kg_hab, 0) / totalRecords

            return {
              countryName: country.name,
              metrics: { aee_pom_avg, raee_generados_avg }
            }
          } catch (err) {
            console.error(`Error fetching metrics for ${country.name}:`, err)
            return null
          }
        })

        const results = await Promise.all(metricsPromises)
        const metricsMap: Record<string, CountryMetrics> = {}

        results.forEach((result) => {
          if (result) {
            metricsMap[result.countryName] = result.metrics
          }
        })

        setCountryMetrics(metricsMap)
      } catch (err) {
        console.error("Error fetching metrics:", err)
      }
    }

    fetchMetrics()
  }, [countries])

  const leftCountries = countries.filter((c) => c.side === "left")
  const rightCountries = countries.filter((c) => c.side === "right")
  const unplacedCountries = countries.filter((c) => c.side === null)

  const calculateMetrics = (countriesSide: CountryPlacement[]) => {
    const metrics = { aee_pom: 0, raee_generados: 0 }
    countriesSide.forEach((country) => {
      if (countryMetrics[country.name]) {
        metrics.aee_pom += countryMetrics[country.name].aee_pom_avg
        metrics.raee_generados += countryMetrics[country.name].raee_generados_avg
      }
    })
    return metrics
  }

  const leftMetrics = calculateMetrics(leftCountries)
  const rightMetrics = calculateMetrics(rightCountries)

  const handleDragStart = (e: React.DragEvent, countryId: string) => {
    setDraggedCountry(countryId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropOnSide = (side: "left" | "right") => {
    if (!draggedCountry) return
    setCountries(countries.map((c) => (c.id === draggedCountry ? { ...c, side } : c)))
    setDraggedCountry(null)
  }

  const handleDropOnUnplaced = () => {
    if (!draggedCountry) return
    setCountries(countries.map((c) => (c.id === draggedCountry ? { ...c, side: null } : c)))
    setDraggedCountry(null)
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Header />

      {/* Pestañas */}
      <div className="border-b-2 border-border/50 bg-gradient-to-r from-card/30 via-card/50 to-card/30 backdrop-blur-sm">
        <div className="grid grid-cols-2">
          {/* Análisis Comparativo tab */}
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-6 py-4 text-sm font-bold transition-all relative group border-r border-border/30 ${
              activeTab === "comparison" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Análisis Comparativo
            {activeTab === "comparison" && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 rounded-t-full shadow-lg shadow-blue-500/50"></div>
            )}
          </button>

          {/* Panel de Datos tab */}
          <button
            onClick={() => setActiveTab("data-panel")}
            className={`px-6 py-4 text-sm font-bold transition-all relative group ${
              activeTab === "data-panel" ? "text-secondary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Panel de Datos
            {activeTab === "data-panel" && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 rounded-t-full shadow-lg shadow-green-500/50"></div>
            )}
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "comparison" && (
          <div className="h-full overflow-y-auto">
            <div className="flex flex-col gap-6 p-8">
              {/* Estado de carga y errores */}
                  {loading && (
                    <div className="bg-card rounded-lg border border-border p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                      <p className="text-sm text-muted-foreground">Cargando países desde el backend...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
                      <p className="text-sm text-destructive font-medium">⚠️ {error}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Asegúrate de que el backend esté ejecutándose en http://localhost:8000
                      </p>
                    </div>
                  )}

                  {!loading && !error && (
                    <>
                      {/* Países sin asignar */}
                      <div className="gradient-card rounded-2xl border-2 border-border/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-black text-foreground bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                              Países Disponibles para Análisis
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                              Arrastra los países a los lados para compararlos ({unplacedCountries.length} disponibles)
                            </p>
                          </div>
                          {(leftCountries.length > 0 || rightCountries.length > 0) && (
                        <button
                          onClick={resetCountries}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 transition-all flex items-center gap-1.5"
                          title="Devolver todos los países al carrusel"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M3 21v-5h5"/>
                          </svg>
                          Reiniciar
                        </button>
                      )}
                    </div>
                    
                    <div className="relative group">
                      {/* Botón flotante izquierdo */}
                      <button
                        onClick={scrollLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/30 shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Anterior"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>

                      {/* Botón flotante derecho */}
                      <button
                        onClick={scrollRight}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/30 shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Siguiente"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>

                      {/* Sombra izquierda */}
                      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
                      {/* Sombra derecha */}
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />

                      <div
                        ref={carouselRef}
                        onDragOver={handleDragOver}
                        onDrop={handleDropOnUnplaced}
                        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50 scroll-smooth"
                        style={{ scrollbarWidth: 'thin' }}
                      >
                        {unplacedCountries.map((country) => (
                          <div
                            key={country.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, country.id)}
                            className="group cursor-move flex-shrink-0 w-28 hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center"
                          >
                            <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-border group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/30 transition-all">
                              <FlagIcon countryCode={country.code} countryName={country.name} size="lg" />
                            </div>
                            <div className="text-[10px] font-bold text-foreground/80 w-full truncate px-1">
                              {country.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pizarra dividida */}
                  <div className="flex gap-6">
                    {/* Lado izquierdo */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={() => handleDropOnSide("left")}
                      className="flex-1 rounded-2xl border-3 border-dashed border-primary/40 bg-gradient-to-br from-primary/8 via-card to-card p-8 flex flex-col min-h-[450px] shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all hover:border-primary/60"
                    >
                      <div className="mb-6">
                        <h3 className="text-xl font-black text-primary mb-1">Análisis A</h3>
                        <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg shadow-primary/30"></div>
                      </div>
                      <div className="flex-1 grid grid-cols-5 gap-2 mb-6">
                        {leftCountries.map((country) => (
                          <div
                            key={country.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, country.id)}
                            className="cursor-move aspect-square rounded-md bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/60 hover:bg-gradient-to-br hover:from-primary/50 hover:to-primary/30 transition-all duration-300 flex flex-col items-center justify-center p-1.5 text-center hover:shadow-lg hover:shadow-primary/40 hover:scale-105"
                          >
                            <div className="mb-0.5">
                              <FlagIcon countryCode={country.code} countryName={country.name} size="sm" />
                            </div>
                            <div className="text-[9px] font-bold text-foreground leading-tight truncate w-full px-0.5">{country.name}</div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t-2 border-primary/30 pt-5 space-y-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground">AEE POM:</span>
                          <span className="text-lg font-black text-primary">{leftMetrics.aee_pom.toFixed(2)} kg/hab</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground">RAEE Generados:</span>
                          <span className="text-lg font-black text-primary">{leftMetrics.raee_generados.toFixed(2)} kg/hab</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-1.5 bg-gradient-to-b from-transparent via-primary to-transparent rounded-full shadow-lg shadow-primary/30" />

                    {/* Lado derecho */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={() => handleDropOnSide("right")}
                      className="flex-1 rounded-2xl border-3 border-dashed border-secondary/40 bg-gradient-to-br from-secondary/8 via-card to-card p-8 flex flex-col min-h-[450px] shadow-xl hover:shadow-2xl hover:shadow-secondary/20 transition-all hover:border-secondary/60"
                    >
                      <div className="mb-6">
                        <h3 className="text-xl font-black text-secondary mb-1">Análisis B</h3>
                        <div className="h-1 w-12 bg-gradient-to-r from-secondary to-accent rounded-full shadow-lg shadow-secondary/30"></div>
                      </div>
                      <div className="flex-1 grid grid-cols-5 gap-2 mb-6">
                        {rightCountries.map((country) => (
                          <div
                            key={country.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, country.id)}
                            className="cursor-move aspect-square rounded-md bg-gradient-to-br from-secondary/30 to-secondary/10 border border-secondary/60 hover:bg-gradient-to-br hover:from-secondary/50 hover:to-secondary/30 transition-all duration-300 flex flex-col items-center justify-center p-1.5 text-center hover:shadow-lg hover:shadow-secondary/40 hover:scale-105"
                          >
                            <div className="mb-0.5">
                              <FlagIcon countryCode={country.code} countryName={country.name} size="sm" />
                            </div>
                            <div className="text-[9px] font-bold text-foreground leading-tight truncate w-full px-0.5">{country.name}</div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t-2 border-secondary/30 pt-5 space-y-3 bg-gradient-to-r from-secondary/5 to-transparent rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground">AEE POM:</span>
                          <span className="text-lg font-black text-secondary">{rightMetrics.aee_pom.toFixed(2)} kg/hab</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-muted-foreground">RAEE Generados:</span>
                          <span className="text-lg font-black text-secondary">{rightMetrics.raee_generados.toFixed(2)} kg/hab</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
                )}

              {/* Panel de Comparación VS */}
              {!loading && !error && (leftCountries.length > 0 || rightCountries.length > 0) && (
                <VSComparisonPanel 
                  leftCountries={leftCountries}
                  rightCountries={rightCountries}
                />
              )}
            </div>
          </div>
        )}
        {activeTab === "data-panel" && <DataPanelTab />}
      </div>
    </div>
  )
}
