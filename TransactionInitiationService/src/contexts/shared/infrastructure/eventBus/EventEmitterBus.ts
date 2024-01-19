import { EventEmitter } from 'events';
import { DomainEvent, DomainEventSubscriber } from '../../domain/events';

export class EventEmitterBus extends EventEmitter {
  constructor(subscribers: Array<DomainEventSubscriber<DomainEvent>>) {
    super();

    this.registerSubscribers(subscribers);
  }

  registerSubscribers(subscribers?: (DomainEventSubscriber<DomainEvent> | (() => void))[]): void {
    subscribers?.forEach((subscriber) => {
      if (typeof subscriber === 'function') {
        subscriber(); // Ejecutar la función anónima
      } else {
        this.registerSubscriber(subscriber as DomainEventSubscriber<DomainEvent>);
      }
    });
  }

  private registerSubscriber(subscriber: DomainEventSubscriber<DomainEvent>): void {
    subscriber.subscribedTo().forEach((event) => {
      this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
    });
  }

  publish(events: DomainEvent[]): void {
    events.forEach((event) => {
      this.emit(event.eventName, event)
    });
  }
}
