// import { IsNotEmpty } from 'class-validator';
export class CreateGoogleAdsApiDto {
    // @IsNotEmpty()
    AccessToken: string;

    // @IsNotEmpty()
    RefreshToken: string;
}


export class ObtainAdsDataDto {
    customer_ids:string
    email:string
    manager_id:string
    refresh_token : string
    access_token : string
    customers ?: []
}