import { FC } from 'react'
import {
  Card,
  CardGrid,
  Div,
  Group,
  Header,
  HorizontalScroll,
  MiniInfoCell,
  Title,
} from '@vkontakte/vkui'
import {
  Icon20IncognitoOutline,
  Icon20StatisticsOutline,
} from '@vkontakte/icons'
import {
  AbsenceType,
  AbsenceTypes,
  AbsenceTypesKeys, Grade,
  PerformanceCurrent,
  TextMark,
} from 'diary-shared'
import calculateAverageMark from '../utils/calculateAverageMark'
import Mark from './UI/Mark'
import { ReturnedMark } from '../utils/setDefaultMark.ts'

interface IMarksByGroup {
  marksForSubject: PerformanceCurrent | null
}

const MarksByGroup: FC<IMarksByGroup> = ({ marksForSubject }) => {
  const subjectMarksMap: Record<
    string,
    { date: string; marks: TextMark[]; absenceType?: AbsenceType }[]
  > = {}

  if (!marksForSubject) {
    return (
      <Group
        mode="plain"
        header={<Header mode="secondary">Оценки по дисциплинам</Header>}
      >
        <CardGrid size="l">
          <Card mode="shadow">
            <Div>
              {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
              <Title level="3">Нет данных</Title>
            </Div>
          </Card>
        </CardGrid>
      </Group>
    )
  }

  marksForSubject?.daysWithMarksForSubject?.map((subject) => {
    const { subjectName, daysWithMarks } = subject
    if (!subjectMarksMap[subjectName]) {
      subjectMarksMap[subjectName] = []
    }

    daysWithMarks?.forEach((dayWithMark) => {
      subjectMarksMap[subjectName].push({
        date: new Date(dayWithMark.day).toLocaleDateString(),
        marks: dayWithMark.markValues,
        absenceType: dayWithMark.absenceType,
      })
    })
  })

  return (
    <Group
      mode="plain"
      header={<Header mode="secondary">Оценки по дисциплинам</Header>}
    >
      {Object.keys(subjectMarksMap).map((subjectName, i) => (
        <CardGrid key={i} size="l">
          <Card mode="shadow">
            <Div>
              {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
              <Title level="3">{subjectName}</Title>
            </Div>
            <HorizontalScroll>
              <div style={{ display: 'flex' }}>
                {subjectMarksMap[subjectName].map(
                  ({ date, marks, absenceType }) => (
                    <div
                      key={`${date}_${absenceType}`}
                      style={{ display: 'flex' }}
                    >
                      {marks.length > 0 && !absenceType ? (
                        marks.map((mark, k) => (
                          <Mark
                            key={k}
                            mark={Grade[mark] as ReturnedMark}
                            size="s"
                          />
                        ))
                      ) : absenceType ? (
                        <Mark
                          size="s"
                          mark={AbsenceTypes[absenceType] as AbsenceTypesKeys}
                        />
                      ) : null}
                    </div>
                  )
                )}
              </div>
            </HorizontalScroll>
            {marksForSubject &&
            marksForSubject.daysWithMarksForSubject[i].averageMark ? (
              <MiniInfoCell
                textWrap="full"
                before={<Icon20StatisticsOutline />}
                style={{ marginTop: 5 }}
                after={calculateAverageMark(subjectMarksMap[subjectName].flatMap(({ marks }) => marks))}
              >
                Средний балл:
              </MiniInfoCell>
            ) : (
              <MiniInfoCell before={<Icon20IncognitoOutline />}>
                Нет оценок
              </MiniInfoCell>
            )}
          </Card>
        </CardGrid>
      ))}
    </Group>
  )
}

export default MarksByGroup
