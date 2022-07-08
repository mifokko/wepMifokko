import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/dataRegE.services';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { Ciudades } from '../../model/ciudades.model';
import { Pagos } from '../../model/pagos.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DataService, AuthService, DataServices]
})
export class RegisterComponent implements OnInit {
  empresaForm!: FormGroup; // Variable que almacena la informacion de la empresa a guardar 
  private isNIT = "^([0-9]{0,15}[0-9]{1})?$"; // Validar estructura del NIT
  private isCel = "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}"; //Validar estructura del celular
  private isEmail = /\S+@\S+\.\S+/; // Validar estructura de correo
  fecha = new Date(); // Variable para conocer la fecha actual 

  //Datos de plan, # de pagos y precio del plan
  passedData!: string;
  precioPlan!: number;
  pagos!: string;

  //Estructura que se usara para el inicio de sesion del usuario
  usuario: Usuario = {
    correo: '',
    password: '',
    uid: '',
    perfil: 'empresa',
    referencia: '',
    plan: this.pagos,
    tipoPlan: this.passedData,
    pago: this.precioPlan,
    fechaInicio: '',
    fechaFin: '',
    estadoPago: false
  }

  fieldTextType: boolean = false; //Ver contraseña
  pagar: boolean = false; // Se usa para habilitar boton de pago 

  ciudades: Ciudades[] = [];
  municipios: string[] = [];
  departamentos: string[] = [];
  departamento: string[] = [];
  seleccion!: string;

  //Referencias de pago 
  referenciaWompi = '';
  referenciaMercadoPago = '';

  //Precio del plan a pagar 
  precio!: number;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder, private dataSvc: DataService, private afs: AuthService, private data: DataServices) {
    data.getCollection<Ciudades>('Ciudades').subscribe(res => {
      //console.log(res);
      this.ciudades = res;
      for (let index = 0; index < res.length; index++) {
        this.departamentos[index] = res[index].departamento;
      }
      this.departamento = this.departamentos.filter((valor, indice) => {
        return this.departamentos.indexOf(valor) === indice;
      });

      this.departamento = this.departamento.sort();
      //this.municipios = this.municipios.sort();
      //console.log(this.departamento);
    })
    //console.log(this.municipios);
    this.referenciaWompi = this.referenciaPago();
    // this.referenciaMercadoPago = this.referenciaPagoM();

    // this.fecha.setMonth(this.fecha.getMonth() + 1);
    // console.log(this.fecha.toLocaleDateString());
    
  }

  ngOnInit(): void {
    this.initForm();
    //console.log(this.passedData,this.pagos,this.precioPlan);
    this.usuario.pago = this.precioPlan;
    this.usuario.plan = this.pagos;
    this.usuario.tipoPlan = this.passedData;
  }

  //Función que carga los municipios en una lista, según el departamento que se ha seleccionado 
  uploadMunicipios() {
    console.log(this.seleccion);
    for (let index = 0; index < this.ciudades.length; index++) {
      if (this.seleccion === this.ciudades[index].departamento) {
        this.municipios[index] = this.ciudades[index].municipio
      } else {
        //console.log('paso');
      }
    }

    this.municipios = this.municipios.filter(Boolean);
    this.municipios = this.municipios.sort();
    //console.log(this.municipios.length);
  }

  //Función que llama a la funcion de almacenamiento y es la encargada de resetear los formularios
  async OnSave(): Promise<void> {
    if (this.empresaForm.valid) {
      try {

        this.registrar();
        this.empresaForm.reset()
        this.modal.close();
        //Notificación de confirmación
        Swal.fire({
          title: 'Registro exitoso',
          icon: 'success',
          html: 'Ir a realizar el <b>Pago</b> <br> ' +
          '<form action="https://checkout.wompi.co/p/" method="GET">' + 
          '<input type="hidden" name="public-key" value="pub_test_pxMGkJMTgaNDNQFwQu6Dq1FoB6u2VN9a" />'+
          '<input type="hidden" name="currency" value="COP" />' +
          '<input type="hidden" name="amount-in-cents" value="'+this.precioPlan*100+'" />' +
          '<input type="hidden" name="reference" value="'+this.referenciaWompi+'" />'+
          '<input type="hidden" name="redirect-url" value="https://www.mifokko.com" />'+
          '<button class="btn btn-primary rounded waynox" type="submit"> Paga con <strong>Wompi</strong></button>'
        })
        this.pagar = true;
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

  //Creacion del Usuario, y almacenamiento de la información de la empresa 
  async registrar() {
    const formValue = this.empresaForm.value;
    //console.log(formValue, this.usuario);
    //console.log('datos -> ', this.usuario.correo);
    const correo = this.usuario.correo;
    //Creación de cuenta con el correo y contraseña
    const res = await this.afs.register(this.usuario).catch(error => {
      console.log('error');
    });
    if (res) {
      console.log('Exito al crear el usuario');
      this.usuario.correo = correo;
      const id = res.user!.uid;
      this.usuario.uid = id;
      this.usuario.password = '';
      this.usuario.referencia = this.referenciaWompi;
      //Generar fecha de registro de la empresa y fecha de finalizacion de la subscripción
      if (this.usuario.plan == '1MENSUALES') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.fecha.setMonth(this.fecha.getMonth() + 1);
        this.usuario.fechaFin = this.fecha.toLocaleDateString();
        //console.log(this.usuario.fechaInicio, '-', this.usuario.fechaFin);
      } else if (this.usuario.plan == 'ANUAL') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.fecha.setFullYear(this.fecha.getFullYear() + 1);
        this.usuario.fechaFin = this.fecha.toLocaleDateString();
        //console.log(this.usuario.fechaFin);
      }
      //Se guarda la información de Usuario de la empresa y se guarda la información de la empresa
      await this.data.createDoc(this.usuario, 'Usuarios', id);
      await this.dataSvc.onSaveEmpresa(formValue, id);
    }
  }

  //Validacion de campos obligatorios 
  isValidField(field: string): string {
    const validateField = this.empresaForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }

  //Validacion de campos que no son obligatorios 
  notRequiredHasValue(field: string): string {
    return this.empresaForm.get(field)?.value ? 'is-valid' : '';
  }

  //Estructura de datos del registro de la empresa
  private initForm(): void {
    this.empresaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      nit: ['', [Validators.required, Validators.pattern(this.isNIT)]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: [''],
      celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
      correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      actividadPrincipal: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      horaMInicio: [''],
      horaMFin: [''],
      horaTInicio: [''],
      horaTFin: [''],
      domicilio: [''],
      servicios: ['', [Validators.required]],
      informacionAdicional: [''],
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

  //Se obtiene la referencia de pago Wompi
  referenciaPago() {
    let result = 'WP';
    const numeros = '0123456789';
    for (let i = 0; i < 6; i++) {
      result += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    console.log('Referencia de pago -> ', result)
    return result;
  }

  // referenciaPagoM() {
  //   let result = 'MP';
  //   const numeros = '0123456789';
  //   for (let i = 0; i < 6; i++) {
  //     result += numeros.charAt(Math.floor(Math.random() * numeros.length));
  //   }
  //   console.log('Referencia de pago -> ', result)
  //   return result;
  // }

  //Ver contraseña
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}