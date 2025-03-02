import { green, red, white, yellow, cyan, magenta } from 'cli-color'
import { format } from 'winston'
import { AppConstant, LoggerConstant } from '@/constants'
import { AsyncRequestContext } from '../async-context-request'
import config from '@/configs/config'
import { ObjectType, StoreContextType } from '@/utils'

export const loggerFormat = (asyncContext: AsyncRequestContext) =>
  format.printf(({ context, level, timestamp, message }): string => {
    const ctx = (context ??
      asyncContext.getRequestIdStore() ??
      {}) as StoreContextType

    const logFields: ObjectType = {
      contextId: ctx.contextId ?? 'N/A',
      domain: ctx.domain ?? 'N/A',
      userId: ctx.userId ? `LoginID: ${ctx.userId}` : 'N/A',
      ip: ctx.ip ? `IP: ${ctx.ip}` : 'N/A',
      method: ctx.method ?? 'N/A',
      endpoint: ctx.endpoint ? `Endpoint: ${ctx.endpoint}` : 'N/A',
      device: ctx.device ? `Device: ${ctx.device}` : 'N/A',
    }

    const colorForLevel =
      {
        [LoggerConstant.infoLevel]: green,
        [LoggerConstant.fatalLevel]: red,
        [LoggerConstant.errorLevel]: red,
        [LoggerConstant.warnLevel]: yellow,
        [LoggerConstant.debugLevel]: yellow,
      }[level] || white

    const applyColor = [AppConstant.test, AppConstant.dev].includes(
      config().app.env,
    )
      ? (text: string) => colorForLevel(text)
      : (text: string) => text

    const highlightSql = (sql: string) =>
      sql.replace(
        /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|ON|INTO|VALUES|LIMIT|OFFSET)\b/g,
        (match) => cyan.bold(match),
      )

    const formattedMessage =
      typeof message === 'string' &&
      level === LoggerConstant.infoLevel &&
      message.startsWith(LoggerConstant.queryPrefix)
        ? highlightSql(message)
        : String(message)

    const parts = [
      magenta('[CUSTOM]'),
      '-',
      new Date(timestamp as string | number | Date).toISOString(),
      '-',
      applyColor(`[${level.toUpperCase()}]`),
      ...Object.values(logFields)
        .filter((value) => value !== 'N/A')
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        .map((value) => applyColor(`[${value}]`)),
      formattedMessage,
    ]

    return parts.join(' ')
  })
