import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.password || !data.email || !data.name) {
      throw new Error('All fields are required');
    }

    const EmailAlreadyExist = await this.userRepo.findOne({ where: { email: data.email } });

    if (EmailAlreadyExist) {
      throw new Error('Email already Exist');
    }

    const NameAlreadyExist = await this.userRepo.findOne({ where: { name: data.name } });
    if (NameAlreadyExist) {
      throw new Error('Username already Exist');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    return this.userRepo.save(user);
  }

  async login(data: Partial<User>): Promise<{ message: string; token: string; user: User }> {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const payload = { email: user.email, sub: user.id };
    const token = jwt.sign(payload, 'samir27', { expiresIn: '1h' });

    return { message: 'Login successful', token, user };
  }

  async updateUserById(id: number, data: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }
    if (data.profileImage) {
      user.profileImage = data.profileImage;
    }
    if (data.Bio) {
      user.Bio = data.Bio;
    }
    return this.userRepo.save(user);
  }
}
