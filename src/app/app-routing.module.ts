import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenresComponent } from './pages/genres/genres.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieComponent } from './pages/movie/movie.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { PeopleComponent } from './pages/people/people.component';
import { PersonComponent } from './pages/person/person.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { TvShowComponent } from './pages/tv-show/tv-show.component';
import { TvShowsComponent } from './pages/tv-shows/tv-shows.component';
import { WatchProvidersComponent } from './pages/watch-providers/watch-providers.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'movies',
    component: MoviesComponent
  },
  {
    path: 'movies/popular',
    component: MoviesComponent
  },
  {
    path: 'movies/upcoming',
    component: MoviesComponent
  },
  {
    path: 'movies/now_playing',
    component: MoviesComponent
  },
  {
    path: 'movie/:id',
    component: MovieComponent
  },
  {
    path: 'movies/keyword/:keywordId',
    component: MoviesComponent
  },
  {
    path: 'movies/company/:companyId',
    component: MoviesComponent
  },
  {
    path: 'genres',
    component: GenresComponent
  },
  {
    path: 'movies/genres/:genreId',
    component: MoviesComponent
  },
  {
    path: 'providers',
    component: WatchProvidersComponent
  },
  {
    path: 'movies/providers/:providerId',
    component: MoviesComponent
  },
  {
    path: 'tv',
    component: TvShowsComponent
  },
  {
    path: 'tv/popular',
    component: TvShowsComponent
  },
  {
    path: 'tv/top_rated',
    component: TvShowsComponent
  },
  {
    path: 'tv/on_the_air',
    component: TvShowsComponent
  },
  {
    path: 'tv/:id',
    component: TvShowComponent
  },
  {
    path: 'tv/genres/:genreId',
    component: TvShowsComponent
  },
  {
    path: 'tv/company/:companyId',
    component: TvShowsComponent
  },
  {
    path: 'tv/providers/:providerId',
    component: TvShowsComponent
  },
  {
    path: 'people',
    component: PeopleComponent
  },
  {
    path: 'person/:id',
    component: PersonComponent
  },
  {
    path: 'person/director/:directorId',
    component: PersonComponent
  },
  {
    path: 'timeline/mcu',
    component: TimelineComponent
  },
  {
    path: 'timeline/dceu',
    component: TimelineComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
