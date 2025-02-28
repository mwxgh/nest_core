import { Logger } from '@nestjs/common'
import { LoggerConstant } from '@/constants/logger.constant'

export const ProcessLogger = (logger: Logger) => {
  process.on('uncaughtException', (exception: unknown) => {
    const error =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : String(exception)
    logger.error(error, null, LoggerConstant.uncaughtException)
  })

  process.on('unhandledRejection', (exception: unknown) => {
    const error =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : String(exception)
    logger.error(error, null, LoggerConstant.unhandledRejection)
  })
}
