export type PageStoreT = {
  page: number;
  setPage: (page: number) => void;
};

export type InputStoreT = {
  setInputValue: (id: string, value: string) => void;
  [key: string]: string | ((id: string, value: string) => void);
};
