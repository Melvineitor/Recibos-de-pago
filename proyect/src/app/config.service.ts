import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<any> {
    return this.http.get('assets/config.json').pipe(
      map(data => {
        this.config = data;
        console.log(data);
        return data;
      })
    ).toPromise();
  }

  getConfig(): any {
    return this.config;
  }
}
