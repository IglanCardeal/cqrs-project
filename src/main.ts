import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { existsSync, unlinkSync } from 'fs'
import { AppService } from './app.service'

async function bootstrap() {
  const dbFile = 'db.sqlite'
  if (existsSync(dbFile)) unlinkSync(dbFile)

  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  const service = app.get(AppService)
  await service.seed()

  await app.listen(3000)
}
bootstrap()
