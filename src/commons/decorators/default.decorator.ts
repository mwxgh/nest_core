import { Transform, TransformFnParams } from 'class-transformer'

export const Default = <T>(defaultValue: T) =>
  Transform(({ value }: TransformFnParams): T => (value as T) ?? defaultValue, {
    toClassOnly: true,
  })
