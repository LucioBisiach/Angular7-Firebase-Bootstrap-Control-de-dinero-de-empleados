import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { GastoInterface } from 'src/app/models/gasto';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  constructor(public dataApi: DataApiService) { }
  public gastos: GastoInterface[];
  ngOnInit() {
    this.getOffers();
    console.log('OFERTAS', this.gastos);
  }


  getOffers() {
    this.dataApi.getAllGastosOffers().subscribe(offers => this.gastos = offers);
  }

}
