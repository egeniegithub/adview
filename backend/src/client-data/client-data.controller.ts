import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientDataService } from './client-data.service';
import { CreateClientDatumDto } from './dto/create-client-datum.dto';
import { UpdateClientDatumDto } from './dto/update-client-datum.dto';

export class WebHookPayload  {
  account_custom_account: string
  billing_schedule_option_billing_schedule: string
  budget_number: number
  media_buyer_option_media_buyer: string
  name_text: string
  is_active ?: string
}

@Controller('client-data')
export class ClientDataController {
  constructor(private readonly clientDataService: ClientDataService) { }

  @Post()
  create(@Body() createClientDatumDto: CreateClientDatumDto) {
    return this.clientDataService.create(createClientDatumDto);
  }


  @Post('webhook-call/update')
  handleWebhook(@Body() payload: WebHookPayload) {
    return this.clientDataService.HandleWebhookUpdateUser(payload);
  }
  @Post('webhook-call/user-status-update')
  HandleWebhookUpdateUserStatus(@Body() payload: WebHookPayload) {
    return this.clientDataService.HandleWebhookUpdateUserStatus(payload);
  }
  

  @Post('webhook-call/create')
  HandleWebhookCreateUser(@Body() payload: WebHookPayload) {
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
