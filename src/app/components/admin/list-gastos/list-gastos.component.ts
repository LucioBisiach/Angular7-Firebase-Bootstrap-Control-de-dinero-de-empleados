import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../../services/data-api.service';
import { GastoInterface } from '../../../models/gasto';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInterface } from '../../../models/user';
import { AngularFirestore } from '@angular/fire/firestore';




@Component({
  selector: 'app-list-gastos',
  templateUrl: './list-gastos.component.html',
  styleUrls: ['./list-gastos.component.css']
})
export class ListGastosComponent implements OnInit {

  constructor(
    public dataApi: DataApiService,
    public authService: AuthService,
    public firestore: AngularFirestore,
  ) { }
  public gastos: GastoInterface[];
  public users: UserInterface[];
  public isAdmin: any = null;
  public userUid: string = null;

  public lst_Gasto_Select: GastoInterface[];

  public lst_Gasto_AllUser_Filtrado: GastoInterface[];
  public lst_Gasto_AllUser_Filtrado_Aprobados: GastoInterface[];
  public lst_Gasto_AllUser_Filtrado_AControlar: GastoInterface[];
  public lst_Gasto_AllUser_Filtrado_Rechazados: GastoInterface[];

  public lst_gastosCurrentUser: GastoInterface[];
  public lst_gastosCurrentUserAprobados: GastoInterface[];
  public lst_gastosCurrentUserAControlar: GastoInterface[];
  public lst_gastosCurrentUserRechazados: GastoInterface[];

  public show_lst_gastosCurrentUserAprobados: boolean = false;
  public show_lst_gastosCurrentUserAControlar: boolean = false;
  public show_lst_gastosCurrentUserRechazados: boolean = false;
  public show_btn_Aprobados: boolean = false;
  public show_btn_AControlar: boolean = false;
  public show_btn_Rechazados: boolean = false;

  public suma_gastosAprobados_porUsuario: 0;
  public suma_gastosAControlar_porUsuario: 0;
  public suma_gastosRechazados_porUsuario: 0;

  public p: string;


  public tabla_por_empleado_y_estado: GastoInterface[];
  public tabla_por_empleado_y_estado_Aprobados: GastoInterface[];
  public tabla_por_empleado_y_estado_AControlar: GastoInterface[];
  public tabla_por_empleado_y_estado_Rechazados: GastoInterface[];

  public show_lst_gastos_all_UserAprobados: boolean = false;
  public show_lst_gastos_all_UserAControlar: boolean = false;
  public show_lst_gastos_all_UserRechazados: boolean = false;
  public show_lst_all_User: boolean = false;
  public button_volver: boolean = true;
  public button_volver_user: boolean = false;


  public select_email: string;
  public select_id: string;
  public estado: string;


  ngOnInit() {
    this.getListGastos();
    this.getUsers()
    this.getCurrentUser();
    this.getListGastosCurrentUser()
    this.getGastosUsers()
  }

  getIdModalAddGasto(selectedUser: any) {
    this.select_id = selectedUser.id
  }

  buttonVolver(){
    this.show_lst_gastos_all_UserAprobados = false
    this.show_lst_gastos_all_UserAControlar = false
    this.show_lst_gastos_all_UserRechazados = false
    this.show_lst_all_User = false
    this.button_volver = true
    this.estado = ''
    this.select_email = ''
  }

  buttonVolverUser(){
    this.show_lst_gastosCurrentUserAprobados = false
    this.show_lst_gastosCurrentUserAControlar = false
    this.show_lst_gastosCurrentUserRechazados = false
    this.button_volver_user = false
    this.show_btn_Aprobados = false
    this.show_btn_AControlar = false
    this.show_btn_Rechazados = false

  }

  onSelectGastoAprobadoForUser(selectedUser: any) {

    this.estado = "Aprobado"
    this.select_email = selectedUser.email

    this.show_lst_all_User = true
    this.show_lst_gastos_all_UserAprobados = true
    this.show_lst_gastos_all_UserAControlar = false
    this.show_lst_gastos_all_UserRechazados = false
    this.button_volver = false

    this.dataApi.getAllGastos()
      .subscribe(gastos => {
        this.tabla_por_empleado_y_estado = gastos.filter(function (item) {
          return item.userUid == selectedUser.id
        });
        this.tabla_por_empleado_y_estado_Aprobados = this.tabla_por_empleado_y_estado.filter(function (item) {
          return item.estado == "Aprobado"
        });
      });
  }

