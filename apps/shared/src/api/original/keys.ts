export type LessonWorkTypeKeys =
  | 'Lesson'
  | 'Control'
  | 'Independent'
  | 'Laboratory'
  | 'Slice'
  | 'Home'
  | 'Test'
  | 'Review'
  | 'Report'
  | 'Colloquium'
  | 'SportStandarts'
  | 'PracticalWork'
  | ''

export type LessonTypeKeys =
  | 'Lecture'
  | 'Lesson'
  | 'PracticalWork'
  | 'PracticalTraining'
  | 'Seminar'
  | 'Practice'
  | 'Laboratory'
  | 'Self'
  | 'Consultation'
  | 'Excursion'
  | 'Examination'
  | 'Composition'
  | 'BusinessGame'
  | 'SportStandarts'
  | ''

export type AbsenceTypesKeys = 'IsAbsent' | 'IsLate'

export type AbsenceTypesDescriptionKeys = 'Н' | 'О'
export type AdditionalMarks = 'Д' | 'Зч'
export type ExaminationKeys = 'DifferentiatedTest' | 'Test' | 'Exam' | 'Other'
export type TermSubjectExaminationKeys = 'subjects' | 'profModules' | 'courseWorks'