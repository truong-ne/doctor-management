import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { nanoid } from "nanoid";
import { Doctor } from "src/doctor/entities/doctor.entity";

@Entity({ name: 'DoctorSchedules' })
export class DoctorSchedules {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time', name: 'start_time' })
    startTime: Date;

    @Column({ type: 'time', name: 'end_time' })
    endTime: Date;

    @ManyToOne(() => Doctor, e => e.schedules, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor' })
    doctor: Doctor;
}