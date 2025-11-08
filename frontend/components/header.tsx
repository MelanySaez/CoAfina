export function Header() {
  return (
    <header className="border-b border-border bg-card px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            E
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">E-Waste Analytics</h1>
            <p className="text-sm text-muted-foreground">Análisis modular de residuos electrónicos en Latinoamérica</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            Guardar Escenario
          </button>
          <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground font-medium text-sm hover:bg-border transition-colors">
            Ayuda
          </button>
        </div>
      </div>
    </header>
  )
}
