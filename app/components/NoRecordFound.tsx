import styled from "styled-components";
import React from "react"

import { IStyledFC } from "../types/IStyledFC";

interface INoRecordFound extends IStyledFC {
    text?: string,
    secondaryText?: string,
    actionBtn?: React.ReactNode
}

const NoRecordFoundFC: React.FC<INoRecordFound> = ({className, text, secondaryText, actionBtn}) => {
    return(
        <div className={className}>
            <img loading="lazy" src="/images/no-record.png" alt="no-record" />
            <div className="primary-text">{text? text : 'No Record Found!'}</div>
            {
                secondaryText? <p className="secondary-text">{secondaryText}</p> : ""
            }
            {
                actionBtn?  
                <div className="action-btn-area">
                    {actionBtn}
                </div> : ""
            }
           
        </div>
    )
}

const NoRecordFound = styled(NoRecordFoundFC)`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 5px;
    padding: 50px 0;
    /* background-color: #dddddd; */

    && img {
        opacity: 0.7;
        width: 50%;
        max-width: 290px;
    }

    && .primary-text, && .secondary-text {
        display: flex;
        flex: 0 1 100%;
        text-align: center;
        line-height: 1;
        justify-content: center;
        font-size: 40px;
        /* font-variant: all-small-caps; */
        font-weight: bolder;
        margin-top: 20px;
        color: #cccccc94;
    }

    && .secondary-text {
        font-size: 20px;
        margin-top: 5px;
        font-weight: normal;
    }

    .action-btn-area {
        display: flex;
        flex: 0 1 100%;
        margin-top: 20px;
        justify-content: center;
        height: fit-content;
    }
`;

export default NoRecordFound;