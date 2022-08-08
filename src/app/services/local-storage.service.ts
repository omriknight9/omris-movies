import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {
  sameObj: boolean = false;
  private storage =  new BehaviorSubject<any[]>(this.init());

  constructor() { }

  init(): any[] {
    const x = localStorage.getItem('localObj');
    return x ? JSON.parse(x) : [];
  }

  setLocalStorage() {
    return this.storage.asObservable();
  }

  changeLocal = (obj: any) => {
    let storageVal = this.storage.value; 
    storageVal = this.storage.value; 
    if (storageVal !== null) {
      for (let i = 0; i < storageVal.length; i++) {   
        if (obj.id == storageVal[i].id && i == 0) {
            return;
        } else {

          if (obj.id == storageVal[i].id && i !== 0) {
            this.sameObj = true;
            storageVal.splice(i, 1);
            storageVal.unshift(obj);
            break;
          }
        }
      }
    }

    if (!this.sameObj) {
      if (storageVal.length == 5) {
        for (let j = 0; j < storageVal.length; j++) {
          storageVal.pop();
          storageVal.unshift(obj);   
          localStorage.setItem('localObj', JSON.stringify(storageVal));
          storageVal = this.storage.value;
          break;  
        }
      } else {
        storageVal.unshift(obj);
        localStorage.setItem('localObj', JSON.stringify(storageVal));
        storageVal = this.storage.value;
      }
    } else {
      localStorage.setItem('localObj', JSON.stringify(storageVal));
      storageVal = this.storage.value;
    }
    setTimeout(() => {
      this.sameObj = false;
    }, 500)
  }
}