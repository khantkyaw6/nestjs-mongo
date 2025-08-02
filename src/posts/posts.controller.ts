import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/CreatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  index() {
    return this.postsService.findPosts();
  }

  @Get()
  show() {}

  @Post()
  @UsePipes(new ValidationPipe())
  store(@Body() createPostDto: CreatePostDto) {
    console.log({ createPostDto });
    return this.postsService.createPost(createPostDto);
  }

  @Patch()
  update() {}

  @Delete()
  delete() {}
}
