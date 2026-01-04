import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { COLORS } from '../../src/core/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TransactionCard from '../../src/presentation/components/TransactionCard';
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

      const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export default function HomeScreen() {
  const { user, logout, transactions, totalBalance, loading, deleteTransaction } = useAuth();

  const chartData = useMemo(() => {
  const income = (transactions || []).filter(t => t?.type === 'income');
  const expenses = (transactions || []).filter(t => t?.type === 'expense');
    if (expenses.length === 0) return null;

    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.value;
      return acc;
    }, {});

    return Object.keys(grouped).map((cat) => ({
      name: cat,
      population: grouped[cat],
      color: generateColor(cat),
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    }));
  }, [transactions]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.userGreetingContainer}>
              <Text style={styles.greeting}>Olá, </Text>
              <Text style={styles.userName}>
                {(user?.displayName?.split(' ')[0]) || 'Usuário'}
              </Text>
          </View>

          <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={logout}
            >
              <Ionicons name="log-out-outline" size={22} color="#FFffff" /> 
          </TouchableOpacity>

        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Atual</Text>
          <Text style={[styles.balanceValue, { color: (totalBalance || 0) >= 0 ? COLORS.secondary : COLORS.error }]}>
            R$ {(totalBalance || 0).toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        {chartData ? (
          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={180}
            chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        ) : (
          <Text style={styles.emptyChartText}>Nenhuma despesa para exibir no gráfico.</Text>
        )}
      </View>

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Transações Recentes</Text>
        <FlatList
          data={transactions || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionCard transaction={item} onDelete={deleteTransaction} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Comece adicionando uma transação!</Text>}
        />
      </View>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(app)/new-transaction')}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  balanceCard: { backgroundColor: COLORS.white, padding: 20, borderRadius: 15, marginTop: 20, elevation: 5 },
  balanceLabel: { color: COLORS.textSecondary, fontSize: 14 },
  balanceValue: { fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  chartSection: { alignItems: 'center', marginVertical: 10 },
  emptyChartText: { color: COLORS.textSecondary, marginVertical: 20 },
  listSection: { flex: 1, paddingHorizontal: 20 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 30 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  marginTop: 20,
  marginBottom: 5,
},
userGreetingContainer: {
  flexDirection: 'row',
  alignItems: 'baseline',
},
greeting: {
  fontSize: 20,
  color: 'rgba(255, 255, 255, 0.8)',
},
userName: {
  fontSize: 25,
  fontWeight: 'bold',
  color: '#FFFFFF',
},
logoutButton: {
  padding: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 12,
}});