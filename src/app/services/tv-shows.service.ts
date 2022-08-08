import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TvShow, TVShowActorsExternals, TvShowDto } from '../models/tvShow';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Genre, GenresDto } from '../models/genre';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TvShowsService {

  constructor(private http : HttpClient) { }

  getTvShow(id: string): Observable<TvShow> {
    return this.http.get<TvShow>(`${environment.baseUrl}/3/tv/${id}?api_key=${environment.apiKey}&append_to_response=images,similar,videos,keywords,credits,watch/providers,external_ids`)
  }

  getTrending(kind: string, time: string): Observable<TvShowDto> {
    return this.http.get<TvShowDto>(`${environment.baseUrl}/3/trending/${kind}/${time}?api_key=${environment.apiKey}&language=en-US`);
  }

  getPagedTvShows(page: number, kind: string): Observable<TvShow[]> {
    return this.http.get<TvShowDto>(`${environment.baseUrl}/3/tv/${kind}?api_key=${environment.apiKey}&language=en-US&page=${page}&sort_by=release_date.asc`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  searchChanged(query?: string): Observable<TvShow[]> {
    return this.http.get<TvShowDto>(`${environment.baseUrl}/3/search/tv?api_key=${environment.apiKey}&query=${query}&language=en-US`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getTvShowsGenres(): Observable<Genre[]> {
    return this.http.get<GenresDto>(`${environment.baseUrl}/3/genre/tv/list?api_key=${environment.apiKey}&language=en-US`)
    .pipe(switchMap(res => {
      return of(res.genres);
    }));
  }

  getTvShowsByGenre(genreId: string, page: number): Observable<TvShow[]> {
    return this.http.get<TvShowDto>(`${environment.baseUrl}/3/discover/tv?api_key=${environment.apiKey}&with_genres=${genreId}&language=en-US&page=${page}`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getTVShowCreditsExternals(id: string): Observable<TVShowActorsExternals> {
    return this.http.get<TVShowActorsExternals>(`${environment.baseUrl}/3/person/${id}/external_ids?api_key=${environment.apiKey}`);
  }

  getTvShowsByCompany(companyId: string, page: number): Observable<TvShow[]> {
    return this.http.get<TvShowDto>(`${environment.baseUrl}/3/discover/tv?api_key=${environment.apiKey}&with_companies=${companyId}&language=en-US&page=${page}`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getTvShowsByWatchProvider(watchProviderId: string, page: number): Observable<TvShow[]> {
    return this.http.get<TvShowDto>(`${environment.baseUrl}/3/discover/tv?api_key=${environment.apiKey}&watch_region=US&sort_by=popularity.desc&with_watch_providers=${watchProviderId}&language=en-US&page=${page}`)
    .pipe(switchMap(res => {
      return of(res.results);
    }));
  }

  getTvShowSeasonDetails(id: string, seasonNum: number): Observable<TvShowDto> {
    return this.http.get<TvShowDto>(`${environment.baseUrl}/3/tv/${id}/season/${seasonNum}?api_key=${environment.apiKey}&language=en-US`)
  }
}