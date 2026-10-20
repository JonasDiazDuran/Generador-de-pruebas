import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IQuestionCategory, IQuestionClasification, ServiceResponse } from '../../models/types';
import { ClasificationQuestionService } from '../../services/clasification-question.service';
import { ImportHelper } from '../../helpers/importHelper';
import * as Alerts from '../../helpers/alerts';
import { LoaderComponent } from '../loader/loader.component';
import { CategoryQuestionService } from '../../services/category-question.service';


declare var bootstrap: any;

@Component({
  selector: 'app-clasification-question',
  standalone: true,
  imports: [
    ImportHelper,
    LoaderComponent
  ],
  templateUrl: './clasification-question.component.html',
  styleUrl: './clasification-question.component.css'
})
export class ClasificationQuestionComponent implements OnInit {

  myForm!: FormGroup;
  formFilter!: FormGroup;
  isLoader: boolean = false;
  listPrograms: IQuestionCategory[] = [];

  listClasificacion: IQuestionClasification[] = [];
  link: string = "";

  constructor(
    private fb: FormBuilder,
    private servicePrograms: CategoryQuestionService,
    private service: ClasificationQuestionService

  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id: this.fb.control(null),
      idCategoryQuestion: this.fb.control(null, Validators.required),
      descripcion: this.fb.control(null, Validators.required),
    });

    this.formFilter = this.fb.group({
      filter: [""],
      isFilter: [false]
    });

    this.getAll();
    this.getAllProgramas();
  }

  showLoader() {
    this.isLoader = true;
  }

  hidenLoader() {
    this.isLoader = false;
  }

  getAllProgramas(showLoader: boolean = true) {
    if (showLoader) {
      this.showLoader()
    }

    this.servicePrograms.filter(this.formFilter.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        if (showLoader)
          this.hidenLoader()
        this.listPrograms = response.data;
      }
    });
  }

  getAll(showLoader: boolean = true) {
    if (showLoader) {
      this.showLoader();
    }
    this.service.filter(this.formFilter.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        if (showLoader) {
          this.hidenLoader();
        }
        this.listClasificacion = response.data;
      }
    });
  }

  getFilter(event: any) {
    if (event.target.value.length > 3) {
      this.formFilter.patchValue({ isFilter: true });
      this.getAll(false);
    }
    if (event.target.value.length == 0) {
      this.formFilter.patchValue({ isFilter: false });
      this.getAll(false);
    }
  }

  edit(category: IQuestionClasification) {
    this.myForm.patchValue({ id: category.id, descripcion: category.descripcion, idCategoryQuestion: category.idCategoryQuestion });
  }

  resetMyForm() {
    this.myForm.reset();
  }

  insert() {
    this.service.insert(this.myForm.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        Alerts.hideLoader();
        Alerts.showSuccess(response.message, 'Éxito');
        this.getAll();
        this.closeModal();
      }
    });
  }

  update() {
    this.service.update(this.myForm.value).subscribe((response: ServiceResponse) => {
      if (response.status) {
        Alerts.showSuccess(response.message, 'Éxito');
        this.getAll();
        this.closeModal();
      }
    });
  }

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
      });
    }
  }

  closeTest(id: number) {
    this.service.ChangeStatus(id).subscribe((response: ServiceResponse) => {
      this.getAll(false);
    });
  }

  save() {
    console.log(this.myForm.value);
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
      modal?.hide();
      this.resetMyForm();
    }
  }

  generateLink(idPrograma: number) {
    this.link = `${window.location}exam/${idPrograma}`;
  }

  copyLink(linkInput: HTMLInputElement) {
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(linkInput.value).then(() => {
      Alerts.showSuccess('Enlace copiado al portapapeles ✅');
    }).catch(err => {
      console.error('Error al copiar:', err);
      Alerts.showError('No se pudo copiar el enlace ❌');
    });
  }
}
