import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './utils/setup.swagger'
import {
  HttpStatus,
  RequestMethod,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import config from './configs/config'

const { port } = config().app

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  // Set global prefix for app.
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  })

  // Use global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  )

  // Setup swagger
  setupSwagger(app)

  // Run app with port
  await app.listen(port, '0.0.0.0')
}

bootstrap()
