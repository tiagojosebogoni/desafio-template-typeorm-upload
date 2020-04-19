import fs from 'fs';
import path from 'path';
import csv from 'csv-parse';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  filename: string;
}

interface TransactionCSV {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const pathFile = path.join(uploadConfig.directory, filename);
    const createTransactionService = new CreateTransactionService();

    const transactionsCSV: TransactionCSV[] = [];
    const transactions: Transaction[] = [];

    const parseCSV = fs.createReadStream(pathFile);

    parseCSV.pipe(csv({ columns: true, trim: true })).on('data', async row => {
      const { title, value, type, category } = row;

      const transactionCsv: TransactionCSV = { title, value, type, category };
      transactionsCSV.push(transactionCsv);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    // eslint-disable-next-line no-restricted-syntax
    for (const item of transactionsCSV) {
      const { title, type, value, category } = item;

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute({
        title,
        type,
        value,
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
