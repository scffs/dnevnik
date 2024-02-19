import { Gradebook } from '@diary-spo/shared'
import { GradebookModel } from '../models'
import { IUserInfo } from './diaryUser'
import { LessonTypeSaveOrGet } from './lessonType'
import { TasksSaveOrGet } from './task'
import { ThemesSaveOrGet } from './theme'

export const GradebookSaveOrGet = async (
  scheduleId: number,
  gradebook: Gradebook,
  userInfo: IUserInfo
) => {
  const lessonTypeId = (await LessonTypeSaveOrGet(gradebook.lessonType)).id
  const absenceTypeId = gradebook.absenceType
    ? (await LessonTypeSaveOrGet(gradebook.absenceType)).id
    : undefined

  const dataToSave = {
    scheduleId,
    lessonTypeId,
    absenceTypeId,
    idFromDiary: gradebook.id
  }

  const [record, isCreated] = await GradebookModel.findOrCreate({
    where: {
      scheduleId
    },
    defaults: {
      ...dataToSave
    }
  })

  if (!isCreated) {
    await record.update({
      ...dataToSave
    })
  }

  if (gradebook.themes) {
    ThemesSaveOrGet(record.id, gradebook.themes)
  }

  if (gradebook.tasks) {
    TasksSaveOrGet(record.id, gradebook.tasks, userInfo)
  }
}
