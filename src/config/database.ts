import pg from 'pg';
import dotenv from 'dotenv';
import "./setup.js"
dotenv.config();

const { Pool } = pg;

const devConfig = {
  host: "127.0.0.1",
  port: 5432,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
}

const prodConfig:any = {
  connectionString: process.env.DATABASE_URL
}

if(process.env.MODE === "PROD"){
  prodConfig.ssl = {
    rejectUnauthorized: false,
  }
}

const connection = new Pool(process.env.MODE === "PROD" ? prodConfig : devConfig);

export default connection;