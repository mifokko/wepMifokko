import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fecha, Oferta } from '../../model/oferta.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';

@Component({
  selector: 'app-ver-ofertas',
  templateUrl: './ver-ofertas.component.html',
  styleUrls: ['./ver-ofertas.component.scss']
})
export class VerOfertasComponent implements OnInit {

   
  oferta: Oferta[] = [];
  ofertas: Oferta[] = [];
  lista: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  years: string[] = [];
  uid = '';
  rol = '';
  cont = 0;
  anio = '';
  meses = '';
  mes = '';
  verSeleccion = '';
  date = new Date();

  verPagina(id: string){
    this.route.navigate(['/perfilOferta', id])
  }

  verEstadisticas(idOfert: string){
    this.route.navigate(['/estadisticas', this.mes, this.anio, this.uid, idOfert]);
  }

  constructor(private firestore: DataServices, private authService: AuthService, private route: Router) {
    const year = this.date.getFullYear();
    for(let i = 2020; i < year+1; i++){
      this.years[this.cont] = i.toString();
      this.cont += 1; 
    }
    this.authService.stateUser().subscribe( res => {
      if(res) {
        
        this.uid = res.uid;
        this.firestore.getDoc<Usuario>('Usuarios', this.uid).subscribe( res => {
          if(res) {
            this.rol = res.perfil;
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.oferta.length = 0;
  }

  capturar(){
    this.ofertas.length = 0;
    console.log(this.anio, this.meses);
    switch (this.meses) {
      case 'Enero':
        this.mes = '1';
        break;
      case 'Febrero':
        this.mes = '2';
        break;
      case 'Marzo':
        this.mes = '3';
        break;
      case 'Abril':
        this.mes = '4';
        break;
      case 'Mayo':
        this.mes = '5';
        break;
      case 'Junio':
        this.mes = '6';
        break;
      case 'Julio':
        this.mes = '7';
        break;
      case 'Agosto':
        this.mes = '8';
        break;
      case 'Septiembre':
        this.mes = '9';
        break;
      case 'Octubre':
        this.mes = '10';
        break;
      case 'Noviembre':
        this.mes = '11';
        break;
      case 'Diciembre':
        this.mes = '12';
        break;
      default:
        break;
    }
    console.log(this.anio, this.mes);
    this.getOfertas();
  }

  getOfertas() {let cont = 0;
    let path = '';
    if (this.rol == 'empresa'){
      path = 'Empresas';
    } else if(this.rol == 'independiente') {
      path = 'Independiente';
    } else {
      path = '';
    }
    
    
      if(this.meses.length !== 0 && this.anio.length !== 0){
        
        this.oferta.length = 0;
        this.firestore.getDocCol<Oferta>(path, this.uid, 'Ofertas').subscribe( res => {
          this.oferta = res;
          console.log(this.oferta);
          for (let index = 0; index < this.oferta.length; index++) {
            const fecha = this.oferta[index].fechaInicio.split('/');
            const fechaF = this.oferta[index].fechaFin.split('/');
            //console.log(fecha);
            //console.log(this.oferta[index].fechaInicio.month.toLocaleString() + ', ' + this.mes);
            if (fecha[1] === this.mes && fecha[2] === this.anio){
              //console.log(true);
              if(this.date.getDate() >= parseInt(fecha[0]) && this.date.getDate() <= parseInt(fechaF[0])){
                this.oferta[index].estado = 'Activo';
                //this.firestore.updateCamposDocCollDoc2(this.oferta[index].estado, path, this.uid, 'Ofertas', this.oferta[index].id , 'estado');
              }else{
                this.oferta[index].estado = 'Inactivo';
                //this.firestore.updateCamposDocCollDoc2(this.oferta[index].estado, path, this.uid, 'Ofertas', this.oferta[index].id , 'estado');
              }
              if(!this.ofertas.length){
                this.ofertas[cont] = this.oferta[index];
                cont++;
              }else{
                this.ofertas[cont++] = this.oferta[index];
              }
            }else {
              //console.log(false);
            }
            //console.log(this.ofertas);
          }
          if(!this.ofertas.length){
            alert('No se encontraron ofertas publicadas en ' + this.meses + '.');
            this.oferta.length = 0;
          }
        });
      }else{
        alert('Debe seleccionar año y mes, para buscar las ofertas');
        
      }
  }

  verPerfil(id: string){
    
  }

}
