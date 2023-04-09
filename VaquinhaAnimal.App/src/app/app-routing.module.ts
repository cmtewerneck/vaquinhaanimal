import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CampanhasComponent } from './campanhas/campanhas.component';
import { ContatoComponent } from './contato/contato.component';
import { BlogComponent } from './blog/blog.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  { path: 'campanhas', component: CampanhasComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'artigos', component: BlogComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
