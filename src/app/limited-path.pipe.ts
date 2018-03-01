import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitedPath'
})
export class LimitedPathPipe implements PipeTransform {

  transform(value: any[], args: any): any {
    if (!value || !args) {
      return value;
    }

    return value.filter(item => item.relPath.indexOf(args) !== -1);
  }

}
