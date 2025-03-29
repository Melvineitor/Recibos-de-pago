import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { RecibosService } from '../recibos.service';
import { ConfigService } from '../config.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  codEmpleadoInput: number = 0; // Variable para almacenar el código de empleado ingresado
  response: string = ''; // Respuesta del servidor
  usuario: string | null = null; // Nombre de usuario obtenido del sistema

  constructor(
    private router: Router, // Servicio para manejar la navegación entre rutas
    private authService: AuthService, // Servicio de autenticación
    private recibosService: RecibosService, // Servicio para manejar recibos
    private configService: ConfigService // Servicio para obtener configuraciones
  ) {}

  ngOnInit(): void {
    // Obtener configuración inicial
    const config = this.configService.getConfig();
    console.log(
      'Base URL:',
      config ? config['BaseUrl'] : 'Config not loaded from login'
    );
    console.log('Environment API URL:', environment.apiURL);

    // Obtener el nombre de usuario desde el sistema
    this.recibosService.getWindowsUsername().subscribe(
      (response) => {
        this.usuario = response.username; // Asignar el nombre de usuario
        console.log(this.usuario);
        console.log(typeof response);
        this.iniciarSesion(); // Intentar iniciar sesión automáticamente
      },
      (error) => {
        console.error('Error fetching username:', error); // Manejo de errores
      }
    );
  }

  iniciarSesion() {
    // Validar si el usuario está definido
    if (!this.usuario) {
      alert('Por favor, ingrese un código de empleado válido.'); // Mostrar alerta si no hay usuario
      return;
    }

    // Establecer el usuario en el servicio de autenticación
    this.authService.setUsuario(this.usuario);
    // Redirigir a la página de aterrizaje
    this.router.navigate(['/landing']);
  }
}
