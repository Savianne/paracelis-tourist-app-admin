import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from 'mysql2';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const promisePool = pool.promise();
    try {
        // For pool initialization, see above
        const row = await promisePool.query('SELECT * FROM admin WHERE email = ? OR username = ?', ["Admin", "Admin"]) as RowDataPacket[];
        res.status(200).json({ message: 'Hello from Next.js!', data: row[0] })
      } catch (err) {
        res.status(200).json({ message: 'Hello from Next.js!', err: err})
      }
}