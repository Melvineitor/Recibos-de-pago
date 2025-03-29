import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RecibosService } from '../recibos.service';
import { CommonModule } from '@angular/common'; // Importación para directivas comunes de Angular
import { FormsModule } from '@angular/forms'; // Importación para formularios basados en plantillas
import { AuthService } from '../auth.service'; // Servicio para operaciones relacionadas con autenticación
import { Router, RouterModule } from '@angular/router'; // Router para navegación
import { ConfigService } from '../config.service'; // Servicio para gestión de configuración

@Component({
  selector: 'app-landing', // Selector del componente
  imports: [CommonModule, FormsModule, RouterModule], // Módulos utilizados en este componente
  templateUrl: './landing.component.html', // Archivo de plantilla
  styleUrl: './landing.component.css', // Archivo de estilos
})
export class LandingComponent implements OnInit {
  // Variables para almacenar datos y estado
  recibos: any[] = []; // Lista de todos los recibos
  reciboActual: any = {}; // Recibo actualmente seleccionado
  recibosRecientes: any[] = []; // Recibos recientes
  recibosRecientesPorFecha: any[] = []; // Recibos recientes filtrados por fecha
  tablaIngresos: any[] = []; // Tabla de elementos de ingresos
  tablaDeducciones: any[] = []; // Tabla de elementos de deducciones
  reciboEspecifico: any | null = null; // Detalles de un recibo específico
  totalIngresos: number = 0; // Total de ingresos
  totalDeducciones: number = 0; // Total de deducciones
  totalNeto: number = 0; // Total neto (ingresos - deducciones)

  fechaPago: string | null = null; // Fecha de pago seleccionada

  codEmpleadoInput: string | null = null; // Código de empleado ingresado por el usuario

  isLoading: boolean = true; // Estado de carga de datos
  loading: boolean = true; // Estado general de carga
  username: string = ''; // Nombre de usuario del usuario autenticado
  isAuthorized: boolean = false; // Estado de autorización
  deviceInfo: any = {}; // Información sobre el dispositivo del usuario
  user: string | null = null; // Información del usuario
  usuario: string | null = null; // Otra variable relacionada con el usuario

  constructor(
    private reciboService: RecibosService, // Servicio para manejar operaciones relacionadas con recibos
    private authService: AuthService, // Servicio para autenticación
    private router: Router, // Router para navegación
    private configService: ConfigService // Servicio para configuración
  ) {}

  @ViewChild('contenido', { static: false }) contenidoComponent!: ElementRef; // Acceso a un componente hijo para impresión

  imprimir() {
    // Abre una nueva ventana e imprime el contenido del componente hijo
    const contenidoImprimir = this.contenidoComponent.nativeElement;
    const ventanaImpresion = window.open('', '', 'width=800, height=600');

    ventanaImpresion?.document.write(
      '<html><head><title>Imprimir</title></head><body>'
    );
    ventanaImpresion?.document.write(contenidoImprimir.innerHTML);
    ventanaImpresion?.document.write('</body></html>');
    ventanaImpresion?.document.close();
    ventanaImpresion?.print();
  }

  ngOnInit(): void {
    // Inicializa el componente y obtiene datos iniciales
    this.codEmpleadoInput = this.authService.getUsuario(); // Obtiene el código de empleado desde AuthService
    this.fechaPago = this.authService.getFechaPago(); // Obtiene la fecha de pago desde AuthService
    const confi = this.configService.loadConfig(); // Carga la configuración
    console.log('el confi', confi);
    const config = this.configService.getConfig(); // Obtiene detalles de configuración
    console.log(
      'Base URL:',
      config ? config['BaseUrl'] : 'Config not loaded in landing.component'
    );

    if (this.codEmpleadoInput) {
      this.buscarRecibos(); // Obtiene los recibos si el código de empleado está disponible
    } else {
      alert(
        'Error: No se encontró el código de empleado. Vuelva a iniciar sesión.'
      );
    }
  }

