import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']

})

export class SignupComponent {
  constructor (public authService: AuthService) {

  }

  onSignup(form: NgForm) {
    if (form.invalid){
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
    console.log(form.value);
  }
}
