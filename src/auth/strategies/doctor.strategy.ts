import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"

export class DoctorStrategy extends PassportStrategy(Strategy, 'doctor') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.DOCTOR_SECRET,
        })
    }

    async validate(payload: any) {
        return {
            user: payload.sub,
            phone: payload.phone
        }
    }
}