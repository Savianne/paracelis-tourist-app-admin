import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IStyledFC } from "../types/IStyledFC";

const rotate = keyframes`
    from {
    transform: rotate(0deg);
    }

    to {
    transform: rotate(359deg);
    }
`;

interface ISpinnerLoadingIndicator extends IStyledFC {
    msSpeed: number
}

const FCSpinnerLoadingIndicator: React.FC<ISpinnerLoadingIndicator> = ({className, msSpeed}) => {
    return (
        <span className={className}>
            <FontAwesomeIcon icon={["fas", "spinner"]} />
        </span>
    )
}


const SpinnerLoadingIndicator = styled(FCSpinnerLoadingIndicator)`
    display: inline-block;
    width: fit-content;
    height: fit-content;
    animation: ${rotate} ${(props) => props.msSpeed+'ms'} linear infinite;
`;

export default SpinnerLoadingIndicator;