import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { PrimeIcons } from 'primeng/api';
import { IMAGES_SIZES } from '../../constants/images-sizes';
import { Router } from '@angular/router';
import { FuncsService } from 'src/app/services/funcs.service';
import { Timeline } from 'src/app/models/timeline';
import { Movie } from 'src/app/models/movie';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {
  events: Timeline[] = [];
  cinematicType: string = '';
  imagesSizes = IMAGES_SIZES;
  moviesArr: Movie[] = [];
  storageClass: string = '';

  constructor(private moviesService: MoviesService, private router: Router, private funcService: FuncsService) { }

  ngOnInit(): void {
    if (this.router.url.indexOf('/mcu') > -1) {
      this.cinematicType = 'mcu';

    this.loadTimeline(1, '7099064');
   
    setTimeout(() => {
      this.loadTimeline(2, '7099064');
    }, 500)

    } else if(this.router.url.indexOf('/dceu') > -1) {
      this.cinematicType = 'dceu'; 
      this.loadTimeline(1, '7099063');
    }

    if (localStorage.getItem('localObj')) {
      this.storageClass = 'card';
    } else {
      this.storageClass = 'card noStorage';
    }
  }

  loadTimeline(page: number, list: string): void {
    this.moviesService.getMovies(4, list, 'list', page, 20).subscribe((response) => {

      console.log(response)

      if (this.moviesArr.length == 0) {
        this.moviesArr = response;
      } else {
        this.moviesArr.push(...response);
      }
    
      for (let w = 0; w < response.length; w++) {

        if (response[w].release_date == undefined) {
          response[w].release_date = 'TBA';
          let newDate = response[w];
          this.moviesArr.push(newDate);
        }

        response[w].release_date2 = response[w].release_date;
        response[w].release_date = this.funcService.configureDate(response[w].release_date);

        let showEventDesc;
        let showEventDescText = false;

        if (response[w].overview.length > 200) {
          showEventDesc = false;
        } else {
          showEventDesc = true;
        }

        let obj = {
          id: response[w].id,
          status: response[w].title,
          date: response[w].release_date,
          date2: response[w].release_date2,
          icon: PrimeIcons.CIRCLE,
          image: response[w].backdrop_path,
          poster: response[w].poster_path,
          desc: response[w].overview, 
          showDesc: showEventDesc,
          showDescText: showEventDescText,
        }

        this.events = [...this.events, obj];
      }

      this.events = this.events.sort((b, a) => new Date(a.date2).getTime() - new Date(b.date2).getTime());

      for (let x = 0; x < this.events.length; x++) {
        if (this.events[x].date == 'TBA') {
          let newDate = this.events[x];
          this.events.splice(x, 1);
          this.events.unshift(newDate);
        }
      }
        this.events = this.events.reverse();
    });
  }

  changeDesc(event: any): void {
    event.showDesc = !event.showDesc;
    event.showDescText = !event.showDescText;
  }
}