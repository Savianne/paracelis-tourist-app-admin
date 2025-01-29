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
    if (req.method !== "DELETE") return res.status(405).end(`Method ${req.method} Not Allowed`);
    const imageURL = req.body.imageURL;
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        
        try {
            // Start a transaction
            await connection.beginTransaction();
            const UID = generateUID();

            //Delete the record in the database
            await connection.query("DELETE FROM destinationimages WHERE pictureUID = ?", [imageURL]);


            const response = await axios.post(`${process.env.RESOURCE_PUBLIC_URL}/uploader/delete-image`, {data: imageURL});

            if(!response.data.success) throw Error("Failed to delete Image")
            
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
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
}
