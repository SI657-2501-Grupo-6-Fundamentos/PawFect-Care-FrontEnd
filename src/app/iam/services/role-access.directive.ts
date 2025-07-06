import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import {AuthenticationService} from "./authentication.service";

@Directive({
  selector: '[appRoleAccess]',
  standalone: true
})
export class RoleAccessDirective implements OnInit {
  @Input() appRoleAccess: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authService.currentUserRole.subscribe(userRole => {
      if (userRole && this.appRoleAccess.includes(userRole)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
