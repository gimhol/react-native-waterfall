import React, { Component } from 'react';
import { ScrollView, View, StyleSheet} from 'react-native';
import ItemView from './ItemView'

var styles = StyleSheet.create({
  root: {
    flex:1,
    alignSelf:'stretch'
  },
  container: {
    alignSelf:'stretch'
  }
})

export default class Waterfall extends Component{
  static defaultProps = {
    onEndReachedThreshold: 0,
    expansionOfScope: 500,
    numberOfColumns: 3,
    data: []
  };
  constructor(props){
    super(props);
    this.list = [...props.data];
    this._resetColHeight();
    this.itemRefs = [];
    this.visibleRange = { start: 0, end: 0 };
    this.curPlacingIdx = 0;
    this.placing = this.list.length > 0;
  }

  componentWillReceiveProps(nextProps){
    var { data } = nextProps;
    if( !data instanceof Array ){
      var err = new Error("props.data should be an array!");
      return console.error(err);
    }
    this.placing = true

    //datas have been refresh, remove all items.
    if( data !== this.props.data ){
      //reset placement job, start with the first item.
      this.curPlacingIdx = 0;
      //reset the list to remove all items
      this.list = [];
      //reset items' reference
      this.itemRefs = [];
      //reset every columns' height
      this._resetColHeight()
      //reset visible range
      this._resetVisibleRange()
      //fire 'render' to remove all itemViews
      this.forceUpdate()

      this.scrollView.scrollTo({x: 0, y: 0, animated: false})
    }
    //add more item
    else if(data.length > this.list.length){
      for(var i=this.list.length; i< data.length; ++i){
        this.list.push(data[i])
      }
      this.forceUpdate()
    }
    else if(data.length < this.list.length){
      var err = new Error("does not support remove item!");
      return console.error(err);
    }
    else{

    }
  }
  shouldComponentUpdate(nextProps){
    var { data } = nextProps;
    if( data !== this.props.data )
      return true

    return false
  }
  componentDidUpdate(lastProps,lastState){
    //datas have been refresh and all items have been removed.
    //add items again.
    if(this.list.length === 0 && this.props.data.length > 0){
      this.list = [...this.props.data];
      this.forceUpdate()
      this._controlItemVisibility(0)
    }
  }
  _resetVisibleRange(){
    this.visibleRange.start = 0;
    this.visibleRange.end = 0;
    delete this.lastContentOffset;
  }
  _resetColHeight(){
    var { numberOfColumns } = this.props;
    this.colHeights = [];
    for(let i=0; i < numberOfColumns; ++i){
      this.colHeights.push(0)
    }
  }
  componentWillUpdate(lastProps,lastState){}
  _getItemWidth(){
    var { numberOfColumns } = this.props
    return this.width/numberOfColumns;
  }
  _getMaxHeight(){
    var maxCol = this._getMaxCol();
    return this.colHeights[maxCol];
  }
  _getMinHeight(){
    var minCol = this._getMinCol();
    return this.colHeights[minCol];
  }
  _getMaxCol(){
    var numberOfColumns = 0;
    var max = this.colHeights[0];
    for(var i=0; i<this.colHeights.length; ++i){
      if(this.colHeights[i] > max){
        numberOfColumns = i;;
        max = this.colHeights[i];
      }
    }
    return numberOfColumns;
  }
  _getMinCol(){
    var numberOfColumns = 0;
    var min = this.colHeights[0];
    for(var i=0; i<this.colHeights.length; ++i){
      if(this.colHeights[i] < min){
        numberOfColumns = i;
        min = this.colHeights[i];
      }
    }
    return numberOfColumns;
  }
  _renderItems(){
    return this.list.map(this._renderItem);
  }
  _renderItem = (item,idx)=>{
    var { renderItem, numberOfColumns } = this.props;
    var ref = (ref)=>{ this._refItem(ref,idx) };
    var initStyle = {
      //opacity: 0,
      position:'absolute',
      width: this._getItemWidth(),
    };
    return (
      <ItemView
        parent={this}
        idx={idx}
        item={item}
        ref={ref}
        key={idx}
        style={initStyle}
        renderContent={renderItem}/>
    );
  }
  _refItem = (ref,idx)=>{
    this.itemRefs[idx] = ref;
  }

