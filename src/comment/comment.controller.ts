import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/post/:id')
  getAllComments(@Param('id') id: string): Promise<Comment[]> {
    return this.commentService.getAll(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post/:id/create')
  createComment(
    @Param('id') id: string,
    @Body() body: Partial<Comment>,
    @Req() req,
  ): Promise<Comment> {
    if (!body.comment) {
      throw new BadRequestException('Comment is required');
    }
    const userId = req.user.id;
    console.log('userid', userId);
    console.log('id', id);

    return this.commentService.createComment({
      comment: body.comment,
      postId: Number(id),
      userId,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/delete')
  deleteComment(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.commentService.deleteComment(Number(id), userId);
  }
}
