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
    promisePool.getConnection()
    .then(connection => {
        connection.beginTransaction()
        .then(async ()=> {

            //get place info from destinations table
            const destinationData = (await promisePool.query('SELECT * FROM destinations WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0];

            if(!destinationData) throw Error("Invalid UID");

            //get total likes of the place
            const totalHearts = (await promisePool.query('SELECT COUNT(*) AS total_hearts FROM heartreact WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_hearts

            //get total likes of the place
            const totalLikes = (await promisePool.query('SELECT COUNT(*) AS total_likes FROM likes WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_likes

            //get total comments of the place
            const totalComments = (await promisePool.query('SELECT COUNT(*) AS total_comments FROM userscomments WHERE destinationUID = ?', [uid]) as RowDataPacket[])[0][0].total_comments

            //get cover photo
            const cover_photo = (await promisePool.query("SELECT cover_photo FROM detinations_cover_photo WHERE destinationUID = ?", [uid]) as RowDataPacket[])[0][0].cover_photo
            
            //get location
            const location = (await promisePool.query("SELECT * FROM geography WHERE destinationUID = ?", [uid]) as RowDataPacket[])[0][0];
            //Commit 
            connection.commit();
            connection.release();

            res.status(200).json({ status: "success", data: {
                ...destinationData,
                location: {...location},
                totalLikes,
                totalHearts,
                totalComments,
                coverPhoto: cover_photo
            }})
        })
        .catch((beginTransactionError) => {
            connection.rollback();
            connection.release();
            res.status(500).json({ status: "error"})
            throw beginTransactionError;
        });
    })
    .catch(err => {
        res.status(500).json({ status: "error", error: err})
    })
}