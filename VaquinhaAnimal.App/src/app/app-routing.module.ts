import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: 'homepage', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomepageComponent },
  { path: 'auth',
            loadChildren: () => import('./auth/auth.module')
            .then(m => m.AuthModule)
  },
  { path: 'campanhas',
            loadChildren: () => import('./campanhas/campanha.module')
            .then(m => m.CampanhaModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
