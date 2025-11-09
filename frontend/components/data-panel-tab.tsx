"use client";
import { useState, useEffect } from "react";
import {
  Upload,
  X,
  Search,
  Plus,
  FileText,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { UploadDataPanel } from "./upload-data-panel";
import { supabase } from "@/lib/supabase";
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
} from "recharts";

interface UploadedFile {
  id: string;
  name: string;
  selected: boolean;
  data: any[];
  parsedCSV?: any[];
  countryFromFilename?: string | null;
}

export function DataPanelTab() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para parsear CSV
  const parseCSVData = async (csvUrl: string): Promise<any[]> => {
    try {
      const response = await fetch(csvUrl);
      const text = await response.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      console.log("Headers detectados:", headers); // Debug

      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          const value = values[index];
          // Convertir números
          obj[header] = Number.isNaN(Number(value)) ? value : Number(value);
        });
        return obj;
      });

      console.log("Primeras 3 filas parseadas:", data.slice(0, 3)); // Debug
      return data;
    } catch (error) {
      console.error("Error parsing CSV:", error);
      return [];
    }
  };

  // Extraer el nombre del país del nombre del archivo
  const extractCountryFromFilename = (filename: string): string | null => {
    // Ejemplo: "Colombia.csv" → "Colombia"
    // Ejemplo: "Colombia datos 2024.csv" → "Colombia"
    const cleanName = filename.replace(".csv", "").trim();
    const firstWord = cleanName.split(/[\s_-]/)[0]; // Toma la primera palabra
    return firstWord || null;
  };

  // Cargar archivos desde Supabase
  const loadFilesFromSupabase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("csv_files")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      const filesWithData = await Promise.all(
        (data || []).map(async (file) => {
          const parsedCSV = await parseCSVData(file.csv_filepath);
          const countryFromFilename = extractCountryFromFilename(file.filename);

          return {
            id: file.id,
            name: file.filename,
            selected: false,
            data: [], // Se llenará dinámicamente
            parsedCSV: parsedCSV,
            countryFromFilename: countryFromFilename, // País extraído del nombre
          };
        })
      );

      setUploadedFiles(filesWithData);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar archivos al montar el componente
  useEffect(() => {
    loadFilesFromSupabase();
  }, []);

  const handleFilesUploaded = (files: File[]) => {
    // Recargar la lista después de subir
    loadFilesFromSupabase();
  };

  const toggleFileSelection = (id: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    );
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFiles = uploadedFiles.filter((file) => file.selected);

  // Procesar datos para gráficas: agrupar por año
  const combinedData = (() => {
    if (selectedFiles.length === 0) return [];

    // Obtener todos los años únicos de todos los archivos seleccionados
    const allYears = new Set<number>();
    selectedFiles.forEach((file) => {
      file.parsedCSV?.forEach((row) => {
        const yearValue = row["Año"] || row["año"] || row["Year"] || row["Ano"];
        if (yearValue) {
          allYears.add(Number(yearValue));
        }
      });
    });

    const sortedYears = Array.from(allYears).sort((a, b) => a - b);

    // Para cada año, agregar datos de todos los países en todos los archivos
    const result = sortedYears.map((year) => {
      const yearData: any = { year: year };

      selectedFiles.forEach((file) => {
        if (!file.parsedCSV) return;

        // PRIORIDAD: Usar el país del nombre del archivo
        const countryFromFile = file.countryFromFilename;

        // Agrupar por país para este año
        file.parsedCSV.forEach((row) => {
          const rowYear = Number(
            row["Año"] || row["año"] || row["Year"] || row["Ano"]
          );
          if (rowYear === year) {
            // Si hay país en el nombre del archivo, usarlo; si no, buscar en el CSV
            const country =
              countryFromFile ||
              (
                row["Pais"] ||
                row["País"] ||
                row["Country"] ||
                row["pais"] ||
                ""
              ).trim();

            const value1 = Number(
              row["AEE_POM_kg_hab"] || row["AEE POM kg/hab"] || 0
            );
            const value2 = Number(
              row["RAEE_generados_kg_hab"] || row["RAEE generados kg/hab"] || 0
            );

            // Usar el nombre del país como clave (sin espacios ni caracteres especiales)
            if (country) {
              const cleanCountry = country.replace(/\s+/g, "_");
              yearData[`${cleanCountry}_AEE`] = value1;
              yearData[`${cleanCountry}_RAEE`] = value2;
            }
          }
        });
      });

      return yearData;
    });

    console.log("Combined data:", result.slice(0, 2)); // Debug solo primeros 2 años
    return result;
  })();

  // Obtener todas las series (países) para las líneas del gráfico
  const seriesKeys = (() => {
    if (combinedData.length === 0) return [];
    const keys = Object.keys(combinedData[0]).filter((k) => k !== "year");
    console.log("Series keys:", keys); // Debug
    return keys;
  })();

  // Formatear nombres para la leyenda (más legibles)
  const formatLegendName = (key: string) => {
    // Convertir "Uruguay_AEE" → "Uruguay - AEE"
    // Convertir "Costa_Rica_RAEE" → "Costa Rica - RAEE"
    const parts = key.split("_");
    const metric = parts.pop(); // AEE o RAEE
    const country = parts.join(" "); // Unir el resto con espacios
    return `${country} - ${metric}`;
  };

  // Colores para las líneas
  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ec4899",
    "#06b6d4",
    "#10b981",
    "#f97316",
    "#6366f1",
    "#14b8a6",
    "#eab308",
  ];

  // Generar colores dinámicamente
  const getFileColor = (index: number) => {
    const colorVariants = [
      {
        border: "border-blue-500/60",
        bg: "from-blue-500/15 to-blue-500/5",
        text: "text-blue-600",
        checkbox:
          "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
      },
      {
        border: "border-purple-500/60",
        bg: "from-purple-500/15 to-purple-500/5",
        text: "text-purple-600",
        checkbox:
          "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
      },
      {
        border: "border-orange-500/60",
        bg: "from-orange-500/15 to-orange-500/5",
        text: "text-orange-600",
        checkbox:
          "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500",
      },
      {
        border: "border-pink-500/60",
        bg: "from-pink-500/15 to-pink-500/5",
        text: "text-pink-600",
        checkbox:
          "data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500",
      },
      {
        border: "border-indigo-500/60",
        bg: "from-indigo-500/15 to-indigo-500/5",
        text: "text-indigo-600",
        checkbox:
          "data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500",
      },
    ];
    return colorVariants[index % colorVariants.length];
  };

  return (
    <div className="flex h-full relative">
      <div className="w-80 border-r border-border bg-gradient-to-b from-blue-50/30 to-emerald-50/20 dark:from-blue-950/20 dark:to-emerald-950/10 p-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="text"
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-primary/30 focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadFilesFromSupabase}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filteredFiles.map((file, index) => {
                const fileColors = getFileColor(index);
                return (
                  <div
                    key={file.id}
                    onClick={() => toggleFileSelection(file.id)} // Permite hacer clic en todo el div
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 group cursor-pointer ${
                      file.selected
                        ? `bg-linear-to-r ${fileColors.bg} ${fileColors.border} shadow-lg shadow-blue-500/20`
                        : `bg-card border-border/60 hover:border-blue-400/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 hover:shadow-md`
                    }`}
                  >
                    <Checkbox
                      checked={file.selected}
                      onClick={(e) => e.stopPropagation()} // Evita que el checkbox dispare el click del div
                      onCheckedChange={() => toggleFileSelection(file.id)}
                      className={`${
                        file.selected
                          ? fileColors.checkbox
                          : "border-2 border-current bg-background hover:bg-primary/10 hover:border-primary/50"
                      } transition-all cursor-pointer`}
                    />
                    <FileText
                      className={`h-4 w-4 transition-colors ${
                        file.selected
                          ? fileColors.text
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`flex-1 text-sm font-medium truncate transition-colors ${
                        file.selected
                          ? `font-semibold ${fileColors.text}`
                          : "text-muted-foreground"
                      }`}
                    >
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el click del botón seleccione
                        removeFile(file.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Selecciona archivos para visualizar
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Marca los checkboxes de los archivos que deseas comparar y
                  visualiza las tendencias
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
                  <h4 className="text-base font-bold text-foreground">
                    Tendencia por Año
                  </h4>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={combinedData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="year"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--primary) / 0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    {seriesKeys.map((key, idx) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        dot={{ fill: colors[idx % colors.length], r: 4 }}
                        activeDot={{ r: 6 }}
                        name={formatLegendName(key)}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/30 to-emerald-50/10 dark:from-emerald-950/20 dark:to-transparent rounded-2xl border-2 border-emerald-200/30 dark:border-emerald-800/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-foreground">
                    Comparación por Año (Barras)
                  </h4>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={combinedData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="year"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--secondary) / 0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    {seriesKeys.map((key, idx) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={colors[idx % colors.length]}
                        radius={[8, 8, 0, 0]}
                        name={formatLegendName(key)}
                      />
                    ))}
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
  );
}
