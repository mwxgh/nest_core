import { CustomConfig } from '@/configs'
import { Module } from '@nestjs/common'
import * as admin from 'firebase-admin'

const { project_id, private_key, client_email } = CustomConfig().firebase

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  useFactory: () =>
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: project_id!,
        privateKey: private_key!,
        clientEmail: client_email!,
      }),
      databaseURL: `https://${project_id}.firebaseio.com`,
      storageBucket: `${project_id}.appspot.com`,
    }),
}

@Module({
  providers: [firebaseProvider],
  exports: [firebaseProvider],
})
export class FirebaseModule {}
