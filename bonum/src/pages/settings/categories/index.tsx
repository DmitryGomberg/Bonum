import { FC } from 'react'
import {SettingsCategory} from "./item";

export const SettingsCategories: FC = () => {
  return (
    <div>
      Все категории пользователя
      <SettingsCategory />
      <SettingsCategory />

    </div>
  )
}