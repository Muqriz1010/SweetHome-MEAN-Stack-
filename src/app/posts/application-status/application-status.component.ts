import { Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';
import {Application} from '../application.model';
import {Request} from '../request.model';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.css']

})

export class ApplicationStatusComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  applications: Application[] = [];
  requests: Request[] = [];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private applicationsSub: Subscription;
  private authStatusSub: Subscription;


  constructor(public postsService: PostsService, private authService: AuthService) {
  }
  ngOnInit() {
    this.postsService.getApplications(); // call the service to get posts
    this.applicationsSub = this.postsService.getApplicationsUpdateListener()
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

  ngOnDestroy(){
    this.applicationsSub.unsubscribe();
    //this.authStatusSub.unsubscribe();
  }
}
