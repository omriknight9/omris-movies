
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduceString'
})

export class ReduceStringPipe implements PipeTransform {

  characterName: string = '';

  transform(value: string): string {
    this.test(value);
    return this.characterName;
  }

  test (str: string) {
    let newStr;
    if (str.length > 25) {
      if (this.countInstances(str, '/') > 1) {
        newStr = str.substring(0, 25);
        newStr = newStr.substring(0, Math.min(newStr.length, newStr.lastIndexOf(" ")));
        newStr = str.split('/');

          if (newStr.length > 2) {
            newStr = newStr[0] + '/' + newStr[1] + '& More';
          } else {
            newStr = newStr[0] + '/' + newStr[1];
          }
      } else {
        newStr = str;
      }
    } else {
      newStr = str;
    }

    if (newStr == '') {
      newStr = 'Unknown';
    }

    this.characterName = newStr;
  }

  countInstances (sentence: string, word: string) {
    return sentence.split(word).length - 1;
  }
}
