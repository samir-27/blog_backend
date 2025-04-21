import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './JwtAuth';

@Module({
  imports: [
    JwtModule.register({
      secret: 'samir27',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
