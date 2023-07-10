import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientDataService } from './client-data.service';
import { CreateClientDatumDto } from './dto/create-client-datum.dto';
import { UpdateClientDatumDto } from './dto/update-client-datum.dto';

@Controller('client-data')
export class ClientDataController {
  constructor(private readonly clientDataService: ClientDataService) { }

  @Post()
  create(@Body() createClientDatumDto: CreateClientDatumDto) {
    return this.clientDataService.create(createClientDatumDto);
  }

  @Post('/syncDb')
  SyncWithBubble(@Body() bubbleData: Array<any>) {
    return this.clientDataService.SyncWithBubble(bubbleData);
  }

  @Post('webhook-call/update')
  handleWebhook(@Body() payload: any) {
    return this.clientDataService.HandleWebhookUpdateUser(payload);
  }

  @Post('webhook-call/create')
  HandleWebhookCreateUser(@Body() payload: any) {
    return this.clientDataService.HandleWebhookCreateUser(payload);
  }
  
  // @Get('compute')
  // ComputeData() {
  //   return this.clientDataService.ComputeMonthlyData();
  // }

  @Get('get-monthly-clients-data')
  GetMonthlyClientsData() {
    return this.clientDataService.GetMonthlyClientsData();
  }

  @Get('insert-users-from-bubble')
  InsertClientData() {
    return this.clientDataService.InsertClientData();
  }
  
  @Get()
  findAll() {
    return this.clientDataService.findAll();
  }

  @Get('/actives')
  findsActives() {
    return this.clientDataService.findsActives();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientDataService.findOne(+id);
  }


  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDatumDto: UpdateClientDatumDto
  ) {
    return this.clientDataService.update(+id, updateClientDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientDataService.remove(+id);
  }
}
