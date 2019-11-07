import { Component, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {  PostsService } from '../posts.service';
import {Subscription} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']

})

export class PostListComponent implements OnInit {
  posts: Post[] = [];
  userIsAuthenticated = false;
  private postsSub:Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub= this.postsService.getPostsUpdatedListener()
    .subscribe((posts:Post[])=> {
      this.posts=posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })
  }

onDelete(postId: string) {
  this.postsService.deletePost(postId);
}

   ngOnDestroy() {
    this.postsSub.unsubscribe;
  }
}
 /* posts = [
   {title: 'First Post' , content: 'This is the first post\'s content'},
    {title: 'Second Post', content: 'This is the second post\'s content'},
    {title: 'Third Post', content: 'This is the third post\'s content'}
  ];
 @Input() posts: Post[];*/
