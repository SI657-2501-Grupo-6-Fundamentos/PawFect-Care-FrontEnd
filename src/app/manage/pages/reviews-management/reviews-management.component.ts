import { Component, OnInit, ViewChild } from '@angular/core';
import { Review } from '../../model/review.entity';
import { ReviewService } from '../../services/review.service';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reviews-management',
  templateUrl: './reviews-management.component.html',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    FormsModule,
    MatInput,
    MatTable,
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatPaginator,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatFormFieldModule,
    MatInputModule
  ],
  styleUrls: ['./reviews-management.component.css']
})
export class ReviewsManagementComponent implements OnInit {
  dataSource: MatTableDataSource<Review> = new MatTableDataSource<Review>();
  columnsToDisplay: string[] = ['id', 'rating', 'content', 'medicalAppointmentId', 'actions'];
  searchQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reviewService: ReviewService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const appointmentIdParam = this.route.snapshot.paramMap.get('id');
    const medicalAppointmentId = appointmentIdParam ? Number(appointmentIdParam) : null;

    if (medicalAppointmentId) {
      this.loadReviews(medicalAppointmentId);
    } else {
      console.error('Missing medicalAppointmentID in route');
    }
  }

  loadReviews(medicalAppointmentId: number): void {
    /*this.reviewService.getReviewsByMedicalAppointmentId(medicalAppointmentId).subscribe((reviews: Review[]) => {
      this.dataSource = new MatTableDataSource(reviews);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });*/


    this.reviewService.getAllReviewsByMedicalAppointmentId(medicalAppointmentId).subscribe((reviews: Review[]) => {
      this.dataSource = new MatTableDataSource(reviews);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  navigateToAddReview(): void {
    this.router.navigate(['/manage/reviews/add/']);
  }

  navigateToEditReview(id: number): void {
    this.router.navigate(['manage/appointments/edit-review/', id]);
  }
}

