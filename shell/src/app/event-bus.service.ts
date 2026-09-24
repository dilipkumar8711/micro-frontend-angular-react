import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface EventBusMessage {
  type: string;
  data: any;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<EventBusMessage>();

  // Expose the event bus globally for cross-framework communication
  constructor() {
    (window as any).eventBus = {
      emit: (type: string, data: any, source: string) => {
        this.emit(type, data, source);
      },
      subscribe: (callback: (event: EventBusMessage) => void) => {
        return this.events$.subscribe(callback);
      }
    };
  }

  get events$(): Observable<EventBusMessage> {
    return this.eventSubject.asObservable();
  }

  emit(type: string, data: any, source: string): void {
    console.log(`[EventBus] Emitting event: ${type} from ${source}`, data);
    this.eventSubject.next({ type, data, source });
  }
}

// Made with Bob
