import {ChangeEvent, FC} from 'react'

type IUiInputProps = {
   label: string;
   type?: string;
   placeholder?: string;
   value: string;
   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const UiInput: FC<IUiInputProps> = (props) => {
   return (
      <div className={'w-full flex flex-col g-[3px]'}>
         <div className={'text-white text-[12px]'}>{props.label}</div>
         <input
            type={props.type || 'text'}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            className={'bg-white border border-pink rounded-s px-[20px] py-[5px] text-[16px] outline-purple'}
         />
      </div>
   )
}