import { FC } from 'react'
import { UiButton } from '../../../ui/button'
import {Add} from "@mui/icons-material";
import {UiTitle} from "../../../ui/titles/title";

export const HomeControls: FC = () => {
  return (
    <div className={'flex justify-between items-start'}>
       <UiTitle>Панель управления</UiTitle>
       <UiButton label={'Новая транзакция'} contentLeft={<Add />} onClick={()=>{}}/>
    </div>
  )
}