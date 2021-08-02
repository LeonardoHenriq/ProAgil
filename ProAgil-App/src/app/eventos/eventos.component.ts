import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { BsLocaleService, } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarEvento = '';

  // tslint:disable-next-line:variable-name
  _filtroLista = '';
  constructor(
    private eventoService: EventoService
  , private modalService: BsModalService
  , private fb: FormBuilder
  , private localeService: BsLocaleService
  )
  {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
     return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

 // tslint:disable-next-line:typedef
 openModal(template: any) {
   this.registerForm.reset();
   template.show();
 }
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[]{
     filtrarPor = filtrarPor.toLocaleLowerCase();
     return this.eventos.filter(
       evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
     );
  }

  alternarImagem(): void {
     this.mostrarImagem = !this.mostrarImagem;
  }

  // tslint:disable-next-line:typedef
  validation() {
    this.registerForm = this.fb.group({
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        imagemURL: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
    });
  }

  // tslint:disable-next-line:typedef
  salvarAlteracao(template: any) {
     console.log(this.modoSalvar);
     if (this.registerForm.valid){
       if (this.modoSalvar === 'post'){
       this.evento = Object.assign({}, this.registerForm.value);
       this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
           console.log(novoEvento);
           template.hide();
           this.getEventos();
          }, error => {
           console.log(error);
         }
       );
       } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
           () => {
            template.hide();
            this.getEventos();
           }, error => {
            console.log(error);
          }
        );
       }
     }
  }
  // tslint:disable-next-line:typedef
  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(evento);
  }

  // tslint:disable-next-line:typedef
  novoEvento(template: any){
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  // tslint:disable-next-line:typedef
  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line:variable-name
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log(this.eventos);
      }, error => {
        console.log(error);
      });
  }

  // tslint:disable-next-line:typedef
  excluirEvento(evento: Evento, template: any){
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  // tslint:disable-next-line:typedef
  confirmeDelete(template: any){
    console.log(this.evento.id);
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
      }, error => {
        console.log(error);
      }
    );
  }

}
