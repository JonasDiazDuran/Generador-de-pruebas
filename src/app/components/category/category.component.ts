import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IQuestionCategory, ServiceResponse } from '../../models/types';
import { CategoryQuestionService } from '../../services/category-question.service';
import { ImportHelper } from '../../helpers/importHelper';
import * as Alerts from '../../helpers/alerts';
import { LoaderComponent } from '../loader/loader.component';



declare var bootstrap: any; // si no usas import de Bootstrap JS directamente


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ImportHelper,
    LoaderComponent
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  myForm!: FormGroup;
  formFilter!: FormGroup;
  isLoader : boolean = false;

  listCategory: IQuestionCategory[] = [];
  link : string = "";
  constructor(
    private fb: FormBuilder,
    private service: CategoryQuestionService
  ) { }

  ngOnInit(): void {

    this.myForm = this.fb.group({
      id: this.fb.control(null),
      name: this.fb.control(null, Validators.required),
    });

    this.formFilter = this.fb.group({
      filter: [""],
      isFilter: [false]
    });

    this.getAll();
  }

  showLoader(){
    this.isLoader=true;
  }
  hidenLoader(){
    this.isLoader=false;
  }
  getAll() {
    this.showLoader()
    this.service.filter(this.formFilter.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        this.hidenLoader()
        this.listCategory = response.data;
      }
    });
  }

  getFilter(event : any){
    this.formFilter.patchValue({isFilter : true})
    this.getAll()
  }

  edit(category: IQuestionCategory) {
    this.myForm.patchValue({ id: category.id, name: category.name })
  }
  resetMyForm() {
    this.myForm.reset();
  }
  //Insert method
  insert() {
    this.service.insert(this.myForm.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        Alerts.hideLoader();
        Alerts.showSuccess(response.message, 'Éxito');
        this.getAll();
        this.closeModal();
      }
    })
  }

  //Update method
  update() {
    this.service.update(this.myForm.value).subscribe((response: ServiceResponse) => {
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
      '¿Estás seguro que quieres eliminar esta categoría?'
    );
    if (confirmed) {
      this.service.delete(id).subscribe((response: ServiceResponse) => {
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
    if (this.myForm.valid) {
      if (this.myForm.value.id == null)
        this.insert();
      this.update();
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

  generateLink(idPrograma : number){
    this.link =`${window.location}exam/${idPrograma}`; 
  }

  copyLink(linkInput: HTMLInputElement) {
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // Para móviles

    navigator.clipboard.writeText(linkInput.value).then(() => {
      // Puedes usar un alert simple
      // alert('Enlace copiado ✅');

      // O mejor, un toast
      Alerts.showSuccess('Enlace copiado al portapapeles ✅');
    }).catch(err => {
      console.error('Error al copiar:', err);
      Alerts.showError('No se pudo copiar el enlace ❌');
    });
  }
} 