import { FC, useState } from 'react'
import { UiTitle } from '../../ui/titles'
import { UiInput } from '../../ui/input'
import { UiButton } from '../../ui/button'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/notifications'
import { useAuth } from '../../context/auth'

export const RegisterPage: FC = () => {
   const navigate = useNavigate()
   const { login } = useAuth();
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const {showNotification} = useNotifications();

   const handleRegister = async () => {
      if (password !== confirmPassword) {
         console.error('Пароли не совпадают');
         showNotification('Пароли не совпадают', 'error');
         return
      }
      try {
         const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: email, password }),
         })
         if (response.ok) {
            const data = await response.json();
            login(data.accessToken);
            showNotification('Пользователь успешно зарегистрирован', 'success');
            navigate('/login')
         } else {
            console.log(response)
            showNotification('Ошибка регистрации', 'error');
            console.error('Registration failed')
         }
      } catch (error) {
         console.error('Error:', error)
      }
   }

   return (
      <div className="bg-white w-full h-screen flex items-center justify-center">
         <div className="flex flex-col gap-[10px] bg-blue1 p-8 rounded-2xl max-w-[440px] w-full">
            <UiTitle className="text-white">Регистрация</UiTitle>
            <div className="flex flex-col gap-[10px]">
               <UiInput label="Имя пользователя" placeholder="Введите значение" value={email} onChange={(e) => setEmail(e.target.value)} />
               <UiInput label="Пароль" placeholder="Введите значение" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
               <UiInput label="Повторите пароль" placeholder="Введите значение" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
               <UiButton label="Зарегистрироваться" onClick={handleRegister} className="mt-2" />
               <p className="text-white text-[11px] text-center font-extralight">Уже есть аккаунт? <span className="underline cursor-pointer" onClick={() => navigate('/login')}>Войти</span></p>
            </div>
         </div>
      </div>
   )
}