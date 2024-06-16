import { Module, forwardRef } from '@nestjs/common'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeesModule } from './employees/employees.module'
import { ReportsModule } from './reports/reports.module'
import { BullModule } from '@nestjs/bull'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { AppConfig } from './app.config'

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
    BullModule.forRootAsync({
      imports: [forwardRef(() => AppModule)],
      inject: [AppConfig],
      useFactory: (appConfig: AppConfig) => ({
        redis: appConfig.redisUrl,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 1000,
          attempts: appConfig.maxAttempts,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: true,
    }),
    EmployeesModule,
    ReportsModule,
  ],
  providers: [AppService, AppConfig],
  exports: [AppConfig],
})
export class AppModule {}
