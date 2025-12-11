import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";


@WebSocketGateway(80, { namespace: '/socket',
    cors:{
        origin:"*"
    } 
})

export class socketGateway {
constructor(){}


@SubscribeMessage('events')
handleEvent(@MessageBody() data: string) {
  console.log(data)
}


}