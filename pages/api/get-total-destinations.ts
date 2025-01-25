import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const promisePool = pool.promise();
  const total = (await promisePool.query("SELECT COUNT(*) AS total FROM destinations") as RowDataPacket[0])[0][0].total;

  res.status(200).json({total});
}