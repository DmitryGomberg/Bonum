import {FC, useState} from 'react';
import { UiTitle } from '../../ui/titles';
import { UiInput } from '../../ui/input';
import { UiButton } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import {useNotifications} from "../../context/notifications.tsx";
import {useAuth} from "../../context/auth.tsx";

export const LoginPage: FC = () => {
   const { login } = useAuth();
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const {showNotification} = useNotifications();

   const handleLogin = async () => {
      try {
         const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: email, password }),
         });
         if (response.ok) {
            const data = await response.json();
            showNotification('Успешный вход', 'success');
            login(data.accessToken);
            navigate('/home');
         } else {
            showNotification('Неверные email или пароль', 'error');
            console.error('Login failed');
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   return (
      <div className="bg-white w-full h-screen flex items-center justify-center relative">
         <div className="flex flex-col gap-[10px] bg-blue1 p-8 rounded-2xl max-w-[400px] w-full z-10">
            <UiTitle className="text-white">Войти</UiTitle>
            <div className="flex flex-col gap-[10px]">
               <UiInput label="Имя пользователя" placeholder="Введите значение" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
               <UiInput label="Пароль" placeholder="Введите значение" type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
               <span
                  className="text-white text-[11px] font-extralight text-center block underline cursor-pointer inline-flex self-center">Забыли пароль</span>
               <UiButton label="Войти" onClick={handleLogin} />
               <p className="text-white text-[11px] text-center font-extralight">Нет аккаунта? <span
                  className="underline cursor-pointer"
                  onClick={() => navigate('/registration')}>Зарегистрироваться</span></p>
            </div>
         </div>
      </div>
   );
};