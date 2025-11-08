import Image from "next/image"

interface FlagIconProps {
  countryCode: string
  countryName: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function FlagIcon({ countryCode, countryName, size = "md" }: FlagIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  const iconSize = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
  }

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <Image
        src={`https://flagcdn.com/${countryCode}.svg`}
        alt={`Bandera de ${countryName}`}
        width={iconSize[size]}
        height={iconSize[size]}
        className="rounded-md shadow-md object-cover"
        unoptimized
      />
    </div>
  )
}
