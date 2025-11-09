"use client"

import { useState } from "react"
import { BookOpen, Sparkles } from "lucide-react"
import { ResearchRepositoryPanel } from "./research-repository-panel"

export function Header() {
  const [isRepositoryOpen, setIsRepositoryOpen] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-gradient-to-r from-card via-primary/5 to-card px-8 py-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30 transition-transform hover:scale-110">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                E-Waste Analytics
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Análisis modular de residuos electrónicos en Latinoamérica
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRepositoryOpen(true)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-md ${
                isRepositoryOpen
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/40 scale-105"
                  : "border-2 border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Repositorio de Investigaciones
            </button>
          </div>
        </div>
      </header>

      <ResearchRepositoryPanel isOpen={isRepositoryOpen} onClose={() => setIsRepositoryOpen(false)} />
    </>
  )
}
