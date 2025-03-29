import { FC } from 'react'
import {AttachMoney, ShoppingCartOutlined, WalletOutlined} from "@mui/icons-material";
import {HomeCard} from "./card";

export const HomeCards: FC = () => {
  return (
     <div className={'grid-cols-3 grid gap-4'}>
        <HomeCard icon={<WalletOutlined/>} name={'Общий доход'} sum={'54,232 BYN'} onClick={()=>{}} />
        <HomeCard icon={<ShoppingCartOutlined/>} name={'Общие расходы'} sum={'54,232 BYN'} onClick={()=>{}} />
        <HomeCard icon={<AttachMoney/>} name={'Чистая прибыль'} sum={'54,232 BYN'} onClick={()=>{}} />
     </div>
  )
}