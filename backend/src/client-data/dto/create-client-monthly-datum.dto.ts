export class CreateClientMonthlyDatumDto {
    id: number;
    email: string;
    client: string;
    total: string;
    monthly_budget: string;
    monthly_spent: string;
    remaining: string;
    month : string;
    year : string;
    created_at: Date;
    updated_at: Date;
}