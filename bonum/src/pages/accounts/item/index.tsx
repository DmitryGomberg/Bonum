import { FC } from 'react'

type IAccountPageItemProps = {
   name: string
   amount: number
   currency: string
}

export const AccountPageItem: FC<IAccountPageItemProps> = (props) => {
  return (
     <>
        <div className={'bg-white border border-brown3 rounded-xl px-4 py-3 flex items-center'}>
           <p className={'font-bold max-w-[60%] w-full'}>
              {props.name}
           </p>
           <div className={'whitespace-nowrap max-w-[10%] w-full text-center font-bold'}>
              {props.amount}
           </div>
           <div className={'whitespace-nowrap ml-auto'}>
              {props.currency}
           </div>
        </div>
     </>
  )
}