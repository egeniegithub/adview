import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
} from 'typeorm';
@Entity()
@Unique(["email"])
export class ClientDatum {
    @PrimaryGeneratedColumn('increment')
    id: number;

    // email is used as bubble_id cuz actual email is not provided by api  
    @Column({ name: "email" })
    email: string

    @Column()
    client: string;

    @Column({ default: '0' })
    total: string;

    @Column({ default: '0' })
    monthly_budget: string;

    @Column({ default: '' })
    frequency: string;

    @Column()
    buyer: string;

    // monthly_spent is calculating on frontend = sum of all platform
    @Column({ default: '0' })
    monthly_spent: string;

    @Column({ default: '0' })
    remaining: string;

    @Column({ default: '0' })
    google: string;

    @Column({ default: '0' })
    bing: string;

    @Column({ default: '0' })
    linkedin: string;

    @Column({ default: '0' })
    facebook: string;

    @Column({ default: '0' })
    instagram: string;

    @Column({ default: true })
    status: string;

    @Column({ type: 'longtext', default: '' })
    google_client_linked_accounts: string;

    @Column({ type: 'longtext', default: '' })
    facebook_client_linked_accounts: string;

    @Column({ type: 'longtext', default: '' })
    linkedin_client_linked_accounts: string;
    @Column({ type: 'longtext', default: '' })
    bing_client_linked_accounts: string;

    @Column({ type: 'longtext', default: '' })
    meta_refresh_token: string;

    @Column({ type: 'longtext', default: '' })
    bing_refresh_token: string;

    @Column({ type: 'longtext', default: '' })
    linkedin_refresh_token: string;

    @Column({ type: 'longtext', default: '' })
    google_refresh_token: string;

    @Column({  default: '0' })
    is_bing_login: string;

    @Column({  default: '0' })
    is_meta_login: string;

    @Column({  default: '0' })
    is_linkedin_login: string;

    @Column({ default: '0' })
    is_google_login: string;

    @Column({ default: '' })
    g_token: string;

    @Column({ default: '' })
    g_refresh: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}


