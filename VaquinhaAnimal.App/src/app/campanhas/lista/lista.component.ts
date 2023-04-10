import { Component, OnInit } from '@angular/core';
import { PagedResult } from 'src/app/_utils/pagedResult';
import { environment } from 'src/environments/environment';
import { CampanhaService } from '../campanha.service';
import { Campanha } from '../model/Campanha';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  campanhas!: Campanha[];
  campanhasPaginado!: PagedResult<Campanha>;
  imagens: string = environment.imagensUrl;

  // PAGINAÇÃO
  pageSize: number = 9;
  pageNumber: number = 1;

  constructor(private campanhaService: CampanhaService, 
              private spinner: NgxSpinnerService, 
              private toastr: ToastrService) { }

  ngOnInit() {
    this.spinner.show();

    this.ObterTodosPaginado();
  }

  ObterTodos() {
    this.campanhaService.obterTodos().subscribe(
      (_campanhas: Campanha[]) => {
      this.campanhas = _campanhas;

      this.campanhas.forEach(campanha => {
        let percentual = (campanha.total_arrecadado! / campanha.valor_desejado)*100;
        campanha.percentual_arrecadado = Math.trunc(percentual);

        let inicio = moment();
        let termino = moment(campanha.data_encerramento); 
        let duracao_restante = termino.diff(inicio, 'days');
        campanha.restam = duracao_restante;

        
      });
      this.spinner.hide();
    }, error => {
        this.spinner.hide();
        this.toastr.error(`Erro de carregamento: ${error.error.errors}`);
        console.log(error);
    });
  }

  pageChanged(event: any){
    this.pageNumber = event;
    this.ObterTodosPaginado();
  }

  ObterTodosPaginado() {
    this.campanhaService.obterTodosPaginado(this.pageSize, this.pageNumber).subscribe(
      (_campanhas: PagedResult<Campanha>) => {
      this.campanhasPaginado = _campanhas;

      this.campanhasPaginado.data.forEach(campanha => {
        let percentual = (campanha.total_arrecadado! / campanha.valor_desejado)*100;
        campanha.percentual_arrecadado = Math.trunc(percentual); 

        let inicio = moment();
        let termino = moment(campanha.data_encerramento); 
        let duracao_restante = termino.diff(inicio, 'days');
        campanha.restam = duracao_restante;

      });
      this.spinner.hide();
    }, error => {
        this.spinner.hide();
        this.toastr.error("Erro de carregamento!");
        console.log(error);
    });
  }

  setClasses(percentual: number) : any {
    if (percentual >= 80){
      return 'bg-success';
    }

    if (percentual < 80 && percentual >= 30){
      return 'bg-primary';
    }

    if (percentual < 30){
      return 'bg-warning';
    }
  }

  getWidth(percentual: number) : any {
    var x = percentual + '%';
    return x;
  }

}
