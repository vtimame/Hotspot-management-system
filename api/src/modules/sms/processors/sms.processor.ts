import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SmsService } from '../services/sms.service';
import { SmsPayloadDto } from '../dto/sms-payload.dto';

@Processor('sms')
export class SmsProcessor {
  constructor(private smsService: SmsService) {}

  @Process()
  async onNewJob(job: Job<SmsPayloadDto>) {
    await this.smsService.sendMessage(job.data);
  }
}
