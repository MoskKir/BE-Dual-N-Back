import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsitesService } from './websites.service';
import { WebsitesController } from './websites.controller';
import { User } from '../models/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [WebsitesService],
  controllers: [WebsitesController],
  exports: [WebsitesService],
})
export class WebsitesModule {}
