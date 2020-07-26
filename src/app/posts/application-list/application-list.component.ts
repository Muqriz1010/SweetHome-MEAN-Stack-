import { Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {Application} from '../application.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';
import {Request} from '../request.model';


@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']

})

export class ApplicationListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  applications: Application[] = [];
  requests: Request[] = [];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;


  constructor(public postsService: PostsService, private authService: AuthService) {
  }
  ngOnInit() {
    this.postsService.getRequests(); // call the service to get posts
    this.postsSub = this.postsService.getRequestsUpdateListener()
      .subscribe((requests: Request[]) => {
        this.requests = requests;

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

  onApprove(id: string) {
    this.postsService.approveApplication(id);
  }

  onReject(id: string) {
    this.postsService.rejectApplication(id);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    //this.authStatusSub.unsubscribe();
  }
}
