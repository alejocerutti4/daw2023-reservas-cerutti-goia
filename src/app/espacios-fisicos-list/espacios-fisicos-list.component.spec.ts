import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaciosFisicosListComponent } from './espacios-fisicos-list.component';

describe('EspaciosFisicosListComponent', () => {
  let component: EspaciosFisicosListComponent;
  let fixture: ComponentFixture<EspaciosFisicosListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaciosFisicosListComponent]
    });
    fixture = TestBed.createComponent(EspaciosFisicosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
