import {FC, useEffect, useState} from 'react'
import {UiTitle} from "../../ui/titles/title";
import {AccountPageItem} from "./item";
import {UiSkeleton} from "../../ui/skeleton";
import {useUserId} from "../../utils/auth.tsx";

interface Account {
   id: number;
   name: string;
   value: number;
   currency: number;
}
interface ServerAccount {
   id: number;
   name: string;
   value: number;
   currency_id: number;
}

export const AccountsPage: FC = () => {
   const [dollarRate, setDollarRate] = useState<number | undefined>()
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
            console.log(data)
            setDollarRate(data.Cur_OfficialRate)
         } else {
            console.error('Failed to get currency.tsx USD to BYN');
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   const fetchAccounts = async () => {
      if (!userId) {
         setError('User ID not found');
         setLoading(false);
         return;
      }

      try {
         const response = await fetch(`http://localhost:8080/api/accounts?user_id=${userId}`);
         if (!response.ok) {
            throw new Error('Failed to fetch accounts');
         }

         const data = await response.json();

         const transformedAccounts: Account[] = data.map((account: ServerAccount) => ({
            id: account.id,
            name: account.name,
            value: account.value,
            currency: account.currency_id,
         }));

         setAccounts(transformedAccounts);

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
      fetchAccounts()
      getRate()
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
                        name={account.name}
                        amount={account.value}
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
}
