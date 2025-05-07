import { CustomConfig } from '@/configs'
import * as admin from 'firebase-admin'
import { ExtractJwt } from 'passport-firebase-jwt'

const { project_id, private_key, client_email } = CustomConfig().firebase

export const firebaseConfig = {
  provide: 'FIREBASE_CONFIG',
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

export const jwtFirebaseStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}
