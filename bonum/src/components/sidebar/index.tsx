import {FC} from 'react'
import logo from '../../assets/images/logo.svg'
import {Link, useNavigate} from "react-router-dom";
import {
   ChecklistOutlined, ReceiptOutlined, SettingsOutlined, SpaceDashboardOutlined
} from "@mui/icons-material";
import {useUser} from "../../context/user.tsx";

export const Sidebar: FC = () => {
   const { user } = useUser();
   const navigate = useNavigate();


  return (
    <div className={'min-w-[255px] border-r border-brown3 h-screen flex flex-col sticky top-0'}>
       <div className={'h-[60px] flex items-center justify-center border-b border-brown3 gap-[5px] text-black font-bold text-[20px] cursor-pointer'} onClick={()=>navigate('/home')}>
          <img src={logo} alt="logo" className={'h-[20px]'}/>
          Bonum
       </div>
       <div className={'p-3'}>
          <ul>
             <li className={'flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/home"} className={'flex gap-[10px] w-full p-2'}><SpaceDashboardOutlined />Панель управления</Link></li>
             <li className={'flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/accounts"} className={'flex gap-[10px] w-full p-2'}><ChecklistOutlined />Счета</Link></li>
             <li className={'flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/transactions"} className={'flex gap-[10px] w-full p-2'}><ReceiptOutlined />Транзакции</Link></li>
             {/*<li className={'flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/"} className={'flex gap-[10px] w-full p-2'}><MailOutline />Отчеты</Link></li>*/}
          </ul>
       </div>
       <div className={'p-3 border-t border-brown3'}>
          <ul>
             <li className={'flex gap-[10px] rounded-md hover:bg-brown2 transition cursor-pointer'}><Link to={"/settings"} className={'p-2 flex gap-[10px] w-full'}><SettingsOutlined />Настройки</Link></li>
          </ul>
       </div>
       <div className={'p-3 mt-auto border-t border-brown3 flex items-center gap-[10px]'}>
          <div className={'w-[40px] h-[40px] rounded-[50%] bg-brown5 flex items-center justify-center text-white'}>{user.username ? user.username.slice(0, 2).toUpperCase() : ''}</div>
          <div>
             <p className={'font-medium'}>{user.name + ' ' + user.surname}</p>
             <p className={'text-[12px]'}>{user.username}</p>
          </div>
       </div>
    </div>
  )
}