import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { nanoid } from "nanoid";
import { DoctorSchedules } from "../../schedule/entities/schedule.entity";
import { Min } from "class-validator";
import { Career } from "./career.entity";
import { Specialties } from "./specialty.entity";
import { EducationAndCertification } from "./educationAndCertification.entity";

@Entity({ name: 'Doctors' })
export class Doctor {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column()
    phone: string

    @Column({ default: true })
    gender: boolean

    @Column({ name: 'day_of_birth', nullable: true })
    dayOfBirth: string

    @Column()
    password: string

    @Column()
    email: string

    @Column({ default: false })
    isActive: boolean

    @Column({ name: 'full_name' })
    full_name: string

    @Column({ nullable: true })
    avatar: string

    @Column({ nullable: true })
    biography: string

    @Column({ name: 'account_balance', default: 0 })
    @Min(0)
    account_balance: number

    @Column({ default: 0 })
    @Min(0)
    fee_per_minutes: number

    @Column({ name: 'fixed_times', nullable: true })
    fixed_times: string

    @OneToMany(() => DoctorSchedules, e => e.doctor)
    schedules: DoctorSchedules[]

    @OneToMany(() => Career, c => c.doctor)
    careers: Career[]

    @OneToMany(() => Specialties, s => s.doctor)
    specialties: Specialties[]

    @OneToMany(() => EducationAndCertification, e => e.doctor)
    educationAndCertification: EducationAndCertification[]

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', name: 'update_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}