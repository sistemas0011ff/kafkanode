import { Inject, Service, Token } from "typedi";
import { ICommandHandler } from "../../../../contexts/shared/cqrs/ICommandHandler";
import { ICommandResult } from "../../../../contexts/shared/cqrs/ICommandResult";
import { GQConfirmation } from "../../../../contexts/shared/application/response/GQConfirmation";
import { ICreateTransactionUseCase } from "../interfaces/ICreateTransactionUseCase";
import { CreateTransactionDTO } from "../dto/CreateTransactionDTO";
import { CreateTransactionCommandHandlerToken } from "../commands/CreateTransactionCommandHandler";
import { CreateTransactionCommand } from "../commands/CreateTransactionCommand";

const ICreateTransactionUseCaseToken = new Token<ICreateTransactionUseCase>();  

@Service(ICreateTransactionUseCaseToken)
export class CreateTransactionUseCase implements ICreateTransactionUseCase {

    public constructor(
        @Inject(CreateTransactionCommandHandlerToken) 
        private commandHandler: ICommandHandler<CreateTransactionCommand, ICommandResult>
    ) {}
    
    async execute(inputCreate: CreateTransactionDTO): Promise<GQConfirmation> {
        const command = new CreateTransactionCommand(inputCreate); 
        const commandResult = await this.commandHandler.handle(command);
        if (!commandResult.result) {
            throw new Error(commandResult.value.message);
        }
        return commandResult.value;
    }
}
