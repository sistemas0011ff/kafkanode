import { DomainEvent } from "../../../../contexts/shared/domain/events/DomainEvent";

export interface DomainEventClass {
    EVENT_NAME: string;
    fromPrimitives(...args: any[]): DomainEvent;
  }
  