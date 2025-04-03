import { ArrowDropDown } from '@mui/icons-material';
import {FC, useEffect, useRef, useState} from 'react'

type IUiSelectProps = {
   values: { id: number; label: string }[];
   label?: string;
   error?: boolean;
   required?: boolean;
}

export const UiSelect: FC<IUiSelectProps> = (props) => {
   const [active, setActive] = useState<boolean>(false)
   const [current, setCurrent] = useState<{ id: number; label: string }>({ id: 0, label: 'Укажите вариант' })
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (ref.current && !ref.current.contains(event.target as Node)) {
            setActive(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [ref]);

  return (
     <div className={'w-full flex flex-col gap-[8px]'}>
        {props.label && <label
            className={`text-black text-[14px] font-medium text-[12px] ${props.error ? 'text-red' : ''}`}>{props.label}{props.required ?
           <span className={'text-red'}>*</span> : ''}</label>}
        <div ref={ref} className={'relative'}>
           <button onClick={() => {
              setActive(!active)
           }}
                className={'outline-brown4 select-none flex items-center gap-[15px] justify-between cursor-pointer bg-brown1 border border-brown3 rounded-md px-[12px] py-[8px] text-[14px] text-black font-normal w-full'}>
              {current.label}
              <span className={`${active ? 'rotate-[180deg]' : ''} transition`}><ArrowDropDown/></span>
           </button>
           {active &&
               <div
                   className={'z-10 absolute top-[100%] right-0 w-full flex flex-col bg-brown1 border border-brown3 rounded-md'}>
                  {
                     props.values.map((elem) => {
                        return <button onClick={() => {
                           setCurrent(elem)
                           setActive(false)
                        }} key={elem.id}
                                    className={'outline-brown4 z-20 cursor-pointer py-1 hover:bg-brown2 transition px-[12px] py-[8px] text-left'}>{elem.label}</button>
                     })
                  }
               </div>
           }
        </div>
     </div>

  )
}