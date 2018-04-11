import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button } from 'antd'
import queryString from 'query-string'

import List from 'components/Aliyun/List'

const AccountList = ({
  aliyun, dispatch, loading, location,
}) => {
  const { list, pagination } = aliyun
  location.query = queryString.parse(location.search)
  const { query, pathname } = location

  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['aliyun/fetch'],
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
    <div><Button type="primary">查询</Button>
      <List {...listProps} />
    </div>
  )
}

// AccountList.propTypes = {
//   aliyun: PropTypes.object,
//   dispatch: PropTypes.func,
//   loading: PropTypes.object,
//   location: PropTypes.object,
// }

export default connect(({ aliyun, loading }) => ({ aliyun, loading }))(AccountList)
