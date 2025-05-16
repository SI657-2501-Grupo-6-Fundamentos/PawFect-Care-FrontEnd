import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { Client } from '../../model/client.entity';
import { ClientsService } from '../../services/clients.service';
import { PetsClientComponent } from "../client-pets/pets-client.component";
import {TranslateModule} from "@ngx-translate/core";
@Component({
  selector: 'app-client-edit',
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
    PetsClientComponent,
    TranslateModule
  ],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.css'
})
export class ClientEditComponent implements OnInit {
  @Input() client!: Client;

  @ViewChild('clientForm', { static: false }) protected clientForm!: NgForm;

  options: Client[] = [];
  clientId!: number;

  constructor(private route: ActivatedRoute,private router: Router,private clientService: ClientsService) {
    this.client = new Client({});
  }

  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllOwners();
    this.getClientById();
  }

  private resetEditState() {
    this.getClientById();
  }

  private isValid(): boolean {
    if(this.clientForm.value.ownerId==0)return false;
    return this.clientForm.valid || false;
  }

  getAllOwners(){
    this.clientService.getAll().subscribe((response: Client[]) => {
      this.options=response;
    });
  }

  getClientById(){
    this.clientService.getById(this.clientId).subscribe((response: Client) => {
      this.client = response;
    });
  }


  onSubmit() {
    if (this.isValid()) {
      this.editClient();
      this.resetEditState();
    } else {
      console.error('Invalid form data');
    }
  }

  editClient() {
    this.clientService.update(this.client.id,this.client).subscribe((response: Client) => {
      console.log(response,this.client)
      this.router.navigate(['/manage/clients']);
      this.resetEditState();
    });
  }

  onCancel() {
    this.router.navigate(['/manage/clients']);
  }
}
