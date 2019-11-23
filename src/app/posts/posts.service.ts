import {Post} from './post.model';
import {Application} from './application.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class PostsService {
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();
 private applications: Application[] = [];
 private applicationsUpdated = new Subject<Application[]>();

 constructor(private http: HttpClient, private router: Router) {}

 getPosts() {
   this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')

      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });

      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);

      })
 }

 getOtherPosts() {
   this.http.get<{message: string, posts: any}>('http://localhost:3000/api/findhouses')

      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });

      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);

      })
 }

 getPostsUpdateListener(){
   return this.postsUpdated.asObservable();
 }

 getPost(id: string){
   return this.http.get<{_id: string; title: string; content: string}>('http://localhost:3000/api/posts/' + id);
 }


 // to add a post
 addPost(title: string, content: string, image: File) { // method to add post with arguments
   const postData = new FormData();
   postData.append('title', title);
   postData.append('content', content);
   postData.append('image', image, title);

   this.http
    .post<{message: string, post: Post}> ('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      const post: Post = {
        id:responseData.post.id,
        title:title,
        content:content,
        imagePath: responseData.post.imagePath};

      this.posts.push(post); // push the new post into posts array
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
   });
 }

 updatePost(id: string, title: string, content: string, image: any){
   // tslint:disable-next-line: prefer-const
   const postData: Post = {id:id, title:title, content:content, imagePath: image};

   if (typeof(image) === 'object'){
     const postData = new FormData();
     postData.append ('title', title);
     postData.append ('content', content);
     postData.append ('image', image, title);

   } else {
     const postData: Post = {id:id, title:title, content:content, imagePath: image};

   }
   this.http.put('http://localhost:3000/api/posts/' + id, postData)
   .subscribe(response => {
     console.log(response);
     this.router.navigate(['/']);
 });
}

applyPost(postId: string, from: string, to: string) {
  const application: Application = {postId: postId, from: from, to: to};
  this.http.post('http://localhost:3000/api/applyhouse', application)
    .subscribe(response => {
      console.log(response);
    });
}

applyyPost(postId: string, from: string, to: string) { // method to add post with arguments
  const applicationData = new FormData();
  applicationData.append('postId', postId);
  applicationData.append('from', from);
  applicationData.append('to', to);


  this.http
   .post<{message: string, application: Application}> ('http://localhost:3000/api/applyhouse', applicationData)
   .subscribe((responseData) => {
     const application: Application = {
       postId: postId,
       from:from,
       to:to
       };

       this.applications.push(application); // push the new post into posts array
       this.applicationsUpdated.next([...this.applications]);
       this.router.navigate(['/']);

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

}
