"use client"
import { useState } from "react"
import { Upload, X, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { UploadDataPanel } from "./upload-data-panel"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface UploadedFile {
  id: string
  name: string
  selected: boolean
  data: any[]
}

export function DataPanelTab() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "csv_adjunto1.csv",
      selected: true,
      data: [
        { month: "Ene", value: 400 },
        { month: "Feb", value: 300 },
        { month: "Mar", value: 500 },
        { month: "Abr", value: 450 },
      ],
    },
    {
      id: "2",
      name: "csv_adjunto2.csv",
      selected: false,
      data: [
        { month: "Ene", value: 250 },
        { month: "Feb", value: 380 },
        { month: "Mar", value: 420 },
        { month: "Abr", value: 390 },
      ],
    },
    {
      id: "3",
      name: "csv_adjunto3.csv",
      selected: false,
      data: [
        { month: "Ene", value: 600 },
        { month: "Feb", value: 550 },
        { month: "Mar", value: 650 },
        { month: "Abr", value: 700 },
      ],
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false)

  const handleFilesUploaded = (files: File[]) => {
    files.forEach((file) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        selected: false,
        data: [
          { month: "Ene", value: Math.floor(Math.random() * 500) + 200 },
          { month: "Feb", value: Math.floor(Math.random() * 500) + 200 },
          { month: "Mar", value: Math.floor(Math.random() * 500) + 200 },
          { month: "Abr", value: Math.floor(Math.random() * 500) + 200 },
        ],
      }
      setUploadedFiles((prev) => [...prev, newFile])
    })
  }

  const toggleFileSelection = (id: string) => {
    setUploadedFiles((prev) => prev.map((file) => (file.id === id ? { ...file, selected: !file.selected } : file)))
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const filteredFiles = uploadedFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const selectedFiles = uploadedFiles.filter((file) => file.selected)

  const combinedData =
    selectedFiles.length > 0
      ? selectedFiles[0].data.map((item, idx) => {
          const combined: any = { month: item.month }
          selectedFiles.forEach((file) => {
            combined[file.name] = file.data[idx]?.value || 0
          })
          return combined
        })
      : []

  return (
    <div className="flex h-full relative">
      {/* Panel izquierdo */}
      <div className="w-80 border-r border-border bg-card p-4 flex flex-col gap-4">
        {/* Adjunta y verás */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Lista de archivos */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 p-3 bg-background rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
              >
                <Checkbox checked={file.selected} onCheckedChange={() => toggleFileSelection(file.id)} />
                <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho - Gráficas */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header with "Adjuntar datos" button */}
        <div className="flex items-center justify-end p-4 border-b border-border">
          <Button variant="outline" onClick={() => setIsUploadPanelOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adjuntar datos
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {selectedFiles.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Selecciona archivos para visualizar</h3>
                <p className="text-sm text-muted-foreground">
                  Marca los checkboxes de los archivos que deseas comparar
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Comparación de Datos</h3>

                {/* Gráfica de líneas */}
                <div className="bg-card rounded-lg border border-border p-4 mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-4">Tendencia Temporal</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      {selectedFiles.map((file, idx) => (
                        <Line
                          key={file.id}
                          type="monotone"
                          dataKey={file.name}
                          stroke={`hsl(${(idx * 360) / selectedFiles.length}, 70%, 50%)`}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfica de barras */}
                <div className="bg-card rounded-lg border border-border p-4">
                  <h4 className="text-sm font-medium text-foreground mb-4">Comparación por Período</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      {selectedFiles.map((file, idx) => (
                        <Bar
                          key={file.id}
                          dataKey={file.name}
                          fill={`hsl(${(idx * 360) / selectedFiles.length}, 70%, 50%)`}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <UploadDataPanel
        isOpen={isUploadPanelOpen}
        onClose={() => setIsUploadPanelOpen(false)}
        onFilesUploaded={handleFilesUploaded}
      />
    </div>
  )
}
