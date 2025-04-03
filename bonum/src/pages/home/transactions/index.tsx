import { FC } from 'react'
import {UiSubtitle} from "../../../ui/titles/subtitle";
import {UiLink} from "../../../ui/link";

export const HomeTransactions: FC = () => {
  return (
    <div className={'flex flex-col gap-[15px]'}>
      <div className={'flex justify-between items-center'}>
         <UiSubtitle>Последние транзакции</UiSubtitle>
         <UiLink>Показать все</UiLink>
      </div>
       <div className={'border border-brown3 p-8 rounded-xl flex flex-col gap-[5px]'}>
            <p className={'text-[14px] text-black text-center w-full'}>Транзакции не найдены</p>
            <UiLink className={'text-center'} goto={'/createTransaction'}>Создать первую транзакцию</UiLink>
       </div>
    </div>
  )
}