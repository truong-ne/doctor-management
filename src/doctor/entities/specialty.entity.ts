import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { nanoid } from "nanoid";
import { Doctor } from "../../doctor/entities/doctor.entity";
import { Specialty } from "../../config/enum.constants"

@Entity({ name: 'Specialty' })
export class Specialties {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column({ type: 'enum', enum: Specialty })
    specialty: string

    @Column({ name: 'level_of_specialty' })
    levelOfSpecialty: string

    @Column()
    image: string

    @ManyToOne(() => Doctor, e => e.specialties, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor' })
    doctor: Doctor
}