import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LoaderComponent } from '../components/loader/loader.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot() // Configuración global


  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class ImportHelper {}