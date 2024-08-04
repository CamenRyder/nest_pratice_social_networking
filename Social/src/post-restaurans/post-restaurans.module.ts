import { Module } from '@nestjs/common';
import { PostRestauransService } from './post-restaurans.service';
import { PostRestauransController } from './post-restaurans.controller';

@Module({
  controllers: [PostRestauransController],
  providers: [PostRestauransService],
})
export class PostRestauransModule {}
