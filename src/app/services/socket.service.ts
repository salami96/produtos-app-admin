import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  listen: any;

  constructor() {
    this.listen = io(environment.host);
    this.listen.on('connect', () => {
      console.log(this.listen.id);
    });
  }
}
