import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new AppError('Transação não encontrada', 404);
    }

    // await transactionsRepository.delete(id); //funciona também é so passar o id
    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
