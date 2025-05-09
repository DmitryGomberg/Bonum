import { FC, useEffect, useState } from 'react';
import { SettingsCategory } from './item';
import {UiButton} from "../../../ui/button";
import {ModalCreateCategory} from "../../../components/modals/createCategory";

type Category = {
   id: number;
   name: string;
   icon: string;
   parent_id: number | null;
   level: number;
};

export const SettingsCategories: FC = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
   const [activeModal, setActiveModal] = useState<boolean>(false);

   const fetchCategories = async () => {
      try {
         const response = await fetch('http://localhost:8080/api/getAllCategories?user_id=1');
         const data = await response.json();
         const sortedCategories = sortCategories(data);
         setCategories(sortedCategories);
      } catch (error) {
         console.error('Error fetching categories:', error);
      }
   };

   useEffect(() => {
      fetchCategories();
   }, [activeModal]);

   const sortCategories = (categories: Category[]): Category[] => {
      const categoryMap = new Map<number, Category[]>();

      categories.forEach((category) => {
         const parentId = category.parent_id || 0;
         if (!categoryMap.has(parentId)) {
            categoryMap.set(parentId, []);
         }
         categoryMap.get(parentId)!.push(category);
      });

      const buildSortedList = (parentId: number, level: number): Category[] => {
         const children = categoryMap.get(parentId) || [];
         return children.flatMap((child) => [
            { ...child, level },
            ...buildSortedList(child.id, level + 1),
         ]);
      };

      return buildSortedList(0, 0);
   };

   const toggleCategory = (categoryId: number) => {
      setExpandedCategories((prev) => {
         const newSet = new Set(prev);
         if (newSet.has(categoryId)) {
            newSet.delete(categoryId);
         } else {
            newSet.add(categoryId);
         }
         return newSet;
      });
   };

   const isCategoryVisible = (category: Category): boolean => {
      if (category.level === 0) return true; // Root categories are always visible
      return expandedCategories.has(category.parent_id!);
   };

   const hasChildren = (categoryId: number): boolean => {
      return categories.some((category) => category.parent_id === categoryId);
   };

   return (
      <div>
         <div className={'flex flex-col gap-[20px] max-w-[800px] mx-auto w-full'}>
            <div className={'flex items-center justify-between'}>
               <p className={'font-medium text-[18px] text-center'}>
                  Категории записей пользователя
               </p>
               <UiButton label={'Добавить'} onClick={()=> setActiveModal(true)} />
            </div>
            <div className={'flex flex-col gap-[10px]'}>
               {categories
                  .filter(isCategoryVisible)
                  .map((category) => (
                     <div key={category.id} style={{ marginLeft: `${category.level * 40}px` }}>
                        <SettingsCategory
                           title={category.name}
                           icon={category.icon}
                           id={category.id}
                           onCategoryAdded={fetchCategories}
                           onToggleExpand={() => toggleCategory(category.id)}
                           isExpanded={expandedCategories.has(category.id)}
                           hasChildren={hasChildren(category.id)}
                        />
                     </div>
                  ))}
            </div>
         </div>
         <ModalCreateCategory active={activeModal} parentId={null} onClose={()=> setActiveModal(false)} />
      </div>
   );
};