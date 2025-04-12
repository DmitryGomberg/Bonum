import {FC, ReactNode} from 'react'
import {Close} from "@mui/icons-material";

type IUiModalProps = {
   active: boolean;
   children: ReactNode;
   title: string;
   onClose(): void;
}

export const UiModal: FC<IUiModalProps> = (props) => {
  return (
    <div className={`z-100 fixed w-screen h-screen top-0 right-0 bg-brown3/70 backdrop-blur-sm transition flex items-center justify-center ${props.active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
       <div className={`transition flex flex-col  max-w-[450px] w-full border border-brown3 rounded-2xl ${props.active ? 'translate-y-0' : 'translate-y-4'}`}>
         <div className={'bg-brown4 p-3 px-5 text-white flex items-center justify-between text-[20px] font-medium rounded-t-2xl overflow-hidden]'}>
            {props.title}
            <Close onClick={props.onClose} className={'cursor-pointer'} />
         </div>
          <div className={'p-3 px-5 bg-white rounded-b-2xl flex flex-col gap-[15px]'}>
             {props.children}
          </div>
       </div>
    </div>
  )
}