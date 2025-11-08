"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { SankeyTab } from "@/components/sankey-tab"
import { FlagIcon } from "@/components/flag-icon"
import { API_CONFIG, buildApiUrl } from "@/lib/api-config"
import type { CountryPlacement, CountryMetrics } from "@/utils/interfaces"
import { getCountryCode, getCountryFlag } from "@/utils/helpers"

export default function Home() {
  const [activeTab, setActiveTab] = useState("workspace")
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
    <div className="flex h-screen flex-col bg-background">
      <Header />

      {/* Pestañas */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "workspace"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Análisis Comparativo
        </button>
        <button
          onClick={() => setActiveTab("sankey")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "sankey"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Flujos Globales (Sankey)
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "workspace" && (
          <div className="flex flex-col gap-4 p-6">
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
                <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        Países disponibles ({unplacedCountries.length})
                      </h3>
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
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground hidden sm:block">Desliza o usa las flechas</p>
                      <div className="flex gap-1">
                        <button
                          onClick={scrollLeft}
                          className="p-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-foreground transition-colors border border-border hover:border-primary"
                          aria-label="Scroll izquierda"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                        </button>
                        <button
                          onClick={scrollRight}
                          className="p-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-foreground transition-colors border border-border hover:border-primary"
                          aria-label="Scroll derecha"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    {/* Botón flotante izquierdo */}
                    <button
                      onClick={scrollLeft}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Anterior"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>

                    {/* Botón flotante derecho */}
                    <button
                      onClick={scrollRight}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Siguiente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>

                    {/* Sombra izquierda */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
                    {/* Sombra derecha */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />

                    <div
                      ref={carouselRef}
                      onDragOver={handleDragOver}
                      onDrop={handleDropOnUnplaced}
                      className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 scroll-smooth"
                      style={{ scrollbarWidth: 'thin' }}
                    >
                      {unplacedCountries.map((country) => (
                        <div
                          key={country.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, country.id)}
                          className="group cursor-move flex-shrink-0 w-28 hover:scale-110 transition-transform duration-200 flex flex-col items-center justify-center gap-2 text-center"
                        >
                          <div className="relative p-2">
                            <FlagIcon countryCode={country.code} countryName={country.name} size="xl" />
                          </div>
                          <div className="text-[10px] font-semibold text-foreground/80 w-full truncate px-1">
                            {country.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

            {/* Pizarra dividida */}
            <div className="flex gap-4">
              {/* Lado izquierdo */}
              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnSide("left")}
                className="flex-1 rounded-lg border-2 border-dashed border-primary/30 bg-card/50 p-6 flex flex-col min-h-[400px]"
              >
                <h3 className="text-sm font-semibold text-primary mb-4">Lado A</h3>
                <div className="flex-1 grid grid-cols-3 gap-3 mb-4">
                  {leftCountries.map((country) => (
                    <div
                      key={country.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, country.id)}
                      className="group cursor-move aspect-square rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/50 hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 mb-2">
                        <FlagIcon countryCode={country.code} countryName={country.name} size="xl" />
                      </div>
                      <div className="text-xs font-semibold text-foreground relative z-10 px-2 py-1 bg-background/90 rounded-md backdrop-blur-sm">
                        {country.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    AEE POM: <span className="font-semibold text-foreground">{leftMetrics.aee_pom.toFixed(2)} kg/hab</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    RAEE Generados: <span className="font-semibold text-foreground">{leftMetrics.raee_generados.toFixed(2)} kg/hab</span>
                  </p>
                </div>
              </div>

              {/* Línea divisoria */}
              <div className="w-1 bg-border" />

              {/* Lado derecho */}
              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnSide("right")}
                className="flex-1 rounded-lg border-2 border-dashed border-accent/30 bg-card/50 p-6 flex flex-col min-h-[400px]"
              >
                <h3 className="text-sm font-semibold text-accent mb-4">Lado B</h3>
                <div className="flex-1 grid grid-cols-3 gap-3 mb-4">
                  {rightCountries.map((country) => (
                    <div
                      key={country.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, country.id)}
                      className="group cursor-move aspect-square rounded-xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-2 border-accent/50 hover:border-accent hover:shadow-xl hover:shadow-accent/20 hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 mb-2">
                        <FlagIcon countryCode={country.code} countryName={country.name} size="xl" />
                      </div>
                      <div className="text-xs font-semibold text-foreground relative z-10 px-2 py-1 bg-background/90 rounded-md backdrop-blur-sm">
                        {country.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    AEE POM: <span className="font-semibold text-foreground">{rightMetrics.aee_pom.toFixed(2)} kg/hab</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    RAEE Generados: <span className="font-semibold text-foreground">{rightMetrics.raee_generados.toFixed(2)} kg/hab</span>
                  </p>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
        )}
        {activeTab === "sankey" && <SankeyTab />}
      </div>
    </div>
  )
}
