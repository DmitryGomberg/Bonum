import { FC, useState } from 'react'
import {UiInput} from "../../ui/input";
import {UiSelect} from "../../ui/select";
import {UiButton} from "../../ui/button";
import {UiTextarea} from "../../ui/textarea";
import {UiTabs} from "../../ui/tabs";
import {UiTitle} from "../../ui/titles/title";

interface Option {
   id: number;
   label: string;
}

export const AddTransactionPage: FC = () => {
   const [sum, setSum] = useState<number>(0)
   const [description, setDescription] = useState<string>('')
   const [date, setDate] = useState<string>('')
   const [type, setType] = useState<number>();


  return (
    <div className={'flex flex-col items-center gap-[20px] max-w-[700px] mx-auto'}>
       <UiTitle>Добавить новую транзакцию</UiTitle>
       <UiTabs values={[{id:1, label:'Расход'}, {id:2, label:'Доход'}, {id:3, label:'Перевод'}]} onClick={(e: number)=> setType(e)} />
       <div className={'bg-white p-5 flex flex-col gap-[20px] w-full border border-brown3 rounded-xl'}>
          <div className={'flex gap-[20px]'}>
             <UiInput label={'Укажите сумму'} placeholder={'Введите сумму'} type={'number'} value={sum.toString()}
                      onChange={(e) => {
                         setSum(Number(e.target.value))
                      }}/>
             <UiInput label={'Укажите дату'} type={'date'} value={date} placeholder={'Введите дату'}
                      onChange={(e) => setDate(e.target.value)}/>
          </div>
          <div className={'flex gap-[20px]'}>
             <UiSelect
                label={'Укажите категорию'}
                options={[{id: 1, label: 'apple'}, {id: 2, label: 'banana'}, {id: 3, label: 'orange'}]}
             />
             <UiSelect
                label={'Выберите счет'}
                options={[{id: 1, label: 'Наличные'}, {id: 2, label: 'Альфа'}, {id: 3, label: 'Беларусьбанк'}]}
             />
          </div>
          <UiTextarea label={'Описание'} placeholder={'Введите значение'} value={description} onChange={(e) => {
             setDescription(e.target.value)
          }}/>
          <UiButton label={'Добавить запись'} onClick={() => {
          }}/>
       </div>
    </div>
 )
}