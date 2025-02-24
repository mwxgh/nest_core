import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './utils/setup.swagger'
import { RequestMethod } from '@nestjs/common'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  // Set global prefix for app.
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  })

  // Setup swagger
  setupSwagger(app)

  // Run app with port
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}

bootstrap()
