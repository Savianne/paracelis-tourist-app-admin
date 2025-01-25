import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const body = JSON.parse(req.body);

    const placeUID = body.placeUID;

    try {
        const promisePool = pool.promise();
        const result = (await promisePool.query("SELECT pictureUID AS src FROM destinationimages WHERE destinationUID = ?", [placeUID]) as RowDataPacket[0])[0];
        
        res.status(200).json({ result });
    } catch(err) {
        console.log(err)
        res.status(500).json({ status: "error", error: err });
    }

}