import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'KeysToArray'
})

export class KeysToArrayPipe implements PipeTransform{
  transform(items: any[], category: string): any[] {
    return items[category]
  }
}