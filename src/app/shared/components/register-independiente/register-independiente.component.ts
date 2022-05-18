import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Ciudades } from '../../model/ciudades.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { DataService1 } from '../../services/dataRegIndependiente.services';

@Component({
  selector: 'app-register-independiente',
  templateUrl: './register-independiente.component.html',
  styleUrls: ['./register-independiente.component.scss'],
  providers: [DataService1, DataServices, AuthService]
})
export class RegisterIndependienteComponent implements OnInit, OnChanges {
  independienteForm!: FormGroup;
  private isCel= "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  private isDoc= "\[0-9]{10}";
  private isEmail= /\S+@\S+\.\S+/;
  fecha = new Date();

  @Input() valorPagoP!: number;

  usuario: Usuario = {
    correo: '',
    password: '',
    uid: '',
    perfil: 'independiente',
    referencia: '',
    plan: 'mensualI',
    fechaInicio: '',
    fechaFin: '',
    estadoPago: false
  }

  ciudades: Ciudades[] = [];
  municipios: string[] = [];
  departamento!: string;

  constructor(private fb: FormBuilder, private dataSvc: DataService1, public modal: NgbActiveModal, private data: DataServices, private afs: AuthService) { 
    data.getCollection<Ciudades>('Cities').subscribe(res => {
      //console.log(res);
      this.ciudades = res;
      for (let index = 0; index < res.length; index++) {
        if (res[index].departamento == 'Valle del Cauca'){
          this.municipios[index] = res[index].municipio;
        }
      }
      this.departamento = res[0].departamento;
      this.municipios = this.municipios.sort();
      console.log(this.municipios);
    })
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    this.initForm();
  }

  async OnSave(): Promise<void> {
    if (this.independienteForm.valid) {
      try {
        this.registrar();
        this.independienteForm.reset()
        this.modal.close();
        //Notificación de confirmación
        Swal.fire('Registro exitoso', 'Volver al inicio', 'success'); 
      } catch (e) {
        alert(e);
      }

    } else {
      //Notificacion de error
      Swal.fire(
        'Error',
        'Revisar información ingresada',
        'error'
      );
    }
  }


  async registrar() {
    const formValue = this.independienteForm.value;
    console.log('datos -> ', this.usuario);
    const res = await this.afs.register(this.usuario).catch( error => {
      console.log('error');
    });
    if (res) {
      console.log('Exito al crear el usuario');
      const {correo} = this.independienteForm.value;
      this.usuario.correo = correo;
      const id = res.user!.uid;
      this.usuario.uid = id;
      this.usuario.password = '';
      this.usuario.referencia = this.referenciaPago();
      if (this.usuario.plan == 'mensualI') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.usuario.fechaFin = (this.fecha.getDate() + '/' + (this.fecha.getMonth() + 2) + '/' + this.fecha.getFullYear());
        console.log(this.usuario.fechaInicio, '-', this.usuario.fechaFin);
      } else if (this.usuario.plan == 'anualI') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.fecha.setDate(this.fecha.getFullYear() + 1);
        this.usuario.fechaFin = this.fecha.toLocaleDateString();
        console.log(this.usuario.fechaFin);
      }
      await this.data.createDoc(this.usuario, 'Usuarios', id);
      await this.dataSvc.onSaveIndependiente(formValue, this.usuario, id);
    }
  }

  isValidField (field:string): string {
    const validateField = this.independienteForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }

  notRequiredHasValue(field: string):string {
    return this.independienteForm.get(field)?.value ? 'is-valid' : '';
  }

  private initForm(): void {
    this.independienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.pattern(this.isDoc)]],
      profesion: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: [''],
      celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
      correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      domicilio: [''],
      servicios: ['', [Validators.required]],
      nombreReferencia1: ['', [Validators.required]],
      celularReferencia1: ['', [Validators.required, Validators.pattern(this.isCel)]],
      ocupacionReferencia1: ['', [Validators.required]],
      nombreReferencia2: ['', [Validators.required]],
      celularReferencia2: ['', [Validators.required, Validators.pattern(this.isCel)]],
      ocupacionReferencia2: ['', [Validators.required]],
      codigoAsesor: [''],
      terminosyCondiciones: ['', [Validators.required]],
    });

  }

  referenciaPago() {
    let result = 'WP';
    const numeros = '0123456789';
    for (let i = 0; i < 6; i++) {
      result += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    console.log('Referencia de pago -> ' ,result)
    return result;
  }
}

