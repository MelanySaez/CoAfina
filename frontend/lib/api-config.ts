// Configuración de la API del backend
export const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://coafina-tvbg.onrender.com",
  endpoints: {
    countries: "/data/countries",
    data: "/data",
    stats: "/data/stats",
    comparison: "/data/comparison",
    countryData: (country: string) => `/data/country/${country}`,
    yearData: (year: number) => `/data/year/${year}`,
  },
};

// Helper para construir URLs completas
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};
