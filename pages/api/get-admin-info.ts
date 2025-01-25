import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from 'mysql2';
import { compareSync } from "bcrypt-ts";
import { getServerSession } from "next-auth"
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const promisePool = pool.promise();
  const session = await getServerSession(req, res, options) 

  res.status(200).json({admin: session?.user});
}