  placeItem(itemRef){
    var placementJob = (itemRef)=>{
      var minCol = this._getMinCol();
      var top = minCol*this._getItemWidth();
      var left = this.colHeights[minCol];
      itemRef.setPosition(top,left);
      itemRef.showUp();
      this.colHeights[minCol] += itemRef.height;
      //重新设置内部容器高度
      this.container.setNativeProps({
        style:{
          height: this._getMaxHeight()
        }
      })
      ++this.curPlacingIdx;
      if( this.curPlacingIdx === this.list.length){
        this.placing = false;
        this.jobAfterPlacing && this.jobAfterPlacing();
        this.jobAfterPlacing = null;
      }
    }
    if( itemRef.props.idx == 0){
      this.curPlacingIdx = 0
      this._resetVisibleRange()
      this._resetColHeight()
    }
    //轮到当前组件做渲染。
    if( itemRef.props.idx == this.curPlacingIdx ){
      placementJob(itemRef);
    }
    //前面还有item重新放置，需要等待。
    else if(itemRef.props.idx > this.curPlacingIdx){

    }
    else if(itemRef.props.idx < this.curPlacingIdx){

    }
  }
  _onRootLayout = (e)=>{
    this.props.onLayout && this.props.onLayout(e)
    var { width, height } = e.nativeEvent.layout
    this.width = width
    this.height = height
  }
  _refScrollView = (ref)=>{ this.scrollView = ref; }
  _refContainer = (ref)=>{ this.container = ref; }
  _controlItemVisibility = (contentOffsetY)=>{
    var expansionOfScope = this.props.expansionOfScope || 0;
    var top = contentOffsetY - expansionOfScope;
    var bottom = contentOffsetY + this.height + expansionOfScope;
    var { start, end } = this.visibleRange;
    if(this.lastContentOffset === undefined){
      for(var i = 0; i < this.itemRefs.length; ++i){
        var itemView = this.itemRefs[i];
        if( !itemView ){
          continue
        }
        if( top > itemView.getFoot() ){
          itemView.hideIt();
          this.visibleRange.start = i+1;
        }
        else if( bottom < itemView.getTop() ){
          itemView.hideIt();
        }
        else{
          itemView.showIt();
          this.visibleRange.end = i;
        }
      }
    }
    //items move upward
    else if( contentOffsetY > this.lastContentOffset){
      for(var i = start; i<this.itemRefs.length; ++i){
        var itemView = this.itemRefs[i];
        if( !itemView ){
          continue
        }if( top > itemView.getFoot() ){
          itemView.hideIt();
        }else{
          this.visibleRange.start = i;
          break;
        }
      }
      for(var i=end; i < this.itemRefs.length; ++i){
        var itemView = this.itemRefs[i];
        if( !itemView ){
          continue
        }if( bottom > itemView.getTop() ){
          itemView.showIt();
          this.visibleRange.end = i;
        }else{
          break;
        }
      }
    }
    //items move downward
    if( contentOffsetY < this.lastContentOffset){
      for(var i=start; i>=0; --i){
        var itemView = this.itemRefs[i];
        if( !itemView ){
          continue
        }if( top < itemView.getFoot() ){
          itemView.showIt();
          this.visibleRange.start = i;
        }else{
          break;
        }
      }
      for(var i=end; i>=0; --i){
        var itemView = this.itemRefs[i];
        if( !itemView ){
          continue
        }if( bottom < itemView.getTop()  ){
          itemView.hideIt();
        }else{
          this.visibleRange.end = i;
          break;
        }
      }
    }
    this.lastContentOffset = contentOffsetY;
  }
  _onScroll = (e)=>{
    var { onScroll, onEndReached, onEndReachedThreshold } = this.props;
    var { nativeEvent } = e;
    var { contentOffset , layoutMeasurement, contentSize} = nativeEvent;

    this._controlItemVisibility( contentOffset.y );
    onScroll && onScroll(e);

    if( this.isHandlingOnEndReached && contentSize.height != this.lastContentHeight){
      this.isHandlingOnEndReached = false;
    }
    if( !this.isHandlingOnEndReached && contentSize.height - contentOffset.y - layoutMeasurement.height < onEndReachedThreshold ){
      this.isHandlingOnEndReached = true;
      this.lastContentHeight = contentSize.height;
      onEndReached && onEndReached();
    }else if( this.isHandlingOnEndReached && contentSize.height - contentOffset.y - layoutMeasurement.height > onEndReachedThreshold){
      this.isHandlingOnEndReached = false;
    }
  }
  render(){
    return (
      <ScrollView {...this.props} ref={this._refScrollView} style={[styles.root,this.props.style]} onLayout={this._onRootLayout} onScroll={this._onScroll}>
        <View style={styles.container} ref={this._refContainer} >
        { this.width && this._renderItems() }
        </View>
      </ScrollView>
    );
  }
}
