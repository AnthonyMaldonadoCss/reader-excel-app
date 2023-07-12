import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  informacionDisponible: boolean = false
  groupedData: any = {};
  
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      console.log(jsonData); // Hacer algo con los datos leídos, como mostrarlos en una tabla

      //todo: arreglar los tipos de datos
        //interfaz de datos para cada tipo de datos

      //context:
        // Implementación de Interactividad: Implementar un sistema de drag and drop
        // entre los elementos que conforman cada categoría. Al mover un equipo entre
          //array por cada categoria ::check
          //por ende 3 listas drag and drop
        // categorías, su categoría debe cambiar correspondientemente en los datos.
      
      const categorys = [...new Set(jsonData.map((item: any) => item.Categoría))];
     

      categorys.forEach((category: string) => {
        this.groupedData[category] = jsonData.filter((item: any) => item.Categoría === category);
      });
      console.log(this.groupedData)
      this.informacionDisponible = true;
    };
    fileReader.readAsArrayBuffer(file);
  }
}