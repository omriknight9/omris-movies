import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Movie, MovieActorsExternals, MovieCredits, MovieImages, MovieKeywords, MovieVideo, MovieSimilar, MovieCrew } from 'src/app/models/movie';
import { FuncsService } from 'src/app/services/funcs.service';
import { MoviesService } from 'src/app/services/movies.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { IMAGES_SIZES } from '../../constants/images-sizes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})

export class MovieComponent implements OnInit {
  movie: Movie | null = null;
  movieKeywords: MovieKeywords | null = null;
  movieImages: MovieImages | null = null;
  movieVideos: MovieVideo | null = null;
  movieCredits: MovieCredits | null = null;
  movieCrew: MovieCredits | null = null;
  movieSimilar: MovieSimilar | null = null;
  movieCreditsExternals: MovieActorsExternals | null = null;
  movieDirectors: Array<MovieCrew> = [];
  showOverview: boolean = false;
  showOverviewText: boolean = false;
  imagesSizes = IMAGES_SIZES;
  currentEnvironment = environment;
  directorHeader: string = '';
  actorsArr: MovieActorsExternals[] = [];
  directorsArr: MovieActorsExternals[] = [];
  newObj: Object = {};
  sameObj: Boolean = false;
  isMobile: boolean = false;

  responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    }
  ];

  constructor(private localStorageService: LocalStorageService, private _location: Location, private router: Router, private route: ActivatedRoute, private moviesService: MoviesService, private funcService: FuncsService) {}

  ngOnInit(): void {
    if (document.body.offsetWidth < 765) {
      this.isMobile = true;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }
    this.route.params.pipe(first()).subscribe(({id}) => {
      this.getMovie(id);
    })
  }

  getMovie(id: string): void {
    this.moviesService.getMovie(id).subscribe(movieData => {   
      this.movieImages = movieData.images;
      this.movieVideos = movieData.videos;
      this.movieKeywords = movieData.keywords;
      this.movieCredits = movieData.credits;
      this.movieCrew = movieData.credits;

      for (let g = 0; g < this.movieCredits?.crew.length; g++) {
        if (this.movieCredits?.crew[g].job == 'Director') {
          this.movieDirectors.push(this.movieCredits?.crew[g]);
        }
      }

      let finalLength: number;

      if (this.movieCredits.cast.length < 21) {
        finalLength = this.movieCredits.cast.length;
      } else {
        finalLength = 21;
      }

      for (let i = 0; i < finalLength; i++) {
        this.getMovieCreditsExternals(String(this.movieCredits.cast[i].id), 1)
      }

      if (this.movieCrew.crew.length > 0) {
        for (let w = 0; w < this.movieCrew.crew.length; w++) {
          if(this.movieCrew.crew[w].job == 'Director') {
            this.getMovieCreditsExternals(String(this.movieCrew?.crew[w].id), 2)
          }
        }
      }

      movieData.similar.results = movieData.similar.results.sort(function (a, b) {  return b.popularity - a.popularity; });
      for (let j = 0; j < movieData.similar.results.length; j++) {
        movieData.similar.results[j].release_date = this.funcService.configureDate(movieData.similar.results[j].release_date);
      }  

      this.movieSimilar = movieData.similar;
      this.newObj = {'link': '/movie/', 'id': id, 'title': movieData.title,  'poster_path': movieData.poster_path};
      this.localStorageService.changeLocal(this.newObj);

      if (movieData.release_date !== '') {
        movieData.release_date = this.funcService.configureDate(movieData.release_date);
      }

      if (movieData.runtime == 0 || movieData.runtime ==null) {
        movieData.runtime = '0';
      }

      if (movieData.runtime !== '0') {
        movieData.runtime = this.funcService.convertMinsToHrsMins(Number(movieData.runtime));
      }

      if (movieData.revenue !== '0') {
        movieData.revenue = this.funcService.numberWithCommas(Number(movieData.revenue));
      }

      this.movie = movieData;

      if (this.movie.overview.length > 200) {
        this.showOverview = false;
      } else {
        this.showOverview = true;
      }

      setTimeout(() => {
        if(this.movieDirectors.length < 2) {
          this.directorHeader = 'Director';
        } else {
          this.directorHeader = 'Directors';
        }
      }, 1000)

      setTimeout(() => {
        this.getImdbAndInstagram();
      }, 2000)
    })
  }

  changeOverview(): void {
    this.showOverview = !this.showOverview;
    this.showOverviewText = !this.showOverviewText;
  }

  getMovieCreditsExternals(id: string, type: number): void {
    this.moviesService.getMovieCreditsExternals(id).subscribe(movieCreditExternalsData => {
      if (type == 1) {
        this.actorsArr.push(movieCreditExternalsData);
      } else {
        this.directorsArr.push(movieCreditExternalsData);
      }
    })
  }

  getImdbAndInstagram(): void {
    if (this.movieCredits) {
      this.actorsArr.forEach((element) => {
        this.movieCredits?.cast.forEach((element2, index2) => {
          if (element.id == element2.id) {
            if (this.movieCredits?.cast) {
              this.movieCredits.cast[index2].imdb_id = element.imdb_id;
              this.movieCredits.cast[index2].instagram_id = element.instagram_id;
            }
          }
        });
      });
    }

    if (this.movieDirectors) {
      this.directorsArr.forEach((element) => {
        this.movieDirectors.forEach((element2, index2) => {
          if (element.id == element2.id) {
            if (this.movieDirectors) {
              this.movieDirectors[index2].imdb_id = element.imdb_id;
              this.movieDirectors[index2].instagram_id = element.instagram_id;
            }
          }
        });
      });
    }
  }
  
  backClicked(): void {
    this._location.back();
  }

  paginate(event: any): void {
    window.scrollTo(0, 0);
  }
}
