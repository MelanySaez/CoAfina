"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const COMPARISON_DATA = [
  { country: "Colombia", recycling: 35, imports: 125, exports: 45, value: 42 },
  { country: "México", recycling: 42, imports: 210, exports: 65, value: 58 },
  { country: "Brasil", recycling: 38, imports: 185, exports: 55, value: 51 },
]

const METRICS_DATA = [
  { metric: "Ene", value: 25 },
  { metric: "Feb", value: 32 },
  { metric: "Mar", value: 28 },
  { metric: "Abr", value: 41 },
  { metric: "May", value: 38 },
  { metric: "Jun", value: 45 },
]

const COUNTRY_FLAGS = {
  Colombia: "🇨🇴",
  México: "🇲🇽",
  Brasil: "🇧🇷",
}

export function ComparisonPanel({ blocks, selectedBlocks, countries, onCountriesChange }) {
  return (
    <div className="w-80 border-r border-border bg-card p-6 overflow-y-auto shadow-sm">
      <h2 className="font-bold text-foreground mb-4">Análisis Comparativo</h2>

      <div className="mb-6">
        <label className="text-xs font-semibold text-muted-foreground mb-3 block">Filtrar Países</label>
        <div className="grid grid-cols-2 gap-3">
          {["Colombia", "México", "Brasil"].map((country) => (
            <label
              key={country}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 aspect-square ${
                countries.includes(country)
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
              }`}
            >
              <input
                type="checkbox"
                checked={countries.includes(country)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onCountriesChange([...countries, country])
                  } else {
                    onCountriesChange(countries.filter((c) => c !== country))
                  }
                }}
                className="sr-only"
              />
              <span className="text-3xl">{COUNTRY_FLAGS[country]}</span>
              <span className="text-sm font-semibold text-foreground text-center">{country}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Volumen por País (kTon)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={COMPARISON_DATA.filter((d) => countries.includes(d.country))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="country" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="recycling" fill="var(--color-primary)" name="Reciclaje" />
            <Bar dataKey="imports" fill="var(--color-secondary)" name="Importaciones" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-muted rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Tendencia de Reciclaje</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={METRICS_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="metric" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} name="% Reciclado" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-muted-foreground space-y-3">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="font-semibold text-foreground mb-1">Métrica Regional</p>
          <p>Volumen total procesado: 450 kTon</p>
          <p>Tasa promedio de reciclaje: 38.3%</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="font-semibold text-foreground mb-1">Recuperación de Materiales</p>
          <p>Metales preciosos: 15% recuperables</p>
          <p>Plásticos: 8% recuperables</p>
        </div>
      </div>
    </div>
  )
}
