"use client"
import styled from "styled-components";
import React from "react";

const LoadingFC: React.FC<{className?: string}> = ({className}) => {
    return(
        <div className={className}>
            <div className="loader"></div>
        </div>
    )
}

const Loading = styled(LoadingFC)`
    && {
        display: flex;
        position: fixed;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: #0f0e15b3;
        z-index: 100;
    }

    && > .loader {
        --d:22px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        color: #25b09b;
        box-shadow: 
            calc(1*var(--d))      calc(0*var(--d))     0 0,
            calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
            calc(0*var(--d))      calc(1*var(--d))     0 2px,
            calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
            calc(-1*var(--d))     calc(0*var(--d))     0 4px,
            calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
            calc(0*var(--d))      calc(-1*var(--d))    0 6px;
        animation: l27 1s infinite steps(8);
    }

    @keyframes l27 {
        100% {transform: rotate(1turn)}
    }

`

export default Loading;