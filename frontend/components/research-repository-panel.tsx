"use client"

import { useState, useEffect } from "react"
import { X, Tag, ExternalLink, Calendar, Loader2 } from "lucide-react"
import { searchArxiv, ArxivArticle, DEFAULT_QUERY } from "@/lib/arxiv-service"

interface ResearchItem {
  id: string
  title: string
  authors: string
  date: string
  source: string
  tags: string[]
  url: string
  abstract: string
}

interface ResearchRepositoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ResearchRepositoryPanel({ isOpen, onClose }: ResearchRepositoryPanelProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [arxivResults, setArxivResults] = useState<ArxivArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Etiquetas personalizables para filtrar artículos
  const allTags = [
    "Reciclaje",
    "Economía Circular",
    "Políticas Públicas",
    "Toxicidad",
    "Exportación",
    "Gestión",
    "Sostenibilidad",
    "Legislación",
  ]

  // Convertir resultados de arXiv a formato ResearchItem
  const arxivToResearchItems = (articles: ArxivArticle[]): ResearchItem[] => {
    return articles.map((article) => {
      // Inferir tags basándose en el contenido
      const inferredTags: string[] = []
      const searchText = (article.title + " " + article.summary).toLowerCase()
      
      if (searchText.includes("recicl") || searchText.includes("recycl")) inferredTags.push("Reciclaje")
      if (searchText.includes("circular") || searchText.includes("economy")) inferredTags.push("Economía Circular")
      if (searchText.includes("polic") || searchText.includes("law") || searchText.includes("regulation")) 
        inferredTags.push("Políticas Públicas")
      if (searchText.includes("toxic") || searchText.includes("tóxico")) inferredTags.push("Toxicidad")
      if (searchText.includes("mining") || searchText.includes("minería")) inferredTags.push("Minería Urbana")
      if (searchText.includes("export") || searchText.includes("import")) inferredTags.push("Exportación")
      if (searchText.includes("management") || searchText.includes("gestión")) inferredTags.push("Gestión")
      if (searchText.includes("sustain") || searchText.includes("sostenib")) inferredTags.push("Sostenibilidad")
      if (searchText.includes("legislation") || searchText.includes("legisla")) inferredTags.push("Legislación")
      
      // Siempre incluir E-waste
      if (!inferredTags.includes("E-waste")) inferredTags.unshift("E-waste")

      return {
        id: article.id,
        title: article.title,
        authors: article.authors.join(", "),
        date: article.published,
        source: "arXiv",
        tags: inferredTags,
        url: article.link,
        abstract: article.summary,
      }
    })
  }

  // Cargar resultados de arXiv al abrir el panel
  useEffect(() => {
    const loadDefaultResults = async () => {
      if (isOpen && arxivResults.length === 0 && !isLoading) {
        setIsLoading(true)
        setLoadError(null)
        
        console.log("Cargando artículos desde arXiv...")
        console.log("Query:", DEFAULT_QUERY)
        
        try {
          const results = await searchArxiv({
            query: DEFAULT_QUERY,
            maxResults: 30,
          })
          
          console.log(`Artículos cargados: ${results.length}`)
          setArxivResults(results)
          
          if (results.length === 0) {
            setLoadError("No se encontraron artículos. La API de arXiv puede estar temporalmente no disponible.")
          }
        } catch (error) {
          console.error("Error al cargar artículos:", error)
          setLoadError("Error al cargar los artículos. Por favor, recarga la página.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadDefaultResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const researchItems = arxivToResearchItems(arxivResults)

  // Filtrar por etiquetas
  const filteredResearch = researchItems.filter((item) => {
    // Si no hay etiquetas seleccionadas, mostrar todos
    if (selectedTags.length === 0) return true
    
    // Verificar si el artículo tiene al menos una de las etiquetas seleccionadas
    return selectedTags.some((tag) => item.tags.includes(tag))
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel deslizante */}
      <div
        className={`fixed top-0 right-0 h-full w-[600px] bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del panel */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Repositorio de Investigaciones</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Artículos sobre E-waste y gestión de residuos electrónicos
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Cerrar panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contenido del panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Etiquetas */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Filtrar por etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Resultados */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Resultados ({filteredResearch.length})
                </h3>
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Cargando...
                  </div>
                )}
              </div>
              
              {loadError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-xs text-destructive">{loadError}</p>
                </div>
              )}
              
              {!isLoading && !loadError && researchItems.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No se pudieron cargar artículos de arXiv.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recarga la página para intentar nuevamente.
                  </p>
                </div>
              )}
              
              {!isLoading && !loadError && researchItems.length > 0 && filteredResearch.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No se encontraron artículos con los filtros seleccionados.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total de artículos disponibles: {researchItems.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Intenta ajustar o quitar los filtros.
                  </p>
                </div>
              )}
              <div className="space-y-4">
                {filteredResearch.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-background border border-border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
                        title="Ver en arXiv"
                        aria-label="Ver artículo en arXiv"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{item.authors}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">{item.source}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{item.abstract}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
