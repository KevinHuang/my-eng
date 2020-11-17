import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  currentUrl = '';

  @Input() hasSignIn = false ;

  @Output() menuSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.router.events.subscribe( evt => {
      // console.log(evt);
      if (evt instanceof NavigationEnd) {
        // console.log(evt.url);
        this.currentUrl = evt.url ;
        // console.log(this.currentUrl);
      }
    });
  }

  showMenu(menuPath: string): void {
    // console.log(menuPath);
    this.menuSelected.emit(menuPath);
    this.router.navigate([menuPath]);
  }

}
