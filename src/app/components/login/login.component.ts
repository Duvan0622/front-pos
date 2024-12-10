import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  nombre_usuario: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

login(): void {
  this.authService.login(this.nombre_usuario, this.password).subscribe({
    next: () => {
      const userRole = this.authService.getUserRole();
      if (userRole === 'gerente') {
        this.router.navigate(['/home']);
      } else if (userRole === 'vendedor') {
        this.router.navigate(['/home']);
      } else {
        console.warn('Rol desconocido, redirigiendo a /home');
        this.router.navigate(['/login']);
      }
    },
    error: (err) => console.error('Login fallido', err),
  });
}

}
