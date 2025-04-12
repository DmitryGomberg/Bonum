import {FC, useEffect, useState} from 'react'
import {UiTitle} from "../../ui/titles/title";
import {UiButton} from "../../ui/button";
import {Add} from "@mui/icons-material";
import {AccountPageItem} from "./item";
import {UiSkeleton} from "../../ui/skeleton";
import {ModalCreateAccount} from "../../components/modals/createAccount";

export const AccountsPage: FC = () => {
   const [dollarRate, setDollarRate] = useState<number | undefined>()
   const [modalActive, setModalActive] = useState<boolean>(false);

   const getRate = async () => {
      try {
         const response = await fetch('https://api.nbrb.by/exrates/rates/431', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
         });
         if (response.ok) {
            const data = await response.json();
            console.log(data)
            setDollarRate(data.Cur_OfficialRate)
         } else {
            console.error('Failed to get currency USD to BYN');
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   useEffect(() => {
      getRate()
   }, []);

  return (
     <div>
        <div className={'max-w-[800px] mx-auto flex flex-col gap-[20px]'}>
           <div className={'flex items-center justify-between'}>
              <UiTitle>Счета</UiTitle>
              <UiButton label={'Добавить счет'} contentRight={<Add/>} onClick={() => {
                 setModalActive(true)
              }}/>
           </div>
           <div className={'flex flex-col gap-[10px]'}>
              <AccountPageItem name={'Наличные'} amount={150.32} currency={'BYN'}/>
              <AccountPageItem name={'Карта АльфаБанк'} amount={1805.32} currency={'USD'}/>
              <AccountPageItem name={'Карта СберБанк'} amount={195.00} currency={'BYN'}/>
              <AccountPageItem name={'Копилка BYN'} amount={19450.32} currency={'BYN'}/>
              <AccountPageItem name={'Копилка USD'} amount={1249.32} currency={'USD'}/>
           </div>
           <span className={'h-[1px] bg-brown5'}/>
           <div className={'flex flex-col items-end'}>
              <p className={'text-right text-black'}>Всего: 3428 BYN + 1263 USD = <span
                 className={'font-medium text-brown5 text-[20px]'}>1 000 000 BYN</span></p>
              <span className={'text-[12px] text-gray-500 flex items-center gap-[5px]'}>по курсу 1 USD = {dollarRate ? dollarRate : <UiSkeleton width={'37px'} height={'13px'} />} BYN</span>
           </div>
        </div>
        <ModalCreateAccount active={modalActive} onClose={()=> setModalActive(false)} />
     </div>
  )
}
