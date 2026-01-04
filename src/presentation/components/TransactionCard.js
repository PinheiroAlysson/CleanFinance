import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../core/colors';

const TransactionCard = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>
      
      <View style={styles.rightSide}>
        <Text style={[styles.value, { color: isIncome ? COLORS.income : COLORS.expense }]}>
          {isIncome ? '+' : '-'} R$ {transaction.value.toFixed(2)}
        </Text>
        
        <TouchableOpacity onPress={() => onDelete(transaction.id)}>
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  description: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  category: { fontSize: 12, color: COLORS.textSecondary },
  rightSide: { alignItems: 'flex-end' },
  value: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 }
});

export default TransactionCard;