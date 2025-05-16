import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalHistoryManagementComponent } from './medical-history-management.component';

describe('EventsManagementComponent', () => {
    let component: MedicalHistoryManagementComponent;
    let fixture: ComponentFixture<MedicalHistoryManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MedicalHistoryManagementComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MedicalHistoryManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

