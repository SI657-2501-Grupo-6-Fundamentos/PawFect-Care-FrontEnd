import { Component, Input, ViewChild } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../../model/client.entity';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Pet } from "../../model/pet.entity";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    TranslateModule,
  ],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.css'
})
export class ClientCreateComponent {
  @Input() client!: Client;

  @ViewChild('clientForm', { static: false }) protected clientForm!: NgForm;

  constructor(private clientService: ClientsService, private router: Router) {
    this.client = new Client({});
  }

  private resetEditState() {
    this.clientForm.reset();
  }

  private isValid(): boolean {
    return this.clientForm.valid || false;
  }

  onSubmit() {
    if (this.isValid()) {
      this.createClient();
    } else {
      console.error('Invalid form data');
    }
  }

  createClient() {
    this.clientService.create(this.client).subscribe((response: Client) => {
      this.router.navigate(['/manage/clients']);
      console.log(response)
      this.resetEditState();
    });
  }

  onCancel() {
    this.router.navigate(['/manage/clients']);
  }
}
