import React, { Component } from 'react';
import { View } from 'react-native';
export default class WaterfallItemView extends Component{
  constructor(props){
    super(props);
    this.hidden = false;
    this.height = 0;
    this.width = props.parent._getItemWidth();
    this.rtime = 0;
  }
  componentWillUnmount(){}
  componentWillMount(){}
  componentWillReceiveProps(nextProps){
    if(nextProps.item !== this.props.item){
      this.rtime = (this.rtime+1)%2;
      this.forceUpdate();
    }

    //this.setOpacity(0)
  }
  componentDidMount(){}
  componentDidUpdate(){}
  hideIt(){
    if( !this.hidden ){
      this.hidden = true;
      this.forceUpdate();
    }
  }
  showIt(){
    if( this.hidden ){
      this.hidden = false;
      this.forceUpdate();
    }
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
  setOpacity(opacity){
    this.setNativeProps({style:{ opacity }});
  }
  render(){
    var style = [
      this.props.style,
      { paddingBottom: this.rtime }
    ];
    return (
      <View ref={'root'} {...this.props} style={style} onLayout={this._onLayout}>
        {  this.hidden?
            <View style={{height: this.height}}/>
            :this._renderContent()
        }
      </View>
    );
  }
}
