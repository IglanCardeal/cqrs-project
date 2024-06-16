import { Module } from '@nestjs/common'
import { AppConfigService } from './app-config.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_URL: Joi.string().required(),
        MAX_ATTEMPTS: Joi.number().required(),
        MAX_ATTEMPTS_DELAY: Joi.number().default(1_000),
        EMPLOYEE_QUEUE_NAME: Joi.string().required(),
        WEBHOOK_QUEUE_NAME: Joi.string().required(),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
