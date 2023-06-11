import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHello(): string {
    return this.configService.get('MESSAGE');
  }

  @Get('service-url')
  getServiceUrl(): string{
    console.log(`${process.cwd()}/envs/${process.env.NODE_ENV}.env`);
    return this.configService.get('SERVICE_URL');
  }

  @Get('db-info')
  getTest(): string{
    console.log(this.configService.get('logLevel'));
    console.log(this.configService.get('apiVersion'));
    return this.configService.get('dbInfo');
  }

  @Get('redis-info')
  getRedisInfo(): string{
    return `${this.configService.get('redis.host')}:${this.configService.get('redis.port')}`;
  }

  @Get('server-url')
  getServerUrl(): string{
    return this.configService.get('SERVER_URL');
  }
}
