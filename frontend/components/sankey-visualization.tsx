"use client"

import { Sankey, Tooltip, ResponsiveContainer } from "recharts"

const SANKEY_DATA = {
  nodes: [
    { name: "China" },
    { name: "Taiwan" },
    { name: "Otros Asiáticos" },
    { name: "Colombia" },
    { name: "México" },
    { name: "Brasil" },
    { name: "Reciclaje Formal" },
    { name: "Vertedero" },
    { name: "Re-exportación" },
  ],
  links: [
    { source: 0, target: 3, value: 85 },
    { source: 0, target: 4, value: 120 },
    { source: 0, target: 5, value: 95 },
    { source: 1, target: 3, value: 30 },
    { source: 1, target: 4, value: 45 },
    { source: 1, target: 5, value: 25 },
    { source: 2, target: 3, value: 15 },
    { source: 2, target: 4, value: 20 },
    { source: 3, target: 6, value: 80 },
    { source: 3, target: 7, value: 40 },
    { source: 3, target: 8, value: 10 },
    { source: 4, target: 6, value: 120 },
    { source: 4, target: 8, value: 65 },
    { source: 5, target: 6, value: 85 },
    { source: 5, target: 7, value: 35 },
  ],
}

export function SankeyVisualization({ variable, onVariableChange, countries }) {
  return (
    <div className="w-96 bg-card p-6 overflow-y-auto shadow-sm border-l border-border">
      <h2 className="font-bold text-foreground mb-4">Flujo de Materiales (Sankey)</h2>

      <div className="mb-6">
        <label className="text-xs font-semibold text-muted-foreground mb-3 block">Variable a Mostrar</label>
        <select
          value={variable}
          onChange={(e) => onVariableChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
        >
          <option value="volume">Volumen (Toneladas)</option>
          <option value="value">Valor Económico</option>
          <option value="emissions">Emisiones Estimadas</option>
          <option value="metals">Metales Recuperables</option>
        </select>
      </div>

      <div className="bg-muted rounded-lg p-4 mb-6 overflow-x-auto">
        <ResponsiveContainer width="100%" height={350}>
          <Sankey
            data={SANKEY_DATA}
            node={{ fill: "hsl(var(--primary))", fillOpacity: 1 }}
            link={{ stroke: "hsl(var(--primary))", strokeOpacity: 0.2 }}
            nodePadding={80}
            margin={{ top: 20, right: 160, bottom: 20, left: 20 }}
          >
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          </Sankey>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-muted border border-border">
          <p className="text-xs font-semibold text-foreground">Datos Clave</p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>
              Variable: <span className="font-medium text-foreground">{variable}</span>
            </p>
            <p>
              Países: <span className="font-medium text-foreground">{countries.join(", ")}</span>
            </p>
            <p>
              Total flujo: <span className="font-medium text-foreground">630 kTon</span>
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-foreground font-semibold">Insights Clave</p>
          <p className="text-xs text-muted-foreground mt-1">
            El flujo muestra que China y Taiwan son los principales proveedores de e-waste en la región, siendo México y
            Colombia los mayores receptores.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="text-xs text-foreground font-semibold">Reciclaje Formal</p>
          <p className="text-xs text-muted-foreground mt-1">
            285 kTon se dirigen a reciclaje formal, representando el 45% del flujo total analizado.
          </p>
        </div>
      </div>
    </div>
  )
}
