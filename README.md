# trie-trending-products
### Tech Stack (MERN)
- MongoDB `v5.0.6`
- ExpressJS `v4.17.3`
- ReactJS `v17.0.2`
- NodeJS `v14.9.0`

### How I solved the problem
1. I used MongoDB to store [Sample Orders](https://docs.google.com/spreadsheets/d/1xfAjSlBflehOYj4O7I2YkfcBB1b9VgSHg9X-SmRWmsE/edit#gid=280279953) by downloading it as a `.xlsx` file where I converted it into a `.json` file. It is stored at `backend/src/_seedData/orders.json`
2. I manipulated the `orders.json` file to add a random timestamp to each row that had the same `order_id` via `backend/src/util/getRandomDate.js`
3. Using a script `npm run import`, it imports the `.json` file into MongoDB via `backend/src/util/seedData.js`
4. Using NodeJS, I created two models. One for `Order` and one for `TrendingProduct`.
    - The `Order` model is an object used to represent each document in the `orders` collection we stored in Step 3.  
    - The `TrendingProduct` model represents a trending product in the `trending_products` collection.
5. The `trending_products` collection is a materialized view of the `orders` collection by using an aggregation pipeline via `backend/src/util/createTrendingProductsMaterialView.js`.
    - In the aggregation pipeline, I used the `$group` operator to group by `restaurant_name` and `product_name` to get the `$max` of `order_time` and `$sum` of `product_quantity` for each group
    -  Then I used the `$sort` operator to define the heruistic to sort the trending products.
6. The heuristic is split into two parts:
    - The first part is to sort by recency. This is prioritized first. I do this by creating a `time_heruistic` field in the aggregation pipeline that falls in the range from 0 - 10 for each product. I essentially bucket each product into 10 buckets by performing a conditional `$cond` on the `order_time` field. Each bucket time range doubles in size. 
        - Bucket 1: [0 - 0.125 hours] before current time
        - Bucket 2: [0.125 - 0.25 hours]  before current time
        - Bucket 3: [0.25 - 0.5 hours]  before current time
        - Bucket 4: [0.5 - 1 hours]  before current time
        - Bucket 5: [1 - 2 hours]  before current time
        - Bucket 6: [2 - 4 hours]  before current time
        - Bucket 7: [4 - 8 hours]  before current time
        - Bucket 8: [8 - 16 hours] before current time
        - Bucket 9: [16 - 32 hours]  before current time
        - Bucket 10: [32 - 48 hours]  before current time
    - The second part is to sort by aggregated sum of  `product_quantity`. This is prioritized second (without bucketing)
7. Using NodeJS, I created an api endpoint at `backend/src/controllers/products.js` that queries the `trending_products` collection and returns the aggregation. It also performs a pagination of the results based on the request query  from the frontend in order to serve data for the infinite-scrolling list of trending products.
8. The frontend is implemented by using `axios` for requests and a third part library called `react-infinite-scroller` to handle the pagination. I provide the function calls and manage the state while the component handles the infinite scrolling with the pagination queries I pass to the backend.

### How to setup
1. [Install NodeJS](https://nodejs.org/en/download/)
2. [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
3. [Run MongoDB as a service](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb-community-edition)
4. Create a `.env` file in the root of `Ahmed_Shahrour/backend`.
```
PORT=5000
MONGODB_URI="mongodb://localhost:27017/snackpass"
```
### How to run
-  Open one terminal for backend

    ```
    cd backend
    ```
    ```
    npm install
    ```
    ```
    npm start
    ```

    > NOTE: npm will delete and seed data from the snakpass database to keep the timestamps of the orders recent.
- Open another terminal for the frontend

  ```
  cd frontend
  ```
  ```
  npm install
  ```
  ```
  npm start
  ```
  >Go ahead and scroll, it should be infinite scrolling! and try pulling down, it should refresh! (if it were live data, the data would be updated)

### Improvements
- Using a materialized view can pay off tremendously for performance. However, there are drawbacks if multiple users are accessing the database at the same time while the data is live. I'm not sure how to handle this but one could create a trigger to update the view every set interval so that everyone sees the same aggregation and still enjoy performance. My trigger was using the refresh query parameter to update the view.
- Unit testing is a must, and I clearly didn't do it. Identitfying edge cases and asserting input forms would be a good start.
- Use `Docker` to create an agnostic versioning setup for the backend and frontend. Developers will have more control and setup steps decrease, but they'd have to be familiar with the setup.
- Creating configuration for development and production environments.
- Live deployment.
- Seeding data from a spreadsheet isn't ideal for a real world application. So I could have used my own data where I have a little more control over edge cases.

