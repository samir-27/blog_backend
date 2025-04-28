import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepo.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<Post | null> {
    return this.postRepo.findOne({ where: { id } });
  }

  async createPost(body: {
    userId: number;
    title: string;
    content: string;
    category: string;
    imageUrl: string;
  }): Promise<Post> {
    const { userId, title, content, category, imageUrl } = body;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.postRepo.create({
      userId: user.id,
      title,
      content,
      category,
      imageUrl,
    });

    return this.postRepo.save(post);
  }

  async updatePost(id: number, data: Partial<Post>, userId: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('You do not own this post');
    }

    if (data.title !== undefined) post.title = data.title;
    if (data.content !== undefined) post.content = data.content;

    return this.postRepo.save(post);
  }

  async deletePost(id: number, userId: number): Promise<{ message: string }> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('You do not own this post');

    await this.postRepo.delete(id);

    return { message: 'Post deleted successfully' };
  }
}
