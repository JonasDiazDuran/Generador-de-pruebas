import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private nextId = 0;

  getToasts() {
    return this.toasts$.asObservable();
  }

  success(message: string) { this.add(message, 'success'); }
  error(message: string) { this.add(message, 'error'); }
  warning(message: string) { this.add(message, 'warning'); }
  info(message: string) { this.add(message, 'info'); }

  private add(message: string, type: Toast['type']) {
    const id = this.nextId++;
    const toast: Toast = { id, message, type };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.remove(id), 3000);
  }

  private remove(id: number) {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}
