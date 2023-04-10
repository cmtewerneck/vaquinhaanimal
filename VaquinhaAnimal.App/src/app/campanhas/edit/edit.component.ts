import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CampanhaService } from '../campanha.service';
import { Campanha } from '../model/Campanha';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Bancos } from '../model/Bancos';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {

  private _jsonURL = '../../../assets/bancos.json';

  get imagensArray(): FormArray {
    return <FormArray>this.campanhaForm.get('imagens');
  }

  imagens: string = environment.imagensUrl;
  errors: any[] = [];
  campanhaForm!: FormGroup;
  beneficiarioForm!: FormGroup;
  campanha!: Campanha;
  document_mask: string = "000.000.000-00";
  document_toggle: string = "individual";
  bancos: Bancos[] = [];

  imageBase64: any;
  imagemPreview: any;
  imagemNome!: string;
  imagemOriginalSrc!: string;

  // VARIÁVEIS PARA IMAGEM
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imageUrl!: string;
  // FIM DA IMAGEM

  constructor(
    private fb: FormBuilder,
    private campanhaService: CampanhaService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { 
      this.campanha = this.route.snapshot.data['campanha']; 
      this.getJSON().subscribe(data => {
        this.bancos = data;
        console.log(data);
       });
    }

    public getJSON(): Observable<any> {
      return this.http.get(this._jsonURL);
    }
    
    ngOnInit(): void {

      this.campanhaForm = this.fb.group({
        data_inicio: [null],
        data_encerramento: [''],
        duracao_dias: ['', Validators.required],
        titulo: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
        descricao_curta: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(5)]],
        descricao_longa: ['', [Validators.required, Validators.maxLength(5000), Validators.minLength(500)]],
        video_url: [''],
        valor_desejado: [0, Validators.required],
        termos: [false, [Validators.required, Validators.requiredTrue]],
        premium: [false, Validators.required],
        imagens: this.fb.array([]),
        beneficiario: this.beneficiarioForm = this.fb.group({
          nome: ['', Validators.required],
          documento: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(16)]],
          tipo: ['', Validators.required],
          codigo_banco: ['', [Validators.required, Validators.maxLength(3)]],
          numero_agencia: ['', [Validators.required, Validators.maxLength(4)]],
          digito_agencia: ['', Validators.maxLength(1)],
          numero_conta: ['', [Validators.required, Validators.maxLength(13)]],
          digito_conta: ['', [Validators.required, Validators.maxLength(2)]],
          tipo_conta: ['', Validators.required],
          recebedor_id: ['']
        })
      });

      this.campanhaForm.patchValue({
        id: this.campanha.id,
        data_inicio: this.campanha.data_inicio,
        data_encerramento: this.campanha.data_encerramento,
        duracao_dias: this.campanha.duracao_dias,
        titulo: this.campanha.titulo,
        descricao_curta: this.campanha.descricao_curta,
        descricao_longa: this.campanha.descricao_longa,
        valor_desejado: this.campanha.valor_desejado,
        video_url: this.campanha.video_url,
        termos: this.campanha.termos,
        premium: this.campanha.premium,
      });

      this.beneficiarioForm.patchValue({
        id: this.campanha.beneficiario.id,
        nome: this.campanha.beneficiario.nome,
        documento: this.campanha.beneficiario.documento,
        tipo: this.campanha.beneficiario.tipo,
        codigo_banco: this.campanha.beneficiario.codigo_banco,
        numero_agencia: this.campanha.beneficiario.numero_agencia,
        digito_agencia: this.campanha.beneficiario.digito_agencia,
        numero_conta: this.campanha.beneficiario.numero_conta,
        digito_conta: this.campanha.beneficiario.digito_conta,
        tipo_conta: this.campanha.beneficiario.tipo_conta
      });

      this.imagemOriginalSrc = this.imagens + this.campanha.imagens[0].arquivo;
    }

    setDocumentValidation(){
      this.beneficiarioForm.controls['documento'].clearValidators();
      this.beneficiarioForm.controls['documento'].setValue("");

      if (this.document_toggle == "CPF"){
        this.beneficiarioForm.controls['documento'].setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
      } else if(this.document_toggle == "CNPJ"){
        this.beneficiarioForm.controls['documento'].setValidators([Validators.required, Validators.minLength(14), Validators.maxLength(16)]);
      }

      this.beneficiarioForm.controls['documento'].updateValueAndValidity();

      console.log(this.beneficiarioForm);
    }

    criaImagem(documento: any): FormGroup {
      return this.fb.group({
        id: [documento.id],
        tipo: [1],
        arquivo: [''],
        arquivo_upload: ['']
      });
    }

    adicionarImagem(){
      this.imagensArray.push(this.criaImagem({ id: "00000000-0000-0000-0000-000000000000" }));
    }

    removerImagem(id: number){
      this.imagensArray.removeAt(id);
    }

    editarCampanha() {
      this.spinner.show();

      if (this.campanhaForm.dirty && this.campanhaForm.valid) {
        this.campanha = Object.assign({}, this.campanha, this.campanhaForm.value);

        this.campanha.imagens.forEach(imagem => {
          imagem.arquivo_upload = this.croppedImage.split(',')[1];
          imagem.arquivo = this.imagemNome;
        });

        console.log(this.campanha);

        this.campanha.termos = this.campanha.termos.toString() == "true";
        this.campanha.premium = this.campanha.premium.toString() == "true";
        
        this.campanhaService.atualizarCampanha(this.campanha)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
          );
        }
      }
      
      processarSucesso(response: any) {
        this.spinner.hide();
        this.campanhaForm.reset();
        this.errors = [];
        
        let toast = this.toastr.success('Campanha atualizada com sucesso!', 'Sucesso!');
        if (toast) {
          toast.onHidden.subscribe(() => {
            this.router.navigate(['campanhas/minhas-campanhas']);
          });
        }
      }
      
      processarFalha(fail: any) {
        this.spinner.hide();
        this.errors = fail.error.errors;
        
        this.toastr.error(this.errors[0], "Erro!");
      }

      documentSelected(event: any){
        console.log(event.target.value);
        
        if(event.target.value == "individual"){
          this.document_mask = "000.000.000-00";
          this.document_toggle = "individual";
        } else if(event.target.value == "company"){
          this.document_mask = "00.000.000/0000-00"
          this.document_toggle = "company";
        }

        this.setDocumentValidation();
      }

      fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.imagemNome = event.currentTarget.files[0].name;
        this.adicionarImagem();
        this.campanhaForm.markAsDirty();
      }
      
      imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
      }
      
      imageLoaded() {
        this.showCropper = true;
      }
      
      cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
      }
      
      loadImageFailed() {
        this.errors.push('O formato do arquivo ' + this.imagemNome + ' não é aceito.');
      }
}
