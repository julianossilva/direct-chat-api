import { Request, Response } from "express";
import { Session } from "../../application/session-manager";
import { User } from "../../domain/model/user";

export class SessionManagerExpress implements Session {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }
    
    close(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    isStarted(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    start(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
