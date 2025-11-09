"use client";

import type React from "react";
import { useState } from "react";
import { X, Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface UploadDataPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesUploaded?: (files: File[]) => void;
}

export function UploadDataPanel({
  isOpen,
  onClose,
  onFilesUploaded,
}: UploadDataPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        const data = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line.split(",");
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index]?.trim() || "";
            });
            return obj;
          });

        resolve(data);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const uploadToSupabase = async () => {
    if (selectedFiles.length === 0) {
      setError("Por favor selecciona al menos un archivo");
      return;
    }

    setIsUploading(true);
    setError(null);

    let allSuccessful = true; // 🔹 Para controlar si todos pasaron la validación y subida

    try {
      for (const file of selectedFiles) {
        // 0️⃣ Validar primero el CSV en el backend
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "https://coafina-tvbg.onrender.com/upload-csv",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (!result.valid) {
          // ❌ Mostrar mensaje del backend
          setError(`${file.name}: ${result.message}`);
          allSuccessful = false; // no todos fueron exitosos
          continue; // saltar subida
        }

        // 1️⃣ Subir a Storage de Supabase
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("csv-uploads")
          .upload(fileName, file);

        if (uploadError) {
          allSuccessful = false;
          throw new Error(
            `Error al subir ${file.name}: ${uploadError.message}`
          );
        }

        // 2️⃣ Obtener URL pública
        const { data: urlData } = supabase.storage
          .from("csv-uploads")
          .getPublicUrl(fileName);

        // 3️⃣ Guardar metadata en DB
        const { error: dbError } = await supabase.from("csv_files").insert({
          filename: file.name,
          csv_filepath: urlData.publicUrl,
        });

        if (dbError) {
          allSuccessful = false;
          throw new Error(`Error al guardar ${file.name}: ${dbError.message}`);
        }
      }

      // 🔹 Mostrar éxito solo si todos pasaron correctamente
      if (allSuccessful) {
        if (onFilesUploaded) onFilesUploaded(selectedFiles);
        setShowSuccess(true);
        setSelectedFiles([]);

        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error al subir archivos:", err);
      setError(err.message || "Error desconocido al subir archivos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFiles = files.filter((file) => file.name.endsWith(".csv"));

    if (csvFiles.length > 0) {
      setSelectedFiles(csvFiles);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const csvFiles = files.filter((file) => file.name.endsWith(".csv"));

    if (csvFiles.length > 0) {
      setSelectedFiles(csvFiles);
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel deslizante */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Adjuntar Datos
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Area de Upload */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Adjunta y verás
                </h3>

                <label htmlFor="panel-file-upload">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-border"
                    }`}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-base font-medium text-foreground mb-1">
                      Arrastra y suelta
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Archivos CSV únicamente
                    </p>
                    <input
                      id="panel-file-upload"
                      type="file"
                      multiple
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                </label>

                {/* Lista de archivos seleccionados */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      Archivos seleccionados:
                    </p>
                    <ul className="space-y-1">
                      {selectedFiles.map((file, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-muted-foreground flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Mensajes de error */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              {/* Mensaje de éxito */}
              {showSuccess && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        ¡Subido exitosamente!
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Los archivos se han guardado en la base de datos
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de Upload */}
              <Button
                onClick={uploadToSupabase}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo a Supabase...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir{" "}
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} archivo${
                          selectedFiles.length > 1 ? "s" : ""
                        }`
                      : "archivos"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
