"use client"

import { SankeyVisualization } from "@/components/sankey-visualization"
import { TimeBombDashboard } from "@/components/time-bomb-dashboard"
import { TradeFlowsDashboard } from "@/components/trade-flows-dashboard"
import { DataGapsDashboard } from "@/components/data-gaps-dashboard"
import { useState } from "react"
import { Bomb, TrendingUp, Database, Network } from "lucide-react"

export function SankeyTab() {
  const [activeView, setActiveView] = useState<"sankey" | "timebomb" | "flows" | "gaps">("timebomb")
  const [variable, setVariable] = useState("volume")

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-2">
        <button
          onClick={() => setActiveView("timebomb")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeView === "timebomb"
              ? "bg-destructive text-destructive-foreground shadow-lg scale-105"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Bomb className="h-4 w-4" />
          Bomba de Tiempo
        </button>
        <button
          onClick={() => setActiveView("flows")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeView === "flows"
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Top Flujos Comerciales
        </button>
        <button
          onClick={() => setActiveView("gaps")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeView === "gaps"
              ? "bg-accent text-accent-foreground shadow-lg scale-105"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Database className="h-4 w-4" />
          Brechas de Datos
        </button>
        <button
          onClick={() => setActiveView("sankey")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeView === "sankey"
              ? "bg-secondary text-secondary-foreground shadow-lg scale-105"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Network className="h-4 w-4" />
          Diagrama Sankey
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-xl">
        {activeView === "timebomb" && <TimeBombDashboard />}
        {activeView === "flows" && <TradeFlowsDashboard />}
        {activeView === "gaps" && <DataGapsDashboard />}
        {activeView === "sankey" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <label className="text-sm font-medium text-foreground">Variable:</label>
              <select
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="volume">Volumen</option>
                <option value="value">Valor</option>
                <option value="emissions">Emisiones</option>
              </select>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <SankeyVisualization variable={variable} countries={["Colombia", "México", "Perú"]} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
