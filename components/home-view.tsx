"use client"

import { AppView } from "@/lib/types"
import { FileText, BookOpen, ClipboardList, Shuffle, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface HomeViewProps {
  onNavigate: (view: AppView) => void
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "300 Preguntas",
      description: "Banco completo con preguntas de ciencias, matematicas, historia, geografia, lengua y tecnologia.",
    },
    {
      icon: <Shuffle className="h-6 w-6" />,
      title: "Seleccion Aleatoria",
      description: "Cada examen selecciona 100 preguntas al azar y mezcla el orden de las respuestas.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Calificacion Automatica",
      description: "Al finalizar, obtendras tu calificacion detallada con respuestas correctas e incorrectas.",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Exportar a Excel",
      description: "Descarga los resultados en un archivo Excel con resumen y detalles por examen.",
    },
  ]

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex w-full flex-col items-center gap-6 px-4 pb-16 pt-16 text-center lg:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 text-primary" />
          <span>Plataforma de evaluacion academica</span>
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
          Genera examenes aleatorios en segundos
        </h1>

        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Selecciona 100 preguntas de un banco de 300, con respuestas mezcladas automaticamente. 
          Califica al instante y exporta los resultados a Excel.
        </p>

        <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row">
          <Button size="lg" onClick={() => onNavigate("exam")} className="gap-2 px-8 text-base">
            <FileText className="h-5 w-5" />
            Iniciar Examen
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate("bank")} className="gap-2 px-8 text-base">
            <BookOpen className="h-5 w-5" />
            Ver Banco de Preguntas
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Card key={i} className="border-border bg-card transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="w-full border-t border-border bg-card py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-around gap-8 px-4 sm:flex-row">
          {[
            { value: "300", label: "Preguntas en banco" },
            { value: "100", label: "Preguntas por examen" },
            { value: "6", label: "Categorias tematicas" },
            { value: "4", label: "Opciones por pregunta" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <span className="font-mono text-3xl font-bold text-primary">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
