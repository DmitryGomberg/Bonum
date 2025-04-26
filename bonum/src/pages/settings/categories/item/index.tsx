import {FC} from 'react'
import {ArrowDropDownCircle, Edit, Fastfood} from "@mui/icons-material";

export const SettingsCategory: FC = () => {
  return (
    <div className={'flex items-center justify-between bg-brown3 my-3 py-3 px-6 rounded-xl cursor-pointer'}>
      <div className={'font-bold text-[17px] flex items-center gap-[15px]'}>
         <Fastfood />
         Доход
      </div>
       <div className={'flex items-center gap-[10px]'}>
          <Edit className={'cursor-pointer'} />
          <ArrowDropDownCircle className={'cursor-pointer'} />
       </div>
    </div>
  )
}