import { FC } from 'react'
import logo from '../../assets/images/logo.svg'
import {Link} from "react-router-dom";
import {ChecklistOutlined, HomeOutlined,
   MailOutline, ReceiptOutlined, SettingsOutlined, SpaceDashboardOutlined} from "@mui/icons-material";

export const Sidebar: FC = () => {
  return (
    <div className={'min-w-[255px] border-r border-brown3 h-full flex flex-col'}>
       <div className={'h-[60px] flex items-center justify-center border-b border-brown3 gap-[5px] text-black font-bold text-[20px]'}>
          <img src={logo} alt="logo" className={'h-[20px]'}/>
          Bonum
       </div>
       <div className={'p-3'}>
          <ul>
             <li className={'p-2 flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/"} className={'flex gap-[10px]'}><SpaceDashboardOutlined />Панель управления</Link></li>
             <li className={'p-2 flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/"} className={'flex gap-[10px]'}><HomeOutlined />Книга</Link></li>
             <li className={'p-2 flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/"} className={'flex gap-[10px]'}><ChecklistOutlined />Счета</Link></li>
             <li className={'p-2 flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/"} className={'flex gap-[10px]'}><ReceiptOutlined />Транзакции</Link></li>
             <li className={'p-2 flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/"} className={'flex gap-[10px]'}><MailOutline />Отчеты</Link></li>
          </ul>
       </div>
       <div className={'p-3 border-t border-brown3'}>
          <ul>
             <li className={'p-2 flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/"} className={'flex gap-[10px]'}><SettingsOutlined />Настройки</Link></li>
          </ul>
       </div>
       <div className={'p-3 mt-auto border-t border-brown3 flex items-center gap-[10px]'}>
          <div className={'w-[40px] h-[40px] rounded-[50%] bg-brown5 flex items-center justify-center text-white'}>DP</div>
          <div>
             <p className={'font-medium'}>Иван Сминов</p>
             <p className={'text-[12px]'}>dpgomberg</p>
          </div>
       </div>
    </div>
  )
}