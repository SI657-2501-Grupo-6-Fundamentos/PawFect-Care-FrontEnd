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
import {MatRadioModule} from '@angular/material/radio';
import {TranslateModule} from "@ngx-translate/core";
@Component({
  selector: 'app-pet-edit',
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
  templateUrl: './pet-edit.component.html',
  styleUrl: './pet-edit.component.css'
})
export class PetEditComponent implements OnInit {
  @Input() pet!: Pet;

  @ViewChild('petForm', { static: false }) protected petForm!: NgForm;

  options: Client[] = [];
  petId!: number;

  constructor(private route: ActivatedRoute,private petService: PetsService, private clientService: ClientsService,private router: Router) {
    this.pet = new Pet({});
  }

  ngOnInit() {
    this.petId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllOwners();
    this.getPetById();
  }

  private resetEditState() {
    this.getPetById();
  }

  private isValid(): boolean {
    if(this.petForm.value.ownerId==0)return false;
    return this.petForm.valid || false;
  }

  getAllOwners(){
    this.clientService.getAll().subscribe((response: Client[]) => {
      this.options=response;
    });
  }

  getPetById(){
    this.petService.getById(this.petId).subscribe((response: Pet) => {

      this.pet = response;
    });
  }


  onSubmit() {
    if (this.isValid()) {
      this.editPet();
      this.resetEditState();
    } else {
      console.error('Invalid form data');
    }
  }

  editPet() {
    this.petService.update(this.pet.id,this.pet).subscribe((response: Pet) => {
      console.log(response)
      this.router.navigate([`/manage/owners/${this.pet.ownerId}/pets`]);
      this.resetEditState();
    });
  }

  onCancel() {
    this.router.navigate([`/manage/owners/${this.pet.ownerId}/pets`]);
  }
}
