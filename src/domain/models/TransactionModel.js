export const mapTransactionData = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    description: data.description || 'Sem descrição',
    value: Number(data.value) || 0,
    type: data.type || 'expense',
    category: data.category || 'Outros',
    date: data.date ? data.date.toDate() : new Date(),
    createdAt: data.createdAt || new Date().toISOString(),
  };
};