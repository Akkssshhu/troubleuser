import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ScreenJsonService } from '../services/screen-json.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../services/utils.service';
declare let $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ScreenJsonService, UtilsService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string = "";
  busy: boolean;
  date: string
  constructor(private router: Router,
    private fb: FormBuilder,
    public utilsService: UtilsService,
    private dialog: MatDialog,
    public screenJsonService: ScreenJsonService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
      /* username: ['arati', Validators.required],
      password: ['Arati@123', Validators.required] */
    })

    this.date = new Date().getFullYear().toString()

  }

  logIn() {
    if (this.loginForm.valid) {
      this.busy = true;
      this.utilsService.openLoaderDialog();
      let param = '/authenticateUser'
      this.screenJsonService.loginMethod(param, this.loginForm.getRawValue()).subscribe((result: any) => {
        console.warn('Login Success=', result);
        let user_obj = {
          email: result.email,
          firstName: result.data.firstName,
          id_token: result.data.id_token,
          lastName: result.data.lastName,
          login: result.data.login,
          mobileNumber: result.data.mobileNumber,
          userId: result.data.userId
        }
        sessionStorage.setItem("USER_OBJ", JSON.stringify(user_obj))
        this.router.navigate(['category', 0])
        this.busy = false;
        this.utilsService.dialogRef.close()
      }, error => {
        console.log("error ", error)
        this.busy = false;
        if (error.status === 401) {
          this.message = "User name or password is wrong, Please enter correct details."
        }
        setTimeout(() => {
          this.message = ""
        }, 2500)

        this.utilsService.dialogRef.close();
      });
    } else {
      $('input.ng-invalid').first().focus();
    }
  }

  forgotPassword() {
    let data = {
      title: "Forgot Password"
    }
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '500px',
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

    })
  }
}
