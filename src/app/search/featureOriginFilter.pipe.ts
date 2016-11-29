import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featureOrigin'
})
@Injectable()
export class FeatureOriginPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
    return items.filter(item => item.properties.origin.indexOf(args[0]) !== -1);
  }
}
