import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Pet } from '../../model/pet.entity';
import { PetsService } from '../../services/pets.service';
import { TranslateModule } from "@ngx-translate/core";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pets-client',
  standalone: true,
  imports: [
    CommonModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    FormsModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './pets-client.component.html',
  styleUrl: './pets-client.component.css'
})
export class PetsClientComponent implements OnInit {
  protected petData!: Pet;
  protected columnsToDisplay: string[] = [
    "id",
    "petName",
    "birthDate",
    "registrationDate",
    "animalType",
    "animalBreed",
    "petGender",
    "actions"
  ];

  @ViewChild(MatSort, { static: false })
  protected sort!: MatSort;

  @ViewChild(MatPaginator, { static: false })
  protected paginator!: MatPaginator;

  protected dataSource!: MatTableDataSource<Pet>;

  clientId!: number;

  private petService: PetsService = inject(PetsService);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.petData = new Pet({});
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllPetsByOwnerId();
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getAllPetsByOwnerId() {
    this.petService.getPetsByOwnerId(this.clientId).subscribe((response: Array<Pet>) => {
      this.dataSource.data = response;
    });
  }
  AddPetToClient() {
    this.router.navigate([`/manage/clients/${this.clientId}/add_pet`]);
  }

  navigateToHcPet(medicalHistoryId: string) {
    this.router.navigate([`/manage/medicalHistory/${medicalHistoryId}`]);
  }


}
