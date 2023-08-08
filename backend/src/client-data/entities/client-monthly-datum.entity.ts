import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { ClientDatum } from './client-datum.entity';

@Entity()
export class ClientMonthlyDatum {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email: string;

    @Column()
    frequency: string;

    @Column()
    buyer: string;

    @Column()
    monthly_budget: string;

    @Column()
    monthly_spent: string;

    @Column()
    remaining: string;

    @Column()
    month: string;

    @Column()
    year: string;

    @ManyToOne(() => ClientDatum, (clientDatum) => clientDatum.monthly_datum)
    user: ClientDatum

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
