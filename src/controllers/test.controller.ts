import { Request, Response } from 'express';
import * as testService from '../services/test.service';

export const getTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await testService.getTestData();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};