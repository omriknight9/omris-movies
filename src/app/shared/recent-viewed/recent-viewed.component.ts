import { Component, OnInit } from '@angular/core';
import { IMAGES_SIZES } from 'src/app/constants/images-sizes';
import { RecentViewed } from 'src/app/models/recent-viewed';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'recent-viewed',
  templateUrl: './recent-viewed.component.html',
  styleUrls: ['./recent-viewed.component.scss']
})

export class RecentViewedComponent implements OnInit {
  localData: RecentViewed[] = [];
  imagesSizes = IMAGES_SIZES;
  currentEnvironment = environment;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.localStorageService.setLocalStorage().subscribe(data => {
      this.localData = data;
    })
  }
}