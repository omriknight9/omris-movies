import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { IMAGES_SIZES } from 'src/app/constants/images-sizes';
import { Person, PersonCredits, PersonImages } from 'src/app/models/person';
import { FuncsService } from 'src/app/services/funcs.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PeopleService } from 'src/app/services/people.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})

export class PersonComponent implements OnInit {
  person: Person | null = null;
  personCredits: PersonCredits | null = null;
  personImages: PersonImages | null = null;
  showOverview: boolean = false;
  showOverviewText: boolean = false;
  directorId: string | null = null;
  newObj: Object = {};
  imagesSizes = IMAGES_SIZES
  currentEnvironment = environment;;
  isMobile: boolean = false;

  responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '765px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '450px',
        numVisible: 1,
        numScroll: 1,
    }
  ];

  constructor(private localStorageService: LocalStorageService, private _location: Location, private route: ActivatedRoute, private router: Router, private peopleService: PeopleService, private funcService: FuncsService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    if (document.body.offsetWidth < 765) {
      this.isMobile = true;
    }

    if (this.router.url.indexOf('/director') > -1) {
      this.checkParam(2);
    } else {
      this.checkParam(1);
    }
  }

  checkParam(type: number): void {
    switch (type) {
      case 1:
        this.route.params.pipe(take(1)).subscribe(({id}) => {
          if (id) {
            this.getPerson(id, 1);
          } 
        })
        break;
      case 2:
        this.route.params.pipe(take(1)).subscribe(({directorId}) => {
          if (directorId) {
            this.directorId = directorId;
            this.getPerson(directorId, 2);
          } 
        })
        break;
      default:
        this.route.params.pipe(take(1)).subscribe(({id}) => {
          if (id) {
            this.getPerson(id, 1);   
          } 
        })
        break;
    }
  }

  getPerson(id: string, type: number): void {
    this.peopleService.getPerson(id).subscribe(personData => {
      let credits = personData.combined_credits.cast;
      this.personImages = personData.images;

      let path;
      if (type == 1) {
        path = '/person/';

        for (let v = 0; v < credits.length; v++) {
          if (credits[v].media_type == 'tv') {
            credits[v].release_date = credits[v].first_air_date;
            credits[v].title = credits[v].name;
          }

          if(credits[v].release_date == '' || credits[v].release_date == undefined) {
            credits[v].release_date = 'TBA';
            var test3 = credits[v];
            credits.splice(v, 1);
            credits.unshift(test3);
          }
        }

        personData.combined_credits.cast = personData.combined_credits.cast.sort((b, a) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
  
        for (let i = 0; i < personData.combined_credits.cast.length; i++) {
          if (personData.combined_credits.cast[i].release_date !== '' && personData.combined_credits.cast[i].release_date !== null && personData.combined_credits.cast[i].release_date !== undefined) {
            personData.combined_credits.cast[i].release_date = this.funcService.configureDate(personData.combined_credits.cast[i].release_date);
          }
          if (personData.combined_credits.cast[i].first_air_date !== '' && personData.combined_credits.cast[i].first_air_date !== null && personData.combined_credits.cast[i].first_air_date !== undefined) {
            personData.combined_credits.cast[i].first_air_date = this.funcService.configureDate(personData.combined_credits.cast[i].first_air_date);
          }
        }
        this.personCredits = personData.combined_credits;
        this.personCredits.crew.length = 0; 
      } else {
        path = '/person/director/';

        for( var w = 0; w < personData.combined_credits.crew.length; w++){ 
          if (personData.combined_credits.crew[w].job !== 'Director') { 
            personData.combined_credits.crew.splice(w, 1);
            w--; 
          }
        }
        personData.combined_credits.crew = personData.combined_credits.crew.sort(function (a, b) {  return b.popularity - a.popularity; });

        for (let i = 0; i < personData.combined_credits.crew.length; i++) {
          if (personData.combined_credits.crew[i].release_date !== '' && personData.combined_credits.crew[i].release_date !== null && personData.combined_credits.crew[i].release_date !== undefined) {
            personData.combined_credits.crew[i].release_date = this.funcService.configureDate(personData.combined_credits.crew[i].release_date);
          }
          if (personData.combined_credits.crew[i].first_air_date !== '' && personData.combined_credits.crew[i].first_air_date !== null && personData.combined_credits.crew[i].first_air_date !== undefined) {
            personData.combined_credits.crew[i].first_air_date = this.funcService.configureDate(personData.combined_credits.crew[i].first_air_date);
          }
        }

        this.personCredits = personData.combined_credits;
        this.personCredits.cast.length = 0;

      }

      this.newObj = {'link': path, 'id': id, 'title': personData.name,  'poster_path': personData.profile_path};
      this.localStorageService.changeLocal(this.newObj);
      this.person = personData;

      if (personData.birthday !== null) {
        personData.age = this.getPersonAge(personData.birthday, 1);  
      }

      if (personData.deathday !== null) {
        personData.deathAge = this.getPersonAge(personData.deathday, 2, personData.birthday);  
      }

      let d = new Date();
      let personDate = new Date(personData.birthday);

      if(personDate.getDate() == d.getDate() && personDate.getMonth() + 1 == d.getMonth() + 1) {
        personData.birthdayToday = true;
      } else {
        personData.birthdayToday = false;
      }

      if (personData.birthday !== null) {
        personData.birthday = this.funcService.configureDate(personData.birthday);
      }

      if (personData.deathday !== null) {
        personData.deathday = this.funcService.configureDate(personData.deathday);
      }

      if (this.person.biography.length > 200) {
        this.showOverview = false;
      } else {
        this.showOverview = true;
      }
    })
  }

  getPersonAge(birthday: string, type: number, deathDay?: string): number {
    let age;

    if(type == 1) {
      let today = new Date();
      let birthDate = new Date(birthday);
      age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }  
    } 
    else {
      if (deathDay !== null && deathDay !== undefined) {
        let today = new Date(birthday);
        let birthDate = new Date(deathDay);
        age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }
    }

    if(age !== undefined) {
      return age;
    } else {
      return 0;
    }
  }

  changeOverview(): void {
    this.showOverview = !this.showOverview;
    this.showOverviewText = !this.showOverviewText;
  }

  backClicked(): void {
    this._location.back();
  }

  paginate(event: any): void {
    window.scrollTo(0, 0);
  }
}