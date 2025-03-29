import { Component, ViewChild, ElementRef } from '@angular/core';
import { LandingComponent } from '../landing/landing.component';

@Component({
  selector: 'app-imprimir',
  templateUrl: './imprimir.component.html',
  styleUrls: ['./imprimir.component.css']
})
export class ImprimirComponent {
  @ViewChild('contenido', { static: false }) contenidoComponent!: ElementRef; // Accede al componente hijo

  imprimir() {
    const contenidoImprimir = this.contenidoComponent.nativeElement; // Accede al contenido del componente hijo
    const ventanaImpresion = window.open('', '', 'width=800, height=600');
    
    ventanaImpresion?.document.write('<html><head><title>Imprimir</title></head><body>');
    ventanaImpresion?.document.write(contenidoImprimir.innerHTML); // Inserta el contenido del componente hijo
    ventanaImpresion?.document.write('</body></html>');
    ventanaImpresion?.document.close();
    ventanaImpresion?.print();
  }
}
