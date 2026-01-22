import { Routes } from '@angular/router';
import { Feature } from './feature/feature/feature';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'feature' },
  { path: 'feature', component: Feature },
];
