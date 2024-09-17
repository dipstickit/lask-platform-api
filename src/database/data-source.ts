import { DataSource } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';

// Đọc file .env để lấy các biến môi trường
config();

// Tạo một instance của DataSource
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../*.migrations/*{.ts,.js}')],
  synchronize: false, // Không nên sử dụng synchronize trong production
  logging: true,
});

export default DataSource;
