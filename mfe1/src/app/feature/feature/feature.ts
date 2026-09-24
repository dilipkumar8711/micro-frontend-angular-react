import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feature',
  imports: [],
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
})
export class Feature implements OnInit, OnDestroy {
  protected receivedData = signal<string>('No data received yet');
  private subscription?: Subscription;

  ngOnInit(): void {
    // Access the global event bus
    const eventBus = (window as any).eventBus;
    
    if (eventBus) {
      this.subscription = eventBus.subscribe((event: any) => {
        console.log('[MFE1] Received event:', event);
        
        // Listen for events targeted to MFE1 or broadcasts
        if (event.type === 'shell-to-mfe1' || event.type === 'shell-broadcast' || event.type === 'mfe2-to-mfe1') {
          this.receivedData.set(`From ${event.source}: ${JSON.stringify(event.data)}`);
        }
      });
    } else {
      console.warn('[MFE1] Event bus not available');
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  sendToMFE2(): void {
    const eventBus = (window as any).eventBus;
    if (eventBus) {
      const data = { message: 'Hello from MFE1!', timestamp: new Date().toISOString() };
      eventBus.emit('mfe1-to-mfe2', data, 'mfe1');
    }
  }

  sendToShell(): void {
    const eventBus = (window as any).eventBus;
    if (eventBus) {
      const data = { message: 'Response from MFE1!', timestamp: new Date().toISOString() };
      eventBus.emit('mfe1-to-shell', data, 'mfe1');
    }
  }
}
