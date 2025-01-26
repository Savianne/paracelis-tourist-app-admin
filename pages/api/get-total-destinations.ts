import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const promisePool = pool.promise();

  try {
    const connection = await promisePool.getConnection();

    try {
      const total = (await connection.query("SELECT COUNT(*) AS total FROM destinations") as RowDataPacket[0])[0][0].total;
      res.status(200).json({total});
    } catch(err) {
      res.status(500).json({ status: "error", error: err });
    } finally {
      connection.release()
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: "error", error: "Database connection error: " + err });
  }
  
}