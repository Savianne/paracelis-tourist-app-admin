"use client"
import React from "react"
import { Gallery } from "next-gallery"
import styled from "styled-components"
import axios from "axios"
import { RESOURCES_SERVER_URL } from "../resources-server-url"
import { IStyledFC } from "../types/IStyledFC"

interface IGallery extends IStyledFC {
    src: string[];
} 

const PlaceGalleryFC:React.FC<IGallery> = ({className, src}) => {
    const [selectedFiles, setSelectedFiles] = React.useState<({img: HTMLImageElement, uid: string})[] | null>(null);
    const [onFullScreenImage, setOnFullScreenImage] = React.useState<{img: HTMLImageElement, uid: string} | null>(null);
    const [showFullScreen, setShowFullScreen] = React.useState(false);

    React.useEffect(() => {
        const loadedImages: ({img: HTMLImageElement, uid: string})[] = [];

        src.forEach(item => {
            const img = new Image();
            img.src = `${RESOURCES_SERVER_URL}/images/gallery/${item}`
            img.onload = () => {
                loadedImages.push({img, uid: item});

                // When all images are loaded, update state
                if (loadedImages.length === src.length) {
                    setSelectedFiles([...loadedImages]);
                }
            }
        })
    }, [src]);

    return(
        <div className={className}>
            {
                selectedFiles? 
                <Gallery 
                widths={[500, 1000, 1600]}
                ratios={[2.2, 4, 6, 8]}
                lastRowBehavior="fill"
                threshold={0}
                images={selectedFiles.map(img => ({
                src: img.img.src,
                aspect_ratio:  img.img.naturalWidth / img.img.naturalHeight
                }))}
                overlay={(i) => {
                    return(<Overlay src={selectedFiles[i].img.src} onClick={() => {
                        setOnFullScreenImage(selectedFiles[i]);
                        setShowFullScreen(true)
                    }} />)
                }}
                /> : ""
            }
            {
                showFullScreen && onFullScreenImage? 
                <FullScreenView src={onFullScreenImage.img.src} 
                onExitFullScreen={() => setShowFullScreen(false)} 
                onDelete={() =>{
                    try{
                        axios.delete("/api/delete-photo", {data: {imageURL: onFullScreenImage.uid}})
                    } catch(err) {
                        console.log(err)
                    }
                }}/> : ""
            }
        </div>
    )
}

interface IFullScreenView extends IStyledFC {
    src: string;
    onExitFullScreen: () => void;
    onDelete: () => void;
}

const FullScreenViewFC: React.FC<IFullScreenView> = ({className, src, onExitFullScreen, onDelete}) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

    return(
        <div className={className} ref={elementRef}>
            <div className="action-toogle-container">
                <div className="action-btn" onClick={() => setShowConfirmDelete(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    <p>Delete Photo</p>
                </div>
                <div className="action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                    <p>Use as Display Picture</p>
                </div>
                <div className="action-btn" onClick={() => {
                    onExitFullScreen()
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    <p>Exit</p>
                </div>
            </div>
            <div className="img-container">
                <img src={src} />
            </div>
            {
                showConfirmDelete?
                <div className="confirm-overlay">
                    <div className="confirm-delete">
                        <h1>Are you sure you want to delete thid photo?</h1>
                        <div className="actions">
                            <span className="confirm" onClick={onDelete}>Confirm</span>
                            <span className="cancel" onClick={() => setShowConfirmDelete(false)}>Cancel</span>
                        </div>
                    </div>
                </div> : ""
            }
            
        </div>
    )
}
 
const FullScreenView = styled(FullScreenViewFC)`
    position: fixed;
    z-index: 5000;
    display: flex;
    width: 100%;
    height: 100vh;
    position: fixed;
    flex-wrap: wrap;
    top: 0;
    left: 0;
    background-color: #121212ef;
    backdrop-filter: blur(5px);
    align-items: center;
    justify-content: center;

    && .img-container {
        position: absolute;
        bottom: 0;
        display: flex;
        flex: 0 1 100%;
        height: 85%;
    }

    && > .action-toogle-container {
        display: flex;
        position: absolute;
        top: 0;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 15%;
    
        /* background-color: #06064849; */

        > .action-btn {
            display: flex;
            align-items: center;
            padding: 15px;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            font-size: 12px;
            
            > svg {
                width: 15px;
                margin-right: 10px;
                fill: white;
            }
        }

        > .action-btn:hover {
            background-color: #385e7643;
        }

    }

    && > .confirm-overlay {
        display: flex;
        width: 100%;
        height: 100vh;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
       
        > .confirm-delete {
            display: flex;
            flex-wrap: wrap;
            padding: 20px;
            flex-direction: column;
            background-color: white;
            border-radius: 5px;

            > h1 {
                font-size: 14px;
            }

            > .actions {
                display: flex;
                margin-top: 25px;
                gap: 10px;
                justify-content: flex-end;

                > span {
                    padding: 8px;
                    border-radius: 5px;
                    cursor: pointer;
                    color: white;
                    font-size: 13px;
                }

                > .confirm {
                    background-color: #00b3ff;
                }

                > .cancel {
                    background-color: #ffa71a;
                }
            }
        }
    }
`;

interface IOverlay extends IStyledFC {
    src: string;
    onClick: () => void
}

const OverlayFC: React.FC<IOverlay> = ({className, src, onClick}) => {
    return(
        <div className={className} onClick={onClick}>
            <img src={src} />        
        </div>
    )
}

const Overlay = styled(OverlayFC)`
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 2000;

    && > img {
        width: 100%;
        height: 100%;
    }

    && > img:hover {
        transform: scale(1.2); 
        transition: all 1s;  
    }
`

const PlaceGallery = styled(PlaceGalleryFC)`
    display: inline-block;
    width: 100%;
    z-index: 0;
`;

export default PlaceGallery;