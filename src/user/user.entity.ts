import { Post } from 'src/post/post.entity';
import { Comment } from 'src/comment/comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  Bio?: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
