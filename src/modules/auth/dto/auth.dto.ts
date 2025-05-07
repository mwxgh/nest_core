import { EmailField, PasswordField, StringField } from '@/commons/decorators'

export class LoginDto {
  @EmailField()
  email: string

  @PasswordField()
  password: string
}

export class LoginResponseDto {
  @StringField()
  token: string

  @StringField()
  refreshToken: string
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
