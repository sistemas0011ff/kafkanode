import { PrismaClient } from "@prisma/client";
import {  Service, Token } from "typedi";

const PrismaClientToken = new Token<PrismaClient>();

@Service(PrismaClientToken)
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}


