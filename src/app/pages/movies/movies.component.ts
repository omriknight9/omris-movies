import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Movie } from 'src/app/models/movie';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})

export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  genreId: string | null = null;
  keywordId: string | null = null;
  companyId: string | null = null;
  providerId: string | null = null;
  searchValue: string | null = null;
  dateDown: boolean = true;
  dateUp: boolean = false;
  aToZ: boolean = true;
  zToA: boolean = false;
  titleHeader: string | null = null;
  moviesType: string = '';
  storageClass: string = '';

  constructor(private moviesService: MoviesService, private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    if (this.router.url.indexOf('/popular') > -1) {
      this.moviesType = 'popular';
      this.titleHeader = 'Popular Movies';
      this.getPagedMovies(1);
    } else if(this.router.url.indexOf('/upcoming') > -1) {
      this.moviesType = 'upcoming';
      this.titleHeader = 'Upcoming Movies';
      this.getPagedMovies(1);
    } else if(this.router.url.indexOf('/now_playing') > -1) {
      this.moviesType = 'now_playing';
      this.titleHeader = 'Playing Now';
      this.getPagedMovies(1);
    } else if(this.router.url.indexOf('/keyword') > -1) {
      this.moviesType = 'keyword';
      this.checkParam(2);
    } else if(this.router.url.indexOf('/genres') > -1) {
      this.moviesType = 'genre';
      this.checkParam(1);
    } else if(this.router.url.indexOf('/company') > -1) {
      this.moviesType = 'company';
      this.checkParam(3);
    } else if(this.router.url.indexOf('/providers') > -1) {
      this.moviesType = 'provider';
      this.checkParam(4);
    }

    if (localStorage.getItem('localObj')) {
      this.storageClass = 'container';
    } else {
      this.storageClass = 'container noStorage';
    }
  }

  checkParam(type: number): void {
    switch (type) {
      case 1:
        this.route.params.pipe(take(1)).subscribe(({genreId}) => {
          if (genreId) {
            this.genreId = genreId;
            this.getMoviesByGenre(genreId, 1);
            
          } else {
            this.getPagedMovies(1);
          }
        })
        break;
      case 2:
        this.route.params.pipe(take(1)).subscribe(({keywordId}) => {
          if (keywordId) {
            this.keywordId = keywordId;
            this.getMoviesByKeyword(keywordId, 1);  
          } 
          else {
            this.getPagedMovies(1);
          }
        })
        break;
      case 3:
        this.route.params.pipe(take(1)).subscribe(({companyId}) => {
          if (companyId) {
            this.companyId = companyId;
            this.getMoviesByCompany(companyId, 1);  
          } 
          else {
            this.getPagedMovies(1);
          }
        })
        break;
        case 4:
          this.route.params.pipe(take(1)).subscribe(({providerId}) => {
            if (providerId) {
              this.providerId = providerId;
              this.getMoviesByWatchProvider(providerId, 1);  
            } 
            else {
              this.getPagedMovies(1);
            }
          })
          break;
      default:
        this.getPagedMovies(1);
        break;
    }
  }

  getPagedMovies(page: number): void {
    this.moviesService.getPagedMovies(3, this.moviesType, 'movie', page).subscribe(movies => {
      this.movies = movies;
    })
  }

  getMoviesByGenre(genreId: string, page: number): void {
    this.moviesService.getMoviesByGenre(genreId, page).subscribe(moviesByGenre => {
      this.movies = moviesByGenre;
    })
  }

  getMoviesByKeyword(keywordId: string, page: number): void {
    this.moviesService.getMoviesByKeyword(keywordId, page).subscribe(moviesByKeyword => {
      this.movies = moviesByKeyword;
    })
  }

  getMoviesByCompany(companyId: string, page: number): void {
    this.moviesService.getMoviesByCompany(companyId, page).subscribe(moviesByCompany => {
      this.movies = moviesByCompany;
    })
  }

  getMoviesByWatchProvider(providerId: string, page: number): void {
    this.moviesService.getMoviesByWatchProvider(providerId, page).subscribe(moviesByWatchProvider => {
      this.movies = moviesByWatchProvider;
    })
  }

  paginate(event: any): void {
    const pageNumber = event.page + 1;
    if (this.genreId) {
      this.getMoviesByGenre(this.genreId, pageNumber);
    } else if (this.keywordId) {
      this.getMoviesByKeyword(this.keywordId, pageNumber);
    } else if (this.companyId) {
      this.getMoviesByCompany(this.companyId, pageNumber);
    } else if (this.providerId) {
      this.getMoviesByWatchProvider(this.providerId, pageNumber);
    } else {
      this.getPagedMovies(pageNumber);
    }

    this.dateDown = true;
    this.dateUp = false;
    this.aToZ = true;
    this.zToA = false;
  }

  searchChanged(): void {
    if (this.searchValue && this.searchValue?.length > 1) {
      this.moviesService.searchChanged('movie', 'search', this.searchValue).subscribe(moviesResults => {
        moviesResults = moviesResults.sort(function (a, b) {  return b.popularity - a.popularity; });
        this.movies = moviesResults;
      })
    } 
  }

  resetResults(): void {
    this.searchValue = '';
    
    if(this.moviesType == 'keyword') {
      this.getMoviesByKeyword(String(this.keywordId), 1);
    } else if(this.moviesType == 'genre') {
      this.getMoviesByGenre(String(this.genreId), 1);
    } else if(this.moviesType == 'company') {
      this.getMoviesByCompany(String(this.companyId), 1);
    } else if(this.moviesType == 'provider') {
      this.getMoviesByWatchProvider(String(this.providerId), 1);
    } else {
      this.moviesService.getPagedMovies(3, this.moviesType, 'movie', 1).subscribe(movies => {
        this.movies = movies;
      })
    }
  }

  fromNewToOld(): void {
    this.dateDown = false;
    this.dateUp = true;
    this.aToZ = true;
    this.zToA = false;
    this.movies = this.movies.sort((a, b) => new Date(b.release_date2).getTime() - new Date(a.release_date2).getTime());
  }

  fromOldToNew(): void {
    this.dateDown = true;
    this.dateUp = false;
    this.aToZ = true;
    this.zToA = false;
    this.movies = this.movies.sort((b, a) => new Date(b.release_date2).getTime() - new Date(a.release_date2).getTime());
  }

  fromAToZ(): void {
    this.dateDown = true;
    this.dateUp = false;
    this.aToZ = false;
    this.zToA = true;
    this.movies = this.movies.sort((a, b) => (a.title > b.title) ? 1 : -1)
  }

  fromZToA(): void {
    this.dateDown = true;
    this.dateUp = false;
    this.aToZ = true;
    this.zToA = false;
    this.movies = this.movies.sort((b, a) => (a.title > b.title) ? 1 : -1)
  }
}
