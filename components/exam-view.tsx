"use client"

import { useState, useCallback, useMemo } from "react"
import { ExamQuestion, ExamResult } from "@/lib/types"
import { generateExam, gradeExam } from "@/lib/exam-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react"

interface ExamViewProps {
  onComplete: (result: ExamResult) => void
}

type ExamPhase = "setup" | "taking" | "review"

export function ExamView({ onComplete }: ExamViewProps) {
  const [phase, setPhase] = useState<ExamPhase>("setup")
  const [studentName, setStudentName] = useState("")
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, number | null>>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [result, setResult] = useState<ExamResult | null>(null)

  const QUESTIONS_PER_PAGE = 10
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)

  const currentQuestions = useMemo(() => {
    const start = currentPage * QUESTIONS_PER_PAGE
    return questions.slice(start, start + QUESTIONS_PER_PAGE)
  }, [questions, currentPage])

  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => a !== null && a !== undefined).length,
    [answers]
  )

  const handleStartExam = useCallback(() => {
    if (!studentName.trim()) {
      toast.error("Por favor ingresa tu nombre")
      return
    }
    const exam = generateExam(100)
    setQuestions(exam)
    setAnswers({})
    setCurrentPage(0)
    setPhase("taking")
    toast.success("Examen generado con 100 preguntas aleatorias")
  }, [studentName])

  const handleSelectAnswer = useCallback((questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }, [])

  const handleSubmitExam = useCallback(() => {
    if (answeredCount < questions.length) {
      const unanswered = questions.length - answeredCount
      toast.warning(`Tienes ${unanswered} preguntas sin responder. Puedes enviar de todas formas.`)
    }
    const examResult = gradeExam(questions, answers, studentName)
    setResult(examResult)
    onComplete(examResult)
    setPhase("review")
    toast.success(`Examen completado: ${examResult.percentage}%`)
  }, [answeredCount, questions, answers, studentName, onComplete])

  const handleRestart = useCallback(() => {
    setPhase("setup")
    setStudentName("")
    setQuestions([])
    setAnswers({})
    setCurrentPage(0)
    setResult(null)
  }, [])

  // Setup Phase
  if (phase === "setup") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-8 px-4 py-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Configurar Examen</h2>
          <p className="text-muted-foreground">
            Se seleccionaran 100 preguntas aleatoriamente del banco de 300 preguntas.
          </p>
        </div>

        <Card className="w-full">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="studentName">Nombre del Estudiante</Label>
              <Input
                id="studentName"
                placeholder="Ingresa tu nombre completo"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartExam()}
              />
            </div>
            <Button onClick={handleStartExam} className="gap-2" size="lg">
              <RefreshCw className="h-4 w-4" />
              Generar y Comenzar Examen
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <AlertCircle className="h-4 w-4 text-primary" />
            Instrucciones
          </div>
          <ul className="ml-6 list-disc space-y-1">
            <li>El examen consta de 100 preguntas de opcion multiple</li>
            <li>Cada pregunta tiene 4 opciones de respuesta</li>
            <li>Las preguntas y opciones se mezclan aleatoriamente</li>
            <li>Al finalizar podras ver tu calificacion y exportar a Excel</li>
          </ul>
        </div>
      </div>
    )
  }

  // Review Phase
  if (phase === "review" && result) {
    const isPassing = result.percentage >= 60
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        {/* Score card */}
        <Card className={`border-2 ${isPassing ? "border-success" : "border-destructive"}`}>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full ${
                isPassing ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {isPassing ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {result.percentage}%
              </h2>
              <p className="text-muted-foreground">
                {result.score} de {result.totalQuestions} respuestas correctas
              </p>
            </div>
            <span
              className={`rounded-full px-4 py-1 text-sm font-medium ${
                isPassing
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {isPassing ? "Aprobado" : "Reprobado"}
            </span>
            <p className="text-sm text-muted-foreground">
              Estudiante: {result.studentName} | Fecha: {result.date}
            </p>
          </CardContent>
        </Card>

        {/* Detailed answers */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-foreground">Detalle de Respuestas</h3>
          {result.answers.map((a, i) => (
            <Card key={i} className={`border ${a.isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-start gap-2">
                  {a.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  )}
                  <span className="font-medium text-foreground">
                    {i + 1}. {a.questionText}
                  </span>
                </div>
                {!a.isCorrect && (
                  <div className="ml-7 flex flex-col gap-1 text-sm">
                    <span className="text-destructive">
                      Tu respuesta: {a.selectedAnswer || "Sin responder"}
                    </span>
                    <span className="text-success">
                      Respuesta correcta: {a.correctAnswer}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pb-8">
          <Button onClick={handleRestart} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Realizar Nuevo Examen
          </Button>
        </div>
      </div>
    )
  }

  // Taking Phase
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6">
      {/* Progress bar */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Respondidas: <span className="font-semibold text-foreground">{answeredCount}</span> / {questions.length}
            </span>
            <span className="font-mono text-sm text-primary">{Math.round((answeredCount / questions.length) * 100)}%</span>
          </div>
          <Progress value={(answeredCount / questions.length) * 100} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Estudiante: {studentName}</span>
            <span>Pagina {currentPage + 1} de {totalPages}</span>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {currentQuestions.map((q, idx) => {
          const globalIndex = currentPage * QUESTIONS_PER_PAGE + idx
          const selectedAnswer = answers[q.id]

          return (
            <Card key={q.id} className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium leading-relaxed text-foreground">
                  <span className="mr-2 font-mono text-sm text-primary">{globalIndex + 1}.</span>
                  {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0">
                {q.shuffledOptions.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(q.id, optIdx)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                      selectedAnswer === optIdx
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                        selectedAnswer === optIdx
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    {option}
                  </button>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pb-8 pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                currentPage === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentPage < totalPages - 1 ? (
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmitExam} className="gap-2">
            <Send className="h-4 w-4" />
            Enviar Examen
          </Button>
        )}
      </div>
    </div>
  )
}
