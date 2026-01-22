import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
export const routes: Routes = [
  {
    path: 'mfe1',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4300/remoteEntry.js',
        exposedModule: './Feature',
      }).then((m) => m.Feature),
  },
  {
    path: 'mfe2',
    loadComponent: () => import('./remotes/mfe2-wrapper/mfe2-wrapper').then((m) => m.Mfe2WrapperComponent),
  },
  // { path: '', pathMatch: 'full', redirectTo: 'mfe2' },
];
