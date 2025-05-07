import { LoginResponseDto } from '@/modules/auth/dto/auth.dto'
import { Inject, Injectable } from '@nestjs/common'
import { FirebaseApp } from 'firebase/app'
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'

@Injectable()
export class FirebaseClientService {
  private auth: Auth
  constructor(
    @Inject('FIREBASE_CLIENT_CONFIG') private firebaseClient: FirebaseApp,
  ) {
    this.auth = getAuth(this.firebaseClient)
  }
  async signIn(email: string, password: string): Promise<LoginResponseDto> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    )
    const token = await userCredential.user.getIdToken()

    return {
      token,
      refreshToken: userCredential.user.refreshToken,
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth)
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser
  }
}
