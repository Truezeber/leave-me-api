export interface TestData {
  message: string;
  timestamp: number;
}

export const getTestData = async (): Promise<TestData> => {
  return {
    message: "Hello World!",
    timestamp: Date.now()
  };
};