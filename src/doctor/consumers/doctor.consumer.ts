import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager";
import { RabbitPayload, RabbitRPC } from "@golevelup/nestjs-rabbitmq"
import { Inject, Injectable } from "@nestjs/common";
import { DoctorService } from "../services/doctor.service";

@Injectable()
export class DoctorConsumer {
    constructor(
        private readonly doctorService: DoctorService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @RabbitRPC({
        exchange: 'healthline.doctor.information',
        routingKey: 'doctor',
        queue: 'doctor',
    })
    async findAllDoctor(@RabbitPayload() uids: string[]): Promise<any> {
        return this.doctorService.findAllDoctorInfo(uids)
    }
}