import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recibo } from './recibos.models';
import { environment } from '../environments/environment';

interface UsernameResponse {
  windowsIdentityName: string;
}

interface AccessResponse {
  username: string;
  isAuthorized: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RecibosService {
  // Constructor que inyecta el servicio HttpClient para realizar solicitudes HTTP.
  constructor(private http: HttpClient) {}

  // Método para obtener todos los recibos de un empleado específico.
  // Se utiliza el parámetro 'codEmpleado' para filtrar los datos.
  getRecibos(codEmpleado: string): Observable<Recibo[]> {
    const params = new HttpParams().set('codEmpleado', codEmpleado.toString());
    console.log('hola, URL generada con parámetros:', `${environment.apiURL}?${params.toString()}`);
    console.log("hola");
    return this.http.get<Recibo[]>(environment.apiURL, { params, withCredentials: true });
  }

  // Método para obtener los recibos más recientes de un empleado en una fecha específica.
  // 'codEmpleado' identifica al empleado y 'fechaPago' filtra por fecha.
  getReciboRecientePorFecha(codEmpleado: string, fechaPago: string): Observable<Recibo[]> {
    const url = `${environment.apiURL}/mostrar-ultimos`;
    const params = new HttpParams()
      .set('codEmpleado', codEmpleado.toString())
      .set('fechaPago', fechaPago);
    console.log(`URL generada: ${url}?${params.toString()}`);

    return this.http.get<Recibo[]>(url, { params, withCredentials: true });
  }

  // Método para obtener los recibos más recientes de un empleado.
  // Solo requiere el código del empleado como parámetro.
  getRecibosRecientes(codEmpleado: string): Observable<Recibo[]> {
    const url = `${environment.apiURL}/ultimos`;
    const params = new HttpParams().set('codEmpleado', codEmpleado.toString());
    console.log(`URL generada: ${url}?${params.toString()}`);

    return this.http.get<Recibo[]>(url, { params, withCredentials: true });
  }

  // Método para obtener el nombre de usuario de Windows del cliente.
  // Este método utiliza credenciales para autenticar la solicitud.
  getWindowsUsername(): Observable<{username: string}> {
    return this.http.get<{username: string}>(`${environment.apiURL}/access`, {withCredentials: true});
  }
}
