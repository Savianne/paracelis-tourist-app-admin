"use client"
import styled from "styled-components"
import React from "react"
import { YouTubeEmbed } from 'react-social-media-embed';
import { IStyledFC } from "../types/IStyledFC"
import Button from "./Button";

interface IYoutubeEmbed {
    id: string;
    url: string;
}

interface IYutubeVideoEmbed extends IStyledFC {
    urls: IYoutubeEmbed[];
    onDelete: (id:string) => void;
}

const YutubeVideosEmbedFC: React.FC<IYutubeVideoEmbed> = ({className, urls, onDelete}) => {

    return(
        <div className={className}> 
            {
                urls.map((url, i) => {
                    return(
                        <YoutubeVideoEmbed key={i} url={url.url} onDelete={() => onDelete(url.id)}/>
                    )
                })
            }
        </div>
    )
}

interface IYoutubeVideoEmbedFC extends IStyledFC {
    url: string,
    onDelete: () => void;
}

const YoutubeVideoEmbedFC:React.FC<IYoutubeVideoEmbedFC> = ({className, url, onDelete}) => {
    const YOUTUBE_DEFAULT_HEIGHT = 390;
    const [embedHeight, setEmbedHeight] = React.useState(YOUTUBE_DEFAULT_HEIGHT);
    return(
        <div className={className}>
            <YouTubeEmbed
            url={url}
            height={embedHeight}
            youTubeProps={{
                onReady: async (r) =>
                (await r.target.getIframe()).addEventListener('load', () => setEmbedHeight((height) => height + 1)),
            }}
            />
            <Button onClick={onDelete}>Delete Embed</Button>
        </div>
    )
}


const YoutubeVideoEmbed = styled(YoutubeVideoEmbedFC)`
    display: flex;
    height: fit-content;
    flex-wrap: wrap;
    justify-content: center;

    && > ${Button} {
        margin-top: 10px;
        flex: 0 1 100%;
        background-color: tomato;
    }
`;

const YoutubeVideosEmbed = styled(YutubeVideosEmbedFC)`
    display: grid;
    flex: 0 1 90%;
    padding: 0 50px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    margin-top: 50px;
`

export default YoutubeVideosEmbed;