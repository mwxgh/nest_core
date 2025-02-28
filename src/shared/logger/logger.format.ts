import { green, red, white, yellow, cyan } from 'cli-color'
import { format } from 'winston'
import { AppConstant, LoggerConstant } from '@/constants'
import { AsyncRequestContext } from '../async-context-request'
import config from '@/configs/config'
import { StoreContextType } from '@/utils'

export const loggerFormat = (asyncContext: AsyncRequestContext) =>
  format.printf(({ context, level, timestamp, message }): string => {
    // Get context information
    const ctx = (context ??
      asyncContext.getRequestIdStore() ??
      {}) as StoreContextType

    // Extract values with type assertions
    const contextId = String(ctx.contextId ?? 'N/A')
    const endpoint = String(ctx.endpoint ?? 'N/A')
    const ip = String(ctx.ip ?? 'N/A')
    const device = String(ctx.device ?? 'N/A')
    const domain = String(ctx.domain ?? 'N/A')
    const userId = String(ctx.userId ?? 'N/A')
    const method = String(ctx.method ?? 'N/A')

    // Define color functions based on log level
    const colorForLevel =
      {
        [LoggerConstant.infoLevel]: green,
        [LoggerConstant.fatalLevel]: red,
        [LoggerConstant.errorLevel]: red,
        [LoggerConstant.warnLevel]: yellow,
        [LoggerConstant.debugLevel]: yellow,
      }[level] || white

    const { env } = config().app
    const applyColor =
      env === AppConstant.test || env === AppConstant.dev
        ? (text: string) => colorForLevel(text)
        : (text: string) => text

    // Format the level and context
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

    // Prisma does not have `highlightSql`, so we manually color SQL queries
    const highlightSql = (sql: string) =>
      sql.replace(
        /(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|ON|INTO|VALUES)/gi,
        (match) => cyan.bold(match),
      )

    // Highlight SQL queries manually
    const formattedMessage =
      typeof message === 'string' &&
      level === LoggerConstant.infoLevel &&
      message.startsWith(LoggerConstant.queryPrefix)
        ? highlightSql(message)
        : String(message)

    const safeTimestamp = new Date(
      timestamp as string | number | Date,
    ).toISOString()

    return `[${safeTimestamp}] ${formattedContext.contextId} ${formattedLevel} ${formattedContext.domain} ${formattedContext.userId} ${formattedContext.ip} ${formattedContext.method} ${formattedContext.endpoint} ${formattedContext.device} - ${formattedMessage}`
  })
