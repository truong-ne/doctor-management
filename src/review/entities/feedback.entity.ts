import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { nanoid } from "nanoid";
import { Doctor } from "../../doctor/entities/doctor.entity";
import { Max, Min } from "class-validator";

@Entity({ name: 'DoctorRates' })
export class DoctorRates {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column()
    user_id: string

    @Column()
    @Min(0)
    @Max(5)
    rated: number

    @ManyToOne(() => Doctor, e => e.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor' })
    doctor: Doctor

    @Column({ nullable: true })
    feedback: string

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date
}