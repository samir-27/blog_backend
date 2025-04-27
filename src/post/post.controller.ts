import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Post as PostEntity } from './post.entity';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<PostEntity | null> {
    return this.postService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  createPost(
    @Body() body: { title: string; content: string; category: string; imageUrl: string },
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.postService.createPost({ ...body, userId });
  }
  

  @Put('/update/:id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() body: Partial<PostEntity>, @Req() req) {
    const userId = req.user.id;
    console.log(userId);
    return this.postService.updatePost(Number(id), body, userId);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;

    return this.postService.deletePost(Number(id), userId);
  }
}
