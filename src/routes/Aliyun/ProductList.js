import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import moment from 'moment';
import { Table, List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import styles from './ProductList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;

@connect(({ aliyun, loading }) => ({
  aliyun,
  loading,
}))

class ProductList extends PureComponent {
  static defaultProps = {
  }
  handleChangeStatus = e => {
    e.preventDefault();
    this.props.dispatch({
      type: 'aliyun/fetchProductInfoListGet',
      payload: {
        status: e.target.value,
      },
    });
  }
  render() {
    const { aliyun: { productInfoList, pagination }, loading, dispatch, location } = this.props;
    const { query, pathname } = location;
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="DEVELOPMENT_STATUS" onChange={this.handleChangeStatus}>
          <RadioButton value="DEVELOPMENT_STATUS">开发中</RadioButton>
          <RadioButton value="RELEASE_STATUS">已发布</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入..."
          onSearch={() => ({})}
        />
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>Edit</a>
        </Menu.Item>
        <Menu.Item>
          <a>Delete</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          More <Icon type="down" />
        </a>
      </Dropdown>
    );

    const columns = [
      { "title": "产品名称", "dataIndex": "name" },
      { "title": "产品型号", "dataIndex": "", render: () => <span>-</span>, width: 100 },
      { "title": "productKey", "dataIndex": "productKey", width: 140 },
      { "title": "节点类型", "dataIndex": "nodeType", width: 100 },
      { "title": "状态", "dataIndex": "status", width: 150 },
      { "title": "创建时间", "dataIndex": "gmtCreate", width: 180 },
      // { "title": "accessMethod", "dataIndex": "accessMethod" },
      // { "title": "gmtModified", "dataIndex": "gmtModified" },
      // { "title": "productModel", "dataIndex": "productModel" },
      // { "title": "modifier", "dataIndex": "modifier" },
      // { "title": "categoryName", "dataIndex": "categoryName" },
      // { "title": "creator", "dataIndex": "creator" },
      // { "title": "productId", "dataIndex": "productId" },
      // { "title": "netType", "dataIndex": "netType" },
      // { "title": "dataFormat", "dataIndex": "dataFormat" },
      // { "title": "aliyunCommodityCode", "dataIndex": "aliyunCommodityCode" },
      // { "title": "productSecret", "dataIndex": "productSecret" },
      // { "title": "categoryKey", "dataIndex": "categoryKey" },
      // { "title": "domain", "dataIndex": "domain" },
      // { "title": "tenantId", "dataIndex": "tenantId" },
      // { "title": "region", "dataIndex": "region" },
      // { "title": "rbacTenantId", "dataIndex": "rbacTenantId" },
      // { "title": "ownerDomain", "dataIndex": "ownerDomain" },
      // { "title": "categoryId", "dataIndex": "categoryId" },
      {
        "title": "Action",
        "dataIndex": "",
        "key": "x",
        width: 150,
        render: () => <div><a href="javascript:;">查看</a>,  <MoreBtn /></div>,
      },
    ];

    const tableProps = {
      pagination,
      dataSource: productInfoList,
      loading: loading.effects['aliyun/fetchProductInfoListGet'],
      onChange(page) {
        dispatch(routerRedux.push({
          pathname,
          search: queryString.stringify({
            ...query,
            page: page.current,
            pageSize: page.pageSize,
          }),
        }))
      },
    }

    return (
      <div className={styles.standardList}>
        <Card
          bordered={false}
          title="产品接入-模组开发调试产品"
          style={{ marginTop: 16 }}
          extra={extraContent}
        >
          <Table
            {...tableProps}
            bordered
            columns={columns}
            simple
            className={styles.table}
            rowKey={record => record.productId}
          />
          {/* <List
            rowKey="id"
            loading={loading.effects['aliyun/fetchProductInfoListGet']}
            pagination={paginationProps}
            dataSource={productInfoList}
            renderItem={item => (
              <List.Item
                actions={[<a>Edit</a>, <MoreBtn />]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.logo} shape="square" size="large" />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.subDescription}
                />
                <ListContent data={item} />
              </List.Item>
            )}
          /> */}
        </Card>
      </div>
    );
  }
}

export default ProductList



// const demoItem = {
//   "accessMethod": "MODULE_DEV",
//   "gmtModified": "2018-03-31 00:29:13",
//   "productModel": "蓝光模组测试cs1's product",
//   "modifier": "5018alf53df0a9046f4a48981b6814eaedbc4562",
//   "productKey": "a1L2VpOLSUn",
//   "categoryName": "水表",
//   "creator": "5018alf53df0a9046f4a48981b6814eaedbc4562",
//   "productId": 155071,
//   "netType": "NET_CELLULAR",
//   "dataFormat": "ALINK_FORMAT",
//   "aliyunCommodityCode": "tmp",
//   "productSecret": "cLUuOpofeGFjnUY8",
//   "categoryKey": "WaterMeter",
//   "nodeType": "DEVICE",
//   "gmtCreate": "2018-03-31 00:29:13",
//   "domain": "a1L2VpOLSUn",
//   "name": "蓝光模组测试的调试产品",
//   "tenantId": 12377,
//   "region": "cn-shanghai",
//   "rbacTenantId": "4AE1852DA9884731A4AAE64D6636CD3E",
//   "ownerDomain": "tmp_5018alf53df0a9046f4a48981b6814eaedbc4562",
//   "categoryId": 21,
//   "status": "DEVELOPMENT_STATUS",
// };

// const columns = [];

// Object.keys(demoItem).map(key => {
//   columns.push({
//     title: key,
//     dataIndex: key,
//   })
// });

// columns.push({
//   title: 'Action',
//   dataIndex: '',
//   key: 'x',
//   render: () => <a href="javascript:;">Delete</a>,
// });