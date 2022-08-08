import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person';
import { TvShow } from 'src/app/models/tvShow';
import { PeopleService } from 'src/app/services/people.service';
import { TvShowsService } from 'src/app/services/tv-shows.service';
import { Movie } from '../../models/movie';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  mcuMovies: Movie[] = [];
  marvelMovies: Movie[] = [];
  dcMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];
  trendingWeekMovies: Movie[] = [];
  trendingWeekTvShows: TvShow[] = [];
  trendingWeekPeople: Person[] = [];
  storageClass: string = '';

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

  constructor(private moviesService: MoviesService, private tvShowsService: TvShowsService, private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.loadData(true, 3, 'popular', 'movie', 1, 20, this.popularMovies);
    this.loadData(true, 3, 'upcoming', 'movie', 1, 20, this.upcomingMovies);
    this.loadTrending('movie', 'week');
    this.loadTrending('tv', 'week');
    this.loadTrending('person', '');

    if (localStorage.getItem('localObj')) {
      this.storageClass = 'container';
    } else {
      this.storageClass = 'container noStorage';
    }
  }

  loadTrending(type: string, time: string): void {
    switch (type) {
      case 'movie':
        this.moviesService.getTrending(type, time).subscribe((response) => {
          this.trendingWeekMovies = response.results;
        });
        break;
      case 'tv':
        this.tvShowsService.getTrending(type, time).subscribe((response) => {
          this.trendingWeekTvShows = response.results;
        });
        break;
      case 'person':
        this.peopleService.getTrending().subscribe((response) => {
          let data = response.results;    
          for (let i = 0; i < data.length; i++) {    
            if (data[i].known_for_department == 'Acting') {
              this.trendingWeekPeople.push(data[i]);
            }
          }
        });
        break;
      default:
        break;
    }
  }

  loadData(typeOfData: boolean, apiVersion: number, list: string, type: string, pageNum: number, count: number, arr: Movie[]): void {
    if (typeOfData) {
      this.moviesService.getMovies(apiVersion, list, type, pageNum, count).subscribe((response) => {
        response = response.sort((b, a) => new Date(b.release_date2).getTime() - new Date(a.release_date2).getTime());
        for (let j = 0; j < response.length; j++) {
          arr.push(response[j]);
          arr = arr.sort((b, a) => new Date(b.release_date2).getTime() - new Date(a.release_date2).getTime());
        }
      })
    } else {
      this.moviesService.getMovies(apiVersion, list, type, pageNum, count).subscribe((response) => {
        for (let j = 0; j < response.length; j++) {
          arr.push(response[j]);   
        }
      })
    }
  }
}