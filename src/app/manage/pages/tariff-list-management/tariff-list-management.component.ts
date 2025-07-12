import { Component, OnInit } from '@angular/core';
import { Tariff } from '../../model/tariff.entity';
import { TariffService } from '../../services/tariff.service';
import {NgForOf, NgIf} from "@angular/common";
import {TariffCreateComponent} from "../../components/tariff-create/tariff-create.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-tariff-management',
  templateUrl: './tariff-list-management.component.html',
  standalone: true,
  imports: [
    NgForOf,
    TariffCreateComponent,
    NgIf
  ],
  styleUrls: ['./tariff-list-management.component.css']
})
export class TariffListManagementComponent implements OnInit {
  tariffs: Tariff[] = [];

  constructor(private tariffService: TariffService, private router: Router) {}

  ngOnInit(): void {
    this.loadTariffs();
  }

  loadTariffs(): void {
    this.tariffService.getAll().subscribe({
      next: (data) => this.tariffs = data,
      error: (err) => console.error('Error loading tariffs', err)
    });
  }

  onCreateAppointment(tariff: Tariff): void {
    console.log('Crear cita para', tariff.serviceName);
    this.router.navigate(['/manage/appointments/add']);

  }

  getFormattedServiceName(name: string): string {
    return name.replace(/_/g, ' ');
  }
}
