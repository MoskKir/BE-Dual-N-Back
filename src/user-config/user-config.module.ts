import { Module } from '@nestjs/common';
import { UserConfigController } from './user-config.controller';

@Module({
  controllers: [UserConfigController],
})
export class UserConfigModule {}
