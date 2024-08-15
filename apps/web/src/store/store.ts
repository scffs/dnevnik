/**
 * Наш собственный глобальный store (хранилищие)
 *
 * Определяет интерфейс TStore для объекта хранилища, содержащего начальное состояние.
 * Функция createStore принимает объект TStore<T> с начальным состоянием и возвращает объект хранилища.
 * Она определяет типы State для текущего состояния и ListenerCallback для слушателей изменений.
 *
 * Создает объект хранилища, включающий функции управления состоянием:
 *   - state: хранит текущее состояние.
 *   - setState: устанавливает новое состояние и уведомляет слушателей.
 *   - getState: возвращает текущее состояние.
 *   - listeners: множество слушателей изменений состояния.
 *   - subscribe: функция подписки на изменения с возможностью отписки.
 */

export interface TStore<T> {
  initialState: T
}

export const createStore = <T>({ initialState }: TStore<T>) => {
  type State = T
  type ListenerCallback = () => void

  const store = {
    state: initialState,
    setState: (newValue: State) => {
      store.state = newValue
      for (const listener of store.listeners) {
        listener()
      }
    },
    getState: (): State => store.state,
    listeners: new Set<ListenerCallback>(),
    subscribe: (cb: ListenerCallback) => {
      store.listeners.add(cb)
      return () => {
        store.listeners.delete(cb)
      }
    }
  }

  return store
}

/**
 * === Как это работает в React ===
 *
 * React использует концепцию однонаправленного потока данных, называемого "подъемом состояния" (lifting state up) и
 * "передачей пропсов"(prop drilling), чтобы управлять состоянием приложения (сайта) и передавать его между компонентами.
 *
 * Хранилище, созданное функцией createStore, является механизмом централизованного хранения состояния.
 * При обновлении состояния через функцию setState, все зарегистрированные слушатели (listeners) вызываются,
 * что позволяет компонентам, подписанным на это состояние, обновлять свое представление с учетом изменений.
 *
 * Использование слушателей позволяет реактивно обновлять компоненты, связанные с этим хранилищем, при изменении его состояния.
 * Компоненты могут подписываться на это хранилище с помощью функции subscribe, чтобы получать уведомления о изменениях
 * и перерисовываться с новыми данными.
 */
