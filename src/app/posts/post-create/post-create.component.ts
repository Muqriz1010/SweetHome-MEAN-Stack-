import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';


@Component({
  selector:'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  // connect to service
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.form = new FormGroup({
      residencename: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      state: new FormControl(null, {validators: [Validators.required]}),
      address: new FormControl(null, {validators: [Validators.required]}),
      size: new FormControl(null, {validators: [Validators.required]}),
      price: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap ) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, residencename: postData.residencename, state: postData.state,
            address: postData.address, size: postData.size, price: postData.price, imagePath: null};
          this.form.setValue({residencename: this.post.residencename, state: this.post.state,
          address: this.post.address, size: this.post.size, price: this.post.price, image: this.post.imagePath});
          console.log(this.post.id);
        });
      } else {
        this.mode = 'create';
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

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create'){
      this.postsService.addPost(this.form.value.residencename, this.form.value.state,
        this.form.value.address, this.form.value.size, this.form.value.price, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId,this.form.value.residencename, this.form.value.state,
        this.form.value.address, this.form.value.size, this.form.value.price, this.form.value.image);
      console.log(this.form.value.residencename);
    }
    this.form.reset();
  }
}
  /*
  @Output() postCreated = new EventEmitter<Post>();


  onAddPost(form: NgForm) {
if (form.invalid) {
  return;
}
const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
this.postCreated.emit(post);
    }*/
