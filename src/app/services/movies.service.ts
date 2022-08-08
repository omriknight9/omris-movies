import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie, MovieActorsExternals, MovieDto } from '../models/movie';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Genre, GenresDto } from '../models/genre';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MoviesService {

  constructor(private http : HttpClient) { }

  getMovies(apiNum: number, kind: string, type: string, page: number, count: number) {
    return this.http.get<MovieDto>(`${environment.baseUrl}/${apiNum}/${type}/${kind}?api_key=${environment.apiKey}&language=en-US&page=${page}&sort_by=release_date.asc`)
    .pipe(switchMap(res => {
      return of(res.results.slice(0, count));
    }));
  }

  getTrending(kind: string, time: string): Observable<MovieDto> {
    return this.http.get<MovieDto>(`${environment.baseUrl}/3/trending/${kind}/${time}?api_key=${environment.apiKey}&language=en-US`);
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${environment.baseUrl}/3/movie/${id}?api_key=${environment.apiKey}&append_to_response=images,similar,videos,keywords,credits,watch/providers`);
  }

  getMoviesGenres(): Observable<Genre[]> {
    return this.http.get<GenresDto>(`${environment.baseUrl}/3/genre/movie/list?api_key=${environment.apiKey}&language=en-US`)
    .pipe(switchMap(res => {
      return of(res.genres);
    }));
  }

  getMoviesByGenre(genreId: string, page: number): Observable<Movie[]> {
    return this.http.get<MovieDto>(`${environment.baseUrl}/3/discover/movie?api_key=${environment.apiKey}&with_genres=${genreId}&language=en-US&page=${page}`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getPagedMovies(apiNum: number, kind: string, type: string, page: number): Observable<Movie[]> {
    return this.http.get<MovieDto>(`${environment.baseUrl}/${apiNum}/${type}/${kind}?api_key=${environment.apiKey}&language=en-US&page=${page}&sort_by=release_date.asc`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  searchChanged(kind: string, type: string, query?: string): Observable<Movie[]> {
    return this.http.get<MovieDto>(`${environment.baseUrl}/3/${type}/${kind}?api_key=${environment.apiKey}&query=${query}&language=en-US`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getMovieCreditsExternals(id: string): Observable<MovieActorsExternals> {
    return this.http.get<MovieActorsExternals>(`${environment.baseUrl}/3/person/${id}/external_ids?api_key=${environment.apiKey}`);
  }
  
  getMoviesByKeyword(keywordId: string, page: number): Observable<Movie[]> {
    return this.http.get<MovieDto>(`${environment.baseUrl}/3/keyword/${keywordId}/movies?api_key=${environment.apiKey}&language=en-US&page=${page}`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getMoviesByCompany(companyId: string, page: number): Observable<Movie[]> {
    return this.http.get<MovieDto>(`${environment.baseUrl}/3/discover/movie?api_key=${environment.apiKey}&with_companies=${companyId}&language=en-US&page=${page}`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getMoviesByWatchProvider(watchProviderId: string, page: number): Observable<Movie[]> {
    return this.http.get<MovieDto>(`${environment.baseUrl}/3/discover/movie?api_key=${environment.apiKey}&watch_region=US&sort_by=popularity.desc&with_watch_providers=${watchProviderId}&language=en-US&page=${page}`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }
}