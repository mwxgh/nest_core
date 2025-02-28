import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './utils'
import {
  ClassSerializerInterceptor,
  HttpStatus,
  RequestMethod,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import config from './configs/config'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { AsyncRequestContext } from './shared/async-context-request'
import { ResponseLoggerInterceptor } from './commons/interceptors'
import {
  BadRequestFilter,
  EntityNotfoundFilter,
  ForbiddenFilter,
  InternalServerFilter,
  QueryFailedFilter,
  UnauthorizedFilter,
  UnprocessableFilter,
} from './commons/filters'
import { LoggerRequestGuard } from './commons/guards/logger-request.guard'

const { port } = config().app

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  const filterParam = {
    asyncRequestContext: app.get(AsyncRequestContext),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    logger: app.get(WINSTON_MODULE_NEST_PROVIDER),
  }

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
    new ResponseLoggerInterceptor(filterParam),
    // new TimeoutInterceptor(timeout),
  )

  app.useGlobalFilters(
    new InternalServerFilter(filterParam),
    new BadRequestFilter(filterParam),
    new QueryFailedFilter(filterParam),
    new UnprocessableFilter(filterParam),
    new UnauthorizedFilter(filterParam),
    new EntityNotfoundFilter(filterParam),
    new ForbiddenFilter(filterParam),
  )

  app.useGlobalGuards(new LoggerRequestGuard(filterParam))

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
