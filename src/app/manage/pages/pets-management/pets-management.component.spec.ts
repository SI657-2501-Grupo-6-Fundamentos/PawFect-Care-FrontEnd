import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsManagementComponent } from './pets-management.component';

describe('PetsManagementComponent', () => {
  let component: PetsManagementComponent;
  let fixture: ComponentFixture<PetsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
