import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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

// Global event bus interface
interface GlobalEventBus {
  emit: (type: EventType, data: EventData, source: EventSource) => void;
  subscribe: (callback: (event: EventBusMessage) => void) => { unsubscribe: () => void };
}

declare global {
  interface Window {
    __MFE_EVENT_BUS__?: GlobalEventBus;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventBusWrapperService implements OnDestroy {
  private eventSubject = new Subject<EventBusMessage>();
  private globalSubscription?: { unsubscribe: () => void };

  constructor() {
    this.initializeEventBus();
  }

  private initializeEventBus(): void {
    const eventBus = window.__MFE_EVENT_BUS__;
    
    if (eventBus) {
      this.globalSubscription = eventBus.subscribe((event: EventBusMessage) => {
        this.eventSubject.next(event);
      });
      console.info('[MFE1 EventBus] Connected to global event bus');
    } else {
      console.warn('[MFE1 EventBus] Global event bus not available');
    }
  }

  get events$(): Observable<EventBusMessage> {
    return this.eventSubject.asObservable();
  }

  emit(type: EventType, data: EventData, source: EventSource = 'mfe1'): void {
    const eventBus = window.__MFE_EVENT_BUS__;
    
    if (!eventBus) {
      console.error('[MFE1 EventBus] Cannot emit event - event bus not available');
      throw new Error('Event bus not available');
    }

    try {
      // Validate data is serializable
      JSON.stringify(data);
      eventBus.emit(type, data, source);
    } catch (error) {
      console.error('[MFE1 EventBus] Failed to emit event:', error);
      throw new Error(`Event data must be serializable: ${error}`);
    }
  }

  ngOnDestroy(): void {
    this.globalSubscription?.unsubscribe();
    this.eventSubject.complete();
  }
}

// Made with Bob
