import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Pet } from '../../model/pet.entity';
import { PetsService } from '../../services/pets.service';
import { TranslateModule } from "@ngx-translate/core";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pets-management',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './pets-management.component.html',
  styleUrl: './pets-management.component.css'
})
export class PetsManagementComponent implements OnInit {
  protected petData!: Pet;
  protected dataSource: { data: Pet[] } = { data: [] };
  protected searchQuery: string = '';
  protected filteredPets: Pet[] = [];
  protected currentOwnerId: number = 0;

  @ViewChild(MatPaginator, { static: false })
  protected paginator!: MatPaginator;

  private petService: PetsService = inject(PetsService);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.petData = new Pet({});
  }

  ngOnInit(): void {
    const ownerIdParam = this.route.snapshot.paramMap.get('ownerId');
    const ownerId = +ownerIdParam!;
    console.log('Param ownerId:', ownerId);

    this.currentOwnerId = ownerId;

    if (ownerId) {
      this.getPetsByOwner(ownerId);
    } else {
      console.error('No se encontró ownerId en la ruta');
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      // Configurar paginación si es necesario
    }
  }

  getAllPets() {
    this.petService.getAll().subscribe((response: Array<Pet>) => {
      this.dataSource.data = response;
      this.filteredPets = response;
    });
  }

  getPetsByOwner(ownerId: number): void {
    this.petService.getPetsByOwnerId(ownerId).subscribe({
      next: (response: Pet[]) => {
        this.dataSource.data = response;
        this.filteredPets = response;
      },
      error: (err) => {
        console.error('Error al obtener mascotas por ownerId:', err);
      }
    });
  }

  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.filteredPets = this.dataSource.data.filter(pet =>
      pet.petName.toLowerCase().includes(filterValue) ||
      pet.animalBreed.toLowerCase().includes(filterValue) ||
      pet.animalType.toLowerCase().includes(filterValue)
    );
  }

  navigateToAddPet(idOwner: number) {
    console.log('ID del dueño recibido:', idOwner);
    this.router.navigate(['/manage/pets/add', idOwner]);
  }

  navigateToEditPet(idPet: number) {
    this.router.navigate([`/manage/pets/edit/${idPet}`]);
  }

  navigateToMedicalHistory(medicalHistoryId: number) {
    this.router.navigate([`/manage/medicalHistory/${medicalHistoryId}`]);
  }

  getCurrentOwnerId(): number {
    return this.currentOwnerId;
  }

  calculateAge(birthDate: string): string {
    if (!birthDate) return 'Unknown age';

    const birth = new Date(birthDate);
    const today = new Date();
    const diffInMs = today.getTime() - birth.getTime();
    const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
    const diffInMonths = Math.floor((diffInMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} old`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} old`;
    } else {
      return 'Less than a month old';
    }
  }

  getPetIcon(animalType: string): string {
    const type = animalType.toLowerCase();
    switch (type) {
      case 'dog':
      case 'perro':
        return 'pets';
      case 'cat':
      case 'gato':
        return 'pets';
      case 'bird':
      case 'ave':
      case 'pájaro':
        return 'flutter_dash';
      case 'fish':
      case 'pez':
        return 'set_meal';
      case 'rabbit':
      case 'conejo':
        return 'cruelty_free';
      case 'hamster':
        return 'pets';
      default:
        return 'pets';
    }
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/default-pet.jpg';
  }
}
