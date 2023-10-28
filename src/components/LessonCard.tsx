import { CSSProperties, FC } from 'react'
import {
  Card,
  Footnote,
  Group,
  Header,
  Placeholder,
  SimpleCell,
} from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  AbsenceTypes,
  Day,
  Gradebook,
  LessonWorkType,
  Timetable,
} from 'diary-shared'
import { useDispatch } from 'react-redux'
import { formatLessonDate, getDayOfWeek } from '../utils/formatLessonDate'
import setDefaultMark from '../utils/setDefaultMark'
import { isToday } from '../utils/isToday'
import { MODAL_PAGE_LESSON } from '../modals/ModalRoot'
import SubtitleWithBorder from './SubtitleWithBorder'
import TimeRemaining from './TimeRemaining'
import Mark from './UI/Mark'
import { setLessonModalData } from '../store/lessonSlice.ts'

interface ILessonCard {
  lesson: Day
}

const LessonCard: FC<ILessonCard> = ({ lesson }) => {
  const routeNavigator = useRouteNavigator()
  const dispatch = useDispatch()

  const handleLessonClick = (
    name: string,
    endTime: string,
    startTime: string,
    timetable: Timetable,
    gradebook: Gradebook | undefined
  ) => {
    routeNavigator.showModal(MODAL_PAGE_LESSON)

    const lessonDate = new Date(lesson.date)
    const lessonId = lessonDate.toISOString()

    const modalData = {
      name,
      endTime,
      startTime,
      timetable,
      gradebook,
      tasks: gradebook?.tasks,
      lessonId,
    }

    dispatch(setLessonModalData(modalData))
  }

  const currentDate = new Date()
  const formattedLessonDate = formatLessonDate(lesson.date)
  const lessonDate = new Date(lesson.date)

  if (lessonDate.getDay() === 0) {
    return null
  }

  const lessonYear = lessonDate.getFullYear().toString()
  const lessonMonth = (lessonDate.getMonth() + 1).toString().padStart(2, '0')
  const lessonDay = lessonDate.getDate().toString().padStart(2, '0')
  const lessonDayOfWeek = getDayOfWeek(lessonDate)
  const isLessonToday = isToday(lessonDate)

  const currentYear = currentDate.getFullYear().toString()
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const currentDay = currentDate.getDate().toString().padStart(2, '0')

  const dayEnded =
    currentYear === lessonYear &&
    currentMonth === lessonMonth &&
    currentDay > lessonDay

  const displayDay = dayEnded
    ? ' День завершён'
    : isLessonToday
    ? 'Сегодня'
    : ''
  const displayEndDayStyles = dayEnded && '#888888'
  const displayCurrDayStyles =
    isLessonToday && 'var(--vkui--color_background_accent)'

  const displayDayStyles: CSSProperties = {
    color: displayEndDayStyles || displayCurrDayStyles || undefined,
    padding: '3px 5px',
    borderRadius: '5px',
    border: `1px solid ${displayEndDayStyles || displayCurrDayStyles}`,
  }

  return (
    <Card className="lessonCard" key={lesson.date}>
      <Group
        header={
          //@ts-ignore типы React не совсем совместимы с Preact
          <Header
            mode="secondary"
            /*//@ts-ignore типы React не совсем совместимы с Preact*/
            aside={<Footnote style={displayDayStyles}>{displayDay}</Footnote>}
          >
            {lessonDayOfWeek && `${lessonDayOfWeek}. `}
            {formattedLessonDate}
          </Header>
        }
      >
        {lesson.lessons && lesson.lessons.length > 0 ? (
          lesson.lessons.map(
            ({ name, endTime, startTime, timetable, gradebook }) =>
              name && (
                <SimpleCell
                  className="lesson"
                  onClick={() =>
                    handleLessonClick(
                      name,
                      endTime,
                      startTime,
                      timetable,
                      gradebook
                    )
                  }
                  key={startTime}
                  subtitle={
                    !name || (
                      <div>
                        <div>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            {gradebook?.lessonType && (
                              <SubtitleWithBorder
                                style={{ margin: '5px 5px 5px 0px' }}
                              >
                                {LessonWorkType[gradebook?.lessonType]}
                              </SubtitleWithBorder>
                            )}
                            {gradebook?.absenceType && (
                              <SubtitleWithBorder
                                color={
                                  gradebook.absenceType === 'IsLate'
                                    ? 'yellow'
                                    : 'red'
                                }
                              >
                                {AbsenceTypes[gradebook?.absenceType]}
                              </SubtitleWithBorder>
                            )}
                          </div>
                          <TimeRemaining
                            lessonDate={lesson.date}
                            startTime={startTime}
                            endTime={endTime}
                          />
                        </div>
                        <div>
                          {startTime === undefined
                            ? ''
                            : `${startTime} — ${endTime}, каб. ${
                                timetable?.classroom.name === '0'
                                  ? 'ДО'
                                  : timetable?.classroom.name
                              }`}
                        </div>
                        <div
                          style={{
                            marginBottom: 5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            {timetable?.teacher?.lastName
                              ? `${timetable.teacher?.lastName} ${timetable.teacher?.firstName[0]}. ${timetable.teacher?.middleName[0]}.`
                              : 'Не указан'}
                          </div>
                          <div style={{ display: 'flex' }}>
                            {gradebook?.tasks?.map(
                              (task, index) => {
                                
                                return (task.isRequired ||
                                  setDefaultMark(task)) && (
                                  <Mark
                                    useMargin
                                    mark={setDefaultMark(task)}
                                    size="s"
                                    key={index}
                                  />
                                )
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }
                >
                  {name}
                </SimpleCell>
              )
          )
        ) : (
          <Placeholder>Пар нет</Placeholder>
        )}
      </Group>
    </Card>
  )
}

export default LessonCard
