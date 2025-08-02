export type pageStoreT = {
  page: number;
  setPage: (page: number) => void;
};

export type inputStoreT = {
  setInputValue: (id: string, value: string) => void;
  [key: string]: string | ((id: string, value: string) => void);
};
