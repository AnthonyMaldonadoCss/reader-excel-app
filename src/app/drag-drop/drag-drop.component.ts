import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DownloadFileService } from '../service/dowload.service';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent implements OnInit {

  public informacionDisponible;
  public informacionNoDisponible;
  public groupedData;
  public listNumbers1;
  public listNumbers2;
  public listNumbers3;
  public diccionario;

  constructor(
    private dowloadFileService : DownloadFileService
  ) { }

  ngOnInit() {
    this.groupedData = {};
    this.informacionDisponible = false
    this.informacionNoDisponible = false
    this.listNumbers1 = []
    this.listNumbers2 = []
    this.listNumbers3 = []
    this.diccionario = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
    };
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const fileName = file.name;

      if(fileName.endsWith('.xlsx') || fileName.endsWith('.xls')){
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        const objetoNormalizado = jsonData.map((item: any) => {
          const normalizedItem = {};

          Object.keys(item).forEach((key) => {
            const normalizedKey = key
              .toLowerCase()
              .replace(/[áéíóú]/g, (match) => this.diccionario[match]);

            normalizedItem[normalizedKey] = item[key];
          });

          return normalizedItem;
        });

      const categorys = [...new Set(objetoNormalizado.map((item: any) => item.categoria))];


      categorys.forEach((category: string, i: number) => {

        if(category == "Electrónica"){
          this.listNumbers1.push(...objetoNormalizado.filter((item: any) => item.categoria === category));
        }
        else if(category == 'Electrodomésticos'){
          this.listNumbers2.push(...objetoNormalizado.filter((item: any) => item.categoria === category));
        }
        else if(category == 'Herramientas'){
          this.listNumbers3.push(...objetoNormalizado.filter((item: any) => item.categoria === category));
        }
      });
      this.informacionDisponible = true;
     }
     else {
      this.informacionNoDisponible = true;
     }
    };
    fileReader.readAsArrayBuffer(file);
  }
  drop($event: CdkDragDrop<Number[]>){

    if($event.previousContainer === $event.container){
      moveItemInArray(
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      )
    }
    else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      )
    }
  }
  exportData(): void {
    const rawArray = this.listNumbers1.concat(this.listNumbers2.concat(this.listNumbers3));
    const data = this.dowloadFileService.createXlsx(rawArray);
    saveAs(data, 'data.xlsx');
  }
}
