import { Module } from "@nestjs/common";
import { socketGateway } from "./socket.gateway";


@Module({
  imports:[],
  controllers:[],
  providers: [socketGateway],
})

export class GatewayModule {}



