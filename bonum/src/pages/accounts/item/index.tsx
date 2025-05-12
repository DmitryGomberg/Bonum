import { FC } from 'react'

type IAccountPageItemProps = {
   id: number
   name: string
   currency: string
   value: number
}

export const AccountPageItem: FC<IAccountPageItemProps> = (props) => {

  return (
     <>
        <div className={'bg-white border border-brown3 rounded-xl px-4 py-3 flex items-center'}>
           <p className={'font-bold max-w-[60%] w-full'}>
              {props.name}
           </p>
           <div className={'whitespace-nowrap ml-auto flex items-center gap-[10px]'}>
              <span className={'whitespace-nowrap w-full text-center font-bold'}>
                 {props.value}
              </span>
              {props.currency}
           </div>
        </div>
     </>
  )
}