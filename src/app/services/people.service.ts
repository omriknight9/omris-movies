import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person, PersonDto } from '../models/person';

@Injectable({
  providedIn: 'root'
})

export class PeopleService {

  constructor(private http : HttpClient) { }

  getPerson(id: string): Observable<Person> {
    return this.http.get<Person>(`${environment.baseUrl}/3/person/${id}?api_key=${environment.apiKey}&append_to_response=combined_credits,images,external_ids`)
  }

  getTrending(): Observable<PersonDto> {
    return this.http.get<PersonDto>(`${environment.baseUrl}/3/trending/person/week?api_key=${environment.apiKey}&language=en-US`);
  }

  getPagedPeople(apiNum: number, kind: string, type: string, page: number): Observable<Person[]> {
    return this.http.get<PersonDto>(`${environment.baseUrl}/${apiNum}/${type}/${kind}?api_key=${environment.apiKey}&language=en-US&page=${page}&sort_by=release_date.asc`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  searchChanged(kind: string, type: string, query?: string): Observable<Person[]> {
    return this.http.get<PersonDto>(`${environment.baseUrl}/3/${type}/${kind}?api_key=${environment.apiKey}&query=${query}&language=en-US`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }
}