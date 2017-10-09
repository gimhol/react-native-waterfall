import React, { Component } from 'react';
import { Animated, View } from 'react-native';
export default class WaterfallItemView extends Component{
  constructor(props){
    super(props);
    this.hidden = false;
    this.height = 0;
    this.width = props.parent._getItemWidth();
    this.rtime = 0;
    this.state = {
      opacity: new Animated.Value(0)
    }
  }
  componentWillUnmount(){}
  componentWillMount(){}
  componentWillReceiveProps(nextProps){
    if(nextProps.item !== this.props.item){
      this.state.opacity.setValue(0)
      this.rtime = (this.rtime+1)%2;
      this.forceUpdate();
    }
  }
  componentDidMount(){}
  componentDidUpdate(){}
  hideIt(){
    if( !this.hidden ){
      this.state.opacity.setValue(0)
      this.hidden = true;
      this.forceUpdate();
    }
  }
  showIt(){
    if( this.hidden ){
      this.showUp()
      this.hidden = false;
      this.forceUpdate();
    }
  }
  showUp(){
    Animated.timing(
      this.state.opacity,{
        toValue:1,
        useNativeDriver: true,
        duration: 250
      }).start()
  }
  _renderContent(){
    var {item, idx, renderContent, parent} = this.props;
    return renderContent && renderContent(item,idx,this,parent);
  }
  setNativeProps(...args){
    this.refs.root.setNativeProps(...args);
  }
  _onLayout = (e)=>{
    var {item, idx, renderContent,parent} = this.props;
    this.props.onLayout && this.props.onLayout(e)
    this.width = e.nativeEvent.layout.width;
    this.height = e.nativeEvent.layout.height;
    parent.placeItem(this);
  }
  setPosition(left,top){
    this.setNativeProps({style:{position:'absolute', left, top}});
    this.left = left;
    this.top = top;
  }
  getTop(){ return this.top; }
  getFoot(){ return this.top + this.height; }
  render(){
    var style = [
      this.props.style,
      {
        paddingBottom: this.rtime,

        opacity: this.state.opacity,
        transform: [
          {
            scale: this.state.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            })
          }
        ],
      }
    ];
    return (
      <Animated.View ref={'root'} {...this.props} style={style} onLayout={this._onLayout}>
        {  this.hidden?
            <View style={{height: this.height}}/>
            :this._renderContent()
        }
      </Animated.View>
    );
  }
}
