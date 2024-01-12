import { ExplanationTooltip } from '@components'
import { Day } from '@diary-spo/shared'
import {
  Icon16ArrowLeftOutline,
  Icon16ArrowRightOutline
} from '@vkontakte/icons'
import { Button, ButtonGroup, IconButton } from '@vkontakte/vkui'
import { endOfWeek, startOfWeek } from '@vkontakte/vkui/dist/lib/date'
import { useState } from 'preact/hooks'
import { FC, useEffect } from 'react'
import { useDebouncedChangeWeek } from '../../hooks'
import { SnackbarData } from '../../hooks/useSnackbar.tsx'
import { ServerResponse } from '../../types'

interface ScheduleAsideButtonsProps {
  handleGetLesson: (start: Date, end: Date) => ServerResponse<Day[]>
  showSnackbar: (data: SnackbarData) => void
  getError: () => void
  startDate: Date
  endDate: Date
  setIsLoading: (value: boolean) => void
  setLessons: (data: Day[]) => void // (data: Day[])
  setStartDate: (startWeek: Date) => void
  setEndDate: (endWeek: Date) => void
}

const ScheduleAsideButtons: FC<ScheduleAsideButtonsProps> = ({
  handleGetLesson,
  startDate,
  endDate,
  getError,
  showSnackbar,
  setLessons,
  setIsLoading,
  setStartDate,
  setEndDate
}) => {
  const [isCurrent, setIsCurrent] = useState(false)
  const debouncedChangeWeekHook = useDebouncedChangeWeek(
    startDate,
    endDate,
    setIsCurrent,
    setStartDate,
    setEndDate
  )
  const { handleButtonClick: debouncedHandleButtonClick } =
    debouncedChangeWeekHook

  const newDate = new Date()

  /** Для обновления текущей недели **/
  useEffect(() => {
    const startWeek = startOfWeek(startDate)
    const startOfCurrWeek = startOfWeek(newDate)

    const startWeekStr = startWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    if (startWeekStr === startOfCurrWeekStr) {
      localStorage.setItem('isCurrent', JSON.stringify(true))
      return setIsCurrent(true)
    }

    localStorage.setItem('isCurrent', JSON.stringify(false))
    localStorage.setItem('currentDate', startDate.toString())
    setIsCurrent(false)
  }, [startDate])

  const getCurrentWeek = async () => {
    const startWeek = startOfWeek(newDate)
    const startOfCurrWeek = startOfWeek(startDate)
    const endWeek = endOfWeek(newDate)

    const startWeekStr = startWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const startOfCurrWeekStr = startOfCurrWeek.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    if (startWeekStr === startOfCurrWeekStr) {
      showSnackbar({
        title: 'Вы уже на текущей неделе'
      })
      localStorage.setItem('isCurrent', JSON.stringify(true))
      setIsCurrent(true)
      return
    }

    setIsLoading(true)
    try {
      const data = await handleGetLesson(startWeek, endWeek)
      setLessons(data as Day[])
      setStartDate(startWeek)
      setEndDate(endWeek)

      localStorage.setItem('isCurrent', JSON.stringify(true))
      setIsCurrent(true)
    } catch (e) {
      console.error(e)
      getError()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ButtonGroup
      style={{
        alignItems: 'center',
        position: 'relative',
        color: 'var(--vkui--color_stroke_accent_themed)'
      }}
      gap='s'
    >
      {/*// @ts-ignore Типы React не совместимы с Preact*/}
      <IconButton
        aria-label='Prev'
        onClick={() => debouncedHandleButtonClick('prev', handleGetLesson)}
      >
        <Icon16ArrowLeftOutline />
      </IconButton>
      {/*// @ts-ignore Типы React не совместимы с Preact*/}
      <Button
        size='s'
        mode='secondary'
        onClick={() => getCurrentWeek()}
        disabled={isCurrent}
      >
        <ExplanationTooltip
          tooltipContent='Вернёт вас на текущую неделю'
          text='Домой'
        />
      </Button>
      {/*// @ts-ignore Типы React не совместимы с Preact*/}
      <IconButton
        aria-label='Next'
        onClick={() => debouncedHandleButtonClick('next', handleGetLesson)}
      >
        <Icon16ArrowRightOutline />
      </IconButton>
    </ButtonGroup>
  )
}

export default ScheduleAsideButtons
