// /* eslint-disable no-useless-escape */
// import { Inject, Logger } from '@nestjs/common'
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
// import { AdvancedConsoleLogger, LoggerOptions } from 'typeorm'
// import { AppConstant } from '@/constants/app.constant'
// import { LoggerConstant } from '@/constants/logger.constant'
// import { AsyncRequestContext } from '../async-context-request'
// import { replaceHiddenText } from '@/utils'
// import config from '@/configs/config'

// export class QueryLogger extends AdvancedConsoleLogger {
//   constructor(
//     @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
//     private readonly asyncRequestContext: AsyncRequestContext,
//   ) {
//     const env = config().app.env
//     const logLevels = [AppConstant.dev, AppConstant.test].includes(env)
//       ? env === AppConstant.test
//         ? LoggerConstant.queryLogLevelsTest
//         : LoggerConstant.queryLogLevelsDev
//       : LoggerConstant.queryLogLevels

//     super(logLevels as LoggerOptions)
//   }

//   logQuery(query: string, parameters?: any[]) {
//     if (!this.isLogEnabledFor('query')) {
//       return
//     }
//     const stringifyParams =
//       parameters && parameters.length
//         ? LoggerConstant.parameterPrefix +
//           JSON.stringify(this.buildLogParameters(query, [...parameters]))
//         : ''

//     const sql = LoggerConstant.queryPrefix + query + stringifyParams

//     this.logger.log(
//       sql,
//       this.asyncRequestContext.getRequestIdStore() ??
//         LoggerConstant.typeOrmFirstQuery,
//     )
//   }

//   private buildLogParameters(query: string, parameters: any[]): any[] {
//     return this[
//       query.startsWith(AppConstant.startQueryInsert)
//         ? 'buildHiddenParamInert'
//         : 'buildHiddenParamCommon'
//     ](query, [...parameters])
//   }

//   private buildHiddenParamInert(query: string, parameters: any[]) {
//     const regExp = /\(([^)]+)\)/
//     const matchInsert = regExp.exec(query)
//     const fieldInsert = matchInsert
//       ? matchInsert[1]
//           // remove space
//           .replace(/\`/g, '')
//           // convert to array
//           .split(', ')
//       : []

//     // get values insert
//     const regexValues = /VALUES \(([^)]+)\)/
//     const matchValue = regexValues.exec(query)

//     if (!matchValue) {
//       // Handle the case where matchValue is null
//       return parameters // or any other appropriate fallback behavior
//     }
//     const values = matchValue[1]
//       // remove space
//       .replace(/\`/g, '')
//       // convert to array
//       .split(', ')

//     const filtered = fieldInsert.filter(
//       (_, index) => !this.getAllKeyDefault(values).includes(index),
//     )

//     return this.replaceHiddenText(filtered, [...parameters])
//   }

//   private buildHiddenParamCommon(query: string, parameters: any[]) {
//     const regex = /`([^`]+)`\s*=\s*\?/g
//     const matches = [...query.matchAll(regex)]
//     const filtered = matches
//       .map((match) => match[1].trim())
//       .filter((_, index) => parameters[index] !== undefined)

//     return this.replaceHiddenText(filtered, [...parameters])
//   }

//   private getAllKeyDefault(array: string[]): number[] {
//     const defaultValue = 'DEFAULT'

//     return array.reduce<number[]>((keys, item, index) => {
//       if (item === defaultValue) {
//         keys.push(index)
//       }
//       return keys
//     }, [])
//   }

//   private replaceHiddenText(fields: string[], parameters: string[]): string[] {
//     fields.forEach((item, index) => {
//       if (AppConstant.blackListField.includes(item) && parameters[index]) {
//         parameters[index] = replaceHiddenText(parameters[index])
//       }
//     })

//     return parameters
//   }
// }
