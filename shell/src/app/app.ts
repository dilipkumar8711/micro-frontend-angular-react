import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { EventBusService } from './event-bus.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('shell');
  protected receivedData = signal<string>('No data received yet');

  constructor(private eventBus: EventBusService) {
    // Subscribe to events from microfrontends
    this.eventBus.events$.subscribe(event => {
      console.log('[Shell] Received event:', event);
      this.receivedData.set(`Received from ${event.source}: ${JSON.stringify(event.data)}`);
    });
  }

  sendToMFE1(): void {
    const data = { message: 'Hello from Shell!', timestamp: new Date().toISOString() };
    this.eventBus.emit('shell-to-mfe1', data, 'shell');
  }

  sendToMFE2(): void {
    const data = { message: 'Greetings from Shell!', timestamp: new Date().toISOString() };
    this.eventBus.emit('shell-to-mfe2', data, 'shell');
  }

  sendToAll(): void {
    const data = { message: 'Broadcasting to all MFEs!', timestamp: new Date().toISOString() };
    this.eventBus.emit('shell-broadcast', data, 'shell');
  }
}
