import { CustomConfig } from '@/configs'
import * as admin from 'firebase-admin'
import { initializeApp } from 'firebase/app'
import { ExtractJwt } from 'passport-firebase-jwt'

const {
  project_id,
  private_key,
  client_email,
  api_key,
  auth_domain,
  messaging_sender_id,
  app_id,
} = CustomConfig().firebase

export const firebaseAdminConfig = {
  provide: 'FIREBASE_ADMIN_CONFIG',
  useFactory: () =>
    admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: project_id!,
          privateKey: private_key!,
          clientEmail: client_email!,
        }),
        databaseURL: `https://${project_id}.firebaseio.com`,
        storageBucket: `${project_id}.appspot.com`,
      },
      'admin',
    ),
}

export const firebaseClientConfig = {
  provide: 'FIREBASE_CLIENT_CONFIG',
  useFactory: () =>
    initializeApp(
      {
        apiKey: api_key!,
        projectId: project_id!,
        authDomain: auth_domain ?? `${project_id}.firebaseapp.com`,
        storageBucket: `${project_id}.appspot.com`,
        messagingSenderId: messaging_sender_id!,
        appId: app_id!,
      },
      'client',
    ),
}

export const jwtFirebaseStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}
