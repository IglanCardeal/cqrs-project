export class EntityBase {
  #events: unknown[] = []

  addEvent(event: unknown) {
    this.#events.push(event)
  }

  clearEvents() {
    this.#events = []
  }

  getEvents() {
    return structuredClone(this.#events)
  }
}
