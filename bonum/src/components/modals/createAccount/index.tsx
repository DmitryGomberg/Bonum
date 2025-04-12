import {FC, useState} from 'react'
import {UiModal} from "../../../ui/modal";
import { UiInput } from '../../../ui/input';
import {UiSelect} from "../../../ui/select";
import {UiButton} from "../../../ui/button";

type IModalCreateAccountProps = {
   active: boolean;
   onClose(): void;
}

export const ModalCreateAccount: FC<IModalCreateAccountProps> = (props) => {
   const [name, setName] = useState('')

  return (
    <UiModal active={props.active} onClose={props.onClose} title={'Создать новый счет'} >
      <UiInput label={'Название счета'} placeholder={'Введите значение'} value={name} onChange={(e)=> setName(e.target.value)} />
       <UiSelect values={[{label: 'BYN', id: 0}, {label: 'USD', id: 1}]} label={'Выберите валюту счета'} />

       <UiButton label={'Создать'} onClick={()=>{}} />
    </UiModal>
  )
}