import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})

export class LoginComponent {
  constructor (public authService: AuthService) { }

  onLogin(form: NgForm) {
    if (form.invalid){
      return;
    }
    this.authService.login(form.value.email, form.value.password);
    console.log(form.value);
  }
  }
