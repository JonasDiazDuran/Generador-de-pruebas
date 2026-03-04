"use client"

import { AppView } from "@/lib/types"
import { FileText, Home, ClipboardList, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  currentView: AppView
  onNavigate: (view: AppView) => void
  resultsCount: number
}

export function Header({ currentView, onNavigate, resultsCount }: HeaderProps) {
  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: "home", label: "Inicio", icon: <Home className="h-4 w-4" /> },
    { view: "bank", label: "Banco de Preguntas", icon: <BookOpen className="h-4 w-4" /> },
    { view: "exam", label: "Nuevo Examen", icon: <FileText className="h-4 w-4" /> },
    { view: "results", label: `Resultados${resultsCount > 0 ? ` (${resultsCount})` : ""}`, icon: <ClipboardList className="h-4 w-4" /> },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight tracking-tight text-foreground">ExamGen</span>
            <span className="text-[10px] leading-tight text-muted-foreground">Generador de Examenes</span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.view}
              variant={currentView === item.view ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate(item.view)}
              className="gap-2"
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>

        <nav className="flex items-center gap-1 md:hidden">
          {navItems.map((item) => (
            <Button
              key={item.view}
              variant={currentView === item.view ? "default" : "ghost"}
              size="icon"
              onClick={() => onNavigate(item.view)}
              aria-label={item.label}
              className="h-9 w-9"
            >
              {item.icon}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}
