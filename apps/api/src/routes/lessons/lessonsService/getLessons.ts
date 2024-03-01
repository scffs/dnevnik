import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { Day } from '@diary-spo/shared'
import { ScheduleGetFromDB, ScheduleSave } from '@models'
import { HeadersWithCookie } from '@utils'

export const getLessonsService = async (
  startDate: string,
  endDate: string,
  id: number,
  secret: string
): Promise<Day[] | string> => {
  const path = `${SERVER_URL}/services/students/${id}/lessons/${startDate}/${endDate}`

  const response = await fetch(path, {
    headers: HeadersWithCookie(secret)
  })

  if (response.status === API_CODES.FORBIDDEN) {
    throw new ApiError(API_ERRORS.USER_NOT_PERMISSION, API_CODES.FORBIDDEN)
  }

  if (!response.ok) {
    // Получаем из базы
    // TODO: fix it
    return ScheduleGetFromDB(startDate, endDate, id) as unknown as Day[]
  }

  // Сохраняем и отдаём
  const days: Day[] = await response.json()
  for (const day of days) {
    ScheduleSave(day, id).catch((err) =>
      console.error(`Ошибка сохранения расписания: ${err}`)
    )
  }
  return days
}
