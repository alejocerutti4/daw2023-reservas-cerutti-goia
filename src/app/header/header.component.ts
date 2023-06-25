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
    this.suscribeToState();
  }

  openModalReserva() {
    this.openModal();
  }

  suscribeToState() {
    this.stateService.getHeaderStateSubject().subscribe((state: any) => {
      this.title = state.title;
      this.buttonContent = state.buttonContent;
      this.openModal = state.openModal;
    }
  );
}


}
