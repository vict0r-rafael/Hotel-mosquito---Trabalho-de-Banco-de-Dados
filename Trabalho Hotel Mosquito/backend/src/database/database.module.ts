import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool } from 'mysql2/promise';
import { DATABASE_POOL } from './database.constants';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createPool({
          host: config.getOrThrow('DB_HOST'),
          port: config.get<number>('DB_PORT', 3306),
          user: config.getOrThrow('DB_USER'),
          password: config.getOrThrow('DB_PASSWORD'),
          database: config.getOrThrow('DB_NAME'),
          connectionLimit: 10,
          waitForConnections: true,
          timezone: '-03:00',
        }),
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
