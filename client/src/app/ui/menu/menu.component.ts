import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  currentUrl = '';

  @Input() hasSignIn = false ;

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
        console.log(this.currentUrl);
      }
    });
  }

}
