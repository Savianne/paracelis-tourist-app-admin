import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {destinationUID} = req.body.data;

    const promisePool = pool.promise();
    try {

        const connection = await promisePool.getConnection();
        
        try {
            const result = (await connection.query("SELECT * FROM youtube_embed WHERE destinationUID = ?", [destinationUID]) as RowDataPacket[])[0];
        
            res.status(200).json({ success: true, result });
        } catch (err) {
            res.status(500).json({ status: "error", error: err });
        }
        finally {
            connection.release();
        }
        
    } catch(err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }

}