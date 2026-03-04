"use client"

import { useState } from "react"
import { ExamResult } from "@/lib/types"
import { exportResultsToExcel, exportSingleResultToExcel } from "@/lib/excel-export"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Download,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from "lucide-react"

interface ResultsViewProps {
  results: ExamResult[]
  onClearResults: () => void
}

export function ResultsView({ results, onClearResults }: ResultsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleExportAll = () => {
    if (results.length === 0) {
      toast.error("No hay resultados para exportar")
      return
    }
    exportResultsToExcel(results)
    toast.success("Archivo Excel descargado")
  }

  const handleExportSingle = (result: ExamResult) => {
    exportSingleResultToExcel(result)
    toast.success(`Resultado de ${result.studentName} exportado`)
  }

  if (results.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-foreground">Sin Resultados</h2>
          <p className="text-muted-foreground">
            Aun no se ha completado ningun examen. Los resultados apareceran aqui una vez que alguien finalice un examen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Resultados de Examenes</h2>
            <p className="text-sm text-muted-foreground">{results.length} examen(es) completado(s)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleExportAll} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Todo a Excel
          </Button>
          <Button variant="outline" size="icon" onClick={onClearResults} aria-label="Borrar resultados">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Promedio",
            value: `${Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)}%`,
          },
          {
            label: "Mejor Nota",
            value: `${Math.max(...results.map((r) => r.percentage))}%`,
          },
          {
            label: "Peor Nota",
            value: `${Math.min(...results.map((r) => r.percentage))}%`,
          },
          {
            label: "Aprobados",
            value: `${results.filter((r) => r.percentage >= 60).length}/${results.length}`,
          },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <span className="font-mono text-2xl font-bold text-primary">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results list */}
      <div className="flex flex-col gap-3">
        {results.map((result) => {
          const isExpanded = expandedId === result.id
          const isPassing = result.percentage >= 60

          return (
            <Card key={result.id} className="border-border">
              <CardHeader
                className="cursor-pointer p-4"
                onClick={() => setExpandedId(isExpanded ? null : result.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold ${
                        isPassing
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {result.percentage}%
                    </div>
                    <div className="flex flex-col">
                      <CardTitle className="text-base text-foreground">{result.studentName}</CardTitle>
                      <span className="text-xs text-muted-foreground">{result.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={isPassing ? "default" : "destructive"}>
                      {isPassing ? "Aprobado" : "Reprobado"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.score}/{result.totalQuestions}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="flex flex-col gap-3 border-t border-border px-4 pb-4 pt-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportSingle(result)
                      }}
                      className="gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Exportar Excel
                    </Button>
                  </div>

                  <div className="max-h-96 space-y-2 overflow-y-auto pr-2">
                    {result.answers.map((a, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 rounded-md p-2 text-sm ${
                          a.isCorrect ? "bg-success/5" : "bg-destructive/5"
                        }`}
                      >
                        {a.isCorrect ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-foreground">
                            {i + 1}. {a.questionText}
                          </span>
                          {!a.isCorrect && (
                            <span className="text-xs text-muted-foreground">
                              Respuesta: {a.selectedAnswer || "Sin responder"} | Correcta: {a.correctAnswer}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
