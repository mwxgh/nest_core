import { Inject, Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_CONFIG') private firebase: admin.app.App) {}

  private auth = () => this.firebase.auth()

  private messaging = () => this.firebase.messaging()

  private getFirestore = () => this.firebase.firestore()

  private getDatabase = () => this.firebase.database()

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
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

  // async setDocument(path: string, data: any): Promise<void> {
  //   try {
  //     await this.document(path).set(data)
  //   } catch (error) {
  //     throw new Error(`Error setting Firestore document: ${error}`)
  //   }
  // }

  // async updateDocument(path: string, data: any): Promise<void> {
  //   try {
  //     await this.document(path).update(data)
  //   } catch (error) {
  //     throw new Error(`Error updating Firestore document: ${error}`)
  //   }
  // }

  async deleteDocument(path: string): Promise<void> {
    try {
      await this.document(path).delete()
    } catch (error) {
      throw new Error(`Error deleting Firestore document: ${error}`)
    }
  }

  // Storage methods
  //   getBucket(name?: string): admin.storage.Bucket {
  //     return name ? this.storage().bucket(name) : this.storage().bucket();
  //   }

  //   async uploadFile(filePath: string, destination: string, bucketName?: string): Promise<void> {
  //     try {
  //       const bucket = this.getBucket(bucketName);
  //       await bucket.upload(filePath, {
  //         destination,
  //       });
  //     } catch (error) {
  //       throw new Error(`Error uploading file to Firebase Storage: ${error}`);
  //     }
  //   }

  //   async getFileUrl(filePath: string, bucketName?: string, expiry?: number): Promise<string> {
  //     try {
  //       const bucket = this.getBucket(bucketName);
  //       const file = bucket.file(filePath);

  //       // Default expiry is 1 hour if not specified
  //       const expiryTime = expiry || 60 * 60 * 1000;

  //       const [url] = await file.getSignedUrl({
  //         action: 'read',
  //         expires: Date.now() + expiryTime,
  //       });

  //       return url;
  //     } catch (error) {
  //       throw new Error(`Error getting Firebase Storage file URL: ${error}`);
  //     }
  //   }

  //   async deleteFile(filePath: string, bucketName?: string): Promise<void> {
  //     try {
  //       const bucket = this.getBucket(bucketName);
  //       await bucket.file(filePath).delete();
  //     } catch (error) {
  //       throw new Error(`Error deleting file from Firebase Storage: ${error}`);
  //     }
  //   }

  // getDatabaseRef(path: string) {
  //   return this.getDatabase().ref(path)
  // }

  //   async getDatabaseValue<T>(path: string): Promise<T | null> {
  //     try {
  //       const snapshot = await this.getDatabaseRef(path).once('value');
  //       return snapshot.val() as T;
  //     } catch (error) {
  //       throw new Error(`Error getting Firebase Database value: ${error}`);
  //     }
  //   }

  //   async setDatabaseValue(path: string, value: any): Promise<void> {
  //     try {
  //       await this.getDatabaseRef(path).set(value);
  //     } catch (error) {
  //       throw new Error(`Error setting Firebase Database value: ${error}`);
  //     }
  //   }

  //   async updateDatabaseValue(path: string, value: any): Promise<void> {
  //     try {
  //       await this.getDatabaseRef(path).update(value);
  //     } catch (error) {
  //       throw new Error(`Error updating Firebase Database value: ${error}`);
  //     }
  //   }

  //   async pushDatabaseValue(path: string, value: any): Promise<string> {
  //     try {
  //       const ref = await this.getDatabaseRef(path).push(value);
  //       return ref.key;
  //     } catch (error) {
  //       throw new Error(`Error pushing Firebase Database value: ${error}`);
  //     }
  //   }

  //   async removeDatabaseValue(path: string): Promise<void> {
  //     try {
  //       await this.getDatabaseRef(path).remove();
  //     } catch (error) {
  //       throw new Error(`Error removing Firebase Database value: ${error}`);
  //     }
  //   }

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

  // async sendMulticastNotification(
  //   tokens: string[],
  //   notification: admin.messaging.Notification,
  //   data?: { [key: string]: string },
  // ): Promise<admin.messaging.BatchResponse> {
  //   try {
  //     const message: admin.messaging.MulticastMessage = {
  //       notification,
  //       data,
  //       tokens,
  //     }

  //     return await this.messaging().sendMulticast(message)
  //   } catch (error) {
  //     throw new Error(
  //       `Error sending Firebase multicast notification: ${error}`,
  //     )
  //   }
  // }

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
