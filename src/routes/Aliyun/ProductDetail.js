import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Card, List, Table, Button, Radio, Slider, notification } from 'antd';
import moment from "moment";
import queryString from 'query-string'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ aliyun, loading, dispatch }) => ({
    loadingProduct: loading.effects['aliyun/fetchProductByProductKey'],
    productDetail: aliyun.productDetail,
    deviceList: aliyun.deviceList,
    SelectedDevice: aliyun.SelectedDevice,
    pagination: aliyun.pagination,
    dispatch,
    loading,
}))

class ProductDetail extends PureComponent {
    static defaultProps = {
        size: 'default',
    }

    // handleRefresh = (e) => {
    //     const { dispatch, productDetail } = this.props;
    //     const params = {
    //         productKey: productDetail.productKey,
    //         deviceName: 's7zMqOjD2yA1GcqckXXv',
    //         propertyIdentifier: 'LightSwitch',
    //     }
    //     dispatch({ type: 'aliyun/getThingProperty', payload: params })
    // }

    // handleSwitch = (e) => {
    //     console.log(e.target.value);
    //     const { dispatch, productDetail } = this.props;
    //     const params = {
    //         productKey: productDetail.productKey,
    //         deviceName: 's7zMqOjD2yA1GcqckXXv',
    //         LightSwitch: 1,
    //     }
    //     dispatch({ type: 'aliyun/putThingProperties', payload: params })
    // }

    handleChangeDeviceProperty = (identifier, e) => {
        const {dispatch, SelectedDevice,productDetail} = this.props;
        if(!SelectedDevice.productKey){
          
          notification.error({
            message: `请求错误 productKey needed`,
            description: '请求错误， 请先选择设备',
          });
          return
        }
        // productKey=a19kxqwXWu7&deviceName=s7zMqOjD2yA1GcqckXXv&LightSwitch=1
        const params = {
            productKey: SelectedDevice.productKey,
            deviceName: SelectedDevice.name,
            SelectedDevice,
            productDetail,
        };
        params[identifier] = e.target ? e.target.value : e;
        try {
          dispatch({type:'aliyun/putThingProperties', payload:params});
        } catch (error) {
          notification.error({
            message: `请求错误`,
            description: error.message,
          });
        }
        console.log('handleChangeDeviceProperty', identifier, params[identifier]);
    }

    handleSelectDevice = (item) => {
        const { dispatch, productDetail } = this.props;
        const params = {
            SelectedDevice: item,
            productDetail,
        };
        dispatch({ type: 'aliyun/fetchThingProperty', payload: params})
    }

    render() {
        const { dispatch, loading, productDetail, deviceList, SelectedDevice,pagination, location } = this.props;

        location.query = queryString.parse(location.search)
        const { query, pathname } = location

        // deviceKey:"q7Grsrl0XuazUyn4AwmN"
        // deviceSecret:"5pWJ62kr4YkM2E1V8FGubseNR2Xxiz2g"
        // gmtCreate:"2018-04-13 17:13:00"
        // gmtModified:"2018-04-13 17:13:00"
        // iotId:"q7Grsrl0XuazUyn4AwmN0010a8b700"
        // name:"bro-l-001"
        // productKey:"a19kxqwXWu7"
        // rbacTenantId:"4AE1852DA9884731A4AAE64D6636CD3E"
        // region:"cn-shanghai"
        // status:0         // [0:'未激活', 1:'',2:'',3:'离线']
        // statusLast:0
        // thingType:"DEVICE"
        const columns = [{
            title: 'DeviceName',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '类型',
            dataIndex: 'thingType',
            key: 'thingType',
        },
        {
            title: '创建日期',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
            render: (text) => {
              return (moment(text).format('YYYY-MM-DD hh:mm:ss'))
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
              return (
                <Button onClick={e => this.handleSelectDevice(record, e)}>查看</Button>
              );
            },
          }];

        const tableProps = {
          pagination,
          columns,
          dataSource: deviceList,
          loading: loading.effects['aliyun/fetchDeviceByProductKey'],
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

        const UIDeviceList = () => (
          <Table {...tableProps} rowKey={record => record.iotId} />
        );

        const RadioGroup = Radio.Group;

        function formatter(value) {
          return `${value}%`;
        }

        const sliderMarks = {
          0: '0%',
          100: {
            style: {
              color: '#f50',
            },
            label: <strong>100%</strong>,
          },
        };

        const UIDataSpecsList = ({data: {dataSpecsList, dataSpecs, value, ...rest}}) => (
          <div>
            { dataSpecsList ?  (
              <div>
                <RadioGroup 
                  defaultValue={value} 
                  options={dataSpecsList.map(o=>{return {label:o.name, value:o.value}})}
                  onChange={e=>this.handleChangeDeviceProperty(rest.identifier,e)}
                />
              </div>) : (
                dataSpecs.unit==='%' ?
                (
                  <div>
                    <Slider 
                      tipFormatter={formatter} 
                      marks={sliderMarks} 
                      value={value}
                      onChange={newValue=>this.handleChangeDeviceProperty(rest.identifier,newValue)}
                    />
                  </div>): (
                    <div>
                      {dataSpecs.dataType},{dataSpecs.unitName},{dataSpecs.min},{dataSpecs.max}
                    </div>))
            }
          </div>
          
        );

        const UIDevicePropertyList = ()=>(
          <List
            rowKey="propertyId"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={productDetail}
            renderItem={
                  (item) => (
                    <List.Item key={item.propertyId}>
                      <Card title={item.name} bordered={false}>
                        
                        <UIDataSpecsList data={item} />

                        {/* <span>当前状态值: {item.value}</span> */}

                        {/* <Button type="primary" size={size} onClick={this.handleSwitch}>切换</Button> */}
                      </Card>
                    </List.Item>
              )}
          />);

        return (
          <PageHeaderLayout
            title="产品设备"
            content="产品设备信息。"
          >
            <div className="content-inner">

              <h2 style={{ margin: '16px 0' }} />
              <Row gutter={32}>
                <Col>
                  <Card title="设备列表">
                    <UIDeviceList />
                  </Card>
                </Col>
              </Row>

              <h2 style={{ margin: '16px 0' }}>设备运行状态 - {SelectedDevice.name}</h2>
              <div style={{ background: '#ECECEC', padding: '30px' }}>
                <UIDevicePropertyList />
              </div>

              <h2 style={{ margin: '16px 0' }} />
              <Row gutter={32}>
                <Col>
                  <Card title="设备属性字典">
                    <div>返回JSON数据：{JSON.stringify(productDetail)}</div>
                  </Card>
                </Col>
              </Row>
            </div>
          </PageHeaderLayout>
        )
    }
}

export default ProductDetail;
