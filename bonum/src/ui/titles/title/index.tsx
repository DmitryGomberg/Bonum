import {FC, ReactNode} from 'react'

type IUiTitleProps = {
   children: ReactNode;
   className?: string;
}
export const UiTitle: FC<IUiTitleProps> = (props) => {
  return (
    <h1 className={'text-[24px] font-bold text-center ' + props.className} >
       {props.children}
    </h1>
  )
}