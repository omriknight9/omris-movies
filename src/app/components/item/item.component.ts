import { Component, Input, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie';
import { IMAGES_SIZES } from '../../constants/images-sizes';
import { FuncsService } from 'src/app/services/funcs.service';
import { TvShow } from 'src/app/models/tvShow';
import { Person } from 'src/app/models/person';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})

export class ItemComponent implements OnInit {
  @Input() itemData: Movie | null = null;
  @Input() itemDataTv: TvShow | null = null;
  @Input() itemDataPerson: Person | null = null;

  readonly imagesSizes = IMAGES_SIZES;
  dateToShow: string | null = null;
  showContent: Boolean = false;
  currentEnvironment = environment;

  constructor(private funcService: FuncsService) { }

  ngOnChanges(): void {
    if (this.itemData) {
      this.itemData.release_date2 = this.itemData.release_date;
      if (this.itemData.release_date.indexOf('-') !== -1) {
        this.itemData.release_date = (this.funcService.configureDate(this.itemData.release_date))
      }
    }

    if (this.itemDataTv) {
      if (this.itemDataTv.first_air_date.indexOf('-') !== -1) {
        this.itemDataTv.first_air_date = (this.funcService.configureDate(this.itemDataTv.first_air_date));
      }
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showContent = true;
    }, 500)
  }
}