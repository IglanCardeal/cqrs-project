import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  get employeeQueueName(): string {
    return this.configService.get<string>('EMPLOYEE_QUEUE_NAME')
  }

  get webhooksQueueName(): number {
    return this.configService.get<number>('WEBHOOK_QUEUE_NAME')
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL')
  }

  get maxAttempts(): number {
    return this.configService.get<number>('MAX_ATTEMPTS')
  }
}
