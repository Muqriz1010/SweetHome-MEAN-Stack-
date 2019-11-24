import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Application } from '../application.model';
import {Subscription} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector:'house-apply',
  templateUrl:'./house-apply.component.html',
  styleUrls: ['./house-apply.component.css']
})

export class HouseApplyComponent implements OnInit {
  post: Post;
  posts: Post[] = [];
  application: Application;
  form: FormGroup;
  imagePreview: string;
  private mode = 'apply';
  private postId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  // connect to service
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.postsService.getPosts(); // call the service to get posts
    this.postsSub = this.postsService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;

      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.form = new FormGroup({
      from: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      to: new FormControl(null, {validators: [Validators.required]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap ) => {
      if (paramMap.has('postId')) {
        this.mode = 'apply';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, residencename: postData.residencename, state: postData.state,
            address: postData.address, size: postData.size, price: postData.price, imagePath: postData.imagePath};
          this.form.setValue({residencename: this.post.residencename, state: this.post.state,
          address: this.post.address, size: this.post.size, price: this.post.price, image: this.post.imagePath});
          console.log(this.post.id);
        });
      } else {
        this.mode = '';
        this.postId = null;
      }
    }
    );
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onApplyPost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'apply'){
      this.postsService.applyPost(this.postId, this.form.value.from, this.form.value.to);
      console.log(this.postId + this.form.value.from + this.form.value.to);

    } else {
      this.postsService.updatePost(this.postId,this.form.value.residencename, this.form.value.state,
        this.form.value.address, this.form.value.size, this.form.value.price, this.form.value.image);
      console.log(this.form.value.residencename);
    }
    this.form.reset();
  }
}
