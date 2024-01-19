import { Service, Token } from 'typedi';
import {
  DomainEvent,
  DomainEventSubscriber,
  EventBus,
} from '../../../domain/events';
import { DomainEventMapping } from '../DomainEventMapping';
import { EventEmitterBus } from '../EventEmitterBus';

 
export const EventBusToken = new Token<EventBus>();
@Service(EventBusToken)
export class InMemoryAsyncEventBus implements EventBus {
  private bus: EventEmitterBus;

  constructor(subscribers: Array<DomainEventSubscriber<DomainEvent>>) {
    this.bus = new EventEmitterBus(subscribers);
  }
 
  async start(): Promise<void> {}

  async publish(events: DomainEvent[]): Promise<void> {
    this.bus.publish(events);
  }

  addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): void {
    this.bus.registerSubscribers(subscribers);
  }

  setDomainEventMapping(domainEventMapping: DomainEventMapping): void {}
}
