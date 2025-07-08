import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticCreateComponent } from './diagnostic-create.component';

describe('DiagnosticCreateComponent', () => {
  let component: DiagnosticCreateComponent;
  let fixture: ComponentFixture<DiagnosticCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
