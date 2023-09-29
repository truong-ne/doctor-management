import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Observable, from, map } from "rxjs";
import { Server } from 'ws'

@WebSocketGateway(8080)
export class ScheduleGateway {
    @WebSocketServer()
    server: Server

    @SubscribeMessage('events')
    onEvent(client: any, data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })))
    }
}