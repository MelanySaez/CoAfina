"use client"

interface Block {
  id: string
  type: string
  side: "left" | "right" | null
  value: number
}

interface MetricsPanelProps {
  blocksLeft: Block[]
  blocksRight: Block[]
  country: string
}

export function MetricsPanel({ blocksLeft, blocksRight, country }: MetricsPanelProps) {
  const calculateTotal = (blocks: Block[]) => {
    return blocks.reduce((sum, block) => sum + block.value, 0)
  }

  const totalLeft = calculateTotal(blocksLeft)
  const totalRight = calculateTotal(blocksRight)
  const difference = totalLeft - totalRight
  const ratio = totalLeft > 0 ? ((totalRight / totalLeft) * 100).toFixed(1) : "0"

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Métricas para {country}</h3>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Total Izquierdo</p>
          <p className="mt-1 text-lg font-bold text-primary">{totalLeft.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Total Derecho</p>
          <p className="mt-1 text-lg font-bold text-secondary">{totalRight.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Diferencia</p>
          <p className={`mt-1 text-lg font-bold ${difference >= 0 ? "text-primary" : "text-destructive"}`}>
            {difference.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Ratio (%)</p>
          <p className="mt-1 text-lg font-bold text-accent">{ratio}%</p>
        </div>
      </div>
    </div>
  )
}
