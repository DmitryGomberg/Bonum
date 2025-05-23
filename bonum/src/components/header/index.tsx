import {FC, useState} from 'react'
import {UiInput} from "../../ui/input";
import {Icon} from "../icon";
import {NotificationsNone, SettingsOutlined} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export const Header: FC = () => {
   const [searchValue, setSearchValue] = useState<string>('')
   const navigate = useNavigate();

  return (
    <header className={'sticky top-0 z-4 w-full px-[10px] bg-white border-brown3 border-b min-h-[60px] flex items-center'}>
       <div className={'flex items-center justify-between max-w-[1280px] mx-auto w-full'}>
         <div>
            <UiInput className={'min-w-[400px]'} placeholder={'Поиск'} value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} />
         </div>
          <div className={"flex gap-[15px]"}>
            <Icon>
               <NotificationsNone />
            </Icon>
             <Icon onClick={()=> navigate('/settings')}>
                <SettingsOutlined />
             </Icon>
          </div>
       </div>
    </header>
  )
}
