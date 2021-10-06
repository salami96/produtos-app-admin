import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { auth } from 'firebase';
import { User } from './entities';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { StoreService } from './store.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _user: User;
  userSubject = new Subject<User>();
  getUser = this.userSubject.asObservable();
  logged = false;
  returnUrl: string;
  options = {
    headers: {
      'authorization': environment.secret,
      'Access-Control-Allow-Origin': '*'
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbar: SnackbarService,
    private sService: StoreService
  ) {
    this.verifyLocalStorage();
    auth().onAuthStateChanged(user => {
      if (user) {
        localStorage['token'] = user.uid;
        this.logged = true;
      } else {
        localStorage.removeItem('token');
        this.logged = false;
      }
    });
  }

  public verifyLocalStorage() {
    if (localStorage['token']) {
      return this.getUserApi(localStorage['token']);
    }
  }

  setUser(user: User) {
    this.logged = user !== undefined;
    this.userSubject.next(user);
    this._user = user;
  }

  login(email: string, password: string): Promise<any> {
    return auth().signInWithEmailAndPassword(email, password).then(user => {
      this.getUserApi(user.user.uid);
    });
  }

  public providerLogin(provider: string) {
    auth().languageCode = 'pt';

    const google = new auth.GoogleAuthProvider()
    .setCustomParameters({
      'prompt': 'select_account'
    });
    const facebook = new auth.FacebookAuthProvider();
    let method: auth.AuthProvider;

    method = provider === 'google' ? google : facebook;

    return auth().signInWithPopup(method).then(resp => {
      if (resp.additionalUserInfo.isNewUser) {
        const user: User = {
          name: resp.user.displayName,
          avatar: resp.user.photoURL,
          email: resp.user.email,
          uid: resp.user.uid,
          phone: resp.user.phoneNumber,
          address: []
        };
        this.saveUserApi(user);
      } else {
        this.getUserApi(resp.user.uid);
      }
    });
  }

  public save(name: string, phone: string, email: string, password: string) {
    return auth().createUserWithEmailAndPassword(email, password).then(resp => {
      const user: User = {
        name,
        avatar: '',
        email,
        uid: resp.user.uid,
        phone,
        address: []
      };
      this.saveUserApi(user);
    });
  }

  public resetPassword(email: string) {
    return auth().sendPasswordResetEmail(email);
  }

  public logout() {
    this._user = undefined;
    this.userSubject.next(undefined);
    localStorage.removeItem('token');
    this.router.navigate(['/entrar']);
    return auth().signOut();
  }

  private getUserApi(uid: string) {
    this.http.get<User>(
      `${environment.host}/api/user/${uid}`, this.options
    ).subscribe(user => {
      this.logged = true;
      this._user = user;
      this.userSubject.next(user);
      this.navigate()
    }, () => this.snackbar.show('Erro ao conectar ao servidor, tente novamente mais tarde!', 'error') );
  }

  private saveUserApi(user: User) {
    this.http.post<User>(
      `${environment.host}/api/user`, user, this.options
    ).subscribe(resp => {
      this.logged = true;
      this._user = user;
      this.userSubject.next(user);
      this.navigate()
    }, () => this.snackbar.show('Erro ao conectar ao servidor, tente novamente mais tarde!', 'error') );
  }

  private navigate() {
    const selected = this.sService.getSelectedStore();
    if (this.returnUrl && selected) {
      this.sService.refreshStore(selected.code)
      this.router.navigate([ this.returnUrl ]);
    } else {
      this.router.navigate([ '/escolher-loja' ]);
    }
  }
}
