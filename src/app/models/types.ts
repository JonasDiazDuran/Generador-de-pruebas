export interface IQuestionCategory {
  id: number;
  name: string;
}


export interface IQuestionOption {
  optionText: string;
  isCorrect: boolean;
  urlImage: string;
}

export interface IQuestion {
  id : number,
  questionText: string;
  idCategory: number;
  correctOption  : number;
  questionOptions: IQuestionOption[];
}



export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ExamQuestion extends Question {
  shuffledOptions: string[];
  shuffledCorrectAnswer: number;
}

export interface IExamQuestion extends IQuestion {
  shuffledOptions: string[];
  shuffledCorrectAnswer: number;
}

export interface ExamResult {
  id: string;
  studentName: string;
  date: string;
  score: number;
  totalQuestions: number;
  approved : boolean;
  percentage: number;
  sex : string;
  email : string;
  age : number;
  idCategoria : number;
  categoriaName : string;
  cedula : string;
  idRecinto : number;
  recintoName : string;
  answers: DetailedAnswer[];
}

export interface DetailedAnswer {
  questionId: number;
  questionText: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface ServiceResponse {
    status : boolean;
    statusCode : number; 
    message : string;
    data : any; 
}


export interface IRecinto {
  idRecinto: number;
  nombre: string;
  siglas: string;
  direccion: string;
  telefono: string;
  ext: string | null;
  longitud: string;
  latitud: string;
}

export type AppView = 'home' | 'category' | 'exam' | 'results' | 'bank';
