import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person';
import { PeopleService } from 'src/app/services/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})

export class PeopleComponent implements OnInit {
  people: Person[] = [];
  searchValue: string | null = null;
  storageClass: string = '';

  constructor(private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.getPagedPeople(1);

    if (localStorage.getItem('localObj')) {
      this.storageClass = 'container';
    } else {
      this.storageClass = 'container noStorage';
    }
  }

  getPagedPeople(page: number): void {
    this.peopleService.getPagedPeople(3, 'popular', 'person', page).subscribe(people => {
      this.people = people;
    })
  }

  paginate(event: any) {
    const pageNumber = event.page + 1;
    this.getPagedPeople(pageNumber);
  }

  searchChanged(): void {
    if (this.searchValue && this.searchValue?.length > 1) {
      this.peopleService.searchChanged('person', 'search', this.searchValue).subscribe(peopleResults => {
        peopleResults = peopleResults.sort(function (a, b) {  return b.popularity - a.popularity; });
        this.people = peopleResults;
      })
    }
  }

  resetResults(): void {
    this.searchValue = '';
    this.peopleService.getPagedPeople(3, 'popular', 'person', 1).subscribe(people => {
      this.people = people;
    })
  }
}