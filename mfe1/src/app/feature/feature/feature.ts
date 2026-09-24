import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusWrapperService, EventData, EventBusMessage } from '../../event-bus-wrapper.service';

@Component({
  selector: 'app-feature',
  imports: [],
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
})
export class Feature implements OnInit, OnDestroy {
  // Use a regular property instead of signal to avoid function calls in template
  protected receivedData: string = 'No data received yet';
  private subscription?: Subscription;

  constructor(private eventBus: EventBusWrapperService) {}

  ngOnInit(): void {
    try {
      // Subscribe to events using the wrapper service
      this.subscription = this.eventBus.events$.subscribe({
        next: (event: EventBusMessage) => {
          // Listen for events targeted to MFE1 or broadcasts
          if (
            event.type === 'shell-to-mfe1' || 
            event.type === 'shell-broadcast' || 
            event.type === 'mfe2-to-mfe1'
          ) {
            try {
              this.receivedData = `From ${event.source}: ${JSON.stringify(event.data)}`;
            } catch (error) {
              console.error('[MFE1] Error processing received event:', error);
              this.receivedData = `Error processing data from ${event.source}`;
            }
          }
        },
        error: (error: any) => {
          console.error('[MFE1] Event subscription error:', error);
        }
      });
    } catch (error) {
      console.error('[MFE1] Failed to initialize event bus:', error);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  sendToMFE2(): void {
    try {
      const data: EventData = { 
        message: 'Hello from MFE1!', 
        timestamp: new Date().toISOString() 
      };
      this.eventBus.emit('mfe1-to-mfe2', data, 'mfe1');
    } catch (error) {
      console.error('[MFE1] Failed to send message to MFE2:', error);
      this.receivedData = 'Error: Failed to send message to MFE2';
    }
  }

  sendToShell(): void {
    try {
      const data: EventData = { 
        message: 'Response from MFE1!', 
        timestamp: new Date().toISOString() 
      };
      this.eventBus.emit('mfe1-to-shell', data, 'mfe1');
    } catch (error) {
      console.error('[MFE1] Failed to send message to Shell:', error);
      this.receivedData = 'Error: Failed to send message to Shell';
    }
  }
}

// Made with Bob
