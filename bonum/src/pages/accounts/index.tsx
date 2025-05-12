import { FC, useEffect, useState } from 'react';
import { UiTitle } from "../../ui/titles/title";
import { AccountPageItem } from "./item";
import { UiSkeleton } from "../../ui/skeleton";
import { useUserId } from "../../utils/auth.tsx";
import {ModalCreateAccount} from "../../components/modals/createAccount";

interface Account {
   id: number;
   name: string;
   value: number;
   currency: number;
}
interface ServerAccount {
   id: number;
   name: string;
   currency_id: number;
}
interface Transaction {
   id: number;
   account_id: number;
   account_to_id?: number;
   category_name?: string;
   sum: number;
   type_id?: number;
}

export const AccountsPage: FC = () => {
   const [activeModal, setActiveModal] = useState(false);
   const [dollarRate, setDollarRate] = useState<number | undefined>();
   const [accounts, setAccounts] = useState<Account[]>([]);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const userId = useUserId();

   const getRate = async () => {
      try {
         const response = await fetch('https://api.nbrb.by/exrates/rates/431', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
         });
         if (response.ok) {
            const data = await response.json();
            setDollarRate(data.Cur_OfficialRate);
         } else {
            console.error('Не удалось получить данные о курсе доллара');
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   const fetchAccounts = async () => {
      if (!userId) {
         setError('ID пользователя не найден');
         setLoading(false);
         return;
      }

      try {
         const response = await fetch(`http://localhost:8080/api/accounts?user_id=${userId}`);
         if (!response.ok) {
            throw new Error('Failed to fetch accounts');
         }

         const accountsData: ServerAccount[] = await response.json();

         const accountsWithValues = await Promise.all(
            accountsData.map(async (account) => {
               const transactionsResponse = await fetch(
                  `http://localhost:8080/api/transactions?user_id=${userId}&account_id=${account.id}`
               );
               if (!transactionsResponse.ok) {
                  throw new Error('Failed to fetch transactions');
               }

               const transactions: Transaction[] = await transactionsResponse.json();

               console.log(transactions)

               const totalSum = transactions.reduce((sum, transaction) => {
                  const transactionSum = parseFloat(transaction.sum.toString());
                  console.log(account.id, transaction.account_id, transaction.account_to_id)
                  if (transaction.type_id === 2) {
                     return sum - transactionSum;
                  } else if (transaction.type_id === 3) {
                     if (transaction.account_id === account.id) {
                        return sum - transactionSum; // Увеличиваем сумму для счета назначения
                     } else if (transaction.account_to_id === account.id) {
                        return sum + transactionSum; // Уменьшаем сумму для счета списания
                     }
                     return sum;
                  }
                  return sum + transactionSum; // Доход
               }, 0);

               return {
                  id: account.id,
                  name: account.name,
                  value: totalSum,
                  currency: account.currency_id,
               };
            })
         );

         setAccounts(accountsWithValues);
      } catch (error) {
         if (error instanceof Error) {
            setError(error.message);
         } else {
            setError('An unknown error occurred');
         }
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAccounts();
      getRate();
   }, [activeModal]);

   return (
      <>
      <div>
         <div className={'max-w-[800px] mx-auto flex flex-col gap-[20px]'}>
            <div className={'flex items-center justify-between'}>
               <UiTitle>Счета</UiTitle>
            </div>
            {loading ? (
               <p>Loading...</p>
            ) : error ? (
               <p className="text-red-500">{error}</p>
            ) : accounts.length > 0 ? (
               <div className={'flex flex-col gap-[10px]'}>
                  {accounts.map((account) => (
                     <AccountPageItem
                        key={account.id}
                        id={account.id}
                        name={account.name}
                        value={account.value}
                        currency={account.currency === 1 ? 'BYN' : 'USD'}
                     />
                  ))}
                  <span className={'h-[1px] bg-brown5'}/>
                  <div className={'flex flex-col items-end'}>
                     <p className={'text-right text-black'}>
                        Всего: {accounts.reduce((sum, acc) => sum + acc.value * (acc.currency === 2 && dollarRate ? dollarRate : 1), 0)} BYN
                     </p>
                     <span className={'text-[12px] text-gray-500 flex items-center gap-[5px]'}>
                        по курсу 1 USD = {dollarRate ? dollarRate : <UiSkeleton width={'37px'} height={'13px'}/>} BYN
                     </span>
                  </div>
               </div>
            ) : (
               <div className={'py-4 border border-brown3 px-8 rounded-xl bg-white'}>
                  <p className={'text-[14px] text-black text-center w-full'}>Вы пока не создали счет!</p>
                  <div className={'text-brown5 text-[14px] font-medium cursor-pointer text-center'}
                       onClick={() => setActiveModal(true)}>
                     Создать счет
                  </div>
               </div>
            )}
         </div>
      </div>
      <ModalCreateAccount active={activeModal} onClose={() => setActiveModal(false)}/>
      </>
   );
};