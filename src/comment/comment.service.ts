import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment) private commentRepo: Repository<Comment>) {}

  getAll(postId: number): Promise<Comment[]> {
    return this.commentRepo.find({ where: { postId } });
  }

  async createComment(data: { comment: string; postId: number; userId: number }): Promise<Comment> {
    const comment = this.commentRepo.create(data);
    return this.commentRepo.save(comment);
  }

  async deleteComment(id: number, userId: number): Promise<{ message: string }> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) throw new ForbiddenException('You do not own this Comment');
    await this.commentRepo.delete(id);

    return { message: 'comment deleted successfully' };
  }
}
