import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
@Injectable()
export class DatabaseService implements OnModuleInit {
    constructor(private dataSource: DataSource) {}
  async onModuleInit() {
    await runSeeders(this.dataSource);
  }
}
