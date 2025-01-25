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

    const { nameOfPlace, story, location, images } = JSON.parse(req.body);

    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        
        try {
            // Start a transaction
            await connection.beginTransaction();
            const UID = generateUID();

            // Insert into destinations table
            await promisePool.query('INSERT INTO destinations(title, description, destinationUID) VALUES(?, ?, ?)', [nameOfPlace, story, UID]);

            // Insert into geography table
            await promisePool.query('INSERT INTO geography(lat, lang, destinationUID) VALUES(?, ?, ?)', [location.lat, location.lng, UID]);

            // Move images to the gallery
            const moveImageStatus = await axios.post(`${RESOURCES_SERVER_URL}/uploader/move-to-gallery`, { images });
            if (!moveImageStatus.data.success) {
                throw new Error("Failed to move images!");
            }

            // Insert image references into destinationimages table
            for (let n = 0; n < images.length; n++) {
                await promisePool.query('INSERT INTO destinationimages(pictureUID, destinationUID) VALUES(?, ?)', [images[n], UID]);
            }

            //SetCover Photo
            await promisePool.query("INSERT INTO detinations_cover_photo(cover_photo, destinationUID) VALUES(?, ?)", [images[0], UID])

            // Commit the transaction
            await connection.commit();
            res.status(200).json({ status: "success", UID });

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
