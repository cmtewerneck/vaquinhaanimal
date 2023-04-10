import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagarmeCardResponse, PagarmeResponse } from 'src/app/auth/User';
import { environment } from 'src/environments/environment';
import { CampanhaService } from '../campanha.service';
import { Campanha } from '../model/Campanha';
import { OrderCartaoNovo } from '../model/OrderCartaoNovo';
import { Order } from '../model/Order';
import { OrderBoleto } from '../model/OrderBoleto';
import { OrderPix } from '../model/OrderPix';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import * as signalR from "@microsoft/signalr"
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageUtils } from 'src/app/_utils/localStorage';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  
  get itemsArray(): FormArray {
    return <FormArray>this.doacaoForm.get('items');
  }
  
  get paymentsArray(): FormArray {
    return <FormArray>this.doacaoForm.get('payments');
  }

  get itemsArrayCartaoNovo(): FormArray {
    return <FormArray>this.cartaoNovoForm.get('items');
  }
  
  get paymentsArrayCartaoNovo(): FormArray {
    return <FormArray>this.cartaoNovoForm.get('payments');
  }

  get itemsBoletoArray(): FormArray {
    return <FormArray>this.boletoForm.get('items');
  }
  
  get paymentsBoletoArray(): FormArray {
    return <FormArray>this.boletoForm.get('payments');
  }

  get itemsPixArray(): FormArray {
    return <FormArray>this.pixForm.get('items');
  }
  
  get paymentsPixArray(): FormArray {
    return <FormArray>this.pixForm.get('payments');
  }
  
  imagens: string = environment.imagensUrl;
  campanha: Campanha;
  cartoes!: PagarmeResponse<PagarmeCardResponse>;
  doacao!: Order;
  doacaoCartaoNovo!: OrderCartaoNovo;
  doacaoBoleto!: OrderBoleto;
  doacaoPix!: OrderPix;
  errors: any[] = [];
  doarToggle: boolean = false;
  doarSemCadastroToggle: boolean = false;
  cartaoToggle: string = "";
  payment_method_toggle: string = "";
  cartaoNovoForm!: FormGroup;
  doacaoForm!: FormGroup;
  boletoForm!: FormGroup;
  pixForm!: FormGroup;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  qrCodeLink!: string;
  qrCode!: TemplateRef<any>;
  restam!: number;
  hubConnection!: signalR.HubConnection;
  totalDoadores!: number;
  userLogado: boolean = false;
  localStorage = new LocalStorageUtils;
  
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private campanhaService: CampanhaService,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService, 
    private modalService: BsModalService,
    private router: Router) {this.campanha = this.route.snapshot.data['campanha'];}
    
    ngOnInit(): void {
      this.calcularDuracao();
      
      this.campanhaService.obterQuantidadeDoadores(this.campanha.id)
        .subscribe(response => this.totalDoadores = response);

      this.usuarioLogado();
    }

    usuarioLogado(){
      let userToken = this.localStorage.obterTokenUsuarioSession();
      console.log("USUARIO LOGADO: " + userToken);

      if(userToken != null){
        this.userLogado = true;
      } else { this.userLogado = false }
    }

    calcularDuracao(): void{
      let inicio = moment();
      let termino = moment(this.campanha.data_encerramento); 
      console.log("Início: " + inicio);
      console.log("Término: " + termino);
      let duracao_restante = termino.diff(inicio, 'days');
      this.restam = duracao_restante;
    }
    
    queroDoar(){
      this.doarToggle = true;
      
      // this.campanhaService.obterMeusCartoes()
      // .subscribe(cartoes => this.cartoes = cartoes);
      
      // this.doacaoForm = this.fb.group({
      //   items: this.fb.array([this.criaItem()]),
      //   payments: this.fb.array([this.criaPayment()])
      // });
    }

    queroDoarSemCadastro(){
      this.doarSemCadastroToggle = true;
    }

    openModal(qrCode: TemplateRef<any>) {
      // this.modalRef = this.modalService.show(qrCode, { id: 1 }, this.config);
      this.modalRef = this.modalService.show(qrCode, this.config);

      this.createConnection(); // Cria a conexão
      this.pixListener(); // Escuta o método
      this.startConnection(); // Inicia a conexão
    }

    closeModal() {
      this.modalRef?.hide();
    }
    
    paymentSelected(event: any){
      this.payment_method_toggle = event.target.value;
      this.cartaoToggle = "";

      if(this.payment_method_toggle == "billing"){
        this.boletoForm = this.fb.group({
          items: this.fb.array([this.criaItemBoleto()]),
          payments: this.fb.array([this.criaPaymentBoleto()])
        });
      }

      if(this.payment_method_toggle == "pix"){
        this.pixForm = this.fb.group({
          items: this.fb.array([this.criaItemPix()]),
          payments: this.fb.array([this.criaPaymentPix()])
        });
      }
    }

    cardToBeUsed(event: any){
      this.cartaoToggle = event.target.value;

      if(this.cartaoToggle == "cartaoCadastrado"){
        this.campanhaService.obterMeusCartoes()
          .subscribe(cartoes => this.cartoes = cartoes);
          
          this.doacaoForm = this.fb.group({
            items: this.fb.array([this.criaItem()]),
            payments: this.fb.array([this.criaPayment()])
          });
      }

      if(this.cartaoToggle == "cartaoNovo"){
        this.cartaoNovoForm = this.fb.group({
          salvarCartao: [false, Validators.required],
          items: this.fb.array([this.criaItemCartaoNovo()]),
          payments: this.fb.array([this.criaPaymentCartaoNovo()])
        });
      }
    }
    
    criaItem(): FormGroup {
      return this.fb.group({
        amount: ['', Validators.required],
        description: ['Doadores'],
        quantity: [1],
        code: ['1'],
      });
    }

    criaItemCartaoNovo(): FormGroup {
      return this.fb.group({
        amount: ['', Validators.required],
        description: ['Doadores'],
        quantity: [1],
        code: ['1'],
      });
    }

    criaItemBoleto(): FormGroup {
      return this.fb.group({
        amount: ['', Validators.required],
        description: ['Doadores'],
        quantity: [1],
        code: ['1'],
      });
    }

    criaItemPix(): FormGroup {
      return this.fb.group({
        amount: ['', Validators.required],
        description: ['Doadores'],
        quantity: [1],
        code: ['DoE - PIX'],
      });
    }
    
    criaPayment(): FormGroup {
      return this.fb.group({
        payment_method: ['credit_card'],
        credit_card: this.fb.group({
          recurrence: [false],
          installments: [1],
          statement_descriptor: ['Doadores'],
          card_id: ['', Validators.required],
          card: this.fb.group({
            cvv: ['', Validators.required]
          })
        })
      });
    }

    criaPaymentCartaoNovo(): FormGroup {
      return this.fb.group({
        payment_method: ['credit_card'],
        credit_card: this.fb.group({
          recurrence: [false],
          installments: [1],
          statement_descriptor: ['Doadores'],
          card: this.fb.group({
            number: ['', Validators.required],
            holder_name: ['', Validators.required],
            holder_document: ['', Validators.required],
            brand: ['', Validators.required],
            exp_month: ['', Validators.required],
            exp_year: ['', Validators.required],
            cvv: ['', Validators.required],
            billing_address: this.fb.group({
              line_1: ['', Validators.required],
              zip_code: ['', Validators.required],
              city: ['', Validators.required],
              state: ['', Validators.required],
              country: ['', Validators.required]
            })
          }),
        })
      });
    }

    criaPaymentBoleto(): FormGroup {
      return this.fb.group({
        payment_method: ['boleto'],
        boleto: this.fb.group({
          instructions: ['Não deixe de doar. O mundo precisa da sua ajuda!'],
          due_at: [null]
        })
      });
    }

    criaPaymentPix(): FormGroup {
      return this.fb.group({
        payment_method: ['pix'],
        pix: this.fb.group({
          expires_in: [300],
          additional_informations: [null]
        })
      });
    }
    
    realizarDoacao(){
      this.spinner.show();

      if (this.doacaoForm.dirty && this.doacaoForm.valid) 
      {
        this.doacao = Object.assign({}, this.doacao, this.doacaoForm.value);
      }
      
      console.log(this.doacao);
      
      this.campanhaService.realizarDoacao(this.doacao, this.campanha.id)
      .subscribe(
        sucesso => { this.processarSucesso(sucesso) },
        falha => { this.processarFalha(falha) }
        );
    }

    realizarDoacaoCartaoNovo(){
      this.spinner.show();

      if (this.cartaoNovoForm.dirty && this.cartaoNovoForm.valid) 
      {
        this.doacaoCartaoNovo = Object.assign({}, this.doacaoCartaoNovo, this.cartaoNovoForm.value);
      }
      
      console.log(this.doacaoCartaoNovo);
      
      this.campanhaService.realizarDoacaoCartaoNovo(this.doacaoCartaoNovo, this.campanha.id)
      .subscribe(
        sucesso => { this.processarSucessoCartaoNovo(sucesso) },
        falha => { this.processarFalha(falha) }
        );
    }

    realizarDoacaoBoleto(){
      this.spinner.show();

      if (this.boletoForm.dirty && this.boletoForm.valid) 
      {
        this.doacaoBoleto = Object.assign({}, this.doacaoBoleto, this.boletoForm.value);
      }
      
      console.log(this.doacaoBoleto);
      
      this.campanhaService.realizarDoacaoBoleto(this.doacaoBoleto, this.campanha.id)
      .subscribe(
        sucesso => { this.processarSucessoBoleto(sucesso) },
        falha => { this.processarFalha(falha) }
        );
    }

    realizarDoacaoPix(qrCode: TemplateRef<any>){
      this.spinner.show();

      if (this.pixForm.dirty && this.pixForm.valid) 
      {
        this.doacaoPix = Object.assign({}, this.doacaoPix, this.pixForm.value);
      }
      
      console.log(this.doacaoPix);
      
      this.campanhaService.realizarDoacaoPix(this.doacaoPix, this.campanha.id)
      .subscribe(
        sucesso => { this.processarSucessoPix(sucesso, qrCode) },
        falha => { this.processarFalha(falha) }
        );
    }
      
    processarSucesso(response: any) {
      this.spinner.hide();
      this.doacaoForm.reset();
      this.errors = [];
      
      let toast = this.toastr.success('Doação em andamento. Verifique o status em MINHAS DOAÇÕES!', 'Processando!');
      if (toast) {
        toast.onHidden.subscribe(() => {
          this.router.navigate(['doacoes/minhas-doacoes']);
        });
      }
    }

    processarSucessoCartaoNovo(response: any) {
      this.spinner.hide();
      this.cartaoNovoForm.reset();
      this.errors = [];
      
      let toast = this.toastr.success('Doação em andamento. Verifique o status em MINHAS DOAÇÕES!', 'Processando!');
      if (toast) {
        toast.onHidden.subscribe(() => {
          this.router.navigate(['doacoes/minhas-doacoes']);
        });
      }
    }

    processarSucessoBoleto(response: any) {
      this.spinner.hide();
      this.boletoForm.reset();
      this.errors = [];
      console.log(response);
      
      let toast = this.toastr.success('Você será redirecionado para impressão do boleto.', 'Boleto Emitido!');
      if (toast) {
        toast.onHidden.subscribe(() => {
          this.router.navigate(['doacoes/minhas-doacoes']);
        });
      }
    }
      
    processarSucessoPix(response: any, qrCode: TemplateRef<any>) {
      this.spinner.hide();
      console.log("Link do QR CODE: " + response);
      this.pixForm.reset();
      this.errors = [];
      this.qrCodeLink = response;

      this.openModal(qrCode);
    }

    processarFalha(fail: any) {
      this.spinner.hide();
      this.errors = fail.error;
      console.log(this.errors);
      //this.toastr.error('Ocorreu um erro!', 'Opa :(');
      this.toastr.error(fail.error, 'Erro!');
    }
      
    naoQueroDoar(){
      this.doarToggle = false;
      this.cartaoToggle = "";
      this.payment_method_toggle = "";
    }  

    naoQueroDoarSemCadastro(){
      this.doarSemCadastroToggle = false;
      // this.cartaoToggle = "";
      // this.payment_method_toggle = "";
    }  
    
    private createConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://doadoresapi20220707212551.azurewebsites.net/pix-response')
                              .build();
    }
  
    private pixListener = () => {
      this.hubConnection.on('pixIsPaid', (data: any) => {
        console.log("Status do pagamento: " + data);

        this.closeModal();

        if(data == true){
          let toast = this.toastr.success('Recebemos o seu PIX', 'Sucesso!');
            if (toast) {
              toast.onHidden.subscribe(() => {
                this.router.navigate(['doacoes/minhas-doacoes']);
              });
            }
        } else if(data == false){
          this.toastr.error('PIX não reconhecido', 'Falha!');
        }
      });

      //this.stopConnection(); 
    }
  
    private startConnection = () => {
      this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))
    }

    private stopConnection = () => {
      this.hubConnection
        .stop()
        .then(() => console.log('Connection stoped'))
        .catch(err => console.log('Error while stoping connection: ' + err))
    }
}