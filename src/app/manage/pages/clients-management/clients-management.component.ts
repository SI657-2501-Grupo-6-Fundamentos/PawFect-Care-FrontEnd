import { Component, inject, ViewChild } from '@angular/core';
import { Client } from '../../model/client.entity';
import { ClientsService } from '../../services/clients.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {  MatFormFieldModule } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-clients-management',
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
    MatButtonModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './clients-management.component.html',
  styleUrl: './clients-management.component.css'
})
export class ClientsManagementComponent {

  protected clientData!: Client;
  protected columnsToDisplay: string[] = [
    "id",
    "fullName",
    "phoneNumber",
    "email",
    "address"
  ];


  @ViewChild(MatSort, {static: false})
  protected sort!: MatSort;
  protected   searchQuery: string = '';
  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  protected dataSource!: MatTableDataSource<Client>;

  private clientService: ClientsService = inject(ClientsService);

  constructor(private router: Router) {
    this.clientData = new Client({});
    this.dataSource = new MatTableDataSource();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllClient();
  }

  getAllClient(){
    this.clientService.getAll().subscribe((response: Array<Client>) => {
      this.dataSource.data = response;
    });
  }
  applyFilter() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }


  navigateToAddClient() {
    this.router.navigate(['/manage/clients/add']);
  }

  navigateToEditClient(idClient: number) {
    this.router.navigate([`/manage/clients/edit/${idClient}`]);
  }


}
