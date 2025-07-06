import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="access-denied-container">
      <div class="access-denied-content">
        <mat-icon class="access-denied-icon">block</mat-icon>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <p>Por favor, verifica que tienes el rol correcto para acceder a este recurso.</p>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="goHome()">
            <mat-icon>home</mat-icon>
            Volver al Inicio
          </button>
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Regresar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .access-denied-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }

    .access-denied-content {
      text-align: center;
      max-width: 400px;
    }

    .access-denied-icon {
      font-size: 64px;
      color: #f44336;
      margin-bottom: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 16px;
    }

    p {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
    }
  `]
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }
}
