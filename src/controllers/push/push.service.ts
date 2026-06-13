import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterPushDeviceDto } from './dto/create-push.dto';
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { PrismaService } from 'src/service/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { domainForImg, folderPublicName } from 'src/shared/utils/constants';

@Injectable()
export class PushService {

  private readonly expo = new Expo();

  constructor(private prisma: PrismaService) { }

  async getAll(page: number = 1) {
    const limit = 25;
  try {
      const [res, totalCount] = await Promise.all([
      this.prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: page == 1 ? 0 : limit * (page - 1)
      }),
      this.prisma.notification.count() // Get total count
    ]);

      let hasNext =  (page * limit) < totalCount;

      return {blog: res.map((item) => {
        const data = (item.data ?? {}) as unknown as {
          images?: string[];
          video?: string;
          videoOrientation?: 'horizontal' | 'vertical';
        };

        const images = Array.isArray(data.images)
          ? data.images.map((name) => new URL(`${folderPublicName}${name}`, domainForImg).toString())
          : undefined;
        const video = data.video
          ? new URL(`${folderPublicName}${data.video}`, domainForImg).toString()
          : undefined;

        return { ...item, images, video, videoOrientation: data.videoOrientation };
      }), details: {
        hasNext: hasNext
      }}

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

    try {
      const rows = await this.prisma.pushDevice.findMany({
        select: { expoPushToken: true }
      })

      const tokens = rows.map((r) => r.expoPushToken);
      await this.prisma.notification.create({
        data: {
          title: payload.title,
          body: payload.body,
          count: 0,
          data: payload.data === undefined
            ? Prisma.JsonNull
            : (payload.data as Prisma.InputJsonValue),
        }
      })
      return await this.sendToTokens(tokens, payload)
    } catch (error: any) {
      console.error('sendEverybody error:', error);
      throw new HttpException(error?.message ?? 'Ошибка при отправке уведомления', HttpStatus.BAD_GATEWAY)
    }
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

    // Нет зарегистрированных устройств — уведомление сохранено, отправлять некому.
    if (messages.length === 0) {
      return { sent: 0, tickets: [] as unknown[] }
    }

    const chunks = this.expo.chunkPushNotifications(messages)
    const tickets: any[] = []
    for (const chunk of chunks) {
      try {
        tickets.push(...(await this.expo.sendPushNotificationsAsync(chunk)))
      } catch (error: any) {
        console.error('Expo sendPushNotificationsAsync error:', error);
      }
    }

    const invalidTokens: string[] = [];
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i] as any;

      if (ticket?.status === 'error') {
        const token = messages[i]?.to;
        console.error(`Push error for token ${String(token)}: ${ticket.message}`);
        if (typeof token === 'string' && ticket.details?.error === 'DeviceNotRegistered') {
          invalidTokens.push(token);
        }
      }
    }

    if (invalidTokens.length > 0) {
      await this.prisma.pushDevice.deleteMany({
        where: {
          expoPushToken: { in: invalidTokens }
        }
      });
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


