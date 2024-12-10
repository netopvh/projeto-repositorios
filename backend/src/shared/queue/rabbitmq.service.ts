// src/shared/queue/rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly maxRetries = 10;
  private readonly retryInterval = 5000;

  async connectWithRetry(url: string, retries = 0): Promise<void> {
    try {
      console.log('Tentando conectar ao RabbitMQ...');
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('Conexão com o RabbitMQ estabelecida com sucesso.');
    } catch (error) {
      if (retries < this.maxRetries) {
        console.warn(`Falha na conexão ao RabbitMQ. Tentativa ${retries + 1} de ${this.maxRetries}`);
        await this.delay(this.retryInterval);
        return this.connectWithRetry(url, retries + 1);
      }
      console.error('Falha ao conectar ao RabbitMQ após várias tentativas:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendToQueue(queue: string, message: any) {
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consume(queue: string, onMessage: (msg: amqp.ConsumeMessage) => void) {
    await this.channel.assertQueue(queue);
    this.channel.consume(queue, (msg) => {
      onMessage(msg);
      this.channel.ack(msg);
    });
  }
}
