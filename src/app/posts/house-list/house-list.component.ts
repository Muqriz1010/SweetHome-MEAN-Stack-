import {Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
import {Subscription} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.css']
})

export class HouseListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;


  constructor(public postsService: PostsService, private authService: AuthService) {
  }
  ngOnInit() {
    this.postsService.getOtherPosts(); // call the service to get posts
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

  onApply(postId: string) {

  }



  ngOnDestroy(){
    this.postsSub.unsubscribe();
    //this.authStatusSub.unsubscribe();
  }
}
