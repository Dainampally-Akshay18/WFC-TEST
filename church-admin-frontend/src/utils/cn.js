// Utility for conditional classNames
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const clsx = cn;
