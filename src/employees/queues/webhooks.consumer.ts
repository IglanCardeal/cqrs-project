import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

@Processor('webhooks')
export class WebhooksConsumer {
  @Process('process-employee-payment')
  async processEmployeePayment(job: Job<any>) {
    // eslint-disable-next-line no-console
    console.log(job.data)
  }
}
