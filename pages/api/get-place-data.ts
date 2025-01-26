import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket, OkPacketParams } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const body = JSON.parse(req.body);

    const uid = body.uid;
   
    const promisePool = pool.promise();
    
    try {
        const connection = await promisePool.getConnection();

        try {
            connection.beginTransaction();
            //get place info from destinations table
            const destinationData = (await connection.query('SELECT * FROM destinations WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0];

            if(!destinationData) throw Error("Invalid UID");

            //get total likes of the place
            const totalHearts = (await connection.query('SELECT COUNT(*) AS total_hearts FROM heartreact WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_hearts

            //get total likes of the place
            const totalLikes = (await connection.query('SELECT COUNT(*) AS total_likes FROM likes WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_likes

            //get total comments of the place
            const totalComments = (await connection.query('SELECT COUNT(*) AS total_comments FROM userscomments WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_comments

            //get cover photo
            const cover_photo = (await connection.query("SELECT cover_photo FROM detinations_cover_photo WHERE destinationUID = ?", [uid]) as RowDataPacket[])[0][0].cover_photo

            //get location
            const location = (await connection.query("SELECT * FROM geography WHERE destinationUID = ?", [uid]) as RowDataPacket[])[0][0];
            //Commit 
            await connection.commit();

            res.status(200).json({ status: "success", data: {
                ...destinationData,
                location: {...location},
                totalLikes,
                totalHearts,
                totalComments,
                coverPhoto: cover_photo
            }})
        } catch (err) {
            await connection.rollback();
            res.status(500).json({ status: "error"})
        }
        finally {
            connection.release();
        }
    }
    catch (err) {
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
}