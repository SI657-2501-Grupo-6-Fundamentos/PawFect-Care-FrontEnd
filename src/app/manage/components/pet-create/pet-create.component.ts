import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Pet } from '../../model/pet.entity';
import { PetsService } from '../../services/pets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Client } from '../../model/client.entity';
import { ClientsService } from '../../services/clients.service';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    TranslateModule,
  ],
  templateUrl: './pet-create.component.html',
  styleUrl: './pet-create.component.css'
})
export class PetCreateComponent implements OnInit {
  @Input() pet!: Pet;

  @ViewChild('petForm', { static: false }) protected petForm!: NgForm;
  clientId!: number;
  options: Client[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private petService: PetsService, private clientService: ClientsService) {
    this.pet = new Pet({});
  }

  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllOwners();
  }

  private resetEditState() {
    this.petForm.reset();
  }

  private isValid(): boolean {
    if (!this.clientId) return false;
    return this.petForm.valid || false;
  }

  getAllOwners() {
    this.clientService.getAll().subscribe((response: Client[]) => {
      this.options = response;
    });
  }

  onSubmit() {
    if (this.isValid()) {
      this.createPet();
    } else {
      console.error('Invalid form data');
    }
  }

  createPet() {
    // Validate that animalType is selected
    if (!this.pet.animalType) {
      console.error('Animal type is required');
      alert('Please select an animal type');
      return;
    }

    // Clean and validate the data before sending
    const cleanedPet = {
      petName: this.pet.petName?.trim() || '',
      birthDate: this.pet.birthDate || '',
      registrationDate: this.pet.registrationDate || '',
      animalType: this.pet.animalType.toUpperCase(), // Remove the fallback to empty string
      animalBreed: this.pet.animalBreed?.trim() || '',
      petGender: this.pet.petGender || 'MALE',
      ownerId: this.clientId
    };

    // Log the data being sent for debugging
    console.log('Sending pet data:', cleanedPet);

    this.petService.create(cleanedPet).subscribe({
      next: (response: Pet) => {
        console.log('Pet created successfully:', response);
        this.router.navigate([`/manage/owners/:ownerId/pets`]);
      },
      error: (error) => {
        console.error('Error creating pet:', error);
        // Log the full error details for debugging
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    });
  }

  onCancel() {
    this.router.navigate([`/manage/owners/:ownerId/pets`]);
  }
}
