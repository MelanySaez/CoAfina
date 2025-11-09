"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import { ResearchRepositoryPanel } from "./research-repository-panel"

export function Header() {
  const [isRepositoryOpen, setIsRepositoryOpen] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-card px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              E
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">E-Waste Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Análisis modular de residuos electrónicos en Latinoamérica
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRepositoryOpen(true)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                isRepositoryOpen
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "border-2 border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Repositorio de Investigaciones
            </button>
          </div>
        </div>
      </header>

      {/* Panel deslizante */}
      <ResearchRepositoryPanel isOpen={isRepositoryOpen} onClose={() => setIsRepositoryOpen(false)} />
    </>
  )
}
