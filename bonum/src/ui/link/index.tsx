import {FC, ReactNode} from 'react'

type IUiLinkProps = {
   children: ReactNode;
   className?: string;
}

export const UiLink: FC<IUiLinkProps> = (props) => {
  return (
    <div className={`text-brown5 text-[14px] font-medium cursor-pointer + ${props.className}`}>
       {props.children}
    </div>
  )
}