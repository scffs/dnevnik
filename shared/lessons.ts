interface Task {
  attachments:[]
  id: number
  isRequired: boolean
  mark: 'Five' | 'Four' | 'Three' | 'Two' | 'One'
  topic: string
  type: 'Lesson'
}

interface Teacher {
  firstName: string
  id: number
  lastName: string
  middleName: string
}

interface Timetable {
  classroom: {
    building: string
    id: number
    name: string
  },
  teacher?: Teacher
}

export interface Lesson {
  endTime: Date
  startTime: Date
  name: string | null
  timetable: Timetable
  gradebook?: {
    id: number
    lessonType: 'Lecture'
    tasks: Task[]
    themes: []
  }
}
export interface Day {
  date: Date;
  lessons: Lesson[] | null
}
