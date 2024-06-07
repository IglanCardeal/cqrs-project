import { Module } from '@nestjs/common'
import { EntityEventsDispatcher } from './entity-events-dispatcher'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule],
  exports: [EntityEventsDispatcher],
  providers: [EntityEventsDispatcher],
})
export class CommonModule {}
