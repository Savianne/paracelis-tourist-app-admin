import pool from '@/app/api/mysql/connectionPool';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from 'mysql2';
import { compareSync, hashSync } from "bcrypt-ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);
  const body = JSON.parse(req.body);

  const email = body.email;
  const oldPass = body.oldPass;
  const newPass = body.newPass;
  const confirm = body.confirm;

  const promisePool = pool.promise();

  try {
    const row = await promisePool.query('SELECT * FROM admin WHERE email = ?', [email]) as RowDataPacket[];
    
    const match = compareSync(oldPass, row[0][0].password);

    if(!match) throw "The old password you entered is incorrect.";

    if(!(newPass === confirm)) throw "Password Not Match";

    const createNewPass = hashSync(newPass, 15);

    await promisePool.query("UPDATE admin SET password = ? WHERE email = ?", [createNewPass, email])

    res.status(200).json({ status: "success"})
  } catch (err) {
    console.log(err)
    res.status(200).json({ status: "error", error: err})
  }
}