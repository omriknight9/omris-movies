import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { TvShow } from 'src/app/models/tvShow';
import { TvShowsService } from 'src/app/services/tv-shows.service';

@Component({
  selector: 'app-tv-shows',
  templateUrl: './tv-shows.component.html',
  styleUrls: ['./tv-shows.component.scss']
})

export class TvShowsComponent implements OnInit {
  tvShows: TvShow[] = [];
  genreId: string | null = null;
  companyId: string | null = null;
  providerId: string | null = null;
  searchValue: string | null = null;
  titleHeader: string | null = null;
  tvShowsType: string = '';
  storageClass: string = '';

  constructor(private tvShowsService: TvShowsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    if (this.router.url.indexOf('/popular') > -1) {
      this.tvShowsType = 'popular';
      this.titleHeader = 'Popular TV Shows';
      this.getPagedTvShows(1);
    } else if(this.router.url.indexOf('/top_rated') > -1) {
      this.tvShowsType = 'top_rated';
      this.titleHeader = 'Top Rated TV Shows';
      this.getPagedTvShows(1);
    } else if(this.router.url.indexOf('/on_the_air') > -1) {
      this.tvShowsType = 'on_the_air';
      this.titleHeader = 'Showing Now';
      this.getPagedTvShows(1);
    } else if(this.router.url.indexOf('/genres') > -1) {
      this.tvShowsType = 'genre';
      this.checkParam(1);
    } else if(this.router.url.indexOf('/company') > -1) {
      this.tvShowsType = 'company';
      this.checkParam(2);
    } else if(this.router.url.indexOf('/providers') > -1) {
      this.tvShowsType = 'provider';
      this.checkParam(3);
    }

    if (localStorage.getItem('localObj')) {
      this.storageClass = 'container';
    } else {
      this.storageClass = 'container noStorage';
    }
  }

  checkParam(type: number) {

    switch (type) {
      case 1:
        this.route.params.pipe(take(1)).subscribe(({genreId}) => {
          if (genreId) {
            this.genreId = genreId;
            this.getTvShowsByGenre(genreId, 1);
            
          } else {
            this.getPagedTvShows(1);
          }
        })
        break;
      case 2:
        this.route.params.pipe(take(1)).subscribe(({companyId}) => {
          if (companyId) {
            this.companyId = companyId;
            this.getTvShowsByCompany(companyId, 1);  
          } 
          else {
            this.getPagedTvShows(1);
          }
        })
        break;
        case 3:
          this.route.params.pipe(take(1)).subscribe(({providerId}) => {
            if (providerId) {
              this.providerId = providerId;
              this.getTvShowsByWatchProvider(providerId, 1);  
            } 
            else {
              this.getPagedTvShows(1);
            }
          })
          break;
    
      default:
        this.getPagedTvShows(1);
        break;
    }
  }

  getPagedTvShows(page: number) {
    this.tvShowsService.getPagedTvShows(page, this.tvShowsType).subscribe(tvShows => {
      this.tvShows = tvShows;
    })
  }

  getTvShowsByGenre(genreId: string, page: number) {
    this.tvShowsService.getTvShowsByGenre(genreId, page).subscribe(tvShowsByGenre => {
      this.tvShows = tvShowsByGenre;
    })
  }

  getTvShowsByCompany(companyId: string, page: number) {
    this.tvShowsService.getTvShowsByCompany(companyId, page).subscribe(tvShowsByCompany => {
      this.tvShows = tvShowsByCompany;
    })
  }

  getTvShowsByWatchProvider(providerId: string, page: number) {
    this.tvShowsService.getTvShowsByWatchProvider(providerId, page).subscribe(tvShowsByWatchProvider => {
      this.tvShows = tvShowsByWatchProvider;
    })
  }

  searchChanged() {
    if (this.searchValue && this.searchValue?.length > 1) {
      this.tvShowsService.searchChanged(this.searchValue).subscribe(tvShowsResults => {
        tvShowsResults = tvShowsResults.sort(function (a, b) {  return b.popularity - a.popularity; });
        this.tvShows = tvShowsResults;
      })
    }
  }

  paginate(event: any) {
    const pageNumber = event.page + 1;
    if (this.genreId) {
      this.getTvShowsByGenre(this.genreId, pageNumber);
    } else if (this.companyId) {
      this.getTvShowsByCompany(this.companyId, pageNumber);
    } else if (this.providerId) {
      this.getTvShowsByWatchProvider(this.providerId, pageNumber);
    } else {
      this.getPagedTvShows(pageNumber);
    }
  }

  resetResults() {
    this.searchValue = '';
    
    if(this.tvShowsType == 'genre') {
      this.getTvShowsByGenre(String(this.genreId), 1);
    } else if(this.tvShowsType == 'company') {
      this.getTvShowsByCompany(String(this.companyId), 1);
    } else if(this.tvShowsType == 'provider') {
      this.getTvShowsByWatchProvider(String(this.providerId), 1);
    } else {
      this.tvShowsService.getPagedTvShows(1, this.tvShowsType).subscribe(tvShows => {
        this.tvShows = tvShows;
      })
    }
  }
}