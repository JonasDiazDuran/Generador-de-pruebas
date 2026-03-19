// alerts.ts
import { ToastrService, ActiveToast } from 'ngx-toastr';

// Creamos un ToastrService "temporal" para usarlo dentro de las funciones
let toastr: ToastrService;
let loaderToast: ActiveToast<any> | null = null;

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

// LOADER
export function ShowLoader(message: string = 'Cargando...', title?: string) {
  loaderToast = toastr?.info(message, title, {
    disableTimeOut: true,
    closeButton: false,
    tapToDismiss: false
  }) || null;
}

export function hideLoader() {
  if (loaderToast) {
    toastr.clear(loaderToast.toastId);
    loaderToast = null;
  }
}

export function showConfirmDelete(message: string): boolean {
  return window.confirm(message);
}