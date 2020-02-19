import React from 'react'
import {
    View,
    Dimensions
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Svg, Path } from 'react-native-svg'

import Home from './Home';
import Search from './Search';

import HomeIcon from './assets/svgs/home.svg'

const Tab = createMaterialBottomTabNavigator();
const { width, height } = Dimensions.get("window")

export default function MyTabs() {
  return (
    <NavigationContainer>
        <Tab.Navigator
            initialRouteName="Home"
            backBehavior="initialRoute"
            labeled={false}
            shifting
            barStyle={{backgroundColor: '#221E23', height: getBottomSpace() + 60}}
        >
            <Tab.Screen 
                name="Home" 
                component={Home} 
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                        <View style={{paddingRight: width/8, paddingTop: 6}}>
                            <HomeIcon width={14} height={14} fill="#D7D7D7"/>
                        </View>
                    ),
                }}
            />
            <Tab.Screen 
                name="Search" 
                component={Search}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                        <View style={{paddingLeft: width/8, paddingTop: 6}}>
                            <Svg id="Capa_1" enable-background="new 0 0 515.558 515.558" height="14" viewBox="0 0 515.558 515.558" width="14" xmlns="http://www.w3.org/2000/svg">
                                <Path fill="#D7D7D7" d="m378.344 332.78c25.37-34.645 40.545-77.2 40.545-123.333 0-115.484-93.961-209.445-209.445-209.445s-209.444 93.961-209.444 209.445 93.961 209.445 209.445 209.445c46.133 0 88.692-15.177 123.337-40.547l137.212 137.212 45.564-45.564c0-.001-137.214-137.213-137.214-137.213zm-168.899 21.667c-79.958 0-145-65.042-145-145s65.042-145 145-145 145 65.042 145 145-65.043 145-145 145z"/>
                            </Svg>
                        </View>
                    ),
                }} 
            />
        </Tab.Navigator>
    </NavigationContainer>
  );
}