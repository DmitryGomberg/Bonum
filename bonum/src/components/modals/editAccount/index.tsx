import {FC, useState} from 'react'
import {UiModal} from "../../../ui/modal";
import { UiInput } from '../../../ui/input';
import {UiSelect} from "../../../ui/select";
import {UiButton} from "../../../ui/button";

type IModalEditAccountProps = {
   active: boolean;
   onClose(): void;
}

export const ModalEditAccount: FC<IModalEditAccountProps> = (props) => {
   const [name, setName] = useState('')

  return (
    <UiModal active={props.active} onClose={props.onClose} title={'Редактировать счет'} >
      <UiInput label={'Название счета'} placeholder={'Введите значение'} value={name} onChange={(e)=> setName(e.target.value)} />
       <UiSelect values={[{label: 'BYN', id: 0}, {label: 'USD', id: 1}]} label={'Выберите валюту счета'} />

       <UiButton label={'Сохранить изменения'} onClick={()=>{}} />
    </UiModal>
  )
}