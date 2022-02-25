import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { HeaderModule } from './shared/components/header/header.module';
import { RegisterModule } from './shared/components/register/register.module';
import { LoginComponent } from './shared/components/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RegisterIndependienteModule } from './shared/components/register-independiente/register-independiente.module';
import { RegisterUsuarioGeneralModule } from './shared/components/register-usuario-general/register-usuario-general.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlanEmpresaComponent } from './shared/components/plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from './shared/components/plan-independiente/plan-independiente.component';

import { FormsModule } from '@angular/forms';
import { UneteComponent } from './shared/components/unete/unete.component';
import { RecuperarContrasenaComponent } from './shared/components/recuperar-contrasena/recuperar-contrasena.component';
import { WhatsappComponent } from './shared/components/whatsapp/whatsapp.component';
import { WhatsappModule } from './shared/components/whatsapp/whatsapp.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PlanEmpresaComponent,
    PlanIndependienteComponent,
    UneteComponent,
    RecuperarContrasenaComponent,
    WhatsappComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    RegisterModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RegisterIndependienteModule,
    RegisterUsuarioGeneralModule,
    BrowserAnimationsModule,
    FormsModule,
    WhatsappModule
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
