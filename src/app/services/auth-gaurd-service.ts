import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

@Injectable()

export class AuthenticatedGuard implements CanActivate {
  constructor(private router: Router, public location: Location) {
    console.log("I am in CanActivate constructor....", );
  }

  canActivate(): boolean {
    let userObj = JSON.parse(sessionStorage.getItem('USER_OBJ'));
    console.log("=================", !!userObj);
    var titlee = this.location.path();
    console.log("=================", titlee);

    if (!!userObj === false) {
      this.router.navigate(['/']);
      // alert('Open dialog')
      return false;
    }else{
      return true;
    }
  }
}