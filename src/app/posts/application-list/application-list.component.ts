import { Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']

})

export class ApplicationListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;


  constructor(public postsService: PostsService, private authService: AuthService) {
  }
  ngOnInit() {
    this.postsService.getPosts(); // call the service to get posts
    this.postsSub = this.postsService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;

      });
    this.userIsAuthenticated = this.authService.getIsAuth();

    //this.authStatusSub = this.authService
     // .getAuthStatusListener()
    //  .subscribe(isAuthenticated =>{
     //   this.userIsAuthenticated = isAuthenticated;
     // });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    //this.authStatusSub.unsubscribe();
  }
}
