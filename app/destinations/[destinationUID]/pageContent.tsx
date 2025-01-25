"use client"
import React from "react"
import styled from "styled-components"
import { IStyledFC } from "@/app/types/IStyledFC"
import Loading from "@/app/components/Loading"
import { RESOURCES_SERVER_URL } from "@/app/resources-server-url"
import Location from "@/app/components/Location"
import PlaceGallery from "@/app/components/PlaceGallery"


type TDestinationData = {
    title: string,
    description: string,
    uid: string,
    totalLikes: string,
    totalHearts: string,
    totalComments: string,
    coverPhoto: string,
    location: {
        lat: string,
        lang: string
    }
}



interface IPageContent extends IStyledFC {
    uid: string
}

const PageContentFC: React.FC<IPageContent> = ({className, uid}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState<null | TDestinationData>(null);
    const [gallery, setGallery] = React.useState<string[]>([]);

    React.useEffect(() => {
        fetch("/api/get-place-data", {
            method: "POST",
            body: JSON.stringify({ uid })
        })
        .then(res => res.json())
        .then(data => setData(data.data))
        .finally(() => {
            setIsLoading(false)
        })
    }, []);

    React.useEffect(() => {
        fetch("/api/get-place-images", {
            method: "POST",
            body: JSON.stringify({ placeUID:  uid})
        })
        .then(res => res.json())
        .then(data => setGallery(data.result.map((i:any) => i.src)))
        .finally(() => {
            setIsLoading(false)
        })
    }, [data])

    return(
        <div className={className}>
            {
                data? <>
                    <Banner dp={data.coverPhoto}>
                        <div className="dp-container">
                            <div className="dp"></div>
                        </div>
                        <div className="info-area">
                            <h1>{data.title}</h1>
                            <p>{data.description}</p>
                            {/* <p>The quick brown fox jump over the head of the lazy dog The quick brown fox jump over the head of the lazy dog The quick brown fox jump over the head of the lazy dog The quick brown fox jump over the head of the lazy dog The quick brown fox jump over the head of the lazy dog The quick brown fox jump over the head of the lazy dog</p> */}
                            <div className="reactions">
                                <div className="reaction">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                                    <h1>{data.totalHearts}</h1>
                                </div>
                                <div className="reaction like">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/></svg>
                                    <h1>{data.totalLikes}</h1>
                                </div>
                                <div className="reaction comment">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
                                    <h1>{data.totalComments}</h1>
                                </div>
                                <div className="reaction play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"/></svg>
                                    {/* <h1>{data.totalComments}</h1> */}
                                </div>
                            </div>
                        </div>
                    </Banner>
                    <div className="map-container">
                        <Location initialCoords={{lat: +data.location.lat, lng: +data.location.lang }}/>
                    </div>
                    <h1>Gallery</h1>
                    <div className="gallery-container">
                        <PlaceGallery src={gallery}/>
                    </div>
                </> : ""
            }
            {
                isLoading? <Loading /> : ''
            }
        </div>
    )
}

const Banner = styled.div<{dp: string}>`
    display: flex;
    flex: 0 1 100%;
    padding: 50px;
    align-items: center;
    /* background-color: #e1e1e1; */

    && > .dp-container {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 250px;
        height: 250px;
        border-radius: 10px;
        overflow: hidden;
        background-color: #82a0ce;
    }

    && > .dp-container > .dp {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-image: url('${RESOURCES_SERVER_URL}/images/gallery/${(p) => p.dp}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        font-size: 30px;
        color: white;
        /* mix-blend-mode: darken; */
    }

    && > .dp-container > .dp:hover {
        transform: scale(1.2); 
        transition: all 1s;   
    }

    && > .info-area {
        display: flex;
        flex: 0 1 100%;
        margin-left: 30px;
        flex-wrap: wrap;
        
        > h1 {
            flex: 0 1 100%;
            padding: 20px 0;
            font-size: 50px;
        }

        > .reactions {
            display: flex;
            flex: 0 1 100%;
            margin-top: 30px;
            gap: 10px;

            > .reaction {
                display: flex;
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #c7c7c7;
                align-items: center;
                /* background-color: #f62072; */

                > svg {
                    width: 30px;
                    fill: #f62072;
                }

                > h1 {
                    font-size: 20px;
                    padding: 0 0 0 10px;
                }
            }

            > .like > svg {
                fill: #23a6e3;
            }

            > .comment > svg {
                fill: #e39123;
            }

            > .play {
                background-color: #8323e3;
                border-color: transparent;
            }

            > .play > svg {
                fill: #ffffff;
            }
        }
    }
`

const PageContent = styled(PageContentFC)`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;

    && > h1 {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        margin-bottom: 30px;
    }

    && > .map-container, && > .gallery-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        flex: 0 1 100%;
        padding: 0 50px;
        margin-bottom: 50px;
    }

    && > .gallery-container {
        display: inline-block;
        width: 100%;
    }
`

export default PageContent;