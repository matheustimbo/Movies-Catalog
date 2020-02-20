import React, { Component } from 'react';
import { 
  View, 
  Text,
  Platform
} from 'react-native';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <CollapsibleHeaderScrollView
        CollapsibleHeaderComponent={<View style={{ backgroundColor: 'red' }} />}
        headerHeight={100}
        statusBarHeight={Platform.OS === 'ios' ? getStatusBarHeight() : 0}
      >
        <View style={{ height: 2000, backgroundColor: 'wheat' }}>
        </View>
      </CollapsibleHeaderScrollView>
    );
  }
}
