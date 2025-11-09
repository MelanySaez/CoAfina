"use client"

import { useState } from "react"
import { X, Tag, ExternalLink, Calendar } from "lucide-react"

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

  // Sample research data - en producción vendría de una API
  const allTags = [
    "E-waste",
    "Latinoamérica",
    "Reciclaje",
    "Economía Circular",
    "Políticas Públicas",
    "Toxicidad",
    "Minería Urbana",
    "Exportación",
  ]

  const researchItems: ResearchItem[] = [
    {
      id: "1",
      title: "Electronic Waste Management in Latin America: Current Status and Future Perspectives",
      authors: "García, M., Santos, R., López, A.",
      date: "2024-01",
      source: "arXiv",
      tags: ["E-waste", "Latinoamérica", "Políticas Públicas"],
      url: "#",
      abstract: "Comprehensive analysis of e-waste management practices across Latin American countries...",
    },
    {
      id: "2",
      title: "Circular Economy Models for Electronic Waste Recycling",
      authors: "Fernández, J., Morales, C.",
      date: "2023-11",
      source: "Environmental Science Journal",
      tags: ["Economía Circular", "Reciclaje", "Minería Urbana"],
      url: "#",
      abstract: "This paper explores innovative circular economy models applied to e-waste recycling...",
    },
    {
      id: "3",
      title: "Toxic Components in Electronic Waste: Health and Environmental Impacts",
      authors: "Silva, P., Ramirez, L.",
      date: "2023-09",
      source: "arXiv",
      tags: ["Toxicidad", "E-waste"],
      url: "#",
      abstract: "Study on the toxic substances present in electronic waste and their environmental impact...",
    },
  ]

  const filteredResearch = researchItems.filter((item) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => item.tags.includes(tag))
    return matchesTags
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
              <p className="text-sm text-muted-foreground mt-1">Filtra artículos por etiquetas</p>
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
              <h3 className="text-sm font-semibold text-foreground">Resultados ({filteredResearch.length})</h3>
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
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.authors}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">{item.source}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.abstract}</p>
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
