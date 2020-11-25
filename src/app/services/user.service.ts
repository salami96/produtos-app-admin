import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { auth } from 'firebase';
import { User } from './entities';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: Observer<User>;
  logged = false;
  options = {
    headers: {
      'authorization': 't5b3b9a5',
      'Access-Control-Allow-Origin': '*'
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router
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

  getUser = new Observable<User>((observer) => {
    observer.next();
    this.user = observer;
  });

  setUser(user: User) {
    this.logged = user !== undefined;
    this.user.next(user);
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
    this.user.next(undefined);
    this.router.navigate(['/entrar']);
    return auth().signOut();
  }

  private getUserApi(uid: string) {
    this.http.get<User>(
      `/api/user/${uid}`, this.options
      ).subscribe(user => {
      this.logged = true;
      this.user.next(user);
      this.router.navigate(['/escolher-loja']);
    });
  }

  private saveUserApi(user: User) {
    this.http.post<User>(
      `/api/user`, user, this.options
    ).subscribe(resp => {
      this.logged = true;
      this.user.next(user);
      this.router.navigate(['/escolher-loja']);
    });
  }
}
