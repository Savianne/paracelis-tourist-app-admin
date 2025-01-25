import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../mysql/connectionPool";
import { RowDataPacket } from "mysql2";
import { compareSync } from "bcrypt-ts";


export const options: NextAuthOptions= {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "Enter your Username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Enter your Password"
                }
            },
            async authorize(credentials) {
                const promisePool = pool.promise();

                const row = await promisePool.query('SELECT * FROM admin WHERE email = ? OR username = ?', [credentials?.username, credentials?.username]) as RowDataPacket[];

                if(!row[0].length) return null;

                const match = compareSync(credentials?.password as string, row[0][0].password);

                return match? {id: new Date().getMilliseconds().toString(), name: row[0][0].username, email: row[0][0].email} : null
            }
        })
    ],
}

