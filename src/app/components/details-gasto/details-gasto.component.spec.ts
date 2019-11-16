import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsGastoComponent } from './details-gasto.component';

describe('DetailsGastoComponent', () => {
  let component: DetailsGastoComponent;
  let fixture: ComponentFixture<DetailsGastoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsGastoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
