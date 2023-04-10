import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CampanhaService } from '../campanha.service';
import { Campanha } from '../model/Campanha';

@Component({
  selector: 'app-lista-admin',
  templateUrl: './listaAdmin.component.html',
  styleUrls: ['./listaAdmin.component.scss']
})
export class ListaAdminComponent implements OnInit {

  campanhas!: Campanha[];
  errors!: any[];
  campanhaId!: string;
  
  constructor(private campanhaService: CampanhaService, private toastr: ToastrService) {}

  ngOnInit(): void {this.ObterTodos();}

  ObterTodos() {
    this.campanhaService.obterTodos().subscribe(
      (_campanhas: Campanha[]) => {
      this.campanhas = _campanhas;
    }, error => {
      console.log(error);
    });
  }

  iniciarCampanha() {
    this.campanhaService.iniciarCampanha(this.campanhaId)
    .subscribe(
      campanha => { 
        this.processarSucesso(campanha) 
      },
      falha => { this.processarFalha(falha) }
      )
   }

   pararCampanha() {
    this.campanhaService.pararCampanha(this.campanhaId)
    .subscribe(
      campanha => { 
        this.processarSucesso(campanha) 
      },
      falha => { this.processarFalha(falha) }
      )
   }

   rejeitarCampanha() {
    this.campanhaService.rejeitarCampanha(this.campanhaId)
    .subscribe(
      campanha => { 
        this.processarSucesso(campanha) 
      },
      falha => { this.processarFalha(falha) }
      )
   }

   retornarCampanha() {
    this.campanhaService.retornarCampanha(this.campanhaId)
    .subscribe(
      campanha => { 
        this.processarSucesso(campanha) 
      },
      falha => { this.processarFalha(falha) }
      )
   }

   processarSucesso(response: any) {
    this.errors = [];
    this.toastr.success('Campanha iniciada!', 'Sucesso!');
    this.ObterTodos();
    this.campanhaId = "";
  }
  
  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
    this.campanhaId = "";
  }

  salvarId(id: string){
    this.campanhaId = id;
  }

  limparId(){
    this.campanhaId = '';
  }

}
