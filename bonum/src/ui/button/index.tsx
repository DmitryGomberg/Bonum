import {FC, ReactNode} from 'react'

type IUiButtonProps = {
   className?: string;
   label: string;
   contentLeft?: ReactNode;
   contentRight?: ReactNode;
   onClick(): void;
}

export const UiButton: FC<IUiButtonProps> = (props) => {
  return (
    <button className={'text-center bg-blue3 hover:bg-blue2 transition w-full text-white px-[26px] py-[8px] rounded-xl cursor-pointer outline-purple' + " " + props.className} onClick={props.onClick}>
       {props.contentLeft}
       {props.label}
       {props.contentRight}
    </button>
  )
}