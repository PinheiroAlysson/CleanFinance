import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { COLORS } from '../../src/core/colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NewTransactionScreen() {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense'); 
  const [loading, setLoading] = useState(false);

  const { addTransaction } = useAuth();

  const handleSave = async () => {
    if (!description || !value || !category) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    const numericValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('Erro', 'Introduza um valor numérico válido.');
      return;
    }

    setLoading(true);
    try {
      await addTransaction({
        description,
        value: numericValue,
        category,
        type,
        date: new Date().toISOString()
      });
      
      Alert.alert('Sucesso', 'Transação registada!');
      router.back(); // Volta para a Home
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível guardar a transação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Transação</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.form}>
        {/* SELETOR DE TIPO (ENTRADA/SAÍDA) */}
        <View style={styles.typeContainer}>
          <TouchableOpacity 
            style={[
              styles.typeButton, 
              type === 'income' && { backgroundColor: COLORS.secondary + '20', borderColor: COLORS.secondary }
            ]} 
            onPress={() => setType('income')}
          >
            <Ionicons name="arrow-up-circle" size={24} color={COLORS.secondary} />
            <Text style={[styles.typeText, type === 'income' && { color: COLORS.secondary }]}>Entrada</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.typeButton, 
              type === 'expense' && { backgroundColor: COLORS.error + '20', borderColor: COLORS.error }
            ]} 
            onPress={() => setType('expense')}
          >
            <Ionicons name="arrow-down-circle" size={24} color={COLORS.error} />
            <Text style={[styles.typeText, type === 'expense' && { color: COLORS.error }]}>Saída</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Aluguel, Salário, Supermercado..."
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Casa, Lazer, Alimentação..."
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: type === 'income' ? COLORS.secondary : COLORS.primary }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Transação</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingHorizontal: 20,
    marginBottom: 20 
  },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  form: { paddingHorizontal: 20 },
  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  typeButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '48%', 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#E5E7EB' 
  },
  typeText: { marginLeft: 8, fontWeight: '600', color: COLORS.textSecondary },
  label: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8, marginTop: 10 },
  input: { 
    backgroundColor: COLORS.white, 
    padding: 15, 
    borderRadius: 12, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    marginBottom: 10,
    color: '#333'
  },
  saveButton: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30, elevation: 3 },
  saveButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' }
});