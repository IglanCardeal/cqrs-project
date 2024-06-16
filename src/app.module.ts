import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeesModule } from './employees/employees.module'
import { ReportsModule } from './reports/reports.module'
import { BullModule } from '@nestjs/bull'

import { AppConfigService } from './app-config/app-config.service'
import { AppConfigModule } from './app-config/app-config.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    AppConfigModule,
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
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
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
