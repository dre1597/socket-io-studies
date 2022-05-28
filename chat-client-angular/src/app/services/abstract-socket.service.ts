import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractSocketService {
  abstract url: string;
  abstract socketConfig: SocketIoConfig;
  abstract socket: Socket;
}
