import { IsNotEmpty, IsString } from "class-validator";

export class UpdateImageProfile {
    @IsNotEmpty()
    avatar: string
}