  onSelectGastoAControlarForUser(selectedUser: any) {
    this.estado = "A controlar"
    this.select_email = selectedUser.email

    this.show_lst_all_User = true
    this.show_lst_gastos_all_UserAprobados = false
    this.show_lst_gastos_all_UserAControlar = true
    this.show_lst_gastos_all_UserRechazados = false
    this.button_volver = false


    this.dataApi.getAllGastos()
      .subscribe(gastos => {
        this.tabla_por_empleado_y_estado = gastos.filter(function (item) {
          return item.userUid == selectedUser.id
        });
        this.tabla_por_empleado_y_estado_AControlar = this.tabla_por_empleado_y_estado.filter(function (item) {
          return item.estado == "A controlar"
        });
      });
  }

  onSelectGastoRechazadoForUser(selectedUser: any) {
    this.estado = "Rechazado"
    this.select_email = selectedUser.email

    this.show_lst_all_User = true
    this.show_lst_gastos_all_UserAprobados = false
    this.show_lst_gastos_all_UserAControlar = false
    this.show_lst_gastos_all_UserRechazados = true
    this.button_volver = false


    this.dataApi.getAllGastos()
      .subscribe(gastos => {
        this.tabla_por_empleado_y_estado = gastos.filter(function (item) {
          return item.userUid == selectedUser.id
        });
        this.tabla_por_empleado_y_estado_Rechazados = this.tabla_por_empleado_y_estado.filter(function (item) {
          return item.estado == "Rechazado"
        });
        console.log(this.tabla_por_empleado_y_estado_Rechazados)
      });
  }



  getUsers() {
    this.dataApi.getAllUsers()
      .subscribe(users => {
        this.users = users;
        // console.log("Usuarios", users)
      });
  }

  getListGastos() {
    // All Gastos
    this.dataApi.getAllGastos()
      .subscribe(gastos => {
        this.gastos = gastos;
        // console.log("GASTOS", gastos)
      });
  }


  //Current User
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

