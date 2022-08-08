import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: (event) => {
          this.router.navigate(['']);
        }
      },
      {
          label: 'Movies',
          icon: 'pi pi-ticket',
          items: [
              {label: 'Popular', command: (event) => {
                this.router.navigate(['movies/popular']);
              }},
              {label: 'Upcoming', command: (event) => {
                this.router.navigate(['movies/upcoming']);
              }},
              {label: 'Playing Now', command: (event) => {
                this.router.navigate(['movies/now_playing']);
              }},

              {label: 'Timeline', items: [
                {label: 'MCU', command: (event) => {
                  this.router.navigate(['timeline/mcu']);
                }},
                {label: 'DCEU', command: (event) => {
                  this.router.navigate(['timeline/dceu']);
                }}
              ]}
          ]
      },
      {
          label: 'TV Shows',
          icon: 'pi pi-tablet',
          items: [
            {label: 'Popular', command: (event) => {
              this.router.navigate(['tv/popular']);
            }},
            {label: 'Top Rated', command: (event) => {
              this.router.navigate(['tv/top_rated']);
            }},
            {label: 'On The Air', command: (event) => {
              this.router.navigate(['tv/on_the_air']);
            }}
          ]
      },
      {
        label: 'Genres',
        icon: 'pi pi-clone',
        command: (event) => {
          this.router.navigate(['/genres']);
        }
      },
      {
        label: 'People',
        icon: 'pi pi-user',
        command: (event) => {
          this.router.navigate(['people']);
        }
      },
      {
        label: 'Providers',
        icon: 'pi pi-video',
        command: (event) => {
          this.router.navigate(['/providers']);
        }
      }
      
    ];
  }
}