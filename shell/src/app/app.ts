import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventBusService, EventData } from './event-bus.service';
import { LoggerService } from './logger.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = 'shell';
  // Use a regular property instead of signal to avoid function calls in template
  protected receivedData: string = 'No data received yet';
  private subscription?: Subscription;

  constructor(
    private eventBus: EventBusService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // Subscribe to events from microfrontends
    this.subscription = this.eventBus.events$.subscribe({
      next: (event) => {
        this.logger.info('[Shell] Received event:', event);
        try {
          this.receivedData = `Received from ${event.source}: ${JSON.stringify(event.data)}`;
        } catch (error) {
          this.logger.error('[Shell] Error processing received event:', error);
          this.receivedData = `Error processing data from ${event.source}`;
        }
      },
      error: (error) => {
        this.logger.error('[Shell] Event subscription error:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.logger.info('[Shell] Component destroyed, subscription cleaned up');
  }

  sendToMFE1(): void {
    try {
      const data: EventData = { 
        message: 'Hello from Shell!', 
        timestamp: new Date().toISOString() 
      };
      this.eventBus.emit('shell-to-mfe1', data, 'shell');
      this.logger.debug('[Shell] Sent message to MFE1');
    } catch (error) {
      this.logger.error('[Shell] Failed to send message to MFE1:', error);
      this.receivedData = 'Error: Failed to send message to MFE1';
    }
  }

  sendToMFE2(): void {
    try {
      const data: EventData = { 
        message: 'Greetings from Shell!', 
        timestamp: new Date().toISOString() 
      };
      this.eventBus.emit('shell-to-mfe2', data, 'shell');
      this.logger.debug('[Shell] Sent message to MFE2');
    } catch (error) {
      this.logger.error('[Shell] Failed to send message to MFE2:', error);
      this.receivedData = 'Error: Failed to send message to MFE2';
    }
  }

  sendToAll(): void {
    try {
      const data: EventData = { 
        message: 'Broadcasting to all MFEs!', 
        timestamp: new Date().toISOString() 
      };
      this.eventBus.emit('shell-broadcast', data, 'shell');
      this.logger.debug('[Shell] Broadcast message to all MFEs');
    } catch (error) {
      this.logger.error('[Shell] Failed to broadcast message:', error);
      this.receivedData = 'Error: Failed to broadcast message';
    }
  }
}

// Made with Bob
