import * as XLSX from "xlsx"
import { ExamResult } from "./types"

export function exportResultsToExcel(results: ExamResult[]) {
  // Summary sheet data
  const summaryData = results.map((r, index) => ({
    "#": index + 1,
    Nombre: r.studentName,
    Fecha: r.date,
    "Preguntas Correctas": r.score,
    "Total Preguntas": r.totalQuestions,
    "Calificacion (%)": r.percentage,
    Aprobado: r.percentage >= 60 ? "Si" : "No",
  }))

  // Create workbook
  const wb = XLSX.utils.book_new()

  // Summary sheet
  const summaryWs = XLSX.utils.json_to_sheet(summaryData)
  summaryWs["!cols"] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 16 },
    { wch: 16 },
    { wch: 10 },
  ]
  XLSX.utils.book_append_sheet(wb, summaryWs, "Resumen")

  // Detail sheet for each result
  results.forEach((result, index) => {
    const detailData = result.answers.map((a, i) => ({
      "#": i + 1,
      Pregunta: a.questionText,
      "Respuesta Dada": a.selectedAnswer || "Sin responder",
      "Respuesta Correcta": a.correctAnswer,
      Resultado: a.isCorrect ? "Correcta" : "Incorrecta",
    }))

    const detailWs = XLSX.utils.json_to_sheet(detailData)
    detailWs["!cols"] = [
      { wch: 5 },
      { wch: 60 },
      { wch: 40 },
      { wch: 40 },
      { wch: 12 },
    ]

    const sheetName = `${result.studentName.slice(0, 20)}_${index + 1}`
    XLSX.utils.book_append_sheet(wb, detailWs, sheetName)
  })

  // Generate and download
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `resultados_examenes_${new Date().toISOString().slice(0, 10)}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportSingleResultToExcel(result: ExamResult) {
  exportResultsToExcel([result])
}
