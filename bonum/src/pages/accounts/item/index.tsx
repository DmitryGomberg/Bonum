import { FC, useState } from 'react'
import {ModalEditAccount} from "../../../components/modals/editAccount";

type IAccountPageItemProps = {
   name: string
   amount: number
   currency: string
}

export const AccountPageItem: FC<IAccountPageItemProps> = (props) => {
   const [activeModal, setActiveModal] = useState(false);

  return (
     <>
        <div className={'bg-white border border-brown3 rounded-xl px-4 py-3 flex items-center'}>
           <p className={'font-bold max-w-[300px] w-full'}>
              {props.name}
           </p>
           <div className={'mr-auto'}>
              {props.amount + ' ' + props.currency}
           </div>
           <button className={'text-brown5 underline text-[14px] cursor-pointer'} onClick={()=> setActiveModal(true)}>Редактировать</button>
        </div>
        <ModalEditAccount active={activeModal} onClose={()=> setActiveModal(false)} />
     </>
  )
}