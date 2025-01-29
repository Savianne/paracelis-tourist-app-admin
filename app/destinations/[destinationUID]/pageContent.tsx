"use client"
import React from "react"
import styled from "styled-components"
import { IStyledFC } from "@/app/types/IStyledFC"
import Loading from "@/app/components/Loading"
import { RESOURCES_SERVER_URL } from "@/app/resources-server-url"
import Location from "@/app/components/Location"
import PlaceGallery from "@/app/components/PlaceGallery"
import ImagePicker from "@/app/components/ImagePicker"
import AddressPicker from "@/app/components/LocationPicker"
import Button from "@/app/components/Button"
import axios from "axios"
import { useRouter } from "next/navigation";
import { YouTubeEmbed } from 'react-social-media-embed';
import YoutubeVideosEmbed from "@/app/components/YoutubeVideoEmbed"
import Error404 from "@/app/components/Error404"

type TDestinationData = {
    title: string,
    description: string,
    uid: string,
    totalLikes: string,
    totalHearts: string,
    totalComments: string,
    coverPhoto: string,
    location: {
        lat: number
        lang: number
    }
}

interface IPageContent extends IStyledFC {
    uid: string
}

const PageContentFC: React.FC<IPageContent> = ({className, uid}) => {
    const router = useRouter();
    const bannerRef =  React.useRef<null | HTMLDivElement>(null)
    const [isLoading, setIsLoading] = React.useState(true);
    const [isLoadingImages, setIsLoadingImages] = React.useState(true);
    const [dp, setDp] = React.useState("");
    const [data, setData] = React.useState<null | TDestinationData>(null);
    const [gallery, setGallery] = React.useState<string[]>([]);
    const [addImagModal, setAddImageModal] = React.useState(false);
    const [addURLModal, setAddURLModal] = React.useState(false);
    const [editPlaceInfoModal, setEditPlaceInfoModal] = React.useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(false);
    const [images, setImages] = React.useState<string[]>([]);
    const [errorUpload, setErrorUpload] = React.useState(false);
    const [YTURLs, setYTURLs] = React.useState<({id: string, url: string})[]>([]);
    const [addUrlValue, setAddUrlValue] = React.useState("");
    const [urlReady, setUrlReady] = React.useState(false);
    const [errorAddURL, setErrorAddURL] = React.useState(false);
    const [updateInfoError, setUpdateInfoError] = React.useState(false);
    const [editFormData, setEditFormData] = React.useState<null | {title: string, story: string, geolocation: {lat: number; lang: number} | null}>(null)


    React.useEffect(() => {
        fetch("/api/get-place-data", {
            method: "POST",
            body: JSON.stringify({ uid })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status) {
                setData(data.data)
            } else throw Error("No data found in the database")
        })
        .finally(() => {
            setIsLoading(false)
        });
    }, []);

    React.useEffect(() => {
        (async  ()=> {
            try {
                const data =  await axios.post('/api/get-embed-urls', {data : {destinationUID: uid}})
                
                if(!data.data.success) throw Error("Failed to fetch");

                setYTURLs(data.data.result)
            } catch (err) {
                console.log(err)
            }
        })()
    }, []);

    React.useEffect(() => {
        if(data) {
            fetch("/api/get-place-images", {
                method: "POST",
                body: JSON.stringify({ placeUID:  uid})
            })
            .then(res => res.json())
            .then(data => setGallery(data.result.map((i:any) => i.src)))
            .finally(() => {
                setIsLoadingImages(false)
            })
    
            setDp(data?.coverPhoto as string);
            setEditFormData({title: data.title, story: data.description, geolocation: null});
        }
    }, [data]);

    React.useEffect(() => {
        const element = bannerRef.current;
        let position = 0;

        function animateBackground() {
            position += 1; // Adjust the step size for speed
            if(element) {
                const randomX = Math.floor(Math.random() * 100); // Random percentage for X-axis (0% to 100%)
                const randomY = Math.floor(Math.random() * 100); // Random percentage for Y-axis (0% to 100%)
                
                element.style.backgroundPosition = `${randomX}% ${randomY}%`;

                // Call the function again after a short delay
                setTimeout(animateBackground, 10000); // Adjust 500ms for speed

            }
        }

        animateBackground();
    })

    return(
        <div className={className}>
            {
                data? <>
                    <Banner dp={dp} ref={bannerRef}>
                        <div className="cover"></div>
                        <div className="actions-btn-group">
                            <span className="action-btn delete" 
                            onClick={() => setConfirmDeleteModal(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </span>
                            <span className="action-btn edit" onClick={() => editFormData? setEditPlaceInfoModal(true) : alert("Loading data..")}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
                            </span>
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
                                <div className="reaction add-images" onClick={() => {
                                    setAddImageModal(true);
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M160 80l352 0c8.8 0 16 7.2 16 16l0 224c0 8.8-7.2 16-16 16l-21.2 0L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336 160 336c-8.8 0-16-7.2-16-16l0-224c0-8.8 7.2-16 16-16zM96 96l0 224c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L160 32c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120L0 344c0 75.1 60.9 136 136 136l320 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-320 0c-48.6 0-88-39.4-88-88l0-224zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
                                    <h1>Add images</h1>
                                </div>
                                <div className="reaction play" onClick={() => {
                                    setAddURLModal(true);
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"/></svg>
                                    <h1>Embed Video</h1>
                                </div>
                            </div>
                        </div>
                    </Banner>
                    <div className="map-container">
                        <Location initialCoords={{lat: +data.location.lat, lng: +data.location.lang }} />
                    </div>
                    <h1>Gallery</h1>
                    <div className="gallery-container">
                        {
                            isLoadingImages? <div className="gallery-onloading">
                                <div className="loader"></div>
                                <h5>Loading gallery...</h5>
                            </div> : ""
                        }
                        {
                            !isLoadingImages && gallery.length?  
                            <PlaceGallery placeUID={uid} onDeletedPhoto={async () => {
                                setIsLoading(true)
                                try {
                                    const res =  await fetch("/api/get-place-images", {
                                        method: "POST",
                                        body: JSON.stringify({ placeUID:  uid})
                                    })
                                    
                                    const success = await res.json();

                                    if(success.result) {
                                        setGallery(success.result.map((i:any) => i.src));
                                    }

                                } catch(err) {
                                    console.log(err)
                                }
                                finally {
                                    setIsLoading(false);
                                }
                            }} 
                            onChangedDp={(i) => {
                                setDp(i)
                            }}
                            src={gallery}/> : <strong className="no-image">No image found in the database!</strong>
                        }
                       
                    </div>
                    {
                        editPlaceInfoModal && editFormData? 
                        <div className="edit-place-info-modal">
                            <span className="close-btn" onClick={() => {
                                setEditFormData({
                                    title: data.title,
                                    story: data.description,
                                    geolocation: null,
                                })
                                setEditPlaceInfoModal(false);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </span>
                            <div className="modal">
                                {
                                    updateInfoError? <strong style={{color: "red"}}>Error</strong> : ''
                                }
                                
                                <h6>Name of Place</h6>
                                <input value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.currentTarget.value})}/>
                                <h6>story</h6>
                                <textarea value={editFormData.story} onChange={(e) => setEditFormData({...editFormData, story: e.currentTarget.value})} />
                                <AddressPicker initialCoords={{ lat: +data.location.lat, lng: +data.location.lang }} onLocationSelect={(g) => setEditFormData({...editFormData, geolocation: {lat: g.lat, lang: g.lng}})} />
                                <div className="btn-container">
                                    <Button disabled={(() => {
                                        if(editFormData.title === "" || editFormData.story === "") return true;
                                        if(editFormData.geolocation !== null) return false;
                                        if(editFormData.title === data.title && editFormData.story === data.description) return true;
                                        return false;
                                    })()}
                                    onClick={async () => {
                                        setIsLoading(true)
                                        try {
                                            const res = await axios.post("/api/update-place-info", { data: {...editFormData, destinationUID: uid}});

                                            if(res.data.status == "success") {
                                                setUpdateInfoError(false);
                                                setData({...data, title: editFormData.title, description: editFormData.story, location: editFormData.geolocation? {lang: +editFormData.geolocation.lang, lat: +editFormData.geolocation.lat} : {lang: +data.location.lang, lat: +data.location.lat}})
                                            }
                                        }
                                        catch(err) {
                                            setUpdateInfoError(true);
                                        }
                                        finally {
                                            setIsLoading(false);
                                        }
                                    }}>Update</Button>
                                </div> 
                            </div>
                        </div> : ""
                    }
                    {
                    addImagModal? 
                    <div className="add-image-modal">
                        <span className="close-btn" onClick={() => setAddImageModal(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                        </span>
                        <div className="modal">
                            {
                                errorUpload? <div className="error">
                                    Failed to add Photos! please try again
                                </div> : ""
                            }
                            
                            <ImagePicker onChange={f => setImages(f)} placeholder="Add cover photo" fullWidth multiple={true} />
                            <div className="btn-container">
                                <Button 
                                disabled={!images.length}
                                onClick={async () => {
                                    setIsLoading(true)
                                    try {
                                        await axios.post('/api/add-photo', {data: {images: images, UID: uid}});

                                        const res =  await fetch("/api/get-place-images", {
                                            method: "POST",
                                            body: JSON.stringify({ placeUID:  uid})
                                        })
                                        
                                        const success = await res.json();

                                        if(success.result) {
                                            setGallery(success.result.map((i:any) => i.src));
                                        }

                                        setErrorUpload(false)
                                    } catch(err) {
                                        setErrorUpload(true);
                                    }
                                    finally {
                                        setIsLoading(false);
                                        setAddImageModal(false)
                                    }
                                }}>Upload</Button>
                            </div>
                        </div>
                    </div> : ""
                }
                {
                    addURLModal? <div className="add-video-modal">
                        <span className="close-btn" onClick={() => setAddURLModal(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                        </span>
                        <div className="modal">
                            {
                                errorAddURL? <div className="error">
                                    Failed to add URl! please try again
                                </div> : ""
                            }
                            <input type="text" value={addUrlValue} onChange={(e) => {
                                setUrlReady(false)
                                setAddUrlValue(e.currentTarget.value);
                            }} placeholder="Please paste the YouTube video URL here."/>
                            {
                                addUrlValue? 
                                <YouTubeEmbed url={addUrlValue} youTubeProps={{
                                    onReady: async (r) =>
                                        (await r.target.getIframe()).addEventListener('load', () => setUrlReady(true)),
                                }}/> : ''
                            }
                            <div className="btn-container">
                                <Button disabled={!urlReady}
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        const res = await axios.post('/api/add-embed-url', {data: {url: addUrlValue, destinationUID: uid}});
                                        setYTURLs([...YTURLs, {id: res.data.id, url: addUrlValue}])
                                        setErrorAddURL(false);
                                        setAddUrlValue("");
                                        setAddURLModal(false);
                                    } catch(e) {
                                        setErrorAddURL(true)
                                    } finally {
                                        setIsLoading(false)
                                    }
                                }}
                                >Embed Video</Button>
                            </div>
                        </div>
                    </div> : ''
                }
                {
                    confirmDeleteModal? 
                    <div className="confirm-delete-modal">
                        <div className="modal">
                            <div className="top">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
                                </div>
                                <div className="text-content">
                                    <h3>Are you sure you want to delete this destination?</h3>
                                    <h5>All related data, including images, reactions, comments will be permanently removed.</h5>
                                </div>
                            </div>
                            <div className="btn-group">
                                <span className="delete" 
                                onClick={() => {
                                    setIsLoading(true)
                                }}>
                                    <Button
                                    onClick={async () => {
                                        setIsLoading(true);
                                        try {
                                            await axios.post('/api/delete-place', {data: {destinationUID: uid}})
                                            router.replace('/destinations')
                                        } catch(err) {
                                            console.log(err);
                                        }
                                        finally {
                                            setIsLoading(false)
                                        }
                                    }}>Continue</Button>
                                </span>
                                <span className="cancel">
                                    <Button onClick={() => setConfirmDeleteModal(false)}>Cancel</Button>
                                </span>
                            </div>
                        </div>
                    </div> : ''
                }
                <h1>Videos</h1>
                {
                    YTURLs.length? 
                    <YoutubeVideosEmbed onDelete={(id) => {
                        setIsLoading(true);
                            axios.post('/api/delete-embed', {data: {id}})
                            .then(res => {
                                if(res.data.success) {
                                    setYTURLs(YTURLs.filter(url => url.id !== id))
                                }
                            })
                            .catch(err => {
                                alert(err)
                            })
                            .finally(() => {
                                setIsLoading(false);
                            })
                    }} urls={YTURLs} /> : <strong className="no-videos">No URL's found in the database!</strong>
                }
                </> : ""
            }
            {
                isLoading? <Loading /> : ''
            }
            {
                (!isLoading) && data == null? <Error404 /> : ''
            }
        </div>
    )
}

const Banner = styled.div<{dp: string}>`
    position: relative;
    display: flex;
    flex: 0 1 100%;
    padding: 100px 50px;
    margin-bottom: 10px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-image: url('${RESOURCES_SERVER_URL}/images/gallery/${(p) => p.dp}');
    // background-attachment: fixed;
    background-position: 50% 50%;
    // background-position: center;
    background-repeat: no-repeat;
    // background-size: cover;
    background-size: 150%;
    color: white;
    background-color:rgb(0, 0, 0);
    transition: background-position 10s ease-in-out;

    && > .cover {
        display: flex;
        width: 100%;
        height: 100%;
        background-color: #101010ba;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
    }

    && > .actions-btn-group {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 5px;
        width: fit-content;
        height: fit-content;

        > .action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 5px;
            cursor: pointer;

            > svg {
                width: 15px;
                fill: white;
            }
        }

        > .edit {
                background-color: #1bfc1b;
        }

        > .delete {
            background-color: #f53729;
        }
    }
    
    && > .info-area {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        z-index: 10;
        
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
            flex-wrap: wrap;
            cursor: pointer;

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

            > .play > svg,
            > .add-images > svg {
                fill: #ffffff;
            }

            > .add-images, > .play {
                background-color: #de4618;
                border-color: transparent;

                > svg {
                    width: 30px;
                    fill: white;
                }

                > h1 {
                    font-size: 15px;
                    color: white;
                    padding: 0 0 0 10px;
                }
            }

            > .play {
                background-color: #8323e3;
                border-color: transparent;
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

        > .gallery-onloading {
            display: flex;
            flex: 0 1 100%;
            height: 100px;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            /* background-color: #727272; */

            > h5 {
                flex: 0 1 100%;
                text-align: center;
            }
            > .loader {
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
        }
    }

    && > .gallery-container > .no-image, && > .no-videos {
        display: inline-block;
        color: #c5c5c5;
        width: 100%;
        font-size: 30px;
        text-align: center;
        margin: 50px 10px;
    }

    && > .add-image-modal, && > .add-video-modal, && > .confirm-delete-modal, && > .edit-place-info-modal {
        position: fixed;
        display: flex;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background-color: #121212ef;
        backdrop-filter: blur(5px);
        z-index: 100; 
        align-items: center;
        justify-content: center;
        overflow-y: auto;

        > .close-btn {
            display: flex;
            position: absolute;
            top: 20px;
            right: 20px;
            width: 50px;;
            height: 50px;
            border-radius: 50%;
            align-items: center;
            justify-content: center;

            > svg {
                height: 30px;
                width: 30px;
                 fill: white;
            }
        }

        > .close-btn:hover {
            transition: background-color 300ms;
            background-color: #4b484871;
        }

        > .modal {
            display: flex;
            flex: 0 1 500px;
            flex-wrap: wrap;
            height: fit-content;
            padding: 20px;
            border-radius: 5px;
            justify-content: center;
            background-color: white;

            > .error {
                display: flex;
                border-radius: 5px;
                flex: 0 1 100%;
                padding: 20px;
                background-color: tomato;
                color: white;
                margin-bottom: 20px;
            }

            > .btn-container {
                flex: 0 1 100%;

                > ${Button} {
                    width: 100%;
                }
            }
        }
    }

    && > .confirm-delete-modal {
        background-color: #25222246;
        backdrop-filter: none;

        > .modal {
            box-shadow: 10px 10px 50px 27px rgba(0,0,0,0.19);

            > .top {
                display: flex;
                flex: 0 1 100%;
                align-items: center;

                > .icon {
                    display: flex;
                    width: fit-content;
                    height: fit-content;

                    > svg {
                        width: 50px;
                        margin-right: 20px;
                        fill: #f53d3d;
                    }
                }

                > .text-content {
                    > h3, > h5 {
                        color: #f53d3d;
                    }

                    > h5 {
                        font-weight: 100;
                        margin-top: 5px;
                    }
                }
            }
            
            > .btn-group {
                display: flex;
                gap: 5px;
                flex: 0 1 100%;
                border-top: 1px solid #d2d2d2;
                justify-content: flex-end;
                margin-top: 20px;
                padding-top: 20px; 

                > .delete > ${Button} {
                    background-color: #f53d3d;
                }

                > .cancel > ${Button} {
                    background-color: #727272;
                }
            }

        }
    }

    && > .add-video-modal > .modal > input,
    && > .edit-place-info-modal > .modal > input,
    && > .edit-place-info-modal > .modal > textarea {
        flex: 0 1 100%;
        height: 50px;
        border-radius: 5px; 
        outline: 0;
        border: 0;
        background-color: #eaeaea;
        /* font-size: 15px; */
        padding: 10px 20px;
        margin-bottom: 20px;
    }

    && > .edit-place-info-modal > .modal > h6 {
        width: 100%;
        text-align: left;
        margin-bottom: 5px;
    }
`

export default PageContent;