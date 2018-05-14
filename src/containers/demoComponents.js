import React, { Component, PropTypes } from 'react';

// dva 的 connect 方法可以将组件和数据关联在一起
import { connect } from 'dva';

// 组件本身
const MyComponent = (props) => {
    return <div {...props}>hello world</div>;
};

MyComponent.propTypes = {
};

// 监听属性，建立组件和数据的映射关系
function mapStateToProps(state) {
    return { ...state.data };
}

// 关联 model
export default connect(mapStateToProps)(MyComponent);