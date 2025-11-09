import Image from "next/image"

interface FlagIconProps {
  countryCode: string
  countryName: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function FlagIcon({ countryCode, countryName, size = "md" }: FlagIconProps) {
  // Proporciones rectangulares 3:2 para banderas
  const sizeClasses = {
    sm: "w-10 h-7",
    md: "w-14 h-10",
    lg: "w-20 h-14",
    xl: "w-24 h-16",
  }

  const iconSize = {
    sm: { width: 40, height: 28 },
    md: { width: 56, height: 40 },
    lg: { width: 80, height: 56 },
    xl: { width: 96, height: 64 },
  }

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <Image
        src={`https://flagcdn.com/${countryCode}.svg`}
        alt={`Bandera de ${countryName}`}
        width={iconSize[size].width}
        height={iconSize[size].height}
        className="rounded shadow-md object-contain"
        unoptimized
      />
    </div>
  )
}
