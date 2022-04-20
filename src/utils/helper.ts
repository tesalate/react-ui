import { isNumber } from "lodash";

export const isTruthy = (val:any):boolean|undefined => {
  // truthy comparisons
  if (val === true)   return true;
  if (val === 'true') return true;
  if (val === 't')    return true;
  if (val === 'y')    return true;
  if (val === 'yes')  return true;
  
  // falsy comparisons
  if (!val)              return false;
  if (val ===  false)    return false;
  if (val === 'false')   return false;
  if (val === null)      return false;
  if (val === undefined) return false;
  
  // Once it gets to this point, any string should
  // just get returned
  if (typeof val === 'string') return true;
  
  // Not equal comparisons
  if (isNumber(val)) return true;
};