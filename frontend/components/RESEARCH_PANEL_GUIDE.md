# Repositorio de Investigaciones - Guía de Personalización

## 📋 Descripción

El panel de Repositorio de Investigaciones muestra artículos científicos de arXiv relacionados con residuos electrónicos en Latinoamérica y el Caribe.

## 🔧 Personalización de Etiquetas

Para modificar las etiquetas de filtrado, edita el array `allTags` en el archivo `research-repository-panel.tsx`:

```typescript
// Etiquetas personalizables para filtrar artículos
const allTags = [
  "E-waste",
  "Reciclaje",
  "Economía Circular",
  "Políticas Públicas",
  "Toxicidad",
  "Minería Urbana",
  "Exportación",
  "Gestión",
  "Sostenibilidad",
  "Legislación",
]
```

### Agregar una nueva etiqueta:

1. Añádela al array `allTags`
2. Añade la lógica de detección en la función `arxivToResearchItems`:

```typescript
if (searchText.includes("tu_palabra_clave")) inferredTags.push("Tu Nueva Etiqueta")
```

## 🌎 Personalización de Países

Para modificar la lista de países, edita el array `latinAmericaCountries`:

```typescript
const latinAmericaCountries = [
  { value: "all", label: "Todos los países" },
  { value: "Argentina", label: "Argentina" },
  { value: "Brasil", label: "Brasil" },
  // ... más países
]
```

### Agregar un nuevo país:

```typescript
{ value: "NombrePaís", label: "Nombre País" }
```

Luego añádelo en la detección automática en `arxiv-service.ts`:

```typescript
function detectCountries(text: string): string[] {
  const countries = [
    "Argentina", "Bolivia", "Brasil", // ... países existentes
    "NuevoPaís", // Tu nuevo país
  ]
  // ...
}
```

## 🔍 Búsqueda Predeterminada

La búsqueda por defecto se define en `arxiv-service.ts`:

```typescript
export const DEFAULT_QUERY = "all:(electronic+waste+latin+america+OR+e-waste+latinoamerica+OR+residuos+electronicos)"
```

Puedes modificarla para buscar otros términos o combinaciones.

## ⚙️ Configuración de Resultados

Para cambiar el número de resultados cargados, modifica el parámetro `maxResults`:

```typescript
const results = await searchArxiv({
  query: DEFAULT_QUERY,
  maxResults: 50, // Cambia este número (max 100)
})
```

## 🏷️ Sistema de Tags Automático

Las etiquetas se infieren automáticamente del contenido de cada artículo:

- **Reciclaje**: Si contiene "recicl" o "recycl"
- **Economía Circular**: Si contiene "circular" o "economy"
- **Políticas Públicas**: Si contiene "polic", "law" o "regulation"
- **Toxicidad**: Si contiene "toxic" o "tóxico"
- **Minería Urbana**: Si contiene "mining" o "minería"
- **Exportación**: Si contiene "export" o "import"
- **Gestión**: Si contiene "management" o "gestión"
- **Sostenibilidad**: Si contiene "sustain" o "sostenib"
- **Legislación**: Si contiene "legislation" o "legisla"

## 🚀 Funcionalidades

### Filtrado por Etiquetas
- Selecciona una o más etiquetas para filtrar artículos
- El filtrado es inclusivo (muestra artículos que contengan AL MENOS UNA de las etiquetas seleccionadas)

### Filtrado por País
- Selecciona un país específico o "Todos los países"
- Los artículos se filtran por países detectados en el título y resumen

### Información Mostrada
- Título del artículo
- Autores (truncados si son muchos)
- Fecha de publicación
- Países relacionados
- Resumen (máximo 3 líneas)
- Etiquetas inferidas
- Enlace directo a arXiv

## 📝 Notas Técnicas

- La búsqueda se realiza automáticamente al abrir el panel
- Los resultados se cachean (no se recargan al cerrar/abrir el panel)
- Para recargar, recarga la página
- La API de arXiv tiene límite de 1 petición cada 3 segundos
- Los países se detectan automáticamente del contenido del artículo
