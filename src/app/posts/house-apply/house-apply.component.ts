import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Application } from '../application.model';

@Component({
  selector:'house-apply',
  templateUrl:'./house-apply.component.html',
  styleUrls: ['./house-apply.component.css']
})

export class HouseApplyComponent implements OnInit {
  post: Post;
  application: Application;
  form: FormGroup;
  imagePreview: string;
  private mode = 'apply';
  private postId: string;

  // connect to service
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
    ) {}

  ngOnInit() {
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
          this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: null};
          this.postId = this.post.id;
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
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
      console.log(this.form.value.title);
    }
    this.form.reset();
  }
}
