import { FC, useEffect, useState } from 'react';
import { UiInput } from "../../ui/input";
import { UiSelect } from "../../ui/select";
import { UiButton } from "../../ui/button";
import { UiTextarea } from "../../ui/textarea";
import { UiTabs } from "../../ui/tabs";
import { UiTitle } from "../../ui/titles/title";
import {useUserId} from "../../utils/auth.tsx";
import {useNotifications} from "../../context/notifications.tsx";
import {ChangeCircle} from "@mui/icons-material";

interface Option {
   id: number;
   label: string;
}
interface Category {
   id: number;
   name: string;
}
interface Account {
   id: number;
   name: string;
}
export const AddTransactionPage: FC = () => {
   const [sum, setSum] = useState<number>(0);
   const [description, setDescription] = useState<string>('');
   const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
   const [type, setType] = useState<number>(1);
   const [categories, setCategories] = useState<Option[]>([]);
   const [accounts, setAccounts] = useState<Option[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
   const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
   const [selectedAccountTo, setSelectedAccountTo] = useState<number | null>(null);
   const userId = useUserId();
   const {showNotification} = useNotifications();

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await fetch(`http://localhost:8080/api/getAllCategories?user_id=${userId}`);
            const data = await response.json();
            const options = data.map((category: Category) => ({
               id: category.id,
               label: category.name,
            }));
            setCategories(options);
         } catch (error) {
            console.error('Error fetching categories:', error);
         }
      };

      const fetchAccounts = async () => {
         try {
            const response = await fetch(`http://localhost:8080/api/accounts?user_id=${userId}`);
            const data = await response.json();
            const options = data.map((account: Account) => ({
               id: account.id,
               label: account.name,
            }));
            setAccounts(options);
         } catch (error) {
            console.error('Error fetching accounts:', error);
         }
      };

      fetchCategories();
      fetchAccounts();
   }, []);

   const saveTransaction = async () => {
      try {
         if (sum === 0) {
            showNotification('Укажите корректную сумму', 'error');
            return;
         }
         if (!date) {
            showNotification('Укажите дату', 'error');
            return;
         }
         if (!selectedCategory && type !== 3 || selectedCategory && selectedCategory === -2) {
            showNotification('Укажите категорию', 'error');
            return;
         }
         if (!selectedAccount || selectedAccount && selectedAccount === -2) {
            showNotification('Укажите счет списания', 'error');
            return;
         }
         if (!selectedAccountTo && type == 3) {
            showNotification('Укажите счет поступления', 'error');
            return;
         }
         if(selectedAccount === selectedAccountTo && type === 3) {
            showNotification('Укажите корректный счет поступления', 'error');
            return;
         }
         const transaction = {
            sum,
            description,
            date,
            type_id: type,
            category_id: selectedCategory,
            account_id: selectedAccount,
            account_to_id: selectedAccountTo,
            user_id: userId,
         };

         const response = await fetch('http://localhost:8080/api/addTransaction', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
         });

         if (!response.ok) {
            throw new Error('Failed to save transaction');
         }

         const result = await response.json();
         console.log('Transaction saved successfully:', result);
         showNotification('Запись успешно создана', 'success');

         setSum(0);
         setDescription('');
      } catch (error) {
         console.error('Error saving transaction:', error);
      }
   };

   return (
      <div className={'flex flex-col items-center gap-[20px] max-w-[700px] mx-auto'}>
         <UiTitle>Добавить новую транзакцию</UiTitle>
         <UiTabs values={[{ id: 1, label: 'Доход' }, { id: 2, label: 'Расход' }, { id: 3, label: 'Перевод' }]} onClick={(e: number) => {
            setType(e);
            setSelectedAccountTo(null)
         }} />
         <div className={'bg-white p-5 flex flex-col gap-[20px] w-full border border-brown3 rounded-xl'}>
            <div className={'flex gap-[20px]'}>
               <UiInput label={'Укажите сумму'} placeholder={'Введите сумму'} type={'number'} value={sum.toString()}
                        onChange={(e) => setSum(Number(e.target.value))} />
               <UiInput label={'Укажите дату'} type={'date'} value={date} placeholder={'Введите дату'}
                        onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className={'flex gap-[20px]'}>
               {type !== 3 && (
                  <UiSelect
                     label={'Выберите категорию'}
                     placeholder={'Выберите категорию'}
                     options={categories.length ? categories : [{ id: -2, label: 'Нет категорий' }]}
                     value={selectedCategory}
                     onChange={(selected: Option | null) => setSelectedCategory(selected ? selected.id : null)}
                  />
               )}
               {type === 3 && (
                  <>
                     <UiSelect
                        label={'Откуда'}
                        placeholder={'Выберите счет'}
                        options={accounts.length ? accounts : [{ id: -2, label: 'Нет счетов' }]}
                        value={selectedAccount}
                        onChange={(selected: Option | null) => setSelectedAccount(selected ? selected.id : null)}
                     />
                     <ChangeCircle className={"bottom-[-37px] relative"} />
                     <UiSelect
                        label={'Куда'}
                        placeholder={'Выберите счет'}
                        options={accounts}
                        value={selectedAccountTo}
                        onChange={(selected: Option | null) => setSelectedAccountTo(selected ? selected.id : null)}
                     />
                  </>)
               }
               {type !== 3 && (
                  <UiSelect
                     label={'Выберите счет'}
                     placeholder={'Выберите счет'}
                     options={accounts.length ? accounts : [{ id: -2, label: 'Нет счетов' }]}
                     value={selectedAccount}
                     onChange={(selected: Option | null) => setSelectedAccount(selected ? selected.id : null)}
                  />
               )}
            </div>
            <UiTextarea label={'Описание'} placeholder={'Введите значение'} value={description} onChange={(e) => setDescription(e.target.value)} />
            <UiButton label={'Добавить запись'} onClick={saveTransaction} />
         </div>
      </div>
   );
};