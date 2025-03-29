import {FC, ReactNode} from 'react'
import { UiLink } from '../../../../ui/link';

type IHomeCardProps = {
  icon: ReactNode;
  name: string;
  sum: string;
  onClick(): void;
}

export const HomeCard: FC<IHomeCardProps> = (props) => {
  return (
     <div className={'border border-brown3 rounded-xl bg-brown1 overflow-hidden'}>
       <div className={'p-4 py-6 flex items-center gap-[15px]'}>
         {props.icon}
         <div className={'flex flex-col'}>
           {props.name}
           <span className={'font-medium'}>{props.sum}</span>
         </div>
       </div>
       <div className={'bg-brown2 p-3 cursor-pointer'} onClick={props.onClick}>
          <UiLink>
            Показать все
          </UiLink>
       </div>
     </div>
  )
}