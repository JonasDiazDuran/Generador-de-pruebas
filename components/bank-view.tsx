"use client"

import { useState, useMemo } from "react"
import { getQuestionBank } from "@/lib/exam-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Filter } from "lucide-react"

const CATEGORIES = [
  { label: "Todas", range: [1, 300] },
  { label: "Ciencias Naturales", range: [1, 50] },
  { label: "Matematicas", range: [51, 100] },
  { label: "Historia", range: [101, 150] },
  { label: "Geografia", range: [151, 200] },
  { label: "Lengua y Literatura", range: [201, 250] },
  { label: "Tecnologia", range: [251, 300] },
]

const ITEMS_PER_PAGE = 20

export function BankView() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [page, setPage] = useState(0)

  const allQuestions = useMemo(() => getQuestionBank(), [])

  const filtered = useMemo(() => {
    let questions = allQuestions
    const cat = CATEGORIES[selectedCategory]
    if (selectedCategory > 0) {
      questions = questions.filter((q) => q.id >= cat.range[0] && q.id <= cat.range[1])
    }
    if (search.trim()) {
      const s = search.toLowerCase()
      questions = questions.filter(
        (q) =>
          q.question.toLowerCase().includes(s) ||
          q.options.some((o) => o.toLowerCase().includes(s))
      )
    }
    return questions
  }, [allQuestions, selectedCategory, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const pageQuestions = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Banco de Preguntas</h2>
            <p className="text-sm text-muted-foreground">{allQuestions.length} preguntas disponibles</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar preguntas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {CATEGORIES.map((cat, i) => (
            <Badge
              key={i}
              variant={selectedCategory === i ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedCategory(i)
                setPage(0)
              }}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Mostrando {pageQuestions.length} de {filtered.length} preguntas
      </p>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        {pageQuestions.map((q) => (
          <Card key={q.id} className="border-border">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-xs font-bold text-primary">
                  {q.id}
                </span>
                <span className="text-sm font-medium leading-relaxed text-foreground">{q.question}</span>
              </div>
              <div className="ml-8 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                      i === q.correctAnswer
                        ? "bg-success/10 font-medium text-success"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="font-mono text-xs">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Anterior
          </Button>
          <span className="px-3 text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
