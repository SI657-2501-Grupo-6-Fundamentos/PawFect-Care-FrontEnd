import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsClientComponent } from './pets-client.component';

describe('PetsClientComponent', () => {
  let component: PetsClientComponent;
  let fixture: ComponentFixture<PetsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
