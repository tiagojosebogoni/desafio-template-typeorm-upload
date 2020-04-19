import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const sunIncome = transactions.reduce((acc, transaction) => {
      return acc + (transaction.type === 'income' ? transaction.value : 0);
    }, 0);

    const sunOutcome = transactions.reduce((acc, transaction) => {
      return acc + (transaction.type === 'outcome' ? transaction.value : 0);
    }, 0);

    return {
      income: sunIncome,
      outcome: sunOutcome,
      total: sunIncome - sunOutcome,
    };
  }
}

export default TransactionsRepository;
