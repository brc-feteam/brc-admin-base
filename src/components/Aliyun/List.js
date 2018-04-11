import React from 'react'
import { Table } from 'antd'
import styles from './List.less'

const showSubTable = (value) => {
  const result = value.reduce((previousValue = '', item) => {
    return typeof (previousValue) === 'object'
      ? `${item.clientType}=${item.show}`
      : `${previousValue}  ${item.clientType}=${item.show}`
  })
  return result
}

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'attrKey',
      dataIndex: 'attrKey',
    }, {
      title: 'attrNameCn',
      dataIndex: 'attrNameCn',
    }, {
      title: 'attrType',
      dataIndex: 'attrType',
    }, {
      title: 'category',
      dataIndex: 'category',
    }, {
      title: 'creator',
      dataIndex: 'creator',
    }, {
      title: 'description',
      dataIndex: 'description',
    }, {
      title: 'editor',
      dataIndex: 'editor',
    }, {
      title: 'gmtCreate',
      dataIndex: 'gmtCreate',
    }, {
      title: 'gmtModified',
      dataIndex: 'gmtModified',
    }, {
      title: 'isActived',
      dataIndex: 'isActived',
    }, {
      title: 'showWhenRegister',
      dataIndex: 'showWhenRegister',
      render: record => showSubTable(record),
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        className={styles.table}
        rowKey={record => record.attrKey}
      />
    </div>
  )
}

export default List
