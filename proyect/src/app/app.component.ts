import { Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { RecibosService } from './recibos.service';
import { ConfigService } from './config.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'proyect';
  recibos: any[] = [];

  recibosService = inject(RecibosService);
  
  constructor(private configService: ConfigService) {
   
  }
  ngOnInit(): void {
    const config = this.configService.getConfig();
    console.log('Base URL:', config ? config.baseUrl : 'not loaded in app.component');
  }
}
