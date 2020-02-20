import React, { Component } from 'react';
import { 
  View, 
  Text,
  Platform,
  StyleSheet
} from 'react-native';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userImageVisible: false,
      postImageVisible: false,
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar} />
        <ShimmerPlaceHolder
          autoRun={true}
          visible={this.state.visible}
        >
          <Text>adfadfad</Text>
        </ShimmerPlaceHolder>
        <View style={styles.menuBar} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  searchBar: {
    height: 54,
    backgroundColor: '#3b5998',
  },
  content: {
    flex: 1,
  },
  menuBar: {
    height: 54,
    backgroundColor: '#edeef1',
  }
});