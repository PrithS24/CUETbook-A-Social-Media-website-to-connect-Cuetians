import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge"
// import { formatDistanceToNow } from "date-fns";
import parseISO from "date-fns/parseISO";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// lib/utils.js
export const formateDate  =(date) =>{
  return formatDistanceToNow(parseISO(date),{addSuffix:true})
}

export const  formatDateInDDMMYYY = (date) =>{
  return new Date(date).toLocaleDateString('en-GB')
}

// export function formatDateInDDMMYYY(date) {
//   if (!date) return "Invalid date";
//   const d = new Date(date);
//   return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
// }