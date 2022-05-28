import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ObservableEvents {
  message = 'message',
  typing = 'typing',
}

@Injectable({
  providedIn: 'root',
})
export class ObservableService {
  messageSource: BehaviorSubject<any> = new BehaviorSubject('init');
  currentMessage: Observable<any> = this.messageSource.asObservable();

  changeMessage(event: ObservableEvents, payload: any) {
    this.messageSource.next({ event: event, payload: payload });
  }
}
