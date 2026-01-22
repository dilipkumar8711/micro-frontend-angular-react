
import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';

// Declare the Webpack share scope globals
declare const __webpack_init_sharing__: any;
declare const __webpack_share_scopes__: any;

@Component({
  selector: 'app-mfe2-wrapper',
  standalone: true,
  template: `
    <p style="margin:0 0 8px;color:#888">Loading React MFE2…</p>
    <div #host style="display:block; min-height: 80px;"></div>
  `,
})
export class Mfe2WrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  private unmount?: (el: HTMLElement) => void;

  private loadScript(src: string) {
    return new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async ngAfterViewInit() {
    console.log('[mfe2-wrapper] route activated');

    // 1) Ensure the remoteEntry is actually loaded into the page
    await this.loadScript('http://localhost:4400/remoteEntry.js');

    // 2) Initialize host share scope
    await __webpack_init_sharing__('default');

    // 3) Grab the global container created by the remote
    const container = (window as any)['mfe2']; // MUST exist if library.type='var' and name='mfe2'
    if (!container) throw new Error('window.mfe2 not found');

    // 4) Initialize the container with the host's share scope
    await container.init(__webpack_share_scopes__.default);

    // 5) Get the exposed module and execute the factory
    const factory = await container.get('./WidgetApp');
    const mod = factory();

    console.log('[mfe2-wrapper] MF module keys:', Object.keys(mod));
    mod.mount(this.host.nativeElement, { user: 'Dileep' });
    this.unmount = mod.unmount;
  }

  ngOnDestroy() {
    this.unmount?.(this.host.nativeElement);
  }
}
