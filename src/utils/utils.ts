import { AppConstant } from '@/constants'
import { format } from 'date-fns'
import { ObjectType, RequestWithContextType, StoreContextType } from './declare'
import { AsyncRequestContext } from '@/shared/async-context-request'
import { isEmpty } from 'lodash'
import { v4 } from 'uuid'

export const getVariableName = <TResult>(getVar: () => TResult): string => {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  )

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    )
  }

  const fullMemberName = m[1]

  const memberParts = fullMemberName.split('.')

  return memberParts[memberParts.length - 1]
}

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  return array.reduce((acc, _, i) => {
    if (i % size === 0) {
      acc.push(array.slice(i, i + size))
    }
    return acc
  }, [] as T[][])
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const createRandomValueCsv = (length: number): string => {
  const array: number[] = []

  for (let i = 0; i < length; i++) {
    const randomValue = Math.floor(Math.random() * 100) + 1
    array.push(randomValue)
  }

  return array.join(',')
}

export const getExampleCsvSwagger = (
  headers: Record<string, string>,
  data?: string,
): string => {
  let exampleValue: string
  const headerValue = Object.values(headers)

  const header = headerValue.join(',')
  if (data) {
    exampleValue = data
  } else {
    exampleValue = createRandomValueCsv(headerValue.length)
  }

  return `${header}\n${exampleValue}`
}

export const arraysAreEqual = <T>(array1: T[], array2: T[]): boolean => {
  if (array1.length !== array2.length) {
    return false
  }

  return array1.every((element, index) => element === array2[index])
}

export const generatePrefixedDateCode = (
  prefix: string,
  id: number,
): string => {
  const date = format(new Date(), 'yyMMdd')
  return `${prefix}${date}${String(id).padStart(6, '0')}`
}

export const generatePrefixedRandomCode = (
  prefix: string,
  id: number,
  length = 6,
): string => {
  const setOfNumbers = '0123456789'
  const randomNumberString = Array.from({ length }, () =>
    setOfNumbers.charAt(Math.floor(Math.random() * setOfNumbers.length)),
  ).join('')

  return `${prefix}${randomNumberString}${String(id).padStart(6, '0')}`
}

export const replaceHiddenText = (
  text: string,
  numDigitsHidden = AppConstant.numDigitsHidden,
  characterHidden = AppConstant.characterHidden,
) => {
  const textReplaced = `${text}`.replace(
    // example : example => exam***
    new RegExp(`.{0,${numDigitsHidden}}$`),
    `${characterHidden.repeat(numDigitsHidden)}`,
  )

  if (
    typeof textReplaced === 'string' &&
    textReplaced.length >= AppConstant.maxCharacterLog
  ) {
    return (
      textReplaced.substring(0, AppConstant.maxCharacterLog) +
      `${characterHidden.repeat(numDigitsHidden)}...`
    )
  }

  return textReplaced
}

export const generatePassword = (): string => {
  const length = 8
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numericChars = '0123456789'
  const specialChars = '!@#$%^&*()'

  let password = ''

  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
  password += numericChars[Math.floor(Math.random() * numericChars.length)]
  password += specialChars[Math.floor(Math.random() * specialChars.length)]

  const remainingLength = length - 4

  const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars
  for (let i = 0; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')

  return password
}

export const promiseAllConcurrency = async <T>(
  collection: (() => Promise<T>)[],
  concurrency = 3,
): Promise<T[]> => {
  const head = collection.slice(0, concurrency)
  const tail = collection.slice(concurrency)
  const result: T[] = []
  const errors: any[] = []
  const execute = async (
    promise: () => Promise<T>,
    i: number,
    next: () => Promise<void>,
  ) => {
    try {
      result[i] = await promise()
      if (!errors.length) {
        await next()
      }
    } catch (error) {
      errors.push(error)
    }
  }
  const runNext = async () => {
    const i = collection.length - tail.length
    const promise = tail.shift()
    if (promise !== undefined) {
      await execute(promise, i, runNext)
    }
  }
  await Promise.all(head.map((promise, i) => execute(promise, i, runNext)))

  if (errors.length) {
    throw errors[0]
  }
  return result
}

export const buildLogParameters = (params: ObjectType): ObjectType => {
  AppConstant.blackListField.forEach((item) => {
    if (typeof params[item] === 'string') {
      params[item] = replaceHiddenText(params[item])
    }
  })

  return params
}

export const createStore = (
  req: RequestWithContextType,
  asyncRequestContext: AsyncRequestContext,
): StoreContextType => {
  let store = asyncRequestContext.getRequestIdStore()

  if (isEmpty(store)) {
    const requestId = v4()

    const logContext: StoreContextType = {
      contextId: requestId,
      ip: (req.headers['x-forwarded-for'] as string) ?? req.ip ?? '',
      endpoint: req.raw?.url ?? req.originalUrl ?? '',
      device: (req.headers['user-agent'] as string) ?? '',
      domain: req.hostname ?? '',
      userId: typeof req.user?.id === 'number' ? req.user.id : undefined,
      method: req.method ?? '',
    }

    asyncRequestContext.set(logContext)
    store = logContext
  }

  return store
}
