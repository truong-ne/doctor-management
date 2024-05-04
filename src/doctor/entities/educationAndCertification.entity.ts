import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { nanoid } from "nanoid";
import { Doctor } from "../../doctor/entities/doctor.entity";

@Entity({ name: 'EducationAndCertification' })
export class EducationAndCertification {
    constructor() {
        this.id = nanoid()
    }

    @PrimaryColumn()
    id: string

    @Column({ name: 'type_of_education_and_experience' })
    typeOfEducationAndExperience: string

    @Column({ name: 'degree_of_education' })
    degreeOfEducation: string

    @Column()
    institution: string

    @Column({ name: 'specialty_by_diploma' })
    specialtyByDiploma: string
    
    @Column()
    address: string
    
    @Column({ name: 'diploma_number_and_series' })
    diplomaNumberAndSeries: string

    @Column({ name: 'date_of_receipt_of_diploma' })
    dateOfReceiptOfDiploma: string

    @ManyToOne(() => Doctor, e => e.educationAndCertification, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor' })
    doctor: Doctor
}