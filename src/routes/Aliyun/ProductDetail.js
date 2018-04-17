import React, { PureComponent } from 'react';
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'
// import queryString from 'query-string'

@connect(({ aliyun, loading }) => ({
    loading: loading.effects['aliyun/fetchProductByProductKey'],
    productDetail: aliyun.productDetail,
}))

class ProductDetail extends PureComponent {
    render() {
        const productDetail = this.props.productDetail;
        return (
          <div>
                返回JSON数据：{JSON.stringify(productDetail)}
          </div>
        )
    }
}

export default ProductDetail;
