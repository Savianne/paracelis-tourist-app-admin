import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket, OkPacketParams } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {start, end} = req.body;

    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        try {
            connection.beginTransaction();

            //get destinations 
            const destinations = (await promisePool.query("SELECT * FROM destinations LIMIT ?, ?", [start, end]) as RowDataPacket[0])[0];
    
            const items = [];
            // Insert image references into destinationimages table
            for (let n = 0; n < destinations.length; n++) {
                const uid = destinations[n].destinationUID;
    
                //get place info from destinations table
                const destinationData = (await promisePool.query('SELECT * FROM destinations WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0];
    
                //get total likes of the place
                const totalHearts = (await promisePool.query('SELECT COUNT(*) AS total_hearts FROM heartreact WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_hearts
    
                //get total likes of the place
                const totalLikes = (await promisePool.query('SELECT COUNT(*) AS total_likes FROM likes WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_likes
    
                //get total comments of the place
                const totalComments = (await promisePool.query('SELECT COUNT(*) AS total_comments FROM userscomments WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_comments
    
                //get cover photo
                const cover_photo = (await promisePool.query("SELECT cover_photo FROM detinations_cover_photo WHERE destinationUID = ?", [uid]) as RowDataPacket[])[0][0].cover_photo
    
                items.push(
                    {
                        ...destinationData,
                        totalLikes,
                        totalHearts,
                        totalComments,
                        coverPhoto: cover_photo
                    }
                )
            }
    
            //Commit 
            connection.commit();
            connection.release();
    
            res.status(200).json({ status: "success", data: items})
        } catch(err) {
            console.log(err)
            connection.rollback();
            res.status(500).json({ status: "error", error: err });
        } finally {
            // Always release the connection
            connection.release();
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
}