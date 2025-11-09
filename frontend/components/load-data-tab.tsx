"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileCheck } from "lucide-react"

export function LoadDataTab() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].name.endsWith(".csv")) {
      setUploadedFile(files[0].name)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && files[0].name.endsWith(".csv")) {
      setUploadedFile(files[0].name)
    }
  }

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Adjunta y verás</h2>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-12 transition-all ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border bg-muted/30 hover:border-primary/50"
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Upload className="h-12 w-12 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">Drag and drop</p>
              <p className="text-sm text-muted-foreground">Arrastra tu archivo CSV aquí o haz clic para seleccionar</p>
            </div>
          </div>
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="rounded-full bg-green-500/10 p-2">
              <FileCheck className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">CSV adjuntado</p>
              <p className="text-xs text-muted-foreground">{uploadedFile}</p>
            </div>
            <button onClick={() => setUploadedFile(null)} className="text-xs text-destructive hover:underline">
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
