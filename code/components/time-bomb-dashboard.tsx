"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp, AlertTriangle, Package } from "lucide-react"

// Datos simulados: Importaciones 2020-2024 y RAEE proyectado 2025-2029
const timeBombData = [
  {
    year: "2020",
    importaciones: 85000,
    raeeProyectado: 0,
    type: "histórico",
  },
  {
    year: "2021",
    importaciones: 92000,
    raeeProyectado: 0,
    type: "histórico",
  },
  {
    year: "2022",
    importaciones: 98000,
    raeeProyectado: 0,
    type: "histórico",
  },
  {
    year: "2023",
    importaciones: 105000,
    raeeProyectado: 0,
    type: "histórico",
  },
  {
    year: "2024",
    importaciones: 112000,
    raeeProyectado: 0,
    type: "histórico",
  },
  {
    year: "2025",
    importaciones: 0,
    raeeProyectado: 72250, // 85% de 85000
    type: "proyección",
  },
  {
    year: "2026",
    importaciones: 0,
    raeeProyectado: 78200,
    type: "proyección",
  },
  {
    year: "2027",
    importaciones: 0,
    raeeProyectado: 83300,
    type: "proyección",
  },
  {
    year: "2028",
    importaciones: 0,
    raeeProyectado: 89250,
    type: "proyección",
  },
  {
    year: "2029",
    importaciones: 0,
    raeeProyectado: 95200,
    type: "proyección",
  },
]

export function TimeBombDashboard() {
  const totalImports = timeBombData.slice(0, 5).reduce((acc, curr) => acc + curr.importaciones, 0)
  const totalProjectedWaste = timeBombData.slice(5).reduce((acc, curr) => acc + curr.raeeProyectado, 0)
  const avgLifespan = 5

  return (
    <div className="space-y-6">
      {/* Header alarmante */}
      <div className="relative overflow-hidden rounded-xl border-2 border-destructive bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent p-6">
        <div className="absolute -right-8 -top-8 text-9xl opacity-10">💣</div>
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
            <h2 className="text-2xl font-bold text-foreground">La Bomba de Tiempo del E-Waste</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Lo que importamos hoy será <span className="font-bold text-destructive">basura electrónica mañana</span>.
            Esta visualización muestra el RAEE que nos espera si no actuamos.
          </p>
        </div>
      </div>

      {/* Métricas destacadas */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="group rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-primary/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Total Importado (2020-2024)</p>
          </div>
          <p className="text-3xl font-bold text-primary">{(totalImports / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground mt-1">toneladas de equipos electrónicos</p>
        </div>

        <div className="group rounded-xl border border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-destructive/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-muted-foreground">RAEE Proyectado (2025-2029)</p>
          </div>
          <p className="text-3xl font-bold text-destructive">{(totalProjectedWaste / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground mt-1">toneladas de residuos esperados</p>
        </div>

        <div className="group rounded-xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-secondary/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            <p className="text-sm font-medium text-muted-foreground">Vida Útil Promedio</p>
          </div>
          <p className="text-3xl font-bold text-secondary">{avgLifespan} años</p>
          <p className="text-xs text-muted-foreground mt-1">tiempo hasta convertirse en RAEE</p>
        </div>
      </div>

      {/* Gráfico comparativo */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Importaciones vs RAEE Proyectado (Vida útil ~5 años)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={timeBombData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis dataKey="year" stroke="oklch(var(--foreground))" />
            <YAxis stroke="oklch(var(--foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="importaciones"
              fill="oklch(var(--primary))"
              name="Importaciones (tons)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="raeeProyectado"
              fill="oklch(var(--destructive))"
              name="RAEE Proyectado (tons)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-4 text-sm text-muted-foreground text-center leading-relaxed">
          <span className="font-semibold text-primary">Importaciones 2020-2024:</span> Lo que entró al sistema.{" "}
          <span className="font-semibold text-destructive">RAEE 2025-2029:</span> Lo que nos espera (85% tasa de
          descarte).
        </p>
      </div>

      {/* Call to action */}
      <div className="rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-transparent p-6">
        <h4 className="mb-2 text-lg font-bold text-accent">¿Qué significa esto?</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent">▸</span>
            <span>
              <strong>Cada tonelada importada hoy</strong> se convertirá en RAEE dentro de 5 años aprox.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">▸</span>
            <span>
              <strong>Sin sistemas de trazabilidad,</strong> no sabemos dónde terminará este e-waste.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">▸</span>
            <span>
              <strong>CoAfina es el primer paso</strong> para visibilizar esta invisibilidad y actuar antes de que sea
              tarde.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
