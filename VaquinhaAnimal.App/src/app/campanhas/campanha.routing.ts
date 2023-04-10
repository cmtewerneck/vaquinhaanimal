import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampanhaAppComponent } from './campanha.app.component';
import { MinhasCampanhasComponent } from './minhasCampanhas/minhasCampanhas.component';
import { ListaComponent } from './lista/lista.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

import { CampanhaGuard } from './campanha.guard';
import { CampanhaResolve } from './campanha.resolve';
import { DetailComponent } from './detail/detail.component';
import { CampanhaEditGuard } from './campanha.edit.guard';
import { ListaAdminComponent } from './lista-admin/listaAdmin.component';

const campanhaRouterConfig: Routes = [
    {
        path: '', component: CampanhaAppComponent,
        children: [
            {
                 path: 'listar-todos', component: ListaComponent
            },
            {
                path: 'listar-todos-admin', component: ListaAdminComponent,
                canActivate: [CampanhaGuard]
            },
            { 
                path: 'minhas-campanhas', component: MinhasCampanhasComponent,
                canActivate: [CampanhaGuard]
            },
            {
                path: 'adicionar-novo', component: AddComponent,
                canActivate: [CampanhaGuard]
            },
            {
                path: 'editar/:id', component: EditComponent,
                canActivate: [CampanhaEditGuard],
                resolve: {
                    campanha: CampanhaResolve
                }
             },
             {
                path: 'detalhes/:id', component: DetailComponent,
                //canActivate: [CampanhaGuard],
                resolve: {
                    campanha: CampanhaResolve
                }
             }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(campanhaRouterConfig)
    ],
    exports: [RouterModule]
})
export class CampanhaRoutingModule { }