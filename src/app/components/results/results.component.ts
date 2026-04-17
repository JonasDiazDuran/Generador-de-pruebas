import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamResult, IQuestionCategory, ServiceResponse } from '../../models/types';
import { ExamService } from '../../services/exam.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { ToastService } from '../../services/toast.service';
import * as Alerts from '../../helpers/alerts';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryQuestionService } from '../../services/category-question.service';


@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {



  formFilter!: FormGroup;
  categories: IQuestionCategory[] = [];
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.formFilter = this.fb.group({
      idCategoria : [null],
      filter: [""],
      isFilter: [false]
    });
  
    this.getAllCategory();
   this.getAllResult();
   
 
  }


  selectedCategory = 10;
  page = 0;





  private examService = inject(ExamService);
  private excelService = inject(ExcelExportService);
  private toastService = inject(ToastService);
  private categoryService= inject(CategoryQuestionService);


  
  results$ = this.examService.getResults();
  expandedId: string | null = null;

  examResultList :  ExamResult []=[];

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  getStats() {
    const results = this.examService.results$.value;
    if (results.length === 0) return [];
    return [
      { label: 'Promedio', value: `${Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)}%` },
      { label: 'Mejor Nota', value: `${Math.max(...results.map(r => r.percentage))}%` },
      { label: 'Peor Nota', value: `${Math.min(...results.map(r => r.percentage))}%` },
      { label: 'Aprobados', value: `${results.filter(r => r.percentage >= 60).length}/${results.length}` },
    ];
  }
  selectCategory(id : number){
    this.formFilter.patchValue({idCategoria : id, isFilter : true})
    this.getAllResult();
  }

  exportAll() {
    // const results = this.examService.getResultsValue();
    // if (results.length === 0) {
    //   this.toastService.error('No hay resultados para exportar');
    //   return;
    // }
    // console.log(results)
    // this.excelService.exportResults(results);
    
        this.excelService.exportResults(this.examResultList);

    this.toastService.success('Archivo Excel descargado');
  }


  exportAllWrongAnswers(){
    this.examService.reportWrongAnswrs(this.formFilter.value.idCategoria==null? 0 : this.formFilter.value.idCategoria).subscribe((response : ServiceResponse)=>{
      if(response.status){
        this.excelService.exportResultsWrongAnswers(response.data);
      }
    })
  }
  
  //Delete method
  delete(id: any) {
    const confirmed = Alerts.showConfirmDelete(
      '¿Estás seguro que quieres eliminar esta categoría?'
    );
    if (confirmed) {
      this.examService.deleteResult(id).subscribe((response: ServiceResponse) => {
        if (response.status) {
          Alerts.showSuccess(response.message, 'Éxito');
          // this.closeModal();
          this.getAllResult();
        } else {
          Alerts.showError(response.message, 'Error');
        }
      })
    }
  }

  deleteAll() {
    const confirmed = Alerts.showConfirmDelete(
      '¿Estás seguro que quieres eliminar esta categoría?'
    );
    if (confirmed) {
      this.examService.deleteResultAll().subscribe((response: ServiceResponse) => {
        if (response.status) {
          Alerts.showSuccess(response.message, 'Éxito');
          // this.closeModal();
          this.getAllResult();
        } else {
          Alerts.showError(response.message, 'Error');
        }
      })
    }
  }

  exportSingle(result: ExamResult) {
    this.excelService.exportSingleResult(result);
    this.toastService.success(`Resultado de ${result.studentName} exportado`);
  }

  clearResults() {
    this.examService.clearResults();
    this.toastService.info('Resultados eliminados');
  }

  getAllResult(){
    this.examService.filterExam(this.formFilter.value).subscribe((response : ServiceResponse)=>{
      if(response.status){
        this.examResultList =response.data;    
        this.examService.results$.next(response.data);
        
        console.log(this.examService.getResultsValue())
      }
    })
  }

  showAll(){
    this.selectedCategory=10;
    this.formFilter.patchValue({isFilter : false})
    this.getAllResult();
  }

  getAllCategory(){
    this.categoryService.filter({filter : "", isFilter : false}).subscribe((response : ServiceResponse)=>{
      if(response.status){
        this.categories = response.data;
      }
      
    })
  }

}
