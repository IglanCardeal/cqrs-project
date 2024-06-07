import { EventBus } from '@nestjs/cqrs'
import { EntityBase } from './entity-base'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EntityEventsDispatcher {
  constructor(private readonly eventBus: EventBus) {}

  public async dispatchEvents(entity: EntityBase): Promise<void> {
    await Promise.all(
      entity.getEvents().map((event) => this.eventBus.publish(event)),
    )
    entity.clearEvents()
  }
}
