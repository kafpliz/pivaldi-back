import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        const dbUrl = new URL(process.env.DATABASE_URL!)
        
        const pool = new Pool({
            host: dbUrl.hostname,
            port: parseInt(dbUrl.port || '5432'),
            database: dbUrl.pathname.slice(1),
            user: dbUrl.username,
            password: decodeURIComponent(dbUrl.password),
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        })

        const adapter = new PrismaPg(pool)

        super({adapter})
    }

    onModuleInit() {
        this.$connect()
    }
    onModuleDestroy() {
        this.$disconnect()
    }
}
