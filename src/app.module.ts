import { CartModule } from './module/cart/cart.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BrandModule } from './module/brand/brand.module';
import { CategoryModule } from './module/category/category.module';
import { subCategoryModule } from './module/subCategory/subCategory.module';
import { ProductModule } from './module/product/product.module';

@Module({
  imports: [ConfigModule.forRoot({
  envFilePath: './config/.env',
  isGlobal:true
}),
MongooseModule.forRoot(process.env.MONGO_URL as string, {
  onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log(`db is connected successfully on ${process.env.MONGO_URL}`));
    return connection;
  },
}),

UserModule,
BrandModule,
CategoryModule,
subCategoryModule,
ProductModule,
CartModule

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
