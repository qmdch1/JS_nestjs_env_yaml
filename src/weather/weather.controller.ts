import { Controller, Get } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';

@Controller('weather')
export class WeatherController {
    constructor(private configService: ConfigService){}

    @Get()
    public getWeather(): string{
        const apiUrl = this.configService.get('WEATHER_API_URL');
        const apiKey = this.configService.get('WEATHER_API_KEY');

        return this.callWheatherApi(apiUrl, apiKey);
    }

    private callWheatherApi(apiUrl: string, apiKey: string){
        console.log(apiUrl);
        console.log(apiKey);
        return '맑음';
    }
}
