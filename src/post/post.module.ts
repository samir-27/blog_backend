import { Module } from '@nestjs/common';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule, AuthModule],
  exports: [TypeOrmModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
