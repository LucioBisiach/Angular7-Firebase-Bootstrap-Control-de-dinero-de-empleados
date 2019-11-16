import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dataApi: DataApiService) { }
  public gastos = [];
  public gasto = '';

  ngOnInit() {
    this.dataApi.getAllGastos().subscribe(gastos => {
      // console.log('BOOKS', gastos);
      this.gastos = gastos;
    })
  }



}
