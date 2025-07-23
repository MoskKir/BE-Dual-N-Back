import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserConfigController {
  constructor() {}

  @Get('config')
  getStrings(): { items: string[] } {
    return { items: ['one', 'two', 'three'] };
  }
}
