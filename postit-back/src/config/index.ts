
export default () => ({
  port: parseInt(process.env.PORT || '3002', 10) || 3004,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '27017', 10) || 27017,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  }
});
