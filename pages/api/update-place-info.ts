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

    const data = req.body.data;

    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        
        try {
            // Start a transaction
            await connection.beginTransaction();
           
            //Update 
            await connection.query("UPDATE destinations SET title = ?, description = ? WHERE destinationUID = ?", [data.title, data.story, data.destinationUID]);

            //Check if there is an update for geolocation
            if(data.geolocation) {
                await connection.query("UPDATE geography SET lat = ?, lang = ? WHERE destinationUID = ?", [data.geolocation.lat, data.geolocation.lang, data.destinationUID]);
            }

            // Commit the transaction
            await connection.commit();
            res.status(200).json({ status: "success" });

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
