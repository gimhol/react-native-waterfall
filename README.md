# react-native-waterfall
a waterfall plugin.

## At present,  you should pay attention to the following points.
- The height of the item must be confirmed in the first rendering, and should be immutable.
- When you need to refresh all items, you should change the reference of the data props.data.
- When you need to add more items, append items' datas to original props.data.

## Install
```
npm install react-native-waterfall --save
```

## Usage
```jsx
  import Waterfall from 'react-native-waterfall'
  ...
  <Waterfall
    numberOfColumns       ={ 2 }
    expansionOfScope      ={ 100 }
    onEndReachedThreshold ={ 1000 }
    onEndReached          ={ this.loadMore }
    renderItem            ={ this.renderItem }
```
## Example

```jsx
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

import Waterfall from 'react-native-waterfall'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FC00',
  },
  waterfall:{
    flex:1,
    backgroundColor:'red'
  }
});

export default class App extends Component {
  state = {
    isRefreshing: false,
    isLoadingMore: false
  }
  componentWillMount(){
    this.data = []
    this.loadMore()
  }

  addMoreDatas(){
    for(var i=0;i<50;++i){
      this.data.push({
        height: 50+Math.floor(Math.random()*200)
      })
    }
  }

  refresh = ()=>{
    if(this.state.isRefreshing || this.state.isLoadingMore){
      return;
    }
    this.setState({isRefreshing: true})
    setTimeout(()=>{
      this.data = [];
      this.addMoreDatas();
      this.setState({isRefreshing: false})
    },500)
  }

  loadMore = ()=>{
    if(this.state.isRefreshing || this.state.isLoadingMore){
      return;
    }
    this.setState({isLoadingMore: true})
    setTimeout(()=>{
      this.addMoreDatas();
      this.setState({isLoadingMore: false})
    },500)
  }

  renderItem = (itemData,itemIdx,itemContainer)=>{
    return (
      <TouchableOpacity style={{backgroundColor:'black',width:itemContainer.width,height:itemData.height}}>
        <Text style={{color:'white'}}>index: {itemIdx}</Text>
        <Text style={{color:'white'}}>height:{itemData.height}</Text>
      </TouchableOpacity>
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Waterfall
          style={styles.waterfall}
          data={this.data}
          gap={6}
          numberOfColumns={2}
          expansionOfScope={100}
          onEndReachedThreshold={1000}
          onEndReached={this.loadMore}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing = {this.state.isRefreshing}
              onRefresh = {this.refresh}
            />
          }/>
      </View>
    );
  }
}

```

## Props
		
name | type | description 
-----|------|-------------
numberOfColumns       | Integer  | the number of columns in the waterfall, default value is 3.
expansionOfScope      | Number   | The distance from the boundary when item starts to render, default value is 0,
onEndReachedThreshold | Number   | Just like ListView.
onEndReached          | Function | Just like ListView.
renderItem            | Function | (itemData,itemIdx,itemContainer)=>renderable 

and any props of ScrollView

# react-native-waterfall
瀑布流组件
  
## 目前，需要注意以下几点。
- 瀑布流里面每个方块，都需要在第一次渲染时就确定好item的高度，而且保证后面不会改变。
- 需要刷新时，改变props.data的引用。
- 需要往下加更多item时，在原有的props.data后面加上新数据就行

## 使用
```jsx
  import Waterfall from 'react-native-waterfall'
  ...
  <Waterfall
    numberOfColumns       ={ 2 }
    expansionOfScope      ={ 100 }
    onEndReachedThreshold ={ 1000 }
    onEndReached          ={ this.loadMore }
    renderItem            ={ this.renderItem }
```

## props

name | type | description 
-----|------|-------------
numberOfColumns       | Integer  | 瀑布流分成几列，默认3列。
expansionOfScope      | Number   | item距离显示范围边界多远时开始渲染，默认值为0。
onEndReachedThreshold | Number   | 参考ListView。
onEndReached          | Function | 参考ListView。
renderItem            | Function | (itemData,itemIdx,itemContainer)=>renderable 

以及ScrollView组件支持的props
