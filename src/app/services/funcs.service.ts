import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FuncsService {

  constructor() { }

  convertMinsToHrsMins (mins: number): string  {
    let h = Math.floor(mins / 60);
    let m = mins % 60;

    h = h < 10 ? 0 + h : h;
    m = m < 10 ? 0 + m : m;

    if (h > 0) {
        return h + 'h ' + m + ' m';
    } else {
        return m + ' m';
    }
  }
  
  configureDate (data: string): string  {
    if (data == undefined || data == '' || data == 'TBA') {
      return 'TBA';
    }
    
    let date = new Date(data);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return this.changeMonthName(month - 1) + ' ' + this.changeDayName(day) + ' ' + year;
  }

  changeMonthName (month: number): string  {
    switch (month) {
        case 0: {
          return 'Jan';
        }
        case 1: {
          return 'Feb';
        }
        case 2: {
          return 'March';
        }
        case 3: {
          return 'April';
        }
        case 4: {
          return 'May';
        }
        case 5: {
          return 'June';
        }
        case 6: {
          return 'July';
        }
        case 7: {
          return 'Aug';
        }
        case 8: {
          return 'Sep';
        }
        case 9: {
          return 'Oct';
        }
        case 10: {
          return 'Nov';
        }
        case 11: {
          return 'Dec';
        }
        default: {
          return '';
      }
    }
  }

  changeDayName (day: number): string  {
    switch (day) {
        case 1:
        case 21:
        case 31: {
            return day + 'st';
        }
        case 2:
        case 22: {
            return day + 'nd';
        }
        case 3:
        case 23: {
            return day + 'rd';
        }

        default: {
            return day + 'th';
        }
    }
  }

  numberWithCommas (x: number): string   {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}