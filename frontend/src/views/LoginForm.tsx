import {
  useState, FC, ChangeEvent, ReactNode,
} from 'react';
import {
  Button, FormItem, FormLayout, Input, Group, Panel, View, FormStatus, ScreenSpinner,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import Hashes from 'jshashes';
import bridge from '@vkontakte/vk-bridge';

import { AuthData } from '../../../shared';
import { VIEW_SCHEDULE } from '../routes';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';

const LoginForm: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDataInvalid, setIsDataInvalid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [popout, setPopout] = useState<ReactNode | null>(null);
  const clearPopout = () => setPopout(null);
  const setErrorScreenSpinner = () => {
    setPopout(<ScreenSpinner state='loading' />);

    setTimeout(() => {
      setPopout(<ScreenSpinner state='error'>Произошла ошибка</ScreenSpinner>);

      setTimeout(clearPopout, 300);
    }, 1);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    const setStateAction = {
      login: setLogin,
      password: setPassword,
    }[name];
    setIsDataInvalid(false);
    setStateAction && setStateAction(value);
  };

  const loginPattern = /^[a-zA-Z0-9-]+$/;

  const handleLogin = async () => {
    if (!loginPattern.test(login)) {
      setIsDataInvalid(true);
      return;
    }
    const passwordHashed = (new Hashes.SHA256()).b64(password);
    setIsLoading(true);
    setPopout(<ScreenSpinner state='loading' />);
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        login,
        password: passwordHashed,
      },
    });

    if (response.status === 401) {
      setIsLoading(false);
      setErrorScreenSpinner();
      setIsDataInvalid(true);
    }

    if (!response.ok) {
      setIsLoading(false);
      setErrorScreenSpinner();
      throw new Error('Failed to fetch login');
    }
    const dataResp = await response.json() as AuthData;

    try {
      await bridge.send('VKWebAppStorageSet', {
        key: 'cookie',
        value: dataResp.cookie,
      })
        .then((data) => {
          if (data.result) {
            console.log('куки сохранены');
          }
        })
        .catch((error) => {
          console.error(error);
        });

      await bridge.send('VKWebAppStorageSet', {
        key: 'id',
        value: String(dataResp.data.tenants.SPO_23.studentRole.id),
      })
        .then((data) => {
          if (data.result) {
            console.log('id saved');
          }
        })
        .catch((error) => {
          console.error(error);
        });

      setIsLoading(false);
      await routeNavigator.replace(`/${VIEW_SCHEDULE}`);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Авторизация' />
        <Group>
          {isDataInvalid && (
          <FormStatus header='Некорректный данные' mode='error'>
            Проверьте правильность логина и пароля
          </FormStatus>
          )}
          <FormLayout>
            <FormItem
              required
              htmlFor='userLogin'
              top='Логин'
              status={login === '' ? 'default' : (loginPattern.test(login) ? 'valid' : 'error')}
              bottom={login === '' ? '' : (loginPattern.test(login) ? 'Логин введён' : 'Введите корректный логин')}
              bottomId='login-type'
            >
              <Input
                required
                aria-labelledby='login-type'
                id='userLogin'
                type='text'
                name='login'
                placeholder='Введите логин'
                value={login}
                onChange={onChange}
              />
            </FormItem>
            <FormItem
              top='Пароль'
              htmlFor='pass'
              status={password === '' ? 'default' : (password ? 'valid' : 'error')}
              bottom={password === '' ? '' : (password ? 'Пароль введён' : 'Введите корректный пароль')}
            >
              <Input
                name='password'
                id='pass'
                type='password'
                placeholder='Введите пароль'
                onChange={onChange}
              />
            </FormItem>
            <FormItem>
              <Button size='l' stretched onClick={() => handleLogin()} disabled={!password || !login || !loginPattern.test(login) || isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </FormItem>
          </FormLayout>
          {popout}
        </Group>
      </Panel>
    </View>
  );
};

export default LoginForm;
