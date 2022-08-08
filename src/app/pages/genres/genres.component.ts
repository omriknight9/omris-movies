import { Component, OnInit } from '@angular/core';
import { Genre } from 'src/app/models/genre';
import { MoviesService } from 'src/app/services/movies.service';
import { TvShowsService } from 'src/app/services/tv-shows.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})

export class GenresComponent implements OnInit {
  moviesGenres: Genre[] = [];
  tvShowsGenres: Genre[] = [];

  constructor(private moviesService: MoviesService, private tvShowsService: TvShowsService) { }

  ngOnInit(): void {
    this.moviesService.getMoviesGenres().subscribe((genresData) => {
      this.moviesGenres = genresData
    })

    this.tvShowsService.getTvShowsGenres().subscribe((genresData) => {
      this.tvShowsGenres = genresData
    })
  }
}
