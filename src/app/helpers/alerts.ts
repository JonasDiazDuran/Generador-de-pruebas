// alerts.ts
import { ToastrService } from 'ngx-toastr';

// Creamos un ToastrService "temporal" para usarlo dentro de las funciones
let toastr: ToastrService;

export function initAlerts(toastrInstance: ToastrService) {
  toastr = toastrInstance;
}

export function showSuccess(message: string, title?: string) {
  toastr?.success(message, title);
}

export function showError(message: string, title?: string) {
  toastr?.error(message, title);
}

export function showInfo(message: string, title?: string) {
  toastr?.info(message, title);
}

export function showWarning(message: string, title?: string) {
  toastr?.warning(message, title);
}

export function showConfirmDelete(message: string): boolean {
    // Solo muestra la pregunta y devuelve true o false según la respuesta del usuario
    return window.confirm(message);
  }