import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private users: User[] = [];
    private UsersUpdated = new Subject<User[]>();

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getById(id: number) {
        return this.http.get(`/users/` + id);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    addUser(username: string, password: string, firstName: string, lastName: string,
    ) {
      const userData = new FormData();
      userData.append('username', username);
      userData.append('password', password);
      userData.append('firstName', firstName);
      userData.append('lastName', lastName);



      this.http
        .post<{ message: string, postId: string }>('http://localhost:3000/api/users', userData)
        .subscribe((responseData) => {
          const user: User = {id:responseData.postId ,username: username, password: password, firstName: firstName, lastName: lastName, token: "1"};
          const id = responseData.postId;
          user.id = id;
          this.users.push(user);
          this.UsersUpdated.next([...this.users]);
        });
    }

    update(user: User) {
        return this.http.put(`/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }
}
