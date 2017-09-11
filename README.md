# react-native-waterfall
a waterfall plugin

## At present,  you should pay attention to the following points.
- The height of the item must be confirmed in the first rendering, and should be immutable.
- When you need to refresh all items, you should change the reference of the data props.data.
- When you need to add more items, append items' datas to original props.data.

## How to use
```jsx
  import Waterfall from 'react-native-waterfall'
  ...
  <Waterfall
    numberOfColumns = {2}
    showUpDistance = {100}
    onEndReachedThreshold={1000}
    onEndReached={this.loadMore}
    renderItem={this.renderItem}
```

## Props
		
	| name | type | description |
	|:----:|:----:|:-----------:|
	| numberOfColumns         | the number of columns in the waterfall, default value is 3.|
	|-------------------------------------------------------------------------------------|
	| showUpDistance          | out of waterfall displa.                                   |
	|-------------------------------------------------------------------------------------|
	| onEndReachedThreshold   | just like VirtualizedList or ListView.                     |
	|-------------------------------------------------------------------------------------|
	|  onEndReached           | just like VirtualizedList or ListView.                     |
  	|-------------------------------------------------------------------------------------|
	|any props of ScrollView  |                                                            |

# react-native-waterfall
瀑布流组件
  
## 目前，需要注意以下几点。
- 瀑布流里面每个方块，都需要在第一次渲染时就确定好item的高度，而且保证后面不会改变。
- 需要刷新时，改变props.data的引用。
- 需要往下加更多item时，在原有的props.data后面加上新数据就行

## Props
- any props of ScrollView

- numberOfColumns: 瀑布流分成几列，默认3列。
  
- showUpDistance: 距离瀑布流的显示范围多远时，开始渲染一个item。

- onEndReachedThreshold: 参考VirtualizedList or ListView。
  
- onEndReached: 参考VirtualizedList or ListView。
