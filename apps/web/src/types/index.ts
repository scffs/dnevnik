import {
  AbsenceTypesDescriptionKeys,
  AdditionalMarks,
  MarkKeys
} from '@diary-spo/shared'
import { AxiosResponse } from 'axios'

export type Pages =
  | 'schedule'
  | 'contacts'
  | 'marks'
  | 'settings'
  | 'attestation'
  | 'notifications'

export interface Storage {
  key: string
  value: string
}

export type ServerResponse<T = unknown> = Promise<
  T | AxiosResponse<any, any>
>

export const HTTP_STATUSES = {
  /** Ошибка авторизации **/
  UNAUTHORIZED: 401,
  /** Rate limit **/
  RATE_LIMIT: 429,
  /** Неизвестная **/
  TEAPOT: 520,
  /** Internal Server Error **/
  INTERNAL: 500
} as const

export const loginPattern = /^[a-zA-Z0-9а-яА-ЯёЁ-]+$/

export type ReturnedMark =
  | MarkKeys
  | AbsenceTypesDescriptionKeys
  | AdditionalMarks
  | 'ДЗ'
  | '.'
  | number

export type Nullable<T> = T | null
