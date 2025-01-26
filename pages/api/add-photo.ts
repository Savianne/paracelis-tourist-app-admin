import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket, OkPacketParams } from 'mysql2';
import axios from 'axios';
import { RESOURCES_SERVER_URL } from "../../app/resources-server-url";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end(`Method ${req.method} Not Allowed`);

    const { images, UID } = req.body.data;

    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        
        try {
            // Start a transaction
            await connection.beginTransaction();
           
            // Move images to the gallery
            const moveImageStatus = await axios.post(`${RESOURCES_SERVER_URL}/uploader/move-to-gallery`, { images });
            if (!moveImageStatus.data.success) {
                throw new Error("Failed to move images!");
            }

            // Insert image references into destinationimages table
            for (let n = 0; n < images.length; n++) {
                await connection.query('INSERT INTO destinationimages(pictureUID, destinationUID) VALUES(?, ?)', [images[n], UID]);
            }

            // Commit the transaction
            await connection.commit();
            res.status(200).json({ status: "success", UID });

        } catch (err) {
            console.log(err)
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
