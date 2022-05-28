import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { AbstractSocketService } from './abstract-socket.service';
import { ObservableEvents, ObservableService } from './observable.service';

interface IMessage {
  name: string;
  content: string;
}

interface ITyping {
  isTyping: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService extends AbstractSocketService {
  url: string;
  socketConfig: SocketIoConfig = {
    url: environment.baseUrl,
    options: {},
  };
  socket: Socket;

  constructor(private observableService: ObservableService) {
    super();
    this.socket = new Socket(this.socketConfig);
  }

  init(): void {
    this.socket.connect();

    this._messageEvent();
    this._typingEvent();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  emitFindAllMessages(callback: (message: IMessage[]) => void): void {
    this.socket.emit('findAllMessages', {}, callback);
  }

  emitSendMessage(content: string, callback: () => void): void {
    this.socket.emit('createMessage', { content }, callback);
  }

  emitJoin(name: string, callback: () => void): void {
    this.socket.emit('join', { name }, callback);
  }

  emitTyping(isTyping: boolean): void {
    this.socket.emit('typing', { isTyping });
  }

  private _messageEvent(): void {
    this.socket.on('message', (message: IMessage) => {
      this.observableService.changeMessage(ObservableEvents.message, message);
    });
  }

  private _typingEvent(): void {
    this.socket.on('typing', (typing: ITyping) => {
      this.observableService.changeMessage(ObservableEvents.typing, typing);
    });
  }
}
