import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import appConfig from './config/app.config';
import supabaseConfig from './config/supabase.config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CustomersModule } from './modules/customers/customers.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { DesignTasksModule } from './modules/design-tasks/design-tasks.module';
import { ProductionJobsModule } from './modules/production-jobs/production-jobs.module';
import { QaReportsModule } from './modules/qa-reports/qa-reports.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ActivityLogInterceptor } from './modules/activity-log/activity-log.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, supabaseConfig],
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    BrandsModule,
    CustomersModule,
    LeadsModule,
    ConversationsModule,
    QuotesModule,
    OrdersModule,
    InvoicesModule,
    DesignTasksModule,
    ProductionJobsModule,
    QaReportsModule,
    ShipmentsModule,
    VendorsModule,
    IntegrationsModule,
    ReportsModule,
    ActivityLogModule,
    WebhooksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
  ],
})
export class AppModule {}
