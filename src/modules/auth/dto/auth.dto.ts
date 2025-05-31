import { EmailField, PasswordField, StringField } from '@/commons/decorators'

export class LoginDto {
  @StringField()
  firebaseUid: string
}

export class SignupDto {
  @EmailField()
  email: string

  @PasswordField()
  password: string

  @StringField()
  firstName: string

  @StringField()
  lastName: string
}
