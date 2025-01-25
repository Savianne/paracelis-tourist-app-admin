"use client"
import styled from "styled-components";
import React from "react";
import { useRouter } from "next/navigation";
import { IStyledFC } from "../types/IStyledFC";
import AddressPicker from "../components/LocationPicker";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ImagePicker from "../components/ImagePicker";

const AddDestinationFormFC: React.FC<IStyledFC> = ({className}) => {
    const router = useRouter();
    const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
    const [images, setImages] = React.useState<string[]>([]);
    const [nameOfPlace, setNameOfPlace] = React.useState("");
    const [story, setStory] = React.useState("");
    const [error, setError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formFilled, setFormFilled] = React.useState(false);
    const handleLocationSelect = (coords: { lat: number; lng: number }) => {
      setLocation(coords);
    };

    React.useEffect(() => {
        if(location?.lat && location.lng && nameOfPlace && story && images.length) {
            setFormFilled(true)
        } else {
            setFormFilled(false)
        }

    }, [location, nameOfPlace, story, images]);

    React.useEffect(() => {
        console.log(images)
    }, [images])
    return(
        <form className={className} onSubmit={(e) => e.preventDefault()}>
            {
                error? <div className="error-alert">
                    Error! Failed to add Place
                </div> : ''
            }
            
            <input onChange={(e) => {
                setNameOfPlace(e.target.value)
            }} 
            value={nameOfPlace}
            type="text" name="name" placeholder="Name of Place" />
            <textarea
            onChange={(e) => {
                setStory(e.target.value);
            }} value={story} name="story" placeholder="Story"></textarea>
            <AddressPicker onLocationSelect={handleLocationSelect} />
            <div className="file-picker">
                <ImagePicker onChange={f => setImages(f)} placeholder="Add cover photo" fullWidth multiple={true} />
            </div>
            <Button
            disabled={!formFilled}
            onClick={async () => {
                setIsLoading(true);
                try {
                    const req = await fetch('/api/add-place', {
                        method: "POST",
                        body: JSON.stringify({nameOfPlace, story, location, images})
                    });

                    const response = await req.json()

                    if(response.status == "success") {
                        setNameOfPlace("")
                        setStory("");
                        setFormFilled(false);
                        setLocation(null);
                        setError(false);
                        router.push(`/destinations/${response.UID}`)
                    } else {
                        throw Error('Operation Failed')
                    }
                }
                catch(e) {
                    setError(true)
                }
                finally{
                    setIsLoading(false)
                }
            }}>Submit</Button>
            {
                isLoading? <Loading /> : ""
            }
        </form>
    )
}

const AddDestinationForm = styled(AddDestinationFormFC)`
    display: flex;
    flex: 0 1 100%;
    /* background-color: aliceblue; */
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;

    && > .error-alert {
        display: flex;
        flex: 0 1 100%;
        background-color: #fe0602;
        color: white;
        padding: 30px 20px;
    }

    && > input, && > textarea {
        flex: 0 1 100%;
        height: 50px;
        border-radius: 5px; 
        outline: 0;
        border: 0;
        background-color: #eaeaea;
        /* font-size: 15px; */
        padding: 10px 20px;
    }

    && > textarea {
        min-height: 150px;
    }

    && > ${Button} {
        flex: 0 1 100%;
        margin-top: 30px;
    }

    && > .file-picker {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        padding: 40px 10px;
    }

`

export default AddDestinationForm;