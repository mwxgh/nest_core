import { green, red, white, yellow, cyan, magenta } from 'cli-color'
import { format } from 'winston'
import { AppConstant, LoggerConstant } from '@/constants'
import { AsyncRequestContext } from '../async-context-request'
import config from '@/configs/config'
import { StoreContextType } from '@/utils'

export const loggerFormat = (asyncContext: AsyncRequestContext) =>
  format.printf(({ context, level, timestamp, message }): string => {
    const ctx = (context ??
      asyncContext.getRequestIdStore() ??
      {}) as StoreContextType

    const contextId = String(ctx.contextId ?? 'N/A')
    const endpoint = String(ctx.endpoint ?? 'N/A')
    const ip = String(ctx.ip ?? 'N/A')
    const device = String(ctx.device ?? 'N/A')
    const domain = String(ctx.domain ?? 'N/A')
    const userId = String(ctx.userId ?? 'N/A')
    const method = String(ctx.method ?? 'N/A')

    const colorForLevel =
      {
        [LoggerConstant.infoLevel]: green,
        [LoggerConstant.fatalLevel]: red,
        [LoggerConstant.errorLevel]: red,
        [LoggerConstant.warnLevel]: yellow,
        [LoggerConstant.debugLevel]: yellow,
      }[level] || white

    const { env, timezone } = config().app
    const applyColor =
      env === AppConstant.test || env === AppConstant.dev
        ? (text: string) => colorForLevel(text)
        : (text: string) => text

    const formatWithColor = (text: string) => applyColor(`[${text}]`)
    const formattedLevel = formatWithColor(level.toUpperCase())
    const formattedContext = {
      contextId: formatWithColor(contextId),
      domain: formatWithColor(domain),
      userId: formatWithColor(`LoginID: ${userId}`),
      ip: formatWithColor(`IP: ${ip}`),
      endpoint: formatWithColor(`Endpoint: ${endpoint}`),
      device: formatWithColor(`Device: ${device}`),
      method: formatWithColor(method),
    }

    const highlightSql = (sql: string) =>
      sql.replace(
        /(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|ON|INTO|VALUES)/gi,
        (match) => cyan.bold(match),
      )

    const formattedMessage =
      typeof message === 'string' &&
      level === LoggerConstant.infoLevel &&
      message.startsWith(LoggerConstant.queryPrefix)
        ? highlightSql(message)
        : String(message)

    const time = new Date(timestamp as string | number | Date).toLocaleString(
      'vi-VN',
      { timeZone: timezone },
    )

    return `${magenta('[Winston]')} - ${time} - ${formattedContext.contextId} ${formattedLevel} ${formattedContext.domain} ${formattedContext.userId} ${formattedContext.ip} ${formattedContext.method} ${formattedContext.endpoint} ${formattedContext.device} - ${formattedMessage}`
  })
