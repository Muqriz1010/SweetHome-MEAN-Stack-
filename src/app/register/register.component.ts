import { Component, EventEmitter, Output, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '../_services';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    mode = 'register';

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public authenticationService: AuthenticationService,
        public userService: UserService,
        public alertService: AlertService

    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        if (this.mode === 'register'){
        this.userService.addUser(this.form.value.username, this.form.value.password,
          this.form.value.firstname, this.form.value.lastname);
        }

    }
}
