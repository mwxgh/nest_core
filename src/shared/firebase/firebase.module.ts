import { Module } from '@nestjs/common'
import { FirebaseAdminService } from './firebase-admin.service'
import { firebaseAdminConfig, firebaseClientConfig } from '@/configs'
import { FirebaseClientService } from './firebase-client.service'

@Module({
  providers: [
    firebaseAdminConfig,
    firebaseClientConfig,
    FirebaseAdminService,
    FirebaseClientService,
  ],
  exports: [FirebaseAdminService, FirebaseClientService],
})
export class FirebaseModule {}
