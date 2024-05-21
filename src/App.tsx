import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {PaperProvider} from 'react-native-paper';
import RootNavigation from './routes';
import {Provider} from 'react-redux';
import {store} from './redux';

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <RootNavigation />
      </PaperProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
