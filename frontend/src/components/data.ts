import { IHelpAccordion } from './HelpAccordion';

export const helpData: IHelpAccordion[] = [
  {
    id: 1,
    title: 'Часто приходится удалять сервис',
    detail:
      'Как правило, эта проблема появляется на телефонах. Одно из возможных решений - не заходить по прямой ссылке в '
      + 'сервис, а через страницу Сервисы -> Для вас -> Дневник СПО.',
  },
  {
    id: 2,
    title: 'В сервисе стоит оценка, которой нет в журнале Сетевого города',
    detail:
      'Иногда в журнале может появиться отметка, которой нет в оригинальном дневнике (Сетевой город). Обычно это \'Д\''
      + ' (Долг), но если вы уверены, что долга у вас нет, то напишите нам.',
  },
  {
    id: 3,
    title: 'На странице Успеваемость нет данных обо мне',
    detail:
      'Если на странице Успеваемость нет данных о вас, то перезайдите в сервис (Настройки - Выйти), но если они '
      + 'неправильные, то сообщите нам. Все данные, кроме аватарки, мы берём из Сетевого города.',
  },
];
