import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExamResult } from '../../models/types';
import { ImportHelper } from '../../helpers/importHelper';

@Component({
  selector: 'app-result-exam',
  imports: [
    ImportHelper
  ],
  templateUrl: './result-exam.component.html',
  styleUrl: './result-exam.component.css'
})
export class ResultExamComponent implements OnInit {
  @Output() complete = new EventEmitter<ExamResult>();
  @Input() result!: ExamResult;

  ngOnInit(): void {
   
  }

  closeWindows(){
    window.close();
  }

}
