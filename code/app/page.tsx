"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { DataPanelTab } from "@/components/data-panel-tab"

interface CountryPlacement {
  id: string
  name: string
  flag: string
  side: "left" | "right" | null
}

const COUNTRIES = [
  { id: "1", name: "Colombia", flag: "🇨🇴" },
  { id: "2", name: "México", flag: "🇲🇽" },
  { id: "3", name: "Brasil", flag: "🇧🇷" },
  { id: "4", name: "Argentina", flag: "🇦🇷" },
  { id: "5", name: "Perú", flag: "🇵🇪" },
  { id: "6", name: "Chile", flag: "🇨🇱" },
  { id: "7", name: "Ecuador", flag: "🇪🇨" },
  { id: "8", name: "Bolivia", flag: "🇧🇴" },
  { id: "9", name: "Venezuela", flag: "🇻🇪" },
  { id: "10", name: "Paraguay", flag: "🇵🇾" },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("comparative")
  const [countries, setCountries] = useState<CountryPlacement[]>(COUNTRIES.map((c) => ({ ...c, side: null })))
  const [draggedCountry, setDraggedCountry] = useState<string | null>(null)

  const leftCountries = countries.filter((c) => c.side === "left")
  const rightCountries = countries.filter((c) => c.side === "right")
  const unplacedCountries = countries.filter((c) => c.side === null)

  const countryMetrics: Record<string, { volume: number; value: number; emissions: number }> = {
    "1": { volume: 450, value: 2300, emissions: 120 },
    "2": { volume: 680, value: 3400, emissions: 180 },
    "3": { volume: 920, value: 4100, emissions: 250 },
    "4": { volume: 380, value: 1900, emissions: 90 },
    "5": { volume: 290, value: 1400, emissions: 70 },
    "6": { volume: 520, value: 2600, emissions: 140 },
    "7": { volume: 210, value: 950, emissions: 50 },
    "8": { volume: 150, value: 700, emissions: 35 },
    "9": { volume: 340, value: 1600, emissions: 85 },
    "10": { volume: 180, value: 850, emissions: 45 },
  }

  const calculateMetrics = (countriesSide: CountryPlacement[]) => {
    const metrics = { volume: 0, value: 0, emissions: 0 }
    countriesSide.forEach((country) => {
      if (countryMetrics[country.id]) {
        metrics.volume += countryMetrics[country.id].volume
        metrics.value += countryMetrics[country.id].value
        metrics.emissions += countryMetrics[country.id].emissions
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
          onClick={() => setActiveTab("comparative")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "comparative"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Análisis Comparativo
        </button>
        <button
          onClick={() => setActiveTab("data-panel")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "data-panel"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Panel de Datos
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "comparative" && (
          <div className="h-full overflow-y-auto">
            <div className="flex flex-col gap-4 p-6">
              {/* Países sin asignar */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Países disponibles</h3>
                <div onDragOver={handleDragOver} onDrop={handleDropOnUnplaced} className="grid grid-cols-10 gap-2">
                  {unplacedCountries.map((country) => (
                    <div
                      key={country.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, country.id)}
                      className="cursor-move aspect-square rounded-lg bg-secondary border-2 border-border hover:border-primary hover:shadow-lg transition-all flex flex-col items-center justify-center p-2 text-center"
                    >
                      <div className="text-2xl">{country.flag}</div>
                    </div>
                  ))}
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
                  <div className="flex-1 grid grid-cols-3 gap-2 mb-4">
                    {leftCountries.map((country) => (
                      <div
                        key={country.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, country.id)}
                        className="cursor-move aspect-square rounded-lg bg-primary/10 border-2 border-primary/50 hover:bg-primary/20 transition-all flex flex-col items-center justify-center p-2 text-center"
                      >
                        <div className="text-3xl">{country.flag}</div>
                        <div className="text-xs font-medium text-foreground mt-1">{country.name}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Volumen: <span className="font-semibold text-foreground">{leftMetrics.volume} t</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Valor: <span className="font-semibold text-foreground">${leftMetrics.value}M</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Emisiones: <span className="font-semibold text-foreground">{leftMetrics.emissions} kg CO₂</span>
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
                  <div className="flex-1 grid grid-cols-3 gap-2 mb-4">
                    {rightCountries.map((country) => (
                      <div
                        key={country.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, country.id)}
                        className="cursor-move aspect-square rounded-lg bg-accent/10 border-2 border-accent/50 hover:bg-accent/20 transition-all flex flex-col items-center justify-center p-2 text-center"
                      >
                        <div className="text-3xl">{country.flag}</div>
                        <div className="text-xs font-medium text-foreground mt-1">{country.name}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Volumen: <span className="font-semibold text-foreground">{rightMetrics.volume} t</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Valor: <span className="font-semibold text-foreground">${rightMetrics.value}M</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Emisiones: <span className="font-semibold text-foreground">{rightMetrics.emissions} kg CO₂</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "data-panel" && <DataPanelTab />}
      </div>
    </div>
  )
}
