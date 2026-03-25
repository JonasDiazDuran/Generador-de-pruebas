import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ExamQuestion, ExamResult, IExamQuestion, IQuestion, IQuestionCategory, IQuestionOption, IRecinto, ServiceResponse, iAnswrsPos } from '../../models/types';
import { ExamService } from '../../services/exam.service';
import { ToastService } from '../../services/toast.service';
import { ImportHelper } from '../../helpers/importHelper';
import * as Alerts from '../../helpers/alerts';
import { CategoryQuestionService } from '../../services/category-question.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

type ExamPhase = 'setup' | 'taking' | 'review';


@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, ImportHelper],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent implements OnInit {
  @Output() complete = new EventEmitter<ExamResult>();

  private examService = inject(ExamService);
  private toastService = inject(ToastService);
  private categoryQuestionService = inject(CategoryQuestionService);


  phase: ExamPhase = 'setup';
  studentName = '';
  correo = "";
  cedula= "";
  genero= "";
  edad= 0;
  recinto=0;
  programa=0;
  recintoName : string="";
  categoriaName : string = "";
  recintoObj! : IRecinto;
  categoriaObj! : IQuestionCategory;


  recintosList :  IRecinto[]=[];
  categoriesList : IQuestionCategory[]=[];

  questions: IExamQuestion[] = [];
  answers: Record<number, number | null> = {};
  answersForPost : iAnswrsPos[]=[];
  currentPage = 0;
  result: ExamResult | null = null;

  QUESTIONS_PER_PAGE = 10;

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.QUESTIONS_PER_PAGE);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get currentQuestions(): IExamQuestion[] {
    const start = this.currentPage * this.QUESTIONS_PER_PAGE;
    return this.questions.slice(start, start + this.QUESTIONS_PER_PAGE);
    
  }

  get answeredCount(): number {
    return Object.values(this.answers).filter(a => a !== null && a !== undefined).length;
  }

  getProgressPct(): number {
    return this.questions.length > 0 ? Math.round((this.answeredCount / this.questions.length) * 100) : 0;
  }

  getLetter(idx: number): string {
    return String.fromCharCode(65 + idx);
  }

 async startExam() {
    const isValid = await this.chekIdentity(this.studentForm.value.cedula, this.studentForm.value.correo);
    if (!isValid) {
      Alerts.showError("Ya completaste esta prueba anteriormente con esta cédula y este correo. Solo se permite un intento por persona.");
      return; // 🔥 aquí se detiene TODO el flujo
    }
    // if (!this.studentName.trim()) {
    //   this.toastService.error('Por favor ingresa tu nombre');
    //   return;
    // }
    this.setProperties();
  if (!this.studentForm.valid) {
      Alerts.showWarning('Debes completar todos los campos del formulario');
        return;
      }
    // if (!this.studentName.trim()) {
    //   this.toastService.error('Por favor ingresa tu nombre');
    //   return;
    // }

     if (!this.studentName.trim()) {
      this.toastService.error('Por favor ingresa tu nombre');
      return;
    }
    // this.questions = this.examService.generateExam(100);
    this.examService.filter({filter : "", isFilter : false}).subscribe((response : ServiceResponse)=>{
      response.data.forEach((c : any)=>{
        this.questions.push({
          id : c.id,
          questionText: c.questionText,
          idCategory: c.idCategoria,
          correctOption  : c.correctAnswer,
          questionOptions: c.questionOptions,
          shuffledOptions : c.questionOptions,
          shuffledCorrectAnswer : c.correctOption
        } as IExamQuestion);
      })
    })

    this.answers = {};
    this.currentPage = 0;
    this.phase = 'taking';
    this.toastService.success('Examen generado con 100 preguntas aleatorias');
  }

  selectAnswer(questionId: number, optionIndex: number, option : IQuestionOption) {
    this.answers = { ...this.answers, [questionId]: optionIndex };
    let question = this.answersForPost.find(c=>c.idQuestion);
    if(this.answersForPost.find(c=>c.idQuestion==questionId)!=undefined){
      this.answersForPost = this.answersForPost.filter(c=>c.idQuestion!==questionId)
    } 

    this.answersForPost.push({
      idQuestion : questionId,
      idSelectedOption : option.id,
      isCorrect : option.isCorrect
    })

    console.log(this.answersForPost);
    
  }

  prevPage() {
    this.currentPage = Math.max(0, this.currentPage - 1);
  }

  nextPage() {
    this.currentPage = Math.min(this.totalPages - 1, this.currentPage + 1);
  }

  submitExam() {
    if (this.answeredCount < this.questions.length) {
      const unanswered = this.questions.length - this.answeredCount;
      this.toastService.warning(`Tienes ${unanswered} preguntas sin responder.`);
    }
    this.result = this.examService.gradeExam(
      this.questions,
      this.answers,
      this.studentName,
      this.correo,
      this.genero,
      this.edad,
      this.recinto,
      this.programa,
      this.cedula
    );
    this.result.answersForSave = this.answersForPost;
    
    
    this.examService.createExam(this.result).subscribe((response: ServiceResponse) => {
      if (response.status) {
        Alerts.showSuccess(response.message);
        this.complete.emit(this.result!);
        this.phase = 'review';
        this.toastService.success(`Examen completado: ${this.result!.percentage}%`);
      }  
    });
  }

  async chekIdentity(cedula: string, correo: string): Promise<boolean> {
    try {
      const response: ServiceResponse = await firstValueFrom(
        this.examService.checkIdentity(cedula, correo)
      );
  
      return response.status;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  restart() {

    this.phase = 'setup';
    this.studentName = '';
    this.questions = [];
    this.answers = {};
    this.currentPage = 0;
    this.result = null;
  }

  setProperties(){
    this.studentName = this.studentForm.value.nombre;
    this.correo = this.studentForm.value.correo;
    this.cedula= this.studentForm.value.cedula;
    this.genero= this.studentForm.value.genero;
    this.edad= this.studentForm.value.edad;
    this.recinto=this.studentForm.value.recinto;
    this.programa= this.studentForm.value.programa;
  }


  // codigo del steper

  
    step = 1;
    studentForm: FormGroup;
    submitted = false; // Para mostrar errores
  
    constructor(private fb: FormBuilder, private route : ActivatedRoute) {
      this.studentForm = this.fb.group({
        nombre: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        cedula: ['', Validators.required],
        genero: ['', Validators.required],
        edad: ['', [Validators.required, Validators.min(1)]],
        recinto: ['', Validators.required],
        programa: ['', Validators.required]
      });

    
      this.getAllRecintos();
      this.getAllCategory();
    }
  ngOnInit(): void {
    const url = window.location.pathname;
    const segments= window.location.hash.replace('#/', '').split('/');    
    if (segments[0] === 'exam' && segments[1]) {
      const id = segments[1];
      this.studentForm.patchValue({programa : id})
    }
  }
  
    next() {
      this.submitted = true;
    
      if (this.step === 1) {
        // Validamos solo los campos del paso 1
        const nombre = this.studentForm.get('nombre')?.valid;
        const correo = this.studentForm.get('correo')?.valid;
        const cedula = this.studentForm.get('cedula')?.valid;
    
        if (nombre && correo && cedula) {
          this.step++;
          this.submitted = false; // Reinicia los errores para el siguiente paso
        }
    
      } else if (this.step === 2) {
        // Validamos solo los campos del paso 2
        const genero = this.studentForm.get('genero')?.valid;
        const edad = this.studentForm.get('edad')?.valid;
        const recinto = this.studentForm.get('recinto')?.valid;
    
        if (genero && edad && recinto) {
          this.step++;
          this.submitted = false;
        }
      }
    }
  
    previous() {
      if (this.step > 1) {
        this.step--;
        this.submitted = false;
      }
    }
  
    submit() {
      this.submitted = true;
      if (this.studentForm.valid) {
        alert('Formulario enviado correctamente');
      }
    }



    getAllRecintos(){
      this.examService.getAllRecintos().subscribe((response : ServiceResponse)=>{
        if(response.status){
          this.recintosList =response.data;
        }
      })
    }

    getAllCategory(){
      this.categoryQuestionService.filter({filter : "", isFilter : false}).subscribe((response : ServiceResponse)=>{
        if(response.status){
          this.categoriesList =response.data;
        }
      })
    }


    // Metodos del Examen
   
  }
