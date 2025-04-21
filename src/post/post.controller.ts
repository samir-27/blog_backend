import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Post as PostEntity } from './post.entity';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/JwtAuth';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPost(@Body() body: { userId: number; title: string; content: string }) {
    return this.postService.createPost(body);
  }
}