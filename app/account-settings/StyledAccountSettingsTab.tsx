"use client"
import styled from "styled-components";

const StyledAccountSettings = styled.div`
    display: flex;
    flex: 0 1 100%;
    padding: 20px;
    justify-content: center;
    align-content: flex-start;
    flex-wrap: wrap;

    && > h1 {
        flex: 0 1 100%;
        text-align: center;
    }

    && > .admin-info {
        display: flex;
        flex: 0 1 800px;
        background-color: #daecfdad;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        padding: 30px 20px;
        border-radius: 10px;
        flex-direction: column;
        
        > .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 150px;
            height: 150px;
            margin-bottom: 10px;
            border-radius: 50%;
            background-image: url('/user-icon.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            font-size: 30px;
            color: white;
        }

        > h3 {
            font-size: 15px;
            font-weight: 100;
        }
    }

    && > form {
        display: flex;
        flex: 0 1 800px;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        padding: 20px;
        
        > .alert-message, > .error-message, > .success-message {
            display: flex;
            flex: 0 1 100%;
            padding: 20px;
            background-color: #6d7e8c;
            color: white;
        }

        > .error-message {
            background-color: red;
            text-align: center;
        }

        > .success-message {
            background-color: #09ff09;
        }

        > input {
            flex: 0 1 80%;
            height: 50px;
            border-radius: 5px; 
            outline: 0;
            border: 0;
            background-color: #eaeaea;
            font-size: 15px;
            padding: 10px 20px;
        }

        > input:disabled {
            opacity: 0.5;
        }

        > .submit-btn {
            display: flex;
            flex: 0 1 80%;
            height: 50px;
            padding: 0 15px;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 13px;
            border-radius: 5px;
            background-color: rgb(0, 89, 255);
            cursor: pointer; 
        }

        > .disabled-btn {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
    }
`;

export default StyledAccountSettings;