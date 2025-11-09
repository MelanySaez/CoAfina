"use client"

import { CheckCircle2, XCircle, HelpCircle, AlertTriangle, Database, FileQuestion } from "lucide-react"

const knownData = [
  {
    category: "Importaciones",
    icon: "📥",
    status: "complete",
    source: "UN COMTRADE",
    coverage: "2013-2024",
    confidence: 95,
    description: "Datos completos de importaciones de equipos electrónicos por país y categoría",
  },
  {
    category: "Consumo Per Cápita",
    icon: "👤",
    status: "partial",
    source: "Estudio Regional",
    coverage: "2009-2019",
    confidence: 70,
    description: "Datos históricos disponibles pero desactualizados para algunos países",
  },
  {
    category: "Vida Útil Promedio",
    icon: "⏱️",
    status: "complete",
    source: "ITU & Estudios",
    coverage: "Global",
    confidence: 85,
    description: "Estimaciones confiables de vida útil por categoría de producto (3-7 años)",
  },
]

const unknownData = [
  {
    category: "Destino Final del RAEE",
    icon: "🗑️",
    status: "critical",
    impact: "high",
    description: "No sabemos dónde termina la mayoría del e-waste generado en LATAM",
  },
  {
    category: "Tratamiento Formal vs Informal",
    icon: "♻️",
    status: "critical",
    impact: "high",
    description: "Desconocemos qué porcentaje se recicla formalmente vs basurales/recicladores informales",
  },
  {
    category: "Flujos Transfronterizos de RAEE",
    icon: "🚚",
    status: "critical",
    impact: "medium",
    description: "No hay datos sobre exportaciones de e-waste entre países LATAM o hacia fuera",
  },
  {
    category: "Trazabilidad Individual",
    icon: "🔍",
    status: "missing",
    impact: "medium",
    description: "Imposible rastrear productos individuales desde importación hasta reciclaje",
  },
  {
    category: "Composición Material Detallada",
    icon: "⚗️",
    status: "missing",
    impact: "low",
    description: "Datos limitados sobre materiales específicos (oro, cobre, tierras raras) por país",
  },
]

export function DataGapsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-6">
        <div className="mb-3 flex items-center gap-3">
          <Database className="h-8 w-8 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Análisis de Disponibilidad de Datos</h2>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Mapa completo de lo que <span className="font-semibold text-primary">sabemos</span> y lo que{" "}
          <span className="font-semibold text-destructive">NO sabemos</span> sobre e-waste en Latinoamérica
        </p>
      </div>

      {/* Métricas de cobertura */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="group rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-primary/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Datos Disponibles</p>
          </div>
          <p className="text-3xl font-bold text-primary">{knownData.length}</p>
          <p className="text-xs text-muted-foreground mt-1">categorías con información confiable</p>
        </div>

        <div className="group rounded-xl border border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-destructive/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-muted-foreground">Datos Faltantes</p>
          </div>
          <p className="text-3xl font-bold text-destructive">{unknownData.length}</p>
          <p className="text-xs text-muted-foreground mt-1">brechas críticas de información</p>
        </div>

        <div className="group rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-6 transition-all hover:shadow-xl hover:shadow-accent/20 hover:scale-105">
          <div className="mb-2 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-accent" />
            <p className="text-sm font-medium text-muted-foreground">Cobertura Total</p>
          </div>
          <p className="text-3xl font-bold text-accent">38%</p>
          <p className="text-xs text-muted-foreground mt-1">de información necesaria disponible</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lo que SABEMOS */}
        <div className="rounded-xl border border-primary/30 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Lo que SABEMOS</h3>
          </div>
          <div className="space-y-3">
            {knownData.map((item, index) => (
              <div
                key={index}
                className="group rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 hover:border-primary/40 hover:scale-105"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-semibold text-foreground">{item.category}</h4>
                  <span
                    className={`ml-auto rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === "complete" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                    }`}
                  >
                    {item.status === "complete" ? "Completo" : "Parcial"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    <strong>Fuente:</strong> {item.source}
                  </span>
                  <span>
                    <strong>Cobertura:</strong> {item.coverage}
                  </span>
                  <span className="ml-auto">
                    <strong>Confianza:</strong> <span className="font-bold text-primary">{item.confidence}%</span>
                  </span>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lo que NO SABEMOS */}
        <div className="rounded-xl border border-destructive/30 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileQuestion className="h-6 w-6 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">Lo que NO SABEMOS</h3>
          </div>
          <div className="space-y-3">
            {unknownData.map((item, index) => (
              <div
                key={index}
                className="group rounded-lg border border-destructive/20 bg-destructive/5 p-4 transition-all hover:bg-destructive/10 hover:border-destructive/40 hover:scale-105"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-semibold text-foreground">{item.category}</h4>
                  <span
                    className={`ml-auto rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === "critical"
                        ? "bg-destructive/20 text-destructive animate-pulse"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {item.status === "critical" ? "Crítico" : "Faltante"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-muted-foreground">
                    <strong>Impacto:</strong>{" "}
                    <span
                      className={
                        item.impact === "high"
                          ? "font-bold text-destructive"
                          : item.impact === "medium"
                            ? "font-bold text-accent"
                            : "font-bold text-muted-foreground"
                      }
                    >
                      {item.impact === "high" ? "Alto" : item.impact === "medium" ? "Medio" : "Bajo"}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="rounded-xl border-2 border-accent bg-gradient-to-r from-accent/20 via-accent/10 to-transparent p-8">
        <h4 className="mb-3 text-xl font-bold text-accent flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Por qué esto importa
        </h4>
        <div className="space-y-3 text-base text-muted-foreground">
          <p className="leading-relaxed">
            <strong className="text-foreground">Sin datos de destino final,</strong> es imposible medir la efectividad
            de políticas de reciclaje o identificar basurales ilegales.
          </p>
          <p className="leading-relaxed">
            <strong className="text-foreground">Sin trazabilidad,</strong> no podemos garantizar que los materiales
            valiosos se recuperen o que los materiales peligrosos se traten correctamente.
          </p>
          <p className="leading-relaxed font-semibold text-accent text-lg">
            CoAfina es el primer paso para cerrar estas brechas críticas de información y construir un sistema
            transparente de gestión de e-waste en Latinoamérica.
          </p>
        </div>
      </div>
    </div>
  )
}
