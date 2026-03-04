import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamResult } from '../../models/types';
import { ExamService } from '../../services/exam.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent {
  private examService = inject(ExamService);
  private excelService = inject(ExcelExportService);
  private toastService = inject(ToastService);

  results$ = this.examService.getResults();
  expandedId: string | null = null;

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  getStats() {
    const results = this.examService.getResultsValue();
    if (results.length === 0) return [];
    return [
      { label: 'Promedio', value: `${Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)}%` },
      { label: 'Mejor Nota', value: `${Math.max(...results.map(r => r.percentage))}%` },
      { label: 'Peor Nota', value: `${Math.min(...results.map(r => r.percentage))}%` },
      { label: 'Aprobados', value: `${results.filter(r => r.percentage >= 60).length}/${results.length}` },
    ];
  }

  exportAll() {
    const results = this.examService.getResultsValue();
    if (results.length === 0) {
      this.toastService.error('No hay resultados para exportar');
      return;
    }
    this.excelService.exportResults(results);
    this.toastService.success('Archivo Excel descargado');
  }

  exportSingle(result: ExamResult) {
    this.excelService.exportSingleResult(result);
    this.toastService.success(`Resultado de ${result.studentName} exportado`);
  }

  clearResults() {
    this.examService.clearResults();
    this.toastService.info('Resultados eliminados');
  }
}
