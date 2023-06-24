import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  sidebarCollapsed: boolean = true;
  sidebarWidth: number = 80; // Initial collapsed width

  expandSidebar() {
    this.sidebarCollapsed = false;
    this.sidebarWidth = 280;
  }

  collapseSidebar() {
    this.sidebarCollapsed = true;
    this.sidebarWidth = 80;
  }

}
