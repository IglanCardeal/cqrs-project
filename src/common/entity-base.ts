import { AfterLoad } from 'typeorm'

export class EntityBase {
  #events: unknown[] = []

  addEvent(event: unknown) {
    this.#events.push(event)
  }

  clearEvents() {
    this.#events = []
  }

  getEvents() {
    return [...this.#events]
  }

  @AfterLoad()
  clearEventsAfterLoad() {
    this.clearEvents()
  }
}
