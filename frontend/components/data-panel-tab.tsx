"use client"
import { useState } from "react"
import { Upload, X, Search, Plus, FileText, TrendingUp } from "lucide-react"
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

  const colorMap: Record<string, { name: string; border: string; bg: string; text: string; checkbox: string }> = {
    "1": {
      name: "csv_adjunto1.csv",
      border: "border-blue-500/60",
      bg: "from-blue-500/15 to-blue-500/5",
      text: "text-blue-600",
      checkbox: "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
    },
    "2": {
      name: "csv_adjunto2.csv",
      border: "border-purple-500/60",
      bg: "from-purple-500/15 to-purple-500/5",
      text: "text-purple-600",
      checkbox: "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
    },
    "3": {
      name: "csv_adjunto3.csv",
      border: "border-orange-500/60",
      bg: "from-orange-500/15 to-orange-500/5",
      text: "text-orange-600",
      checkbox: "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500",
    },
    "4": {
      name: "csv_adjunto4.csv",
      border: "border-pink-500/60",
      bg: "from-pink-500/15 to-pink-500/5",
      text: "text-pink-600",
      checkbox: "data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500",
    },
    "5": {
      name: "csv_adjunto5.csv",
      border: "border-indigo-500/60",
      bg: "from-indigo-500/15 to-indigo-500/5",
      text: "text-indigo-600",
      checkbox: "data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500",
    },
  }

  return (
    <div className="flex h-full relative">
      <div className="w-80 border-r border-border bg-gradient-to-b from-blue-50/30 to-emerald-50/20 dark:from-blue-950/20 dark:to-emerald-950/10 p-4 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            type="text"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-primary/30 focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {filteredFiles.map((file) => {
              const colors = colorMap[file.id]
              return (
                <div
                  key={file.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 group cursor-pointer ${
                    file.selected
                      ? `bg-gradient-to-r ${colors.bg} ${colors.border} shadow-lg shadow-blue-500/20`
                      : `bg-card border-border/60 hover:border-blue-400/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 hover:shadow-md`
                  }`}
                >
                  <Checkbox
                    checked={file.selected}
                    onCheckedChange={() => toggleFileSelection(file.id)}
                    className={`${
                      file.selected
                        ? colors.checkbox
                        : "border-2 border-current bg-background hover:bg-primary/10 hover:border-primary/50"
                    } transition-all cursor-pointer`}
                  />
                  <FileText
                    className={`h-4 w-4 transition-colors ${file.selected ? colors.text : "text-muted-foreground"}`}
                  />
                  <span
                    className={`flex-1 text-sm font-medium truncate transition-colors ${
                      file.selected ? `font-semibold ${colors.text}` : "text-muted-foreground"
                    }`}
                  >
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-background via-background to-blue-50/10 dark:to-blue-950/10">
        <div className="flex items-center justify-end p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <Button
            onClick={() => setIsUploadPanelOpen(true)}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Adjuntar datos
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {selectedFiles.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Selecciona archivos para visualizar</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Marca los checkboxes de los archivos que deseas comparar y visualiza las tendencias
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Comparación de Datos
                </h3>
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
              </div>

              <div className="bg-gradient-to-br from-blue-50/30 to-blue-50/10 dark:from-blue-950/20 dark:to-transparent rounded-2xl border-2 border-blue-200/30 dark:border-blue-800/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h4 className="text-base font-bold text-foreground">Tendencia Temporal</h4>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px", fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--primary) / 0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    {selectedFiles.map((file, idx) => {
                      const chartColors = ["#3b82f6", "#a855f7", "#f97316", "#ec4899", "#6366f1"]
                      return (
                        <Line
                          key={file.id}
                          type="monotone"
                          dataKey={file.name}
                          stroke={chartColors[idx % chartColors.length]}
                          strokeWidth={3}
                          dot={{ fill: chartColors[idx % chartColors.length], r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      )
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/30 to-emerald-50/10 dark:from-emerald-950/20 dark:to-transparent rounded-2xl border-2 border-emerald-200/30 dark:border-emerald-800/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-foreground">Comparación por Período</h4>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px", fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--secondary) / 0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    {selectedFiles.map((file, idx) => {
                      const chartColors = ["#3b82f6", "#a855f7", "#f97316", "#ec4899", "#6366f1"]
                      return (
                        <Bar
                          key={file.id}
                          dataKey={file.name}
                          fill={chartColors[idx % chartColors.length]}
                          radius={[8, 8, 0, 0]}
                        />
                      )
                    })}
                  </BarChart>
                </ResponsiveContainer>
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
