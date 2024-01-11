import OracleDB, { Connection, Pool } from "oracledb"
import env from "../utils/validateEnv"

const dbConfig = {
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    connectString: env.DB_URI, // Host:Port/ServiceName
    poolMax: 10, // Maximum size of the pool
    poolMin: 2, // Minimum size of the pool
    poolIncrement: 2, // Number of connections to add when needed
    poolTimeout: 60, // Time (in seconds) after which idle connections are removed
    poolPingInterval: 60 // Time (in seconds) to check aliveness of connection
  };

export const connectToDB = async():Promise<Connection>=>{
       const pool = await OracleDB.createPool(dbConfig);
       return pool.getConnection();
}