import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IQuestion, IQuestionCategory, Question, ServiceResponse } from '../../models/types';
import { ExamService } from '../../services/exam.service';
import { CategoryQuestionService } from '../../services/category-question.service';
import * as Alerts from '../../helpers/alerts';
import { ImportHelper } from '../../helpers/importHelper';

// interface Category {
//   label: string;
//   range: [number, number];
// }
declare var bootstrap: any; // si no usas import de Bootstrap JS directamente

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [ImportHelper],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.css',
})
export class BankComponent implements OnInit {

  myForm!: FormGroup;
  formFilter!: FormGroup;
  constructor(private categoryService : CategoryQuestionService, private fb : FormBuilder){

  }

  
  getAllCategory(){
    this.categoryService.filter({filter : "", isFilter : false}).subscribe((response : ServiceResponse)=>{
      if(response.status){
        this.categories = response.data;
      }
      
    })
  }

  private examService = inject(ExamService);

  // allQuestions: Question[] = this.examService.getQuestionBank();
 allQuestions: IQuestion[] = [];


  search = '';
  selectedCategory = 0;
  page = 0;
  ITEMS_PER_PAGE = 20;
  selectCategory(id : number){
    this.formFilter.patchValue({idCategoria : id, isFilter : true})
    this.getAll();
  }
  // categories: Category[] = [
  //   { label: 'Todas', range: [1, 300] },
  //   { label: 'Ciencias Naturales', range: [1, 50] },
  //   { label: 'Matematicas', range: [51, 100] },
  //   { label: 'Historia', range: [101, 150] },
  //   { label: 'Geografia', range: [151, 200] },
  //   { label: 'Lengua y Literatura', range: [201, 250] },
  //   { label: 'Tecnologia', range: [251, 300] },
  // ];

   categories: IQuestionCategory[] = [
    // { label: 'Todas', range: [1, 300] },
    // { label: 'Ciencias Naturales', range: [1, 50] },
    // { label: 'Matematicas', range: [51, 100] },
    // { label: 'Historia', range: [101, 150] },
    // { label: 'Geografia', range: [151, 200] },
    // { label: 'Lengua y Literatura', range: [201, 250] },
    // { label: 'Tecnologia', range: [251, 300] },
  ];

  // get filtered(): Question[] {
  //   let questions = this.allQuestions;
  //   if (this.selectedCategory > 0) {
  //     const cat = this.categories[this.selectedCategory];
  //     questions = questions.filter(q => q.id >= cat.range[0] && q.id <= cat.range[1]);
  //   }
  //   if (this.search.trim()) {
  //     const s = this.search.toLowerCase();
  //     questions = questions.filter(q =>
  //       q.question.toLowerCase().includes(s) ||
  //       q.options.some(o => o.toLowerCase().includes(s))
  //     );
  //   }
  //   return questions;
  // }

  // get totalPages(): number {
  //   return Math.ceil(this.filtered.length / this.ITEMS_PER_PAGE);
  // }

  // get pageQuestions(): Question[] {
  //   return this.filtered.slice(this.page * this.ITEMS_PER_PAGE, (this.page + 1) * this.ITEMS_PER_PAGE);
  // }

   get pageQuestions(): IQuestion[] {
    // return this.filtered.slice(this.page * this.ITEMS_PER_PAGE, (this.page + 1) * this.ITEMS_PER_PAGE);
    return this.allQuestions;
  }

  getLetter(idx: number): string {
    return String.fromCharCode(65 + idx);
  }

  ngOnInit(): void {
    this.initForm();
   this.getAllCategory();
    this.myForm = this.fb.group({
      id: this.fb.control(null),
      name: this.fb.control(null, Validators.required),
    });

    this.formFilter = this.fb.group({
      filter: [""],
      isFilter: [false],
      idCategoria : [null]
    });

    this.getAll();
  }

  showAll(){
    this.formFilter.patchValue({isFilter : false})
    this.getAll();
  }

  
  getAll() {
    this.examService.filter(this.formFilter.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.allQuestions = response.data;
        console.log(response.data);
        
      }
    });
  }

  getFilter(event : any){
    this.formFilter.patchValue({isFilter : true})
    this.getAll()
  }

  edit(question: IQuestion) {
    question.questionOptions.forEach(c=>{
      this.addOption()
    })
    this.questionForm.reset(question)
   
  }
  resetMyForm() {
    this.myForm.reset();
  }
  //Insert method
  insert() {

    this.examService.insert(this.questionForm.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        Alerts.showSuccess(response.message, 'Éxito');
        this.getAll();
        this.closeModal();
      }
    })
  }

  //Update method
  update() {
    this.examService.update(this.questionForm.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        Alerts.showSuccess(response.message, 'Éxito');
        this.getAll();
        this.closeModal();
      }
    })
  }

  //Delete method
  delete(id: number) {
    const confirmed = Alerts.showConfirmDelete(
      '¿Estás seguro que quieres eliminar esta pregunta?'
    );
    if (confirmed) {
      this.examService.delete(id).subscribe((response: ServiceResponse) => {
        if (response.status) {
          Alerts.showSuccess(response.message, 'Éxito');
          this.closeModal();
          this.getAll();
        } else {
          Alerts.showError(response.message, 'Error');
        }
      })
    }
  }

  
  save() {
    if (this.questionForm.valid) {
      if (this.questionForm.value.id == null)
      {
        this.insert();

      }else{
        this.update();

      }
    } else {
      Alerts.showInfo("Debe completar los campos para poder guardar.", 'Precaución');
    }
  }


  closeModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide(); // cierra el modal
      this.resetMyForm();
    }
  }

  @Output() questionSubmit = new EventEmitter<Question>();

  questionForm!: FormGroup;





  private initForm(): void {
    this.questionForm = this.fb.group({
      id : [null],
      questionText: ['', [Validators.required, Validators.minLength(5)]],
      idCategory: [null, Validators.required],
      questionOptions: this.fb.array([], Validators.minLength(2)),
    });

    // Agregar dos opciones por defecto
   
  }

  get questionOptions(): FormArray {
    return this.questionForm.get('questionOptions') as FormArray;
  }

  createOptionGroup(): FormGroup {
    return this.fb.group({
      optionText: ['', Validators.required],
      isCorrect: [false],
      urlImage: [''],
    });
  }

  addOption(): void {
    this.questionOptions.push(this.createOptionGroup());
  }

  removeOption(index: number): void {
    if (this.questionOptions.length > 2) {
      this.questionOptions.removeAt(index);
    }
  }

  hasCorrectOption(): boolean {
    return this.questionOptions.controls.some(
      (control : any) => control.get('isCorrect')?.value === true
    );
  }

  getPreviewJson(): string {
    const formValue = this.questionForm.value;
    return JSON.stringify(formValue, null, 2);
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    if (!this.hasCorrectOption()) {
      alert('Debes marcar al menos una opción como correcta');
      return;
    }

    const question: Question = this.questionForm.value;
    this.questionSubmit.emit(question);

    // Resetear formulario
    this.resetForm();
  }

  resetForm(): void {
    this.questionForm.reset();
    this.questionOptions.clear();
    // this.addOption();
    // this.addOption();
  }

  // Helpers para validación en template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.questionForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  isOptionFieldInvalid(index: number, fieldName: string): boolean {
    const option = this.questionOptions.at(index);
    const field = option.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  
}
