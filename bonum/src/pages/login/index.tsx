import { FC, useState } from 'react'
import { useAuth } from '../../App'
import { UiTitle } from '../../ui/titles'
import { UiInput } from '../../ui/input'
import { UiButton } from '../../ui/button'
import { useNavigate } from 'react-router-dom'

export const LoginPage: FC = () => {
   const { login } = useAuth()
   const navigate = useNavigate()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   const handleLogin = async () => {
      try {
         // Replace with your API call
         const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
         })
         if (response.ok) {
            login()
            navigate('/home')
         } else {
            // Handle login error
            console.error('Login failed')
         }
      } catch (error) {
         console.error('Error:', error)
      }
   }

   return (
      <div className="bg-white w-full h-screen flex items-center justify-center">
         <div className="flex flex-col gap-[10px] bg-blue1 p-8 rounded-2xl max-w-[400px] w-full">
            <UiTitle className="text-white">Войти</UiTitle>
            <div className="flex flex-col gap-[10px]">
               <UiInput label="Имя пользователя" placeholder="Введите значение" value={username} onChange={(e) => setUsername(e.target.value)} />
               <UiInput label="Пароль" placeholder="Введите значение" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
               <span className="text-white text-[11px] font-extralight text-center block underline cursor-pointer inline-flex self-center">Забыли пароль</span>
               <UiButton label="Войти" onClick={handleLogin} />
               <p className="text-white text-[11px] text-center font-extralight">Нет аккаунта? <span className="underline cursor-pointer" onClick={() => navigate('/registration')}>Зарегистрироваться</span></p>
            </div>
         </div>
      </div>
   )
}