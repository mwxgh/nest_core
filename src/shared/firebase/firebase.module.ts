import { Module } from '@nestjs/common'
import { FirebaseService } from './firebase.service'
import { firebaseConfig } from '@/configs'

@Module({
  providers: [firebaseConfig, FirebaseService],
  exports: [firebaseConfig, FirebaseService],
})
export class FirebaseModule {}
