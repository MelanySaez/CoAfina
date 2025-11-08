// Funciones auxiliares para el manejo de países

import { COUNTRY_CODES, COUNTRY_FLAGS } from "./constants"

/**
 * Obtiene el código ISO de un país, normalizando diferentes variaciones del nombre
 * @param countryName - Nombre del país
 * @returns Código ISO del país (ej: "ar", "br", "mx")
 */
export const getCountryCode = (countryName: string): string => {
  // Intentar búsqueda directa
  if (COUNTRY_CODES[countryName]) {
    return COUNTRY_CODES[countryName]
  }

  // Intentar sin espacios
  const noSpaces = countryName.replace(/\s+/g, "")
  if (COUNTRY_CODES[noSpaces]) {
    return COUNTRY_CODES[noSpaces]
  }

  // Intentar reemplazando guiones bajos por espacios
  const withSpaces = countryName.replace(/_/g, " ")
  if (COUNTRY_CODES[withSpaces]) {
    return COUNTRY_CODES[withSpaces]
  }

  // Fallback: primeras dos letras en minúscula
  return countryName.toLowerCase().slice(0, 2)
}

/**
 * Obtiene el emoji de la bandera de un país
 * @param countryName - Nombre del país
 * @returns Emoji de la bandera o bandera genérica
 */
export const getCountryFlag = (countryName: string): string => {
  // Intentar búsqueda directa
  if (COUNTRY_FLAGS[countryName]) {
    return COUNTRY_FLAGS[countryName]
  }

  // Intentar sin espacios
  const noSpaces = countryName.replace(/\s+/g, "")
  if (COUNTRY_FLAGS[noSpaces]) {
    return COUNTRY_FLAGS[noSpaces]
  }

  // Intentar reemplazando guiones bajos por espacios
  const withSpaces = countryName.replace(/_/g, " ")
  if (COUNTRY_FLAGS[withSpaces]) {
    return COUNTRY_FLAGS[withSpaces]
  }

  // Fallback: bandera genérica
  return "🏴"
}

/**
 * Normaliza el nombre de un país para mostrar
 * @param countryName - Nombre del país que puede venir con guiones bajos
 * @returns Nombre formateado con espacios
 */
export const formatCountryName = (countryName: string): string => {
  return countryName.replace(/_/g, " ")
}
