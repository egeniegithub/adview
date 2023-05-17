// import { IsNotEmpty } from 'class-validator';
export class CreateGoogleAdsApiDto {
    // @IsNotEmpty()
    AccessToken: string;

    // @IsNotEmpty()
    RefreshToken: string;
}


export class ObtainAdsDataDto {
    accessToken:string
    customer_id:string
    email:string
    manager_id:string
}