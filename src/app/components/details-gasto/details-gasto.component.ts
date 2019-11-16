import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { GastoInterface } from '../../models/gasto';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-details-gasto',
  templateUrl: './details-gasto.component.html',
  styleUrls: ['./details-gasto.component.css']
})
export class DetailsGastoComponent implements OnInit {

  constructor(public dataApi: DataApiService, public route: ActivatedRoute) { }
  public gasto: GastoInterface = {};

  ngOnInit() {
    const idGasto = this.route.snapshot.params['id'];
    this.getDetails(idGasto);
  }

  getDetails(idGasto: string): void {
    this.dataApi.getOneGasto(idGasto).subscribe(gasto => {
      this.gasto = gasto;
    });
  }

}
