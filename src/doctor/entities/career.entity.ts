import { nanoid } from "nanoid"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Doctor } from "./doctor.entity"

@Entity({ name: 'Careers' })
export class Career {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column({ name: 'medical_institute' })
    medicalInstitute: string

    @Column()
    position: string

    @Column({ name: 'period_start' })
    periodStart: string

    @Column({ name: 'period_end' })
    periodEnd: string

    @ManyToOne(() => Doctor, e => e.careers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor' })
    doctor: Doctor
}