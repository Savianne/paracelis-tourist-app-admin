import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const searchTerm = req.body.searchTerm;
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        try {
            const result = (await connection.query("SELECT title, destinationUID AS uid FROM destinations WHERE title LIKE CONCAT('%', ?, '%') LIMIT 10;", [searchTerm]) as RowDataPacket[0])[0];
           
            const items = [];
    
            for (let n = 0; n < result.length; n++) {
                const uid = result[n].uid;
    
                //get cover photo
                const cover_photo = (await connection.query("SELECT cover_photo FROM detinations_cover_photo WHERE destinationUID = ?", [uid]) as RowDataPacket[])[0][0].cover_photo;
    
                items.push(
                    {
                        ...result[n],
                        coverPhoto: cover_photo
                    }
                )
            }

            res.status(200).json({ result: items });

        } catch (err) {
            res.status(500).json({ status: "error", error: err });
        } finally {
            connection.release();
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }

}