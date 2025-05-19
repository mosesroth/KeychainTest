import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

// Import Keychain using require instead of ES6 import
const Keychain = require('react-native-keychain');

export default function KeychainTestScreen() {
  const [status, setStatus] = useState('');
  const [isFireOS, setIsFireOS] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Check if running on Fire OS
    // Fire OS is based on Android but has specific characteristics
    if (Platform.OS === 'android') {
      // This is a simple check - in a real app you might want to use
      // more sophisticated detection methods
      try {
        // Fire OS typically includes "Fire" or "Amazon" in the device model or brand
        // This is just a placeholder - actual implementation would need device info
        setIsFireOS(false); // Set this based on actual detection
        setStatus('Running on Android (Check if Fire OS in actual device)');
      } catch (error) {
        setStatus('Error detecting device: ' + error);
      }
    } else {
      setStatus(`Running on ${Platform.OS}`);
    }
  }, []);

  const addResult = (test, result) => {
    setResults(prev => [...prev, { test, result }]);
  };

  const resetResults = () => {
    setResults([]);
  };

  const testSetGenericPassword = async () => {
    try {
      const result = await Keychain.setGenericPassword('username', 'password');
      addResult('setGenericPassword', `Success: ${JSON.stringify(result)}`);
    } catch (error) {
      addResult('setGenericPassword', `Error: ${error}`);
    }
  };

  const testGetGenericPassword = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        addResult('getGenericPassword', `Retrieved: ${JSON.stringify(credentials)}`);
      } else {
        addResult('getGenericPassword', 'No credentials found');
      }
    } catch (error) {
      addResult('getGenericPassword', `Error: ${error}`);
    }
  };

  const testResetGenericPassword = async () => {
    try {
      const result = await Keychain.resetGenericPassword();
      addResult('resetGenericPassword', `Reset result: ${result}`);
    } catch (error) {
      addResult('resetGenericPassword', `Error: ${error}`);
    }
  };

  const testInternetCredentials = async () => {
    try {
      // Set internet credentials
      await Keychain.setInternetCredentials(
        'example.com',
        'username',
        'password'
      );
      addResult('setInternetCredentials', 'Success');
      
      // Get internet credentials
      const credentials = await Keychain.getInternetCredentials('example.com');
      if (credentials) {
        addResult('getInternetCredentials', `Retrieved: ${JSON.stringify(credentials)}`);
      } else {
        addResult('getInternetCredentials', 'No credentials found');
      }
      
      // Reset internet credentials
      const resetResult = await Keychain.resetInternetCredentials('example.com');
      addResult('resetInternetCredentials', `Reset result: ${resetResult}`);
    } catch (error) {
      addResult('internetCredentials', `Error: ${error}`);
    }
  };

  const runAllTests = async () => {
    resetResults();
    addResult('Platform', status);
    await testSetGenericPassword();
    await testGetGenericPassword();
    await testResetGenericPassword();
    await testInternetCredentials();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Keychain Compatibility Test' }} />
      
      <Text style={styles.title}>React Native Keychain Test</Text>
      <Text style={styles.subtitle}>{status}</Text>
      
      <TouchableOpacity style={styles.button} onPress={runAllTests}>
        <Text style={styles.buttonText}>Run All Tests</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={resetResults}>
        <Text style={styles.buttonText}>Clear Results</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.resultsContainer}>
        {results.map((item, index) => (
          <View key={index} style={styles.resultItem}>
            <Text style={styles.testName}>{item.test}:</Text>
            <Text style={styles.resultText}>{item.result}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    marginTop: 16,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  testName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultText: {
    color: '#333',
  },
});
