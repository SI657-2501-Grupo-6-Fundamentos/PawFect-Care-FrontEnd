import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticEditComponent } from './diagnostic-edit.component';

describe('DiagnosticEditComponent', () => {
  let component: DiagnosticEditComponent;
  let fixture: ComponentFixture<DiagnosticEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
