import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';
import { Review } from '../../model/review.entity';
import { ReviewService } from '../../services/review.service';
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-review-edit',
  templateUrl: './review-edit.component.html',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatFormFieldModule,
    MatInputModule
  ],
  styleUrls: ['./review-edit.component.css']
})
export class ReviewEditComponent implements OnInit {
  @ViewChild('reviewForm', { static: false }) protected reviewForm!: NgForm;
  review: Review = new Review(0, 0, '', 0);
  reviewId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.reviewId = +this.route.snapshot.paramMap.get('id')!;
    this.getReviewById();
  }

  getReviewById(): void {
    this.reviewService.getById(this.reviewId).subscribe((res: Review) => {
      this.review = res;
    });
  }

  private isValid(): boolean {
    return this.reviewForm?.valid || false;
  }

  onSubmit(): void {
    if (this.isValid()) {
      this.reviewService.update(this.review.id, this.review).subscribe((updated: Review) => {
        console.log('Review actualizada:', updated);
        this.router.navigate([`/manage/appointments/review/${this.review.medicalAppointmentId}`]);
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  onCancel(): void {
    this.router.navigate([`/manage/appointments/review/${this.review.medicalAppointmentId}`]);
  }
}
