import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { User } from '../User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  errors: any[] = [];
  user!: User;

  constructor(
    // private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    // private spinner: NgxSpinnerService,
    public fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['']);
    }
    this.validation();
  }

  validation() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    // this.spinner.show();

    if (this.loginForm.dirty && this.loginForm.valid) {
      this.user = Object.assign({}, this.user, this.loginForm.value);

      this.authService.login(this.user).subscribe(
        (success) => {
          this.processarSucesso(success);
        },
        (error) => {
          this.processarFalha(error);
        }
      );
    }
  }

  processarSucesso(response: any) {
    // this.spinner.hide();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) this.router.navigate([returnUrl]);
    else this.router.navigate(['']);

    // this.toastr.success('Você está Online!', 'ACESSO PERMITIDO', {
    //   closeButton: true,
    //   progressBar: true,
    //   timeOut: 2000,
    // });

    this.errors = [];

    this.authService.LocalStorage.salvarDadosLocaisUsuarioSession(response);
    // this.authService.LocalStorage.salvarDadosLocaisUsuario(response);
  }

  processarFalha(fail: any) {
    // this.spinner.hide();
    this.errors = fail.error.errors;

    // this.toastr.error(this.errors[0]);
  }
}
