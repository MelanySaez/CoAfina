/**
 * Servicio para interactuar con la API de arXiv
 * Documentación: https://arxiv.org/help/api/
 */

export interface ArxivArticle {
  id: string
  title: string
  authors: string[]
  published: string
  summary: string
  link: string
  pdfLink: string
  categories: string[]
  countries: string[] // Países mencionados en el abstract/title
}

interface ArxivSearchParams {
  query: string
  maxResults?: number
  startIndex?: number
}

/**
 * Parsea la respuesta XML de arXiv a objetos JavaScript
 */
function parseArxivResponse(xmlText: string): ArxivArticle[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, "text/xml")
  
  const entries = Array.from(xmlDoc.getElementsByTagName("entry"))
  const articles: ArxivArticle[] = []

  for (const entry of entries) {
    // Extraer ID del artículo
    const idElement = entry.getElementsByTagName("id")[0]
    const fullId = idElement?.textContent || ""
    const id = fullId.split("/abs/")[1] || fullId
    
    // Extraer título
    const titleElement = entry.getElementsByTagName("title")[0]
    const title = titleElement?.textContent?.trim().replaceAll(/\s+/g, " ") || ""
    
    // Extraer autores
    const authorElements = Array.from(entry.getElementsByTagName("author"))
    const authors: string[] = []
    for (const authorElement of authorElements) {
      const nameElement = authorElement.getElementsByTagName("name")[0]
      if (nameElement?.textContent) {
        authors.push(nameElement.textContent)
      }
    }
    
    // Extraer fecha de publicación
    const publishedElement = entry.getElementsByTagName("published")[0]
    const published = publishedElement?.textContent?.split("T")[0] || ""
    
    // Extraer resumen
    const summaryElement = entry.getElementsByTagName("summary")[0]
    const summary = summaryElement?.textContent?.trim().replaceAll(/\s+/g, " ") || ""
    
    // Extraer enlaces
    const linkElements = Array.from(entry.getElementsByTagName("link"))
    let link = ""
    let pdfLink = ""
    
    for (const linkElement of linkElements) {
      const href = linkElement.getAttribute("href") || ""
      const linkTitle = linkElement.getAttribute("title") || ""
      
      if (linkTitle === "pdf") {
        pdfLink = href
      } else if (!link) {
        link = href
      }
    }
    
    // Extraer categorías
    const categoryElements = Array.from(entry.getElementsByTagName("category"))
    const categories: string[] = []
    for (const categoryElement of categoryElements) {
      const term = categoryElement.getAttribute("term")
      if (term) {
        categories.push(term)
      }
    }
    
    // Detectar países mencionados
    const countries = detectCountries(title + " " + summary)
    
    articles.push({
      id,
      title,
      authors,
      published,
      summary,
      link: link || `https://arxiv.org/abs/${id}`,
      pdfLink: pdfLink || `https://arxiv.org/pdf/${id}.pdf`,
      categories,
      countries,
    })
  }
  
  return articles
}

/**
 * Detecta países de Latinoamérica y el Caribe mencionados en el texto
 */
function detectCountries(text: string): string[] {
  const textLower = text.toLowerCase()
  
  // Mapeo de variaciones a país normalizado
  const countryMapping: Record<string, string> = {
    'argentina': 'Argentina',
    'bolivia': 'Bolivia',
    'brasil': 'Brasil',
    'brazil': 'Brasil',
    'chile': 'Chile',
    'colombia': 'Colombia',
    'costa rica': 'Costa Rica',
    'cuba': 'Cuba',
    'ecuador': 'Ecuador',
    'el salvador': 'El Salvador',
    'guatemala': 'Guatemala',
    'honduras': 'Honduras',
    'méxico': 'México',
    'mexico': 'México',
    'nicaragua': 'Nicaragua',
    'panamá': 'Panamá',
    'panama': 'Panamá',
    'paraguay': 'Paraguay',
    'perú': 'Perú',
    'peru': 'Perú',
    'república dominicana': 'República Dominicana',
    'dominican republic': 'República Dominicana',
    'uruguay': 'Uruguay',
    'venezuela': 'Venezuela',
    'haití': 'Haití',
    'haiti': 'Haití',
    'jamaica': 'Jamaica',
    'trinidad y tobago': 'Trinidad y Tobago',
    'trinidad and tobago': 'Trinidad y Tobago',
    'bahamas': 'Bahamas',
    'barbados': 'Barbados',
    'belize': 'Belize',
    'guyana': 'Guyana',
    'suriname': 'Suriname',
    'latin america': 'Latinoamérica',
    'latinamerica': 'Latinoamérica',
    'latinoamérica': 'Latinoamérica',
    'south america': 'Latinoamérica',
    'caribbean': 'Caribe',
    'caribe': 'Caribe',
  }
  
  const detectedCountries = new Set<string>()
  
  for (const [searchTerm, normalizedName] of Object.entries(countryMapping)) {
    if (textLower.includes(searchTerm)) {
      detectedCountries.add(normalizedName)
    }
  }
  
  return Array.from(detectedCountries)
}

/**
 * Busca artículos en arXiv
 */
export async function searchArxiv({
  query,
  maxResults = 50,
  startIndex = 0,
}: ArxivSearchParams): Promise<ArxivArticle[]> {
  try {
    // Construir la URL de búsqueda
    const baseUrl = "https://export.arxiv.org/api/query"
    const params = new URLSearchParams({
      search_query: query,
      max_results: maxResults.toString(),
      start: startIndex.toString(),
      sortBy: "relevance",
      sortOrder: "descending",
    })
    
    const url = `${baseUrl}?${params.toString()}`
    console.log("URL de búsqueda arXiv:", url)
    
    // Hacer la petición
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Error en la búsqueda de arXiv: ${response.status} ${response.statusText}`)
    }
    
    const xmlText = await response.text()
    console.log("Respuesta XML recibida, longitud:", xmlText.length)
    
    if (xmlText.length < 100) {
      console.warn("Respuesta XML muy corta, posiblemente vacía")
    }
    
    const articles = parseArxivResponse(xmlText)
    console.log(`Artículos parseados: ${articles.length}`)
    
    return articles
  } catch (error) {
    console.error("Error al buscar en arXiv:", error)
    throw error
  }
}

/**
 * Búsqueda predeterminada para e-waste
 * Cubre múltiples términos relevantes para residuos electrónicos
 */
export const DEFAULT_QUERY = 'all:("electronic waste" OR "e-waste" OR "electronic scrap" OR "waste electrical and electronic equipment" OR WEEE OR RAEE OR "electronic recycling" OR "end-of-life electronics" OR "EoL electronics")'
