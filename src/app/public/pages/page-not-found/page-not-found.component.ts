import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    MatButton, TranslateModule, MatCard
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent implements OnInit {
  protected invalidUrl: string;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {
    this.invalidUrl = '';
  }

  ngOnInit(): void {
    this.invalidUrl = this.route.snapshot.url.map(element => element.path).join('/');
  }

  protected onNavigateHome() {
    this.router.navigate(['']).then();
  }
}
