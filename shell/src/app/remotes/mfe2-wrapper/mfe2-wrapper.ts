
import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { loadMfExposed } from '../../mf-utils';

type Mfe2Module = {
  mount: (el: HTMLElement, props?: any) => void;
  unmount: (el: HTMLElement) => void;
};

@Component({
  selector: 'app-mfe2-wrapper',
  standalone: true,
  template: `<div #host style="display:block; min-height: 80px;"></div>`,
})
export class Mfe2WrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  private unmount?: (el: HTMLElement) => void;

  async ngAfterViewInit() {
    const mod = await loadMfExposed<Mfe2Module>({
      remoteEntry: 'http://localhost:4400/remoteEntry.js',
      remoteName: 'mfe2',
      exposedModule: './WidgetApp',
    });

    mod.mount(this.host.nativeElement, { user: 'Dileep' });
    this.unmount = mod.unmount;
  }

  ngOnDestroy() {
    this.unmount?.(this.host.nativeElement);
  }
}
