import { FC, useEffect, useState } from 'react';
import { UiTitle } from "../../ui/titles/title";
import { AccountPageItem } from "./item";
import { UiSkeleton } from "../../ui/skeleton";
import { useUserId } from "../../utils/auth.tsx";

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
   source_account_id: number;
   destination_account_id?: number;
   category_name?: string;
   sum: number;
}

export const AccountsPage: FC = () => {
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
                  if (transaction.category_name === "Расходы") {
                     return sum - transactionSum;
                  }
                  return sum + transactionSum;
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
   }, []);

   return (
      <div>
         <div className={'max-w-[800px] mx-auto flex flex-col gap-[20px]'}>
            <div className={'flex items-center justify-between'}>
               <UiTitle>Счета</UiTitle>
            </div>
            {loading ? (
               <p>Loading...</p>
            ) : error ? (
               <p className="text-red-500">{error}</p>
            ) : (
               <div className={'flex flex-col gap-[10px]'}>
                  {accounts.map((account) => (
                     <AccountPageItem
                        key={account.id}
                        id={account.id}
                        name={account.name}
                        value={account.value}
                        currency={account.currency === 1 ? 'USD' : 'BYN'}
                     />
                  ))}
               </div>
            )}
            <span className={'h-[1px] bg-brown5'} />
            <div className={'flex flex-col items-end'}>
               <p className={'text-right text-black'}>
                  Всего: {accounts.reduce((sum, acc) => sum + acc.value, 0)} BYN
               </p>
               <span className={'text-[12px] text-gray-500 flex items-center gap-[5px]'}>
                  по курсу 1 USD = {dollarRate ? dollarRate : <UiSkeleton width={'37px'} height={'13px'} />} BYN
               </span>
            </div>
         </div>
      </div>
   );
};