  buscarRecibos(): void {
    // Obtiene los recibos para el código de empleado dado
    if (!this.codEmpleadoInput) {
      alert('Por favor, ingrese un código de empleado válido.');
      return;
    }

    // Obtiene el nombre de usuario de Windows desde el backend
    this.reciboService.getWindowsUsername().subscribe(
      (response) => {
        this.codEmpleadoInput = response.username; // Actualiza el código de empleado con el nombre de usuario del backend
        console.log(`${response}`);
      },
      (error) => {
        console.error('Error fetching username:', error);
      }
    );

    // Obtiene todos los recibos
    this.reciboService.getRecibos(this.codEmpleadoInput).subscribe(
      (data) => {
        this.recibos = data; // Almacena los recibos obtenidos
        console.log('Recibos:', this.recibos);
        this.isLoading = false; // Actualiza el estado de carga
        this.procesarDatos(); // Procesa los datos de los recibos
        this.calcularTotales(); // Calcula los totales
      },
      (error) => {
        console.error('Error al obtener los recibos:', error);
        this.isLoading = false;
      }
    );

    // Obtiene los recibos recientes
    this.reciboService.getRecibosRecientes(this.codEmpleadoInput).subscribe(
      (data) => {
        this.recibosRecientes = data; // Almacena los recibos recientes
        console.log('Recibos Recientes:', this.recibosRecientes);
      },
      (error) => {
        console.log('Error con los recibos recientes', error);
      }
    );
  }

  seleccionarFecha(fecha: string) {
    // Actualiza la fecha de pago seleccionada y obtiene los recibos para esa fecha
    this.fechaPago = fecha;
    console.log('Fecha seleccionada:', this.fechaPago);
    this.buscarRecibosRecientesPorFecha();
  }

  buscarRecibosRecientesPorFecha(): void {
    // Obtiene los recibos recientes filtrados por la fecha seleccionada
    if (!this.codEmpleadoInput) {
      alert('Por favor, ingrese un código de empleado válido.');
      return;
    }
    if (!this.fechaPago) {
      alert('falta fecha');
      return;
    }
    this.reciboService
      .getReciboRecientePorFecha(this.codEmpleadoInput, this.fechaPago)
      .subscribe(
        (data) => {
          this.recibos = data; // Almacena los recibos filtrados
          console.log('Recibos Recientes Por Fecha:', this.recibos);
          this.procesarDatos(); // Procesa los datos de los recibos
          this.calcularTotales(); // Calcula los totales
        },
        (error) => {
          console.log('Error con los recibos por fecha', error);
        }
      );
  }

  procesarDatos() {
    // Procesa los datos de los recibos para llenar las tablas de ingresos y deducciones
    const mapaIngresos: { [key: string]: any } = {};
    const mapaDeducciones: { [key: string]: any } = {};

    this.recibos.forEach((recibo) => {
      const concepto = recibo.CONCEPTONOMINA;

      if (recibo.INGRESO > 0) {
        if (!mapaIngresos[concepto]) {
          mapaIngresos[concepto] = { concepto, ingreso: 0, deduccion: 0 };
        }
        mapaIngresos[concepto].ingreso += recibo.INGRESO;
      }

      if (recibo.DEDUCCION > 0) {
        if (!mapaDeducciones[concepto]) {
          mapaDeducciones[concepto] = { concepto, ingreso: 0, deduccion: 0 };
        }
        mapaDeducciones[concepto].deducción += recibo.DEDUCCIÓN;
      }
    });

    this.tablaIngresos = Object.values(mapaIngresos); // Convierte el mapa de ingresos a un arreglo
    this.tablaDeducciones = Object.values(mapaDeducciones); // Convierte el mapa de deducciones a un arreglo
  }

  calcularTotales() {
    // Calcula el total de ingresos, deducciones y el total neto
    this.totalIngresos = this.tablaIngresos.reduce(
      (total, artículo) => total + artículo.ingreso,
      0
    );
    this.totalDeducciones = this.tablaDeducciones.reduce(
      (total, artículo) => total + artículo.deducción,
      0
    );
    this.totalNeto = this.totalIngresos - this.totalDeducciones;
  }

  menuAbierto: boolean = false; // Estado de visibilidad del menú

  toggleMenu() {
    // Alterna la visibilidad del menú
    this.menuAbierto = !this.menuAbierto;
  }

  getUserInfo() {
    // Recupera información sobre el dispositivo y navegador del usuario
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
  }
}
