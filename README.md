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
