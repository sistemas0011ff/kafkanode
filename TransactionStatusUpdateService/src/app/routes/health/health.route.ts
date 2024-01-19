import { Router } from "express";
import { HealthGetControllerToken } from "../../../app/controllers/health/HealthGetController";
// import { HealthGetControllerToken } from "../../../app/tokens/HealthGetControllerToken";
import Container from "typedi";

export const register = (router: Router) : void => {
    const controller = Container.get(HealthGetControllerToken);
    router.get(
        '/health',
        controller.run
    )
}