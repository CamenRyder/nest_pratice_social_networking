import { Module } from '@nestjs/common';
import { ReactPostService } from './react-post.service';
import { ReactPostController } from './react-post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule] ,  
  controllers: [ReactPostController],
  providers: [ReactPostService],
})
export class ReactPostModule {}
