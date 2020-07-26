import {Post} from './post.model';
import {Request} from './request.model';
import {Application} from './application.model';
import {Injectable} from '@angular/core';
import {User} from './user.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})

export class PostsService {
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();
 private applications: Application[] = [];
 private applicationsUpdated = new Subject<Application[]>();
 private requests: Request[] = [];
 private requestsUpdated = new Subject<Request[]>();
 private user: User[] = [];
 private usersUpdated = new Subject<User[]>();

 constructor(private http: HttpClient, private router: Router) {}

 getPosts() {
   this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')

      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            residencename: post.residencename,
            state: post.state,
            id: post._id,
            address: post.address,
            size: post.size,
            price: post.price,
            imagePath: post.imagePath
          };
        });

      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);

      })
 }

 getApplications() {
   this.http.get<{message: string, applications: any}>('http://localhost:3000/api/viewapplications')

      .pipe(map((applicationData) => {
        return applicationData.applications.map(application => {
          return {
            id: application._id,
            applicantname: application.applicant.email,
            residencename: application.residence.residencename,
            imagePath: application.residence.imagePath,
            from: application.stayfrom,
            to: application.stayto,
            status: application.status
          };
        });

      }))
      .subscribe(transformedApplications => {
        this.requests = transformedApplications;
        this.requestsUpdated.next([...this.requests]);

      })
 }

 getOtherPosts() {
   this.http.get<{message: string, posts: any}>('http://localhost:3000/api/findhouses')

      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            residencename: post.residencename,
            state: post.state,
            id: post._id,
            address: post.address,
            size: post.size,
            price: post.price,
            imagePath: post.imagePath
          };
        });

      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);

      })
 }

 getRequests() {
   this.http.get<{message: string, applications: any}>('http://localhost:3000/api/viewrequests')

      .pipe(map((applicationData) => {
        return applicationData.applications.map(application => {
          console.log(application)
          return {
            id: application._id,
            applicantname: application.applicant.email,
            residencename: application.residence.residencename,
            imagePath: application.residence.imagePath,
            from: application.stayfrom,
            to: application.stayto,
            status: application.status
          };
        });

      }))
      .subscribe(transformedRequests => {
        this.requests = transformedRequests;
        this.requestsUpdated.next([...this.requests]);
      })
 }

 getPostsUpdateListener(){
   return this.postsUpdated.asObservable();
 }

 getApplicationsUpdateListener(){
   return this.requestsUpdated.asObservable();
 }

 getRequestsUpdateListener(){
   return this.requestsUpdated.asObservable();
 }

 getPost(id: string){
   return this.http.get<{_id: string; residencename: string; state: string; address: string;
   size: string; price: string; imagePath: any;}>('http://localhost:3000/api/posts/' + id);
 }


 // to add a post
 addPost(residencename: string, state: string, address: string, size: string, price: string, image: File) { // method to add post with arguments
   const postData = new FormData();
   postData.append('residencename', residencename);
   postData.append('state', state);
   postData.append('address', address);
   postData.append('size', size);
   postData.append('price', price);
   postData.append('image', image, residencename);

   this.http
    .post<{message: string, post: Post}> ('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      const post: Post = {
        id:responseData.post.id,
        residencename: residencename,
        state: state,
        address: address,
        size: size,
        price: price,
        imagePath: responseData.post.imagePath};

      this.posts.push(post); // push the new post into posts array
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
   });
 }

 updatePost(id: string, residencename: string, state: string, address: string, size: string, price: string, image: any){
   // tslint:disable-next-line: prefer-const
   const postData: Post = {id: id, residencename: residencename, state: state, address: address, size: size, price: price, imagePath: image};

   if (typeof(image) === 'object'){
     const postData = new FormData();
     postData.append('residencename', residencename);
     postData.append('state', state);
     postData.append('address', address);
     postData.append('size', size);
     postData.append('price', price);
     postData.append('image', image, residencename);

   } else {
     const postData: Post = {id: id, residencename: residencename, state: state, address: address, size: size, price: price, imagePath: image};

   }
   this.http.put('http://localhost:3000/api/posts/' + id, postData)
   .subscribe(response => {
     console.log(response);
     this.router.navigate(['/']);
 });
}

applyPost(postId: string, from: string, to: string) {
  const application: Application = {postId: postId, from: from, to: to, status: null};
  this.http.post('http://localhost:3000/api/applyhouse', application)
    .subscribe(response => {
      console.log(response);
    });
}

deletePost(postId: string){
  this.http.delete('http://localhost:3000/api/posts/' + postId)
   .subscribe(() => {
     const updatedPosts = this.posts.filter(post => post.id !== postId)
     this.posts = updatedPosts;
     this.postsUpdated.next([...this.posts])

   });
}

 approveApplication(id: string){
   this.http.put('http://localhost:3000/api/view/' + id, status)
     .subscribe(response => {
       console.log(response);
       this.router.navigate(['/']);
     });
 }

 rejectApplication(id: string){
   this.http.put('http://localhost:3000/api/view/reject/' + id, status)
     .subscribe(response => {
       console.log(response);
       this.router.navigate(['/']);
     });
 }

}
