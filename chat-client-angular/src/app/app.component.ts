import { Component, OnInit } from '@angular/core';
import {
  ObservableEvents,
  ObservableService,
} from './services/observable.service';
import { SocketService } from './services/socket.service';

interface IMessage {
  id: string;
  name: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  joined: boolean = false;
  messages: IMessage[] = [];
  messageToSend: string = '';
  userName: string = '';
  typingDisplay = '';

  constructor(
    private socketService: SocketService,
    private observableService: ObservableService
  ) {}

  ngOnInit(): void {
    this.socketService.init();

    this.socketService.emitFindAllMessages((allMessages: IMessage[]) => {
      this.messages = allMessages;
    });

    this._messageListener();
    this._typingListener();
  }

  join(): void {
    if (this.userName !== '') {
      this.socketService.emitJoin(this.userName, () => {
        this.joined = true;
      });
    }
  }

  sendMessage(): void {
    if (this.messageToSend !== '') {
      this.socketService.emitSendMessage(this.messageToSend, () => {
        this.messageToSend = '';
      });
    }
  }

  inputTyping(): void {
    this.socketService.emitTyping(true);
    setTimeout(() => {
      this.socketService.emitTyping(false);
    }, 2000);
  }

  private _messageListener(): void {
    this.observableService.currentMessage.subscribe((message) => {
      if (message.event === ObservableEvents.message) {
        this.messages.push(message.payload);
      }
    });
  }

  private _typingListener(): void {
    this.observableService.currentMessage.subscribe((message) => {
      if (message.event === ObservableEvents.typing) {
        if (message.payload.isTyping) {
          this.typingDisplay = `${message.payload.name} is typing...`;
        } else {
          this.typingDisplay = '';
        }
      }
    });
  }
}
