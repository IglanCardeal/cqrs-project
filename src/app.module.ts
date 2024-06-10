import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeesModule } from './employees/employees.module'
import { ReportsModule } from './reports/reports.module'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    BullModule.forRoot({
      redis: 'redis://localhost:6379',
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 1000,
        attempts: 3,
        backoff: {
          type: 'exponetial',
          delay: 1000,
        },
      },
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
  providers: [AppService],
})
export class AppModule {}
