import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default function App() {
  return (
    <View style={styles.container}>
      <Grid>
        <Col size={50}>
          <Row style={styles.cell}>
            <Text>A</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>B</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>C</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>D</Text>
          </Row>
        </Col>
        <Col size={25}>
        <Row style={styles.cell}>
            <Text>E</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>F</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>G</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>H</Text>
          </Row>
        </Col>
        <Col size={25}>
        <Row style={styles.cell}>
            <Text>1</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>2</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>3</Text>
          </Row>
          <Row style={styles.cell}>
            <Text>4</Text>
          </Row>
        </Col>
      </Grid>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    padding: 16,
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
});