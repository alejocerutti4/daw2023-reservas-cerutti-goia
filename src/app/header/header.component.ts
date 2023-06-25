import { Component } from '@angular/core';
import { StateService } from '../service/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public title: string = '';
  public buttonContent: string = '';
  public openModal: Function = () => {};

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.suscribeToTitle();
    this.suscribeToButtonContent();
    this.suscribeToOpenModal();
  }

  openModalReserva() {
    this.openModal();
  }

  suscribeToTitle() {
    this.stateService.getTitle().subscribe((title: string) => {
      this.title = title;
    });
  }

  suscribeToButtonContent() {
    this.stateService.getButtonContent().subscribe((content: string) => {
      this.buttonContent = content;
    });
  }

  suscribeToOpenModal() {
    this.stateService.getOpenModal().subscribe((fn: Function) => {
      this.openModal = fn;
    });
  }

}
