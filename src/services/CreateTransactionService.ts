import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('Valor inválido');
      }
    }

    const categoryRepository = getRepository(Category);

    const findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id: string;

    if (!findCategory) {
      const newCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(newCategory);

      category_id = newCategory.id;
    } else {
      category_id = findCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
