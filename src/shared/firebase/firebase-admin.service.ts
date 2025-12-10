import { Inject, Injectable } from '@nestjs/common'

import * as admin from 'firebase-admin'
import { RoleType } from '@orm/enums'

@Injectable()
export class FirebaseAdminService {
  constructor(
    @Inject('FIREBASE_ADMIN_CONFIG') private firebaseAdmin: admin.app.App,
  ) {}

  private auth = () => this.firebaseAdmin.auth()

  private messaging = () => this.firebaseAdmin.messaging()

  private getFirestore = () => this.firebaseAdmin.firestore()

  private getDatabase = () => this.firebaseAdmin.database()

  async verifyIdToken(
    token: string,
  ): Promise<admin.auth.DecodedIdToken & { roles?: RoleType[] }> {
    try {
      return await this.auth().verifyIdToken(token)
    } catch (error) {
      throw new Error(`Error verifying Firebase token: ${error}`)
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth().getUser(uid)
    } catch (error) {
      throw new Error(`Error getting Firebase user: ${error}`)
    }
  }

  async setCustomUserClaims(uid: string, claims: object) {
    try {
      return await this.auth().setCustomUserClaims(uid, claims)
    } catch (error) {
      throw new Error(`Error set custom user claims: ${error}`)
    }
  }

  async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth().getUserByEmail(email)
    } catch (error) {
      throw new Error(`Error getting Firebase user by email: ${error}`)
    }
  }

  async createUser(
    userData: admin.auth.CreateRequest,
  ): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth().createUser(userData)
    } catch (error) {
      throw new Error(`Error creating Firebase user: ${error}`)
    }
  }

  async updateUser(
    uid: string,
    userData: admin.auth.UpdateRequest,
  ): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth().updateUser(uid, userData)
    } catch (error) {
      throw new Error(`Error updating Firebase user: ${error}`)
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth().deleteUser(uid)
    } catch (error) {
      throw new Error(`Error deleting Firebase user: ${error}`)
    }
  }

  async listUsers(maxResults?: number): Promise<admin.auth.UserRecord[]> {
    try {
      const listUsersResult = await this.auth().listUsers(maxResults)
      return listUsersResult.users
    } catch (error) {
      throw new Error(`Error listing Firebase users: ${error}`)
    }
  }

  collection(path: string): admin.firestore.CollectionReference {
    return this.getFirestore().collection(path)
  }

  document(path: string): admin.firestore.DocumentReference {
    return this.getFirestore().doc(path)
  }

  async getDocument<T>(path: string): Promise<T | null> {
    try {
      const doc = await this.document(path).get()
      return doc.exists ? (doc.data() as T) : null
    } catch (error) {
      throw new Error(`Error getting Firestore document: ${error}`)
    }
  }

  async deleteDocument(path: string): Promise<void> {
    try {
      await this.document(path).delete()
    } catch (error) {
      throw new Error(`Error deleting Firestore document: ${error}`)
    }
  }

  // Firebase Cloud Messaging methods
  async sendNotification(
    token: string,
    notification: admin.messaging.Notification,
    data?: Record<string, string>,
  ): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        notification,
        data,
        token,
      }

      return await this.messaging().send(message)
    } catch (error) {
      throw new Error(`Error sending Firebase notification: ${error}`)
    }
  }

  async sendTopicNotification(
    topic: string,
    notification: admin.messaging.Notification,
    data?: Record<string, string>,
  ): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        notification,
        data,
        topic,
      }

      return await this.messaging().send(message)
    } catch (error) {
      throw new Error(`Error sending Firebase topic notification: ${error}`)
    }
  }
}
