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
  public dropListIds;
  public diccionario;
  public globalData;
  constructor(
    private dowloadFileService : DownloadFileService
  ) { }

  ngOnInit() {
    this.groupedData = {};
    this.informacionDisponible = false
    this.informacionNoDisponible = false
    this.dropListIds = [];
    this.globalData = [];
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

        const normalizedObject = jsonData.map((item: any) => {
          const normalizedItem = {};

          Object.keys(item).forEach((key) => {
            const normalizedKey = key
              .toLowerCase()
              .replace(/[áéíóú]/g, (match) => this.diccionario[match]);

            normalizedItem[normalizedKey] = item[key];
          });
          return normalizedItem;
        });
        this.globalData = normalizedObject;

      const categorys = [...new Set(normalizedObject.map((item: any) => item.categoria))];
      this.dropListIds = categorys;
      categorys.forEach((category: string, i: number) => {
        
        this.groupedData[category] = normalizedObject
          .filter((item: any) => item.categoria === category);
      });
      this.informacionDisponible = true;
     }
     else {
      this.informacionNoDisponible = true;
     }
    };
    fileReader.readAsArrayBuffer(file);
  }
  generarID(category: string): string {
    const id = category;
    this.dropListIds.push(id);
    return id;
  }
  getConnectedLists(id: string): any[] {
    return [... new Set(this.dropListIds)].filter(dropListId => dropListId !== id);
  }
  drop($event: CdkDragDrop<Number[]>){
    const nextCategoria = $event.container.id;
    
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
      const data = $event.container.data;
      const diff: any = data.filter((d:any) => d.categoria != nextCategoria);
      this.globalData = this.globalData.reduce((acc, data) => {
        if(data.id == diff.id){
          data.categoria == nextCategoria
        }
        return this.globalData
      }, this.globalData)
    }
  }
  exportData(): void {
    const rawArray = this.globalData
    const data = this.dowloadFileService.createXlsx(rawArray);
    saveAs(data, 'data.xlsx');
  }
}
