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

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.stateService.title$.subscribe(title => {
      this.title = title;
    });

    this.stateService.buttonContent$.subscribe(content => {
      this.buttonContent = content;
    });
  }

  openModalReserva() {
    this.stateService.setShouldOpenModalReserva(true);
  }

}
