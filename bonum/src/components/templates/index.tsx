import {FC, ReactNode} from 'react'
import {Sidebar} from "../sidebar";
import {Header} from "../header";

type IAppTemplateProps = {
   children: ReactNode
}

export const AppTemplate: FC<IAppTemplateProps> = (props) => {
  return (
    <div className={'flex w-full min-h-screen'}>
       <Sidebar />
       <div className={'w-full flex flex-col'}>
          <Header />
          <div className={'px-4 py-4 bg-brown1 grow-1'}>
             <div className={'max-w-[1280px] mx-auto'}>
               {props.children}
             </div>
          </div>
       </div>
    </div>
  )
}