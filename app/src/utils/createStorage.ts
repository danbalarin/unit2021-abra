export const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve();
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const createStorage = () =>
  typeof window !== "undefined" ? localStorage : createNoopStorage();

export default createStorage;
