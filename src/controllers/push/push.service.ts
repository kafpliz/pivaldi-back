import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterPushDeviceDto } from './dto/create-push.dto';
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { PrismaService } from 'src/service/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class PushService {

  private readonly expo = new Expo();

  constructor(private prisma: PrismaService) { }

  async getAll() {
    try {
      const res = await this.prisma.notification.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 100
      })
      console.log(res);

      return res
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY)
    }
  }

  async register(data: RegisterPushDeviceDto) {
    
    try {
      if (!Expo.isExpoPushToken(data.expoPushToken)) {
        throw new HttpException("Invalid Expo push token", HttpStatus.BAD_REQUEST);
      }

      await this.prisma.pushDevice.upsert({
        where: { expoPushToken: data.expoPushToken },
        create: {
          expoPushToken: data.expoPushToken,
          platform: data.platform,
        },
        update: {
          platform: data.platform,
        },
      });

      return { ok: true }

    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY)
    }
  }

  async sendEverybody(payload: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }) {

    const rows = await this.prisma.pushDevice.findMany({
      select: { expoPushToken: true }
    })

    const tokens = rows.map((r) => r.expoPushToken);
    await this.prisma.notification.create({
      data: {
        ...payload,
        count: 0,
        data: payload.data === undefined
          ? Prisma.JsonNull
          : (payload.data as Prisma.InputJsonValue),
      }
    })
    return this.sendToTokens(tokens, payload)

  }

  async sendToTokens(tokens: string[], payload: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }) {
    const messages: ExpoPushMessage[] = tokens.filter((t) => Expo.isExpoPushToken(t)).map((to) => ({
      to,
      sound: "default",
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      priority: "high",
      channelId: "default",
    }))
    const chunks = this.expo.chunkPushNotifications(messages)
    const tickets: unknown[] = []
    for (const chunk of chunks) {
      tickets.push(...(await this.expo.sendPushNotificationsAsync(chunk)))
    }
    await this.prisma.notification.updateMany({
      where: {
        title: payload.title
      },
      data: {
        count: messages.length,
      }
    })
    return { sent: messages.length, tickets }
  }


}
