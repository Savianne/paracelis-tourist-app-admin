import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket, OkPacketParams } from 'mysql2';
import axios from 'axios';
import { generateUID } from '@/app/helpers/generateUID';
import { RESOURCES_SERVER_URL } from "../../app/resources-server-url";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end(`Method ${req.method} Not Allowed`);

    const { destinationUID } = req.body.data;

    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        
        try {
            // Start a transaction
            await connection.beginTransaction();

            //delete from destinations table
            await connection.query("DELETE FROM destinations WHERE destinationUID = ?", [destinationUID]);

            //delete all comments from userscomments table
            await connection.query("DELETE FROM userscomments WHERE destinationUID = ?", [destinationUID]);

            //delete all likes from likes table
            await connection.query("DELETE FROM likes WHERE destinationUID = ?", [destinationUID]);

            //delete all hearts from heartreact table
            await connection.query("DELETE FROM heartreact WHERE destinationUID = ?", [destinationUID]);

            //delete all embeds from youtube_embed table
            await connection.query("DELETE FROM youtube_embed WHERE destinationUID = ?", [destinationUID]);

            //delete all cover photo from detinations_cover_photo table
            await connection.query("DELETE FROM detinations_cover_photo WHERE destinationUID = ?", [destinationUID]);

            //delete geography photo from dgeography table
            await connection.query("DELETE FROM geography WHERE destinationUID = ?", [destinationUID]);

            //get all the photos related to this destination
            const photos = (await connection.query("SELECT pictureUID FROM destinationimages WHERE destinationUID = ?", [destinationUID]) as RowDataPacket[])[0];
            
            const imagesDeletionResult = await axios.post(`${process.env.RESOURCE_PUBLIC_URL}/uploader/delete-images`, {data: {images: photos.map((p:any) => p.pictureUID)}})

            // Commit the transaction
            await connection.commit();
            res.status(200).json({ status: "success" });

        } catch (err) {
            // If an error occurs, rollback the transaction
            await connection.rollback();
            res.status(500).json({ status: "error", error: err });
        } finally {
            // Always release the connection
            connection.release();
        }

    } catch (err) {
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
}