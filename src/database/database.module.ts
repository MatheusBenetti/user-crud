import { Module } from '@nestjs/common';
import { dataProviders } from 'src/database.providers';

@Module({
  providers: [...dataProviders],
  exports: [...dataProviders],
})
export class DatabaseModule {}
