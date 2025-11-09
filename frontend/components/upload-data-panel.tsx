"use client"

import type React from "react"
import { useState } from "react"
import { X, Upload, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadDataPanelProps {
  isOpen: boolean
  onClose: () => void
  onFilesUploaded: (files: File[]) => void
}

export function UploadDataPanel({ isOpen, onClose, onFilesUploaded }: UploadDataPanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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

    const files = Array.from(e.dataTransfer.files)
    const csvFiles = files.filter((file) => file.name.endsWith(".csv"))

    if (csvFiles.length > 0) {
      onFilesUploaded(csvFiles)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const csvFiles = files.filter((file) => file.name.endsWith(".csv"))

    if (csvFiles.length > 0) {
      onFilesUploaded(csvFiles)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel deslizante */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Adjuntar Datos</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="h-full flex items-center justify-center">
              <div className="w-full">
                <h3 className="text-sm font-semibold text-foreground mb-4">Adjunta y verás</h3>

                <label htmlFor="panel-file-upload">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                      isDragging ? "border-primary bg-primary/10 scale-105" : "border-border"
                    }`}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-base font-medium text-foreground mb-1">Arrastra y suelta</p>
                    <p className="text-sm text-muted-foreground mb-3">o haz clic para seleccionar</p>
                    <p className="text-xs text-muted-foreground">Archivos CSV únicamente</p>
                    <input
                      id="panel-file-upload"
                      type="file"
                      multiple
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </label>

                {showSuccess && (
                  <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">¡Adjuntado exitosamente!</h3>
                        <p className="text-xs text-muted-foreground">Los archivos se han añadido a la lista de datos</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
