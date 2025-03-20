import React from 'react';
import { useNotifications } from '../../context/notifications';
import {Close} from "@mui/icons-material";

export const Notification: React.FC = () => {
   const { notifications, closeNotification } = useNotifications();

   return (
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50 flex flex-col items-end">
         {notifications.map(({ id, message, type }) => (
            <div
               key={id}
               className={`notification ${type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-orange-500' : 'bg-red-500'} text-white px-4 py-2 rounded-lg shadow-lg flex justify-between items-center`}
            >
               <span>{message}</span>
               <span className={'w-[1px] h-[20px] bg-gray-50 mx-[15px]'}></span>
               <button onClick={() => closeNotification(id)} className="rounded-[50%] border-2 cursor-pointer text-lg font-bold flex align-middle justify-center">
                  <Close />
               </button>
            </div>
         ))}
      </div>
   );
};