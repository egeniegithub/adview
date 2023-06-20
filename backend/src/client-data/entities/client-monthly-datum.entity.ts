import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ClientMonthlyDatum {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email: string;

    @Column()
    client: string;

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

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
