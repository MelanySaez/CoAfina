"use client"

import { FileText, Download, Calendar, TrendingUp } from "lucide-react"

export function ReportsTab() {
  const reports = [
    {
      id: 1,
      title: "Análisis de Flujos de E-waste 2024",
      description: "Reporte completo de importaciones y exportaciones en Latinoamérica",
      date: "15 Marzo 2024",
      size: "2.4 MB",
      type: "PDF",
    },
    {
      id: 2,
      title: "Comparativa Regional Q1",
      description: "Análisis trimestral de volumen y valor de residuos electrónicos",
      date: "10 Marzo 2024",
      size: "1.8 MB",
      type: "PDF",
    },
    {
      id: 3,
      title: "Impacto Ambiental - Emisiones",
      description: "Evaluación de emisiones de CO₂ por país y tipo de residuo",
      date: "5 Marzo 2024",
      size: "3.1 MB",
      type: "PDF",
    },
    {
      id: 4,
      title: "Tendencias de Reciclaje 2023-2024",
      description: "Evolución de tasas de reciclaje y valorización en la región",
      date: "28 Febrero 2024",
      size: "2.7 MB",
      type: "PDF",
    },
  ]

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Reportes Generados</h2>
            <p className="text-muted-foreground">Descarga y consulta tus análisis anteriores</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <TrendingUp className="h-4 w-4" />
            Generar Nuevo
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/50"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 truncate">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.date}
                    </div>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span className="font-medium">{report.type}</span>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
                <Download className="h-4 w-4" />
                Descargar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
