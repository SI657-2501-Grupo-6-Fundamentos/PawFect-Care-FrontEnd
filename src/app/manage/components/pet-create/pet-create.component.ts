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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './pet-create.component.html',
  styleUrl: './pet-create.component.css'
})
export class PetCreateComponent implements OnInit {
  @Input() pet!: Pet;

  @ViewChild('petForm', { static: false }) protected petForm!: NgForm;
  @ViewChild('fileInput', { static: false }) fileInput!: any;

  clientId!: number;
  options: Client[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploadingImage: boolean = false;
  uploadError: string = '';

  // Cloudinary configuration - these should be in your environment variables
  private readonly CLOUDINARY_CLOUD_NAME = 'dgcgdxn0u'; // Replace with your Cloudinary cloud name
  private readonly CLOUDINARY_UPLOAD_PRESET = 'vacapp_unsigned'; // Replace with your upload preset
  private readonly CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`;

  // Alternative upload preset for testing
  private readonly CLOUDINARY_UPLOAD_PRESET_BASIC = 'ml_default'; // Default unsigned preset

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetsService,
    private clientService: ClientsService,
    private http: HttpClient
  ) {
    this.pet = new Pet({});
  }

  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllOwners();
  }

  private resetEditState() {
    this.petForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadError = '';
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.uploadError = 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
        return;
      }

      // Validate file size (max 10MB for Cloudinary)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        this.uploadError = 'File size must be less than 10MB';
        return;
      }

      this.selectedFile = file;
      this.uploadError = '';

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.pet.imageUrl = '';
    this.uploadError = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // SOLUTION 1: Use native fetch API with proper error handling
  private async uploadImageToCloudinary(): Promise<string> {
    if (!this.selectedFile) {
      return '';
    }

    this.isUploadingImage = true;
    this.uploadError = '';

    try {
      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);

      // Don't add transformation here - let the upload preset handle it
      // Or use individual transformation parameters
      // formData.append('transformation', 'c_fill,w_800,h_600,q_auto,f_auto');

      console.log('Uploading to Cloudinary with preset:', this.CLOUDINARY_UPLOAD_PRESET);
      console.log('File size:', this.selectedFile.size);
      console.log('File type:', this.selectedFile.type);

      // Use native fetch instead of Angular HttpClient
      const response = await fetch(this.CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        // Get detailed error information
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);

        let errorMessage = 'Upload failed';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      this.uploadError = 'Failed to upload image. Please try again.';
      throw error;
    } finally {
      this.isUploadingImage = false;
    }
  }

  // Alternative simpler upload method for testing
  private async uploadImageToCloudinarySimple(): Promise<string> {
    if (!this.selectedFile) {
      return '';
    }

    this.isUploadingImage = true;
    this.uploadError = '';

    try {
      // Create form data with minimal parameters
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Try with the default ml_default preset first
      formData.append('upload_preset', 'ml_default');

      // Optional: Add folder to organize uploads
      formData.append('folder', 'pets');

      console.log('Uploading to Cloudinary with minimal config...');

      const response = await fetch(this.CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      this.uploadError = 'Failed to upload image. Please try again.';
      throw error;
    } finally {
      this.isUploadingImage = false;
    }
  }
  private async uploadImageToCloudinaryXHR(): Promise<string> {
    if (!this.selectedFile) {
      return '';
    }

    this.isUploadingImage = true;
    this.uploadError = '';

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('file', this.selectedFile!);
      formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
      formData.append('transformation', 'c_fill,w_800,h_600,q_auto,f_auto');

      xhr.onload = () => {
        this.isUploadingImage = false;
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          this.uploadError = 'Failed to upload image. Please try again.';
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        this.isUploadingImage = false;
        this.uploadError = 'Failed to upload image. Please try again.';
        reject(new Error('Network error during upload'));
      };

      xhr.open('POST', this.CLOUDINARY_URL);
      xhr.send(formData);
    });
  }

  async onSubmit() {
    if (this.isValid()) {
      await this.createPet();
    } else {
      console.error('Invalid form data');
    }
  }

  async createPet() {
    // Validate that animalType is selected
    if (!this.pet.animalType) {
      console.error('Animal type is required');
      this.uploadError = 'Please select an animal type';
      return;
    }

    try {
      // Upload image to Cloudinary if selected
      let imageUrl = '';
      if (this.selectedFile) {
        // Try the simple upload first, fallback to regular upload
        try {
          imageUrl = await this.uploadImageToCloudinarySimple();
        } catch (error) {
          console.log('Simple upload failed, trying regular upload...');
          imageUrl = await this.uploadImageToCloudinary();
        }
      }

      // Clean and validate the data before sending
      const cleanedPet = {
        petName: this.pet.petName?.trim() || '',
        birthDate: this.pet.birthDate || '',
        registrationDate: this.pet.registrationDate || '',
        animalType: this.pet.animalType.toUpperCase(),
        animalBreed: this.pet.animalBreed?.trim() || '',
        petGender: this.pet.petGender || 'MALE',
        ownerId: this.clientId,
        imageUrl: imageUrl || this.pet.imageUrl || '' // This will be the Cloudinary URL string
      };

      // Log the data being sent for debugging
      console.log('Sending pet data:', cleanedPet);

      this.petService.create(cleanedPet).subscribe({
        next: (response: Pet) => {
          console.log('Pet created successfully:', response);
          this.router.navigate([`/manage/owners/${this.clientId}/pets`]);
        },
        error: (error) => {
          console.error('Error creating pet:', error);
          this.uploadError = 'Error creating pet. Please try again.';
          if (error.error) {
            console.error('Error details:', error.error);
          }
        }
      });
    } catch (error) {
      console.error('Error in createPet:', error);
      this.uploadError = 'Error uploading image. Please try again.';
    }
  }

  onCancel() {
    this.router.navigate([`/manage/owners/${this.clientId}/pets`]);
  }
}
