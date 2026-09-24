import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LoggerService } from './logger.service';

// Define specific event types for better type safety
export type EventType =
  | 'shell-to-mfe1'
  | 'shell-to-mfe2'
  | 'shell-broadcast'
  | 'mfe1-to-mfe2'
  | 'mfe1-to-shell'
  | 'mfe2-to-mfe1'
  | 'mfe2-to-shell';

export type EventSource = 'shell' | 'mfe1' | 'mfe2';

export interface EventData {
  message: string;
  timestamp: string;
  [key: string]: any;
}

export interface EventBusMessage {
  type: EventType;
  data: EventData;
  source: EventSource;
}

// Global event bus interface for window object
export interface GlobalEventBus {
  emit: (type: EventType, data: EventData, source: EventSource) => void;
  subscribe: (callback: (event: EventBusMessage) => void) => { unsubscribe: () => void };
}

// Extend Window interface
declare global {
  interface Window {
    __MFE_EVENT_BUS__?: GlobalEventBus;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<EventBusMessage>();

  constructor(private logger: LoggerService) {
    // Use a namespaced property to avoid global pollution
    if (!window.__MFE_EVENT_BUS__) {
      window.__MFE_EVENT_BUS__ = {
        emit: (type: EventType, data: EventData, source: EventSource) => {
          this.emit(type, data, source);
        },
        subscribe: (callback: (event: EventBusMessage) => void) => {
          return this.events$.subscribe(callback);
        }
      };
      this.logger.info('[EventBus] Global event bus initialized');
    }
  }

  get events$(): Observable<EventBusMessage> {
    return this.eventSubject.asObservable();
  }

  emit(type: EventType, data: EventData, source: EventSource): void {
    try {
      // Validate data is serializable
      JSON.stringify(data);
      
      this.logger.debug(`[EventBus] Emitting event: ${type} from ${source}`, data);
      this.eventSubject.next({ type, data, source });
    } catch (error) {
      this.logger.error(`[EventBus] Failed to emit event: ${type}`, error);
      throw new Error(`Event data must be serializable: ${error}`);
    }
  }
}
