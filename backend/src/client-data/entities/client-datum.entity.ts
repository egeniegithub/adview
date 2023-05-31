import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity()
export class ClientDatum {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email: string;

    @Column()
    client: string;

    @Column()
    total: string;

    @Column()
    monthly_budget: string;

    @Column()
    monthly_spent: string;

    @Column()
    remaining: string;

    @Column()
    google: string;

    @Column()
    bing: string;

    @Column()
    linkedin: string;

    @Column()
    facebook: string;

    @Column()
    instagram: string;

    @Column()
    status: string;

    @Column("longtext")
    google_client_linked_accounts: string;

    @Column("longtext")
    facebook_client_linked_accounts: string;

    @Column()
    g_token: string;

    @Column()
    g_refresh: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
