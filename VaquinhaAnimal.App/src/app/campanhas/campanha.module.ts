import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { CampanhaRoutingModule } from './campanha.routing';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskModule } from 'ngx-mask';

import { CampanhaAppComponent } from './campanha.app.component';
import { MinhasCampanhasComponent } from './minhasCampanhas/minhasCampanhas.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListaComponent } from './lista/lista.component';
import { DetailComponent } from './detail/detail.component';

import { CampanhaGuard } from './campanha.guard';
import { CampanhaService } from './campanha.service';
import { CampanhaResolve } from './campanha.resolve';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CampanhaEditGuard } from './campanha.edit.guard';
import { ListaAdminComponent } from './lista-admin/listaAdmin.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { SafePipe } from './safe.pipe';
registerLocaleData(localePt);

@NgModule({
  imports: [
    CommonModule,
    CampanhaRoutingModule,
    RouterModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    HttpClientModule,
    ImageCropperModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      maxOpened: 0,
      progressBar: true,
      progressAnimation: 'decreasing'
    }),
    NgxMaskModule.forChild(),
    FormsModule,
    NgxPaginationModule
  ],
  declarations: [
    CampanhaAppComponent,
    AddComponent,
    EditComponent,
    ListaComponent,
    ListaAdminComponent,
    DetailComponent,
    MinhasCampanhasComponent,
    SafePipe
  ],
  providers: [
    CampanhaService,
    CampanhaGuard,
    CampanhaEditGuard,
    CampanhaResolve,
    CurrencyPipe,
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    },
    {
      provide:  DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
  ]
})
export class CampanhaModule { }
