"use client"
import styled from "styled-components"
import { IStyledFC } from "../types/IStyledFC"
import React from "react"

const WelcomeAdminFC: React.FC<IStyledFC> = ({className}) => {

    return(
        <div className={className}>
            <img src="/images/hi.png" />
            <div>
                <h1>Welcome back Admin</h1>
                <p className="verse-text">
                "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving."
                </p>
                <p className="verse">-Colossians 3:23-24 (NIV)</p>
            </div>
        </div>
    )

}

const WelcomeAdmin = styled(WelcomeAdminFC)`
    display: flex;
    flex: 0 1 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: #0a0338b5;
    flex-wrap: wrap;

    && > img {
        width: 50%;
        max-width: 300px;
    }

    && > div {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        padding: 20px;
        align-items: center;
        justify-content: center;
        min-width: 400px;
    }

    && > div > h1 {
        color: white;
        font-size: 60px;
        text-align: center;
        padding: 0 20px;
    }

    && > div > .verse-text, && > div > .verse {
        margin-top: 20px;
        flex: 0 1 70%;
        color: #f4f4f4c2;
        font-style: italic;
    }
    
`

export default WelcomeAdmin;