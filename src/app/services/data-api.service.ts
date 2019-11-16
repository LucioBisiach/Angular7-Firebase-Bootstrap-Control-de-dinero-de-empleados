import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { GastoInterface } from '../models/gasto';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UserInterface } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  constructor(public afs: AngularFirestore) { }
  public usersCollection: AngularFirestoreCollection<UserInterface>;
  public users: Observable<UserInterface[]>;

  public gastosCollection: AngularFirestoreCollection<GastoInterface>;
  public gastos: Observable<GastoInterface[]>;

  public gastoDoc: AngularFirestoreDocument<GastoInterface>;
  public gasto: Observable<GastoInterface>;
  public selectedGasto: GastoInterface = {
    id: null
  };

  getAllGastos() {
    this.gastosCollection = this.afs.collection<GastoInterface>('gastos', ref => ref.orderBy('fecha', 'desc'));
    return this.gastos = this.gastosCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as GastoInterface;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getAllGastosOffers() {
    this.gastosCollection = this.afs.collection('gastos');
    return this.gastos = this.gastosCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as GastoInterface;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getOneGasto(idGasto: string) {
    this.gastoDoc = this.afs.doc<GastoInterface>(`gastos/${idGasto}`);
    return this.gasto = this.gastoDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as GastoInterface;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  addGasto(gasto: GastoInterface): void {
    this.gastosCollection.add(gasto);
   
  }
  updateGasto(gasto: GastoInterface): void {
    let idGasto = gasto.id;
    this.gastoDoc = this.afs.doc<GastoInterface>(`gastos/${idGasto}`);
    this.gastoDoc.update(gasto);
  }
  deleteGasto(idGasto: string): void {
    this.gastoDoc = this.afs.doc<GastoInterface>(`gastos/${idGasto}`);
    this.gastoDoc.delete();
  }


  getAllUsers() {
    this.usersCollection = this.afs.collection<UserInterface>('users');
    // console.log("All User", this.usersCollection)
    return this.users = this.usersCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as UserInterface;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }
}
