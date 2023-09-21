import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Token } from "../../auth/entities/token.entity";
import { nanoid } from "nanoid";
import { float } from "@elastic/elasticsearch/lib/api/types";
import { Specialty } from "../../config/enum.constants";

@Entity({ name: 'Doctor' })
export class Doctor {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column()
    phone: string

    @Column({ type: 'enum', enum: Specialty })
    specialty: string

    @Column()
    password: string

    @Column({ nullable: true })
    email: string

    @Column({ name: 'full_name' })
    full_name: string

    @Column({ nullable: true })
    avatar: string

    @OneToMany(() => Token, token => token.user)
    token: Token

    @Column({ name: 'account_balance', default: 0 })
    accout_balance: float

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', name: 'update_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}