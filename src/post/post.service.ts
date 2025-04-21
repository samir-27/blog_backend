import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  findAll(): Promise<Post[]> {
    return this.postRepo.find();
    //  return this.postRepo.find({ relations: ['user'] });if you want user info with each post
  }

  async createPost(body: { userId: number; title: string; content: string }): Promise<Post> {
    const { userId, title, content } = body;

    // Check if the user exists
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new post
    const post = this.postRepo.create({
      userId: user.id,
      title,
      content,
    });

    return this.postRepo.save(post);
  }

}
