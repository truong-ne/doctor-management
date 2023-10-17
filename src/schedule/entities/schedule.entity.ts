import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { nanoid } from "nanoid";
import { Doctor } from "../../doctor/entities/doctor.entity";

@Entity({ name: 'DoctorSchedules' })
export class DoctorSchedules {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column()
    day: number

    @Column()
    month: number

    @Column()
    year: number

    @Column({ name: 'working_times', nullable: true, default: null })
    workingTimes: string

    @ManyToOne(() => Doctor, e => e.schedules, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor' })
    doctor: Doctor
}