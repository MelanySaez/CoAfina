"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Agregar estilos de animación al documento
    const style = document.createElement('style')
    style.textContent = `
      .scroll-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .scroll-reveal.show {
        opacity: 1;
        transform: translateY(0);
      }

      .scroll-reveal-left {
        opacity: 0;
        transition: opacity 0.6s ease-out;
      }
      
      .scroll-reveal-left.show {
        opacity: 1;
      }

      .scroll-reveal-right {
        opacity: 0;
        transition: opacity 0.6s ease-out;
      }
      
      .scroll-reveal-right.show {
        opacity: 1;
      }

      .scroll-reveal-scale {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .scroll-reveal-scale.show {
        opacity: 1;
        transform: scale(1);
      }
    `
    document.head.appendChild(style)

    // Intersection Observer para las animaciones
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show")
          } else {
            entry.target.classList.remove("show")
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    )

    const elements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale")
    for (const el of elements) {
      observerRef.current?.observe(el)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      style.remove()
    }
  }, [])

  return (
    <>
      <Header />
      
      {/* Hero Section - Sin animación, siempre visible */}
      <section className="relative px-6 pt-20 pb-32 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="absolute inset-0 -z-10">
          {/* Imagen de fondo con overlay - Placeholder temporal */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=80')"}}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
                E-Waste Analytics
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-muted-foreground">
                Transformando Datos en Impacto Ambiental
              </p>
            </div>

            <p className="mx-auto max-w-3xl text-lg md:text-xl text-foreground/80 leading-relaxed">
              Plataforma de análisis y visualización de residuos de aparatos eléctricos y electrónicos (RAEE) en Latinoamérica. 
              Empoderamos a investigadores, gobiernos y organizaciones con datos precisos para impulsar la economía circular.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/workspace">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all">
                  Explorar Plataforma
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-accent/10">
                Ver Documentación
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="px-6 py-16 lg:px-8 bg-card/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent scroll-reveal">
            Nuestro Impacto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/20 scroll-reveal">
              <div className="text-5xl font-black text-primary mb-3">15+</div>
              <div className="text-lg font-bold text-foreground mb-2">Países Analizados</div>
              <div className="text-sm text-muted-foreground">
                Cobertura completa de Latinoamérica con datos actualizados
              </div>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/30 hover:border-secondary/50 transition-all hover:shadow-xl hover:shadow-secondary/20 scroll-reveal">
              <div className="text-5xl font-black text-secondary mb-3">50K+</div>
              <div className="text-lg font-bold text-foreground mb-2">Registros Procesados</div>
              <div className="text-sm text-muted-foreground">
                Miles de puntos de datos analizados y verificados
              </div>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 hover:border-accent/50 transition-all hover:shadow-xl hover:shadow-accent/20 scroll-reveal">
              <div className="text-5xl font-black text-accent mb-3">100+</div>
              <div className="text-lg font-bold text-foreground mb-2">Artículos Científicos</div>
              <div className="text-sm text-muted-foreground">
                Repositorio integrado con investigación de vanguardia
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-20 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 scroll-reveal-left">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Nuestra Misión
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                En E-Waste Analytics, creemos que los datos son la clave para resolver la crisis de los residuos electrónicos. 
                Nuestra plataforma democratiza el acceso a información crítica sobre RAEE, permitiendo a investigadores, 
                formuladores de políticas y organizaciones tomar decisiones informadas.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                A través de visualizaciones interactivas, análisis comparativos y un repositorio de investigación actualizado, 
                facilitamos la transición hacia una economía circular en Latinoamérica.
              </p>
            </div>

            {/* Imagen ilustrativa de reciclaje electrónico - Placeholder temporal */}
            <div className="relative scroll-reveal-right">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80" 
                  alt="Proceso de reciclaje de residuos electrónicos"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badge flotante */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary to-secondary text-white px-6 py-4 rounded-2xl shadow-2xl">
                <div className="text-3xl font-black">100%</div>
                <div className="text-xs font-bold">Reciclable</div>
              </div>
            </div>
          </div>

          {/* Grid de imágenes pequeñas con datos */}
          {/* Grid de 4 cards con imágenes - Placeholders temporales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/30 hover:scale-105 transition-transform scroll-reveal-scale">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" 
                  alt="Placas de circuitos"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">Componentes</h3>
              <p className="text-sm text-muted-foreground">
                Metales preciosos recuperables
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-2 border-secondary/30 hover:scale-105 transition-transform scroll-reveal-scale">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&q=80" 
                  alt="Recolección de RAEE"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">Recolección</h3>
              <p className="text-sm text-muted-foreground">
                Sistemas de acopio regional
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30 hover:scale-105 transition-transform scroll-reveal-scale">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" 
                  alt="Análisis de datos"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">Análisis</h3>
              <p className="text-sm text-muted-foreground">
                Insights basados en datos
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/30 hover:scale-105 transition-transform scroll-reveal-scale">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80" 
                  alt="Economía circular"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">Circularidad</h3>
              <p className="text-sm text-muted-foreground">
                Cerrando el ciclo productivo
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 lg:px-8 bg-card/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent scroll-reveal">
            Características Principales
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto scroll-reveal">
            Herramientas poderosas diseñadas para investigadores y tomadores de decisiones
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary/50 scroll-reveal-scale">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M3 3v18h18"/>
                  <path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Análisis Comparativo</h3>
              <p className="text-muted-foreground">
                Compara métricas de RAEE entre diferentes países con drag & drop intuitivo
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-secondary/50 scroll-reveal-scale">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Visualización de Datos</h3>
              <p className="text-muted-foreground">
                Gráficas interactivas con datos históricos y tendencias temporales
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-accent/50 scroll-reveal-scale">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Repositorio Científico</h3>
              <p className="text-muted-foreground">
                Acceso a artículos de arXiv sobre e-waste y economía circular
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary/50 scroll-reveal-scale">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Carga de CSV</h3>
              <p className="text-muted-foreground">
                Importa tus propios datasets y visualiza resultados al instante
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-secondary/50 scroll-reveal-scale">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Colaboración</h3>
              <p className="text-muted-foreground">
                Diseñado para equipos de investigación y organizaciones
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-accent/50 scroll-reveal-scale">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Datos Confiables</h3>
              <p className="text-muted-foreground">
                Información verificada de fuentes oficiales y académicas
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/30 rounded-3xl p-12 shadow-2xl scroll-reveal-scale">
            <h2 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ¿Listo para Hacer la Diferencia?
            </h2>
            <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
              Únete a investigadores, gobiernos y organizaciones que están usando E-Waste Analytics para impulsar 
              la economía circular en Latinoamérica
            </p>
            <Link href="/workspace">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all">
                Comenzar Ahora
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 px-6 py-12 lg:px-8 scroll-reveal">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                E-Waste Analytics
              </h3>
              <p className="text-sm text-muted-foreground">
                Transformando datos en impacto ambiental
              </p>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              © 2025 E-Waste Analytics • Proyecto CoAfina Hackathon<br/>
              Desarrollado con 💚 para un futuro sostenible
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}