import { useState, useEffect } from 'react';
import {
  Text,
  Container,
  Row,
  Col,
  Card,
  Loading,
  Divider,
  Input,
} from '@nextui-org/react';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';

import productsService from './services/products.service';

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [search, setSearch] = useState('');

  // function to handle the inifinite scoll data fetching.
  async function fetchData() {
    try {
       const { data } = await productsService.getTrendingProducts(
         page,
         limit,
         refresh
       );
       setProducts([...products].concat(data.trendingProducts));
       setHasMore(data.totalPages > page);
       setPage(page + 1);
       setRefresh(false);
    } catch (err) {
      console.log(err);
    }
  }

  // function to handle refresh condition
  async function fetchRefreshData() {
    try {
      setProducts([]);
      setHasMore(true);
      setRefresh(true);
      const { data } = await productsService.getTrendingProducts(
        1,
        limit,
        refresh
      );
      setProducts(data.trendingProducts);
      setHasMore(data.totalPages > page);
      setPage(2);
      setRefresh(false);
      return data.trendingProducts;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => fetchData(), []);

  return (
    <div style={{ textAlign: 'center' }}>
      <header>
        <Container css={{ py: '$10' }} xs={3}>
          <Text h1>Trending Products</Text>
          <hr />
        </Container>
      </header>
      <Container css={{ py: '$10' }} xs={3}>
        <Input
          label="Search"
          size="xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Container>
      <InfiniteScroll
        dataLength={products.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<Loading />}
        refreshFunction={fetchRefreshData}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={<Text h3>&#8595; Pull down to refresh</Text>}
        releaseToRefreshContent={<Text h3>&#8593; Release to refresh</Text>}
      >
        <Container xs={3}>
          {products &&
            products.map((product, i) => (
              <Row key={product._id.product_name}>
                <Col className="my-2">
                  <Card
                    css={{ my: '$5' }}
                    hoverable
                    clickable
                    shadow
                    animated
                    bordered
                  >
                    <Container>
                      <Card.Body>
                        <Text h2>{product._id.product_name}</Text>
                        <Text>{product._id.restaurant_name}</Text>
                      </Card.Body>
                      <Divider />
                      <Card.Footer>
                        <Row justify="space-between">
                          <Text color="#777">
                            {product.most_recent_quantity} purchased recently
                          </Text>
                          <Text color="#777">
                            ordered {moment(product.most_recent_time).fromNow()}
                          </Text>
                        </Row>
                      </Card.Footer>
                    </Container>
                  </Card>
                </Col>
              </Row>
            ))}
        </Container>
      </InfiniteScroll>
    </div>
  );
}

export default App;
