import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            // Set the path to your .env file
            envFilePath: '../.env',
        }),
    ],
})
export class ConfigAppModule { }