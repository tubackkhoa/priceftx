import React, { useEffect, useState } from 'react';
import { Table, Typography, Space } from 'antd';
import FuturePrice from './FuturePrice';
import './App.less';

const RenderChange = ({ change }) => {
  const value = (change * 100).toFixed(2);
  return (
    <Typography.Text type={value > 0 ? 'success' : 'danger'}>
      {value} %
    </Typography.Text>
  );
};

const columns = [
  {
    title: 'Ticker',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Price',
    dataIndex: 'marginPrice',
    key: 'marginPrice',
    render: (price) => `${price}$`
  },
  {
    title: 'Change 5m',
    dataIndex: 'change',
    key: 'change',
    sorter: (a, b) => a.change - b.change,
    render: (change) => <RenderChange change={change} />
  },
  {
    title: 'Change 1h',
    dataIndex: 'change1h',
    key: 'change1h',
    sorter: (a, b) => a.change1h - b.change1h,
    render: (change) => <RenderChange change={change} />
  },
  {
    title: 'Change 24h',
    dataIndex: 'change24h',
    key: 'change24h',
    sorter: (a, b) => a.change24h - b.change24h,
    render: (change) => <RenderChange change={change} />
  }
];

const futurePrice = new FuturePrice();
const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    futurePrice.start((data) => {
      setData(
        data
          .filter((item) => item.change24h > 0.05)
          .sort((a, b) => b.change1h - a.change1h)
      );
    });
  }, []);

  return (
    <Space>
      <Table rowKey="name" dataSource={data} columns={columns} />
    </Space>
  );
};

export default App;
