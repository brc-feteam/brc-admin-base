import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Row, Col, Card, Table, Button } from 'antd';
// import { routerRedux } from 'dva/router'
// import queryString from 'query-string'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ aliyun, loading }) => ({
    loading: loading.effects['aliyun/fetchProductByProductKey'],
    productDetail: aliyun.productDetail,
}))

class ProductDetail extends PureComponent {
    static defaultProps = {
        size: 'default',
    }
    
    render() {
        const { size } = this.props;

        const productDetail = this.props.productDetail;
        return (
          <PageHeaderLayout
            title="产品设备"
            content="产品设备信息。"
          >
            <div className="content-inner">
              <h2 style={{ margin: '16px 0' }}>设备属性</h2>
              <Row gutter={32}>
                <Col>
                  <Card title="默认">
                    <div>返回JSON数据：{JSON.stringify(productDetail)}</div>
                  </Card>
                </Col>
              </Row>
              <h2 style={{ margin: '16px 0' }}>设备属性状态</h2>
              <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Card title="主灯开关" bordered={false}>
                      <div>关闭／开启</div>
                      <div>2018-04-12 17:21:24</div>
                      <Button type="primary" size={size}>切换</Button>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </PageHeaderLayout>
        )
    }
}

export default ProductDetail;
