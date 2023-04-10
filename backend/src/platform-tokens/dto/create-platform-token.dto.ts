export class CreatePlatformTokenDto {
    id: number;
    email: string;
    g_token: string;
    g_refresh: string;
    b_token: string;
    b_refresh: string;
    li_token: string;
    li_refresh: string;
    m_token: string;
    m_refresh: string;
    created_at: Date;
    updated_at: Date;
}
