// import { IsNotEmpty } from 'class-validator';
export class CreateGoogleAdsApiDto {
    // @IsNotEmpty()
    AccessToken: string;

    // @IsNotEmpty()
    RefreshToken: string;
}


export class ObtainAdsDataDto {
    accessToken:string
    customer_ids:string
    email:string
    manager_id:string
}