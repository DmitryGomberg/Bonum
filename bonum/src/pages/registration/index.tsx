import { FC, useState } from 'react'
import { UiTitle } from '../../ui/titles'
import { UiInput } from '../../ui/input'
import { UiButton } from '../../ui/button'
import { useNavigate } from 'react-router-dom'

export const RegisterPage: FC = () => {
   const navigate = useNavigate()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')

   const handleRegister = async () => {
      if (password !== confirmPassword) {
         console.error('Пароли не совпадают');
         alert('Пароли не совпадают!')
         return
      }
      console.log(username, password)
      try {
         const response = await fetch('http://localhost:8080/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: username, password }),
         })
         if (response.ok) {
            alert('Пользователь зарегистрирован!')
            navigate('/login')
         } else {
            console.log(response)
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
               <UiInput label="Имя пользователя" placeholder="Введите значение" value={username} onChange={(e) => setUsername(e.target.value)} />
               <UiInput label="Пароль" placeholder="Введите значение" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
               <UiInput label="Повторите пароль" placeholder="Введите значение" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
               <UiButton label="Зарегистрироваться" onClick={handleRegister} className="mt-2" />
               <p className="text-white text-[11px] text-center font-extralight">Уже есть аккаунт? <span className="underline cursor-pointer" onClick={() => navigate('/login')}>Войти</span></p>
            </div>
         </div>
      </div>
   )
}