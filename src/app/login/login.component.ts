import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  page: string;
  atLogin = true;
  email: string;
  password: string;
  cadEmail = '';
  cadPassword = '';
  cadPassword2 = '';
  phone = '';
  name = '';
  emailError = false;
  passwordError = false;
  cadEmailError = false;
  cadPasswordError = false;
  cadPassword2Error = false;
  nameError = false;
  phoneError = false;
  msgError = '';
  loginError: boolean;
  loading = {
    facebook: false,
    google: false,
    login: false,
    register: false
  };
  emailSend = false;

  constructor(
    private uService: UserService,
    private sService: StoreService
  ) { }

  ngOnInit() {
  }

  validate() {
    let valid = true;
    if (!this.validateEmail(this.email)) {
      this.emailError = true;
      valid = false;
    }
    if (this.password) {
      if (this.password.length < 8) {
        this.passwordError = true;
        valid = false;
      }
    } else {
      this.passwordError = true;
      valid = false;
    }
    return valid;
  }

  validateRegister() {
    let valid = true;
    if (!this.validateEmail(this.cadEmail)) {
      this.cadEmailError = true;
      valid = false;
    }
    if (this.cadPassword) {
      if (this.cadPassword.length < 8) {
        this.cadPasswordError = true;
        valid = false;
      }
    } else {
      this.cadPasswordError = true;
      valid = false;
    }
    if (this.cadPassword2 !== this.cadPassword || this.cadPassword2 === '') {
      this.cadPassword2Error = true;
      valid = false;
    }
    if (this.name === '') {
      this.nameError = true;
      valid = false;
    }
    if (this.phone === '') {
      this.phoneError = true;
      valid = false;
    }
    return valid;
  }

  validateEmail(email: string) {
    // tslint:disable-next-line: max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  signIn() {
    this.loading.login = true;
    if (this.validate()) {
      this.uService.login(this.email, this.password).then(resp => {
        this.loading.login = false;
        this.clear();
      }).catch((e: any) => {
        this.loading.login = false;
        this.msgError = this.getMessage(e.code);
        this.loginError = true;
        setTimeout(() => {
          this.clear();
        }, 5000);
      });
    } else {
      this.loading.login = false;
    }
  }

  save() {
    this.loading.register = true;
    if (this.validateRegister()) {
      this.uService.save(this.name, this.phone, this.cadEmail, this.cadPassword).then(resp => {
      this.loading.register = false;
      this.clear();
    }).catch((e: any) => {
        this.loading.register = false;
        this.msgError = this.getMessage(e.code);
        this.loginError = true;
        setTimeout(() => {
          this.clear();
        }, 5000);
      });
    } else {
      this.loading.register = false;
    }
  }

  socialLogin(method: string) {
    method === 'google' ? this.loading.google = true : this.loading.facebook = true;
    this.uService.providerLogin(method).then(resp => {
      method === 'google' ? this.loading.google = false : this.loading.facebook = false;
      this.clear();
    }).catch((e: any) => {
      method === 'google' ? this.loading.google = false : this.loading.facebook = false;
      console.log(e);
      this.msgError = this.getMessage(e.code);
      this.loginError = true;
      setTimeout(() => {
        this.clear();
      }, 5000);
    });
  }

  resetPassword() {
    if (this.validateEmail(this.email)) {
      this.clear();
      this.uService.resetPassword(this.email).then(() => {
        this.emailSend = true;
        setTimeout(() => {
          this.emailSend = false;
        }, 15000);
      }).catch(e => {
        console.log(e);
        this.msgError = this.getMessage(e.code);
        this.loginError = true;
        setTimeout(() => {
          this.clear();
        }, 5000);
      });
    } else {
      this.emailError = true;
      this.msgError = 'Informe o email para resetar sua senha';
      this.loginError = true;
      setTimeout(() => {
        this.clear();
      }, 5000);
    }
  }

  getMessage(code: string) {
    switch (code) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado 😕';
      case 'auth/wrong-password':
        return 'Senha incorreta 😕';
      case 'auth/email-already-in-use':
        return 'Esse email já está sendo usado 😕';
      case 'auth/invalid-email':
        return 'Email inválido 😕';
      case 'auth/weak-password':
        return 'Senha muito fraca 😕';
      case 'auth/popup-closed-by-user':
        return 'O processo de entrada foi cancelado pelo usuário 😕';
      default:
        return 'Não foi possível realizar a ação 😕';
    }
  }

  focus(field: string) {
    document.getElementById(field).focus();
  }

  clear() {
    this.emailError = false;
    this.passwordError = false;
    this.cadEmailError = false;
    this.cadPasswordError = false;
    this.cadPassword2Error = false;
    this.nameError = false;
    this.phoneError = false;
    this.loginError = false;
    this.msgError = '';
  }
}
