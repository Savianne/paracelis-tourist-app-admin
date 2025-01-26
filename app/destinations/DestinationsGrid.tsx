"use client"
import React, { ReactNode } from "react"
import axios from "axios"
import { RESOURCES_SERVER_URL } from '@/app/resources-server-url';
import styled from "styled-components"
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import NoRecordFound from "../components/NoRecordFound";
import Button from "../components/Button";

type TDestinationCardData = {
    title: string,
    story: string,
    coverPhoto: string,
    totalHearts: number,
    totalLikes: number,
    totalComments: number,
    destinationUID: string

}

const DestinationCardFC: React.FC<{className?: string, destinationData: TDestinationCardData}> = ({className, destinationData}) => {
    const router = useRouter();
    return(
        <div className={className} onClick={() => {
            router.push(`/destinations/${destinationData.destinationUID}`)
        }}>
            <div className="cover-photo"></div>
            <h1>{destinationData.title}</h1>
            <div className="reactions">
                <ReactionCount color="#ff0291" count={destinationData.totalHearts} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg>} />
                <ReactionCount color="#2db0ff" count={destinationData.totalLikes} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M104 224H24c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V248c0-13.3-10.7-24-24-24zM64 472c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zM384 81.5c0 42.4-26 66.2-33.3 94.5h101.7c33.4 0 59.4 27.7 59.6 58.1 .1 17.9-7.5 37.2-19.4 49.2l-.1 .1c9.8 23.3 8.2 56-9.3 79.5 8.7 25.9-.1 57.7-16.4 74.8 4.3 17.6 2.2 32.6-6.1 44.6C440.2 511.6 389.6 512 346.8 512l-2.8 0c-48.3 0-87.8-17.6-119.6-31.7-16-7.1-36.8-15.9-52.7-16.2-6.5-.1-11.8-5.5-11.8-12v-213.8c0-3.2 1.3-6.3 3.6-8.5 39.6-39.1 56.6-80.6 89.1-113.1 14.8-14.8 20.2-37.2 25.4-58.9C282.5 39.3 291.8 0 312 0c24 0 72 8 72 81.5z"/></svg>} />
                <ReactionCount color="#ffbe73" count={destinationData.totalComments} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>} />
            </div>
        </div>
    )
}

const DestinationCard = styled(DestinationCardFC)`
    position: relative;
    display: flex;
    flex: 0 1 350px;
    height: 400px;
    padding: 20px;
    border-radius: 10px;
    background-color: #82a0ce;
    overflow: hidden;
    align-content: flex-end;
    flex-wrap: wrap;
    
    && > .cover-photo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-image: url('${RESOURCES_SERVER_URL}/images/gallery/${(props) => props.destinationData.coverPhoto}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        /* mix-blend-mode: darken; */
    }

    && > .cover-photo:hover {
        transform: scale(1.2); 
        transition: all 1s;   
    }

    && > h1 {
        z-index: 1;
        font-size: 40px;
        color: white;
    }

    && > .reactions {
        display: flex;
        flex: 0 1 100%;
        margin-top: 20px;
        height: 45px;
        z-index: 1;
        gap: 10px;
    }
`

const ReactionCountFC: React.FC<{className?: string, count: number, icon: ReactNode, color: string}> = ({className, count, icon,color}) => {
    return(
        <div className={className}>
            { icon }
            <span className="count">{count}</span>
        </div>
    )
}

const ReactionCount = styled(ReactionCountFC)`
    display: flex;
    mix-blend-mode: normal;

    && > svg {
        width: 25px;
        height: 25px;
        fill: ${p => p.color};

    }

    & > span {
        color: white;
        font-size: 13px;
        margin-left: 5px;
    }
`;

const DestinationGridFC: React.FC<{className?: string}> = ({className}) => {
    const router = useRouter();
    const [totalList, setTotalList] = React.useState(0);
    const [loadedData, setLoadedData] = React.useState<TDestinationCardData[]>([]);
    const [isLoading, seIsLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get("/api/get-total-destinations")
        .then(res => {
            setTotalList(res.data.total);
        })
    }, [])
    
    React.useEffect(() => {
        axios.post("/api/get-destinations", {start: loadedData.length, end: 10})
        .then(res => {
            setLoadedData(res.data.data)
        })
        .finally(() => {
            seIsLoading(false)
        })
    }, [])
    return(
        <>
            {
                (!isLoading) && loadedData.length == 0? <NoRecordFound actionBtn={<Button onClick={() => router.replace("/add-destination")}>Add Place</Button>} /> : ""
            }
            <div className={className}>
                {
                    loadedData.map((destinationData, index) => {
                        return <DestinationCard key={destinationData.destinationUID} destinationData={destinationData} />
                    })
                }

                {
                    !(loadedData.length === totalList)?
                    <div className="load-more" onClick={() => {
                        seIsLoading(true)
                        axios.post("/api/get-destinations", {start: loadedData.length, end: 5})
                        .then(res => {
                            setLoadedData([...loadedData, ...res.data.data])
                        })
                        .finally(() => seIsLoading(false))
                    }}>
                        <div className="btn">Load more</div>
                    </div> : ""
                }

                {
                    isLoading? <Loading /> : ""
                }
            </div>
        </>
    )
}

const DestinationGrid = styled(DestinationGridFC)`
    display: grid;
    flex: 0 1 90%;
    padding: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    margin-top: 50px;

    && > .load-more {
        display: flex;
        /* background-color: #8bb1b3; */
        align-items: center;
        justify-content: center;

        > .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 1px solid gray;
            cursor: pointer;
        }

        > .btn:hover {
            background-color: #83b9ec;
            transition: background-color 300ms;
            color: white;
        }
    }
`;

export default DestinationGrid;