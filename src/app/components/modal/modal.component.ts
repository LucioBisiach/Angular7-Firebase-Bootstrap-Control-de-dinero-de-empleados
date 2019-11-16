import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { ListGastosComponent } from '../admin/list-gastos/list-gastos.component';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(
    public dataApi: DataApiService, 
    public authService: AuthService,
    public listaGastosComponent: ListGastosComponent,
    ) { }

  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnCloseAdmin') btnCloseAdmin: ElementRef;
  @Input() userUid: string;

  ngOnInit() {
    this.getCurrentUser()
  }

  public isAdmin: any = null;

  onSaveGasto(gastoForm: NgForm): void {
    if (gastoForm.value.id == null) {
      // New 
      gastoForm.value.userUid = this.userUid
      gastoForm.value.estado = "A controlar"
      gastoForm.value.categoria = ""
      this.dataApi.addGasto(gastoForm.value);
    } else {
      // Update
      this.dataApi.updateGasto(gastoForm.value);
    }
    gastoForm.resetForm();
    this.btnClose.nativeElement.click();
  }

  onSaveGastoAdmin(gastoForm: NgForm): void {
    if (gastoForm.value.id == null) {
      // New 
      gastoForm.value.userUid = this.listaGastosComponent.select_id
      gastoForm.value.estado = "A controlar"
      this.dataApi.addGasto(gastoForm.value);
    } else {
      // Update
      this.dataApi.updateGasto(gastoForm.value);
    }
    gastoForm.resetForm();
    this.btnCloseAdmin.nativeElement.click();
    

  }

  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
          // this.isAdmin = true;
        })
      }
    })
  }

}
