import { ExtractJwt } from 'passport-jwt'
import { CustomConfig } from './index'

const { secret, refreshSecret } = CustomConfig().jwt

export const jwtStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: secret,
}

export const refreshJwtStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: refreshSecret,
}
