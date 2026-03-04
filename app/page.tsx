"use client"

import { useState, useCallback } from "react"
import { AppView, ExamResult } from "@/lib/types"
import { Header } from "@/components/header"
import { HomeView } from "@/components/home-view"
import { ExamView } from "@/components/exam-view"
import { BankView } from "@/components/bank-view"
import { ResultsView } from "@/components/results-view"
import { toast } from "sonner"

export default function Page() {
  const [currentView, setCurrentView] = useState<AppView>("home")
  const [results, setResults] = useState<ExamResult[]>([])

  const handleExamComplete = useCallback((result: ExamResult) => {
    setResults((prev) => [result, ...prev])
    setCurrentView("results")
  }, [])

  const handleClearResults = useCallback(() => {
    setResults([])
    toast.info("Resultados eliminados")
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        resultsCount={results.length}
      />

      <main className="flex-1">
        {currentView === "home" && <HomeView onNavigate={setCurrentView} />}
        {currentView === "exam" && <ExamView onComplete={handleExamComplete} />}
        {currentView === "bank" && <BankView />}
        {currentView === "results" && (
          <ResultsView results={results} onClearResults={handleClearResults} />
        )}
      </main>

      <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
        ExamGen - Generador de Examenes Aleatorios
      </footer>
    </div>
  )
}
