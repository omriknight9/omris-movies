import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { TvShowSimilar, TvShowEpisodes, TvShow, TVShowActorsExternals, TvShowCredits, TvShowExternalIDs, TvShowImages, TvShowVideo } from 'src/app/models/tvShow';
import { FuncsService } from 'src/app/services/funcs.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TvShowsService } from 'src/app/services/tv-shows.service';
import { IMAGES_SIZES } from '../../constants/images-sizes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tv-show',
  templateUrl: './tv-show.component.html',
  styleUrls: ['./tv-show.component.scss']
})
export class TvShowComponent implements OnInit {
  tvShow: TvShow | null = null;
  tvShowExternalIds: TvShowExternalIDs | null = null;
  tvShowCredits: TvShowCredits | null = null;
  tvShowGuestStars: TvShowEpisodes | null = null;
  tvShowImages: TvShowImages | null = null;
  tvShowVideos: TvShowVideo| null = null;
  tvShowSimilar: TvShowSimilar | null = null;
  tvShowSeasons: Array<number> = [];
  tvShowEpisodes: Array<number> = [];
  tvShowEpisodesData: TvShowEpisodes[] = [];
  chosenTvShowEpisodesData: TvShowEpisodes[] = [];
  arr: TVShowActorsExternals[] = [];
  imagesSizes = IMAGES_SIZES;
  currentEnvironment = environment;
  showOverview: boolean = false;
  showOverviewText: boolean = false;
  showSeasons: boolean = false;
  showEpisodes: boolean = false;
  newObj: Object = {};
  isMobile: boolean = false;

  responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    }
  ];

  constructor(private localStorageService: LocalStorageService, private _location: Location, private router: Router, private route: ActivatedRoute, private tvShowsService: TvShowsService, private funcService: FuncsService) {}

  ngOnInit(): void {
    if (document.body.offsetWidth < 765) {
      this.isMobile = true;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }
    this.route.params.pipe(first()).subscribe(({id}) => {
      this.getTvShow(id);
    })
  }

  getTvShow(id: string) {
    this.tvShowsService.getTvShow(id).subscribe(tvShowData => {  
      this.tvShowExternalIds = tvShowData.external_ids;
      this.tvShowCredits = tvShowData.credits;
      this.tvShowImages = tvShowData.images;
      this.tvShowVideos = tvShowData.videos;

      for (let w = 0; w < tvShowData.number_of_seasons; w++) {
        this.tvShowSeasons.push(w + 1);
      }

      let finalLength: number;

      if (this.tvShowCredits.cast.length < 20) {
        finalLength = this.tvShowCredits.cast.length;
      } else {
        finalLength = 20;
      }

      for (let i = 0; i < finalLength; i++) {
        this.getTVShowCreditsExternals(String(this.tvShowCredits.cast[i].id))
      }

      setTimeout(() => {
        this.getImdbAndInstagram();
      }, 2000)

      tvShowData.similar.results = tvShowData.similar.results.sort(function (a, b) {  return b.popularity - a.popularity; });
      for (let i = 0; i < tvShowData.similar.results.length; i++) {
        tvShowData.similar.results[i].first_air_date = this.funcService.configureDate(tvShowData.similar.results[i].first_air_date);
      }

      this.tvShowSimilar = tvShowData.similar;
      this.newObj = {'link': '/tv/', 'id': id, 'title': tvShowData.name,  'poster_path': tvShowData.poster_path};
      this.localStorageService.changeLocal(this.newObj);
      tvShowData.first_air_date = this.funcService.configureDate(tvShowData.first_air_date);
      this.tvShow = tvShowData;

      if (this.tvShow.overview.length > 200) {
        this.showOverview = false;
      } else {
        this.showOverview = true;
      }
    })
  }

  toggleDisplay() {
    this.showSeasons = !this.showSeasons;
    this.showEpisodes = false;
  }

  changeOverview() {
    this.showOverview = !this.showOverview;
    this.showOverviewText = !this.showOverviewText;
  }

  getTVShowCreditsExternals(id: string) {
    this.tvShowsService.getTVShowCreditsExternals(id).subscribe(TvShowCreditExternalsData => {
      this.arr.push(TvShowCreditExternalsData)
    })
  }
  
  getImdbAndInstagram(): void {
    if (this.tvShowCredits) {
      this.arr.forEach((element) => {
        this.tvShowCredits?.cast.forEach((element2, index2) => {
          if (element.id == element2.id) {
            if (this.tvShowCredits?.cast) {
              this.tvShowCredits.cast[index2].imdb_id = element.imdb_id;
              this.tvShowCredits.cast[index2].instagram_id = element.instagram_id;
            }
          }
        });
      });
    }
  }

  getTvShowSeasonDetails(id: string, seasonNum: number) {
    this.tvShowEpisodes = [];
    this.chosenTvShowEpisodesData = [];
    this.tvShowsService.getTvShowSeasonDetails(id, seasonNum).subscribe(tvShowSeasonData => {  
      this.tvShowEpisodesData = tvShowSeasonData.episodes;

      for (let k = 0; k < tvShowSeasonData.episodes.length; k++) {
        this.tvShowEpisodesData[k].guest_stars = this.tvShowEpisodesData[k].guest_stars.sort(function (a, b) {  return b.popularity - a.popularity; });
        this.tvShowEpisodes.push(k + 1);
      }

      this.showEpisodes = !this.showEpisodes;
      this.showSeasons = !this.showSeasons;

    });
  }

  getEpisodeInfo(episodeNum: number) {
    this.chosenTvShowEpisodesData = [];
    this.chosenTvShowEpisodesData.push(this.tvShowEpisodesData[episodeNum - 1]);
    this.tvShowGuestStars = this.tvShowEpisodesData[episodeNum - 1];
    setTimeout(() => {
      this.tvShowGuestStars = this.tvShowEpisodesData[episodeNum - 1];
    }, 0)
  }

  backClicked() {
    this._location.back();
  }

  paginate(event: any): void {
    window.scrollTo(0, 0);
  }
}