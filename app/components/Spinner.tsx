"use client"
import styled from "styled-components";

const Spinner = styled.div`
    width: 30px;
    height: 30px;
    border: 5px solid #f3f3f3;
    border-top: 3px solid #acc1ce;
    border-bottom: 3px solid #acc1ce;
    border-right: 3px solid #acc1ce;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;

    /* Spinner rotation animation */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

`

export default Spinner;