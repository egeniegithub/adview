import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlatformToken {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ nullable: false })
    email: string;

    @Column()
    g_token: string;

    @Column()
    g_refresh: string;

    @Column()
    b_token: string;

    @Column()
    b_refresh: string;

    @Column()
    li_token: string;

    @Column()
    li_refresh: string;

    @Column()
    m_token: string;

    @Column()
    m_refresh: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}