import status from 'http-status';
import * as pkgJson from '../../../../package.json';
import { Request, Response } from 'express'
import { IBaseController } from "../../../contexts/shared/infrastructure/interfaces/IBaseController";
import { config } from '../../config'; 
import { Service, Token } from 'typedi';

export const HealthGetControllerToken = new Token<HealthGetController>("HealthGetController");

@Service(HealthGetControllerToken)
export default class HealthGetController  implements IBaseController{
    run = async (req: Request, res: Response) : Promise<void> =>{
        console.log("healt");
        const healt = {
            status : "ok",
            name: pkgJson.name,
            version: pkgJson.version,
            enviroment: config.get('env')
        }
        res.status(status.OK).send(healt);
    }

}