  getGastosAprobados() {
    this.show_lst_gastosCurrentUserAprobados = true
    this.show_lst_gastosCurrentUserAControlar = false
    this.show_lst_gastosCurrentUserRechazados = false
    this.show_btn_Aprobados = false
    this.show_btn_AControlar = true
    this.show_btn_Rechazados = true
    this.button_volver_user = true

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
          // this.isAdmin = true;
        })
        this.dataApi.getAllGastos()
          .subscribe(gastos => {
            this.lst_gastosCurrentUser = gastos.filter(function (item) {
              return item.userUid == auth.uid
            });
            this.lst_gastosCurrentUserAprobados = this.lst_gastosCurrentUser.filter(function (item) {
              return item.estado == "Aprobado"
            });
          });

      }
    })

  }

  getGastosAControlar() {

    this.show_lst_gastosCurrentUserAprobados = false
    this.show_lst_gastosCurrentUserAControlar = true
    this.show_lst_gastosCurrentUserRechazados = false
    this.button_volver_user = true
    this.show_btn_Aprobados = true
    this.show_btn_AControlar = false
    this.show_btn_Rechazados = true


    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
          // this.isAdmin = true;
        })
        this.dataApi.getAllGastos()
          .subscribe(gastos => {
            this.lst_gastosCurrentUser = gastos.filter(function (item) {
              return item.userUid == auth.uid
            });
            this.lst_gastosCurrentUserAControlar = this.lst_gastosCurrentUser.filter(function (item) {
              return item.estado == "A controlar"
            });
          });
      }
    })

  }

  getGastosRechazados() {
    this.show_lst_gastosCurrentUserAprobados = false
    this.show_lst_gastosCurrentUserAControlar = false
    this.show_lst_gastosCurrentUserRechazados = true
    this.button_volver_user = true
    this.show_btn_Aprobados = true
    this.show_btn_AControlar = true
    this.show_btn_Rechazados = false


    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
          // this.isAdmin = true;
        })
        this.dataApi.getAllGastos()
          .subscribe(gastos => {
            this.lst_gastosCurrentUser = gastos.filter(function (item) {
              return item.userUid == auth.uid
            });
            this.lst_gastosCurrentUserRechazados = this.lst_gastosCurrentUser.filter(function (item) {
              return item.estado == null || item.estado == "Rechazado"
            });
          });
      }
    })
  }

  getListGastosCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
        this.dataApi.getAllGastos()
          .subscribe(gastos => {
            this.lst_gastosCurrentUser = gastos.filter(function (item) {
              return item.userUid == auth.uid
            });

            this.lst_gastosCurrentUserAprobados = this.lst_gastosCurrentUser.filter(function (item) {
              return item.estado == "Aprobado"
            })

            this.lst_gastosCurrentUserAControlar = this.lst_gastosCurrentUser.filter(function (item) {
              return item.estado == "A controlar"
            })

            this.lst_gastosCurrentUserRechazados = this.lst_gastosCurrentUser.filter(function (item) {
              return item.estado != "Aprobado" && item.estado != "A controlar"
            })

            this.suma_gastosAControlar_porUsuario = 0;
            this.suma_gastosAprobados_porUsuario = 0;
            this.suma_gastosRechazados_porUsuario = 0;

            for (let item of this.lst_gastosCurrentUser) {
              switch (item.estado) {
                case "A controlar":
                  this.suma_gastosAControlar_porUsuario += ((parseFloat(item.precio) * -1))
                  break;
                case "Aprobado":
                  this.suma_gastosAprobados_porUsuario += ((parseFloat(item.precio) * -1))
                  break;
                default:
                  this.suma_gastosRechazados_porUsuario += ((parseFloat(item.precio) * -1))
                  break;
              }

            }
          });
      }
    })

  }

  // All User


  getGastosUsers() {
    this.dataApi.getAllUsers()
      .subscribe(users => {
        this.users = users;

        this.dataApi.getAllGastos()
          .subscribe(gastos => {
            this.gastos = gastos;


            for (let user of this.users) {

              var valorAprobado = 0
              var valorAControlar = 0
              var valorRechazado = 0

              this.lst_Gasto_AllUser_Filtrado = this.gastos.filter(function (item) {
                return item.userUid == user.id
              });


              this.lst_Gasto_AllUser_Filtrado_Aprobados = this.lst_Gasto_AllUser_Filtrado.filter(function (item) {
                return item.estado == "Aprobado"
              });

              this.lst_Gasto_AllUser_Filtrado_AControlar = this.lst_Gasto_AllUser_Filtrado.filter(function (item) {
                return item.estado == "A controlar"
              });

              this.lst_Gasto_AllUser_Filtrado_Rechazados = this.lst_Gasto_AllUser_Filtrado.filter(function (item) {
                return item.estado == "Rechazado"
              });

              for (let item of this.lst_Gasto_AllUser_Filtrado_Aprobados) {
                valorAprobado += parseFloat(item.precio) * -1
              }
              user.gastosAprobados = valorAprobado.toString()

              for (let item of this.lst_Gasto_AllUser_Filtrado_AControlar) {
                valorAControlar += parseFloat(item.precio) * -1
              }
              user.gastosAControlar = valorAControlar.toString()

              for (let item of this.lst_Gasto_AllUser_Filtrado_Rechazados) {
                valorRechazado += parseFloat(item.precio) * -1
              }
              user.gastosRechazados = valorRechazado.toString()

            }
          });
      });
  }

  onDeleteGasto(idGasto: string): void {
    const confirmacion = confirm('Desea Eliminar este Gasto?');
    if (confirmacion) {
      this.dataApi.deleteGasto(idGasto);
    }
  }

  onPreUpdateGasto(gasto: GastoInterface) {
    console.log('GASTO', gasto);
    this.dataApi.selectedGasto = Object.assign({}, gasto);
  }

  getGastoAprobado(gasto: GastoInterface) {
    gasto.estado = "Aprobado"
    this.firestore.doc('gastos/' + gasto.id).update(gasto);
  }

  getGastoAControlar(gasto: GastoInterface) {
    gasto.estado = "A controlar"
    this.firestore.doc('gastos/' + gasto.id).update(gasto);
  }

  getGastoRechazado(gasto: GastoInterface) {
    gasto.estado = "Rechazado"
    this.firestore.doc('gastos/' + gasto.id).update(gasto);
  }


}
