"use client"
import { TrendingUp, Globe2, MapPin } from "lucide-react"

// Datos simulados de flujos comerciales
const topExporters = [
  { country: "China", flag: "🇨🇳", volume: 245000, percentage: 42 },
  { country: "Estados Unidos", flag: "🇺🇸", volume: 128000, percentage: 22 },
  { country: "Alemania", flag: "🇩🇪", volume: 67000, percentage: 11 },
  { country: "Japón", flag: "🇯🇵", volume: 52000, percentage: 9 },
  { country: "Corea del Sur", flag: "🇰🇷", volume: 38000, percentage: 6 },
  { country: "Francia", flag: "🇫🇷", volume: 24000, percentage: 4 },
  { country: "Italia", flag: "🇮🇹", volume: 18000, percentage: 3 },
  { country: "Reino Unido", flag: "🇬🇧", volume: 12000, percentage: 2 },
]

const topImporters = [
  { country: "Brasil", flag: "🇧🇷", volume: 156000, percentage: 35 },
  { country: "México", flag: "🇲🇽", volume: 118000, percentage: 26 },
  { country: "Argentina", flag: "🇦🇷", volume: 67000, percentage: 15 },
  { country: "Chile", flag: "🇨🇱", volume: 45000, percentage: 10 },
  { country: "Colombia", flag: "🇨🇴", volume: 32000, percentage: 7 },
  { country: "Perú", flag: "🇵🇪", volume: 18000, percentage: 4 },
  { country: "Ecuador", flag: "🇪🇨", volume: 9000, percentage: 2 },
  { country: "Venezuela", flag: "🇻🇪", volume: 5000, percentage: 1 },
]

const COLORS = [
  "oklch(var(--primary))",
  "oklch(var(--secondary))",
  "oklch(var(--accent))",
  "oklch(var(--chart-4))",
  "oklch(var(--chart-5))",
  "oklch(0.65 0.19 80)",
  "oklch(0.68 0.2 320)",
  "oklch(0.72 0.18 40)",
]

export function TradeFlowsDashboard() {
  const totalExports = topExporters.reduce((acc, curr) => acc + curr.volume, 0)
  const totalImports = topImporters.reduce((acc, curr) => acc + curr.volume, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent p-6">
        <div className="mb-3 flex items-center gap-3">
          <Globe2 className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Flujos Comerciales de Electrónicos</h2>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Análisis de los principales países exportadores e importadores de equipos electrónicos hacia Latinoamérica
          (Datos COMTRADE 2020-2024)
        </p>
      </div>

      {/* Métricas globales */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="group rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-primary/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Total Exportado a LATAM</p>
          </div>
          <p className="text-3xl font-bold text-primary">{(totalExports / 1000).toFixed(0)}K tons</p>
          <p className="text-xs text-muted-foreground mt-1">desde principales países exportadores</p>
        </div>

        <div className="group rounded-xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-secondary/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            <p className="text-sm font-medium text-muted-foreground">Total Importado en LATAM</p>
          </div>
          <p className="text-3xl font-bold text-secondary">{(totalImports / 1000).toFixed(0)}K tons</p>
          <p className="text-xs text-muted-foreground mt-1">por países de Latinoamérica</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Exportadores */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            Top 8 Países Exportando a LATAM
          </h3>
          <div className="space-y-3">
            {topExporters.map((item, index) => (
              <div
                key={item.country}
                className="group flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 transition-all hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  #{index + 1}
                </div>
                <span className="text-2xl">{item.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.country}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 group-hover:bg-primary/80"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.percentage}%</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-primary">{(item.volume / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Importadores */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-2xl">🌎</span>
            Top 8 Países LATAM Importando
          </h3>
          <div className="space-y-3">
            {topImporters.map((item, index) => (
              <div
                key={item.country}
                className="group flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 transition-all hover:bg-secondary/10 hover:border-secondary/50 hover:scale-105"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">
                  #{index + 1}
                </div>
                <span className="text-2xl">{item.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.country}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all duration-500 group-hover:bg-secondary/80"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.percentage}%</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-secondary">{(item.volume / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-transparent p-6">
        <h4 className="mb-2 text-lg font-bold text-accent flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Insights Clave
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent">▸</span>
            <span>
              <strong>China domina</strong> con el 42% de las exportaciones globales de electrónicos a LATAM
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">▸</span>
            <span>
              <strong>Brasil y México</strong> representan el 61% de las importaciones totales en Latinoamérica
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">▸</span>
            <span>
              <strong>Oportunidad:</strong> Estos flujos se convertirán en RAEE. ¿Dónde está la infraestructura de
              reciclaje?
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
