import React, {useEffect, useState} from 'react';
import {Table, Typography, Space, Anchor} from 'antd';
import FuturePrice from './FuturePrice';
import './App.less';
var mapping = require('./mapping.json');

const COIN_MARKETCAP = 'https://coinmarketcap.com/currencies/';
const {Link} = Anchor;

const RenderChange = ({change}) => {
  const value = (change * 100).toFixed(2);
  return (
    <Typography.Text type={value > 0 ? 'success' : 'danger'}>
      {value} %
    </Typography.Text>
  );
};

const RenderName = ({name}) => {
  return (
    <Anchor>
      <Link href={COIN_MARKETCAP + (mapping[name] ? mapping[name] : name)} title={name} target="_blank"/>
    </Anchor>
  );
};

const RenderUp = ({up}) => {
  return (
    <Typography.Text>
      {up ? up.join(' ') : '...'}
    </Typography.Text>
  );
};

const columns = [
  {
    title: 'Ticker',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'CoinMarketCap',
    dataIndex: 'underlying',
    key: 'underlying',
    render: (underlying) => <RenderName name={underlying}/>
  },
  {
    title: 'Price',
    dataIndex: 'marginPrice',
    key: 'marginPrice',
    render: (price) => `${price.toFixed(4)}$`
  },
  {
    title: '5s',
    dataIndex: 'up5s',
    key: 'up5s',
    render: (up5s) => <RenderUp up={up5s}/>
  },
  {
    title: '1m',
    dataIndex: 'up1m',
    key: 'up1m',
    render: (up1m) => <RenderUp up={up1m}/>
  },
  {
    title: '5m',
    dataIndex: 'up5m',
    key: 'up5m',
    render: (up5m) => <RenderUp up={up5m}/>
  },
  {
    title: 'Change 5m',
    dataIndex: 'change',
    key: 'change',
    sorter: (a, b) => a.change - b.change,
    render: (change) => <RenderChange change={change}/>
  },
  {
    title: 'Change 1h',
    dataIndex: 'change1h',
    key: 'change1h',
    sorter: (a, b) => a.change1h - b.change1h,
    render: (change) => <RenderChange change={change}/>
  },
  {
    title: 'Change 24h',
    dataIndex: 'change24h',
    key: 'change24h',
    sorter: (a, b) => a.change24h - b.change24h,
    render: (change) => <RenderChange change={change}/>
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
    futurePrice.start5s((data) => {});
    futurePrice.start1m((data) => {});
    futurePrice.start5m((data) => {});
  }, []);

  return (
    <Space>
      <Table rowKey="name" dataSource={data} columns={columns}/>
    </Space>
  );
};

export default App;
