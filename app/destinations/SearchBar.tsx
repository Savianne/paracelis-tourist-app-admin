"use client"
import React from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";
import { RESOURCES_SERVER_URL } from "../resources-server-url";

const SearchBarFC: React.FC<{className?: string}> = ({className}) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [showResult, setShowResult] = React.useState(false);
    const [result, setResult] = React.useState<({title: string, uid: string, coverPhoto: string})[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);


    return(
        <div className={className}>
            <div className="search-bar">
                <input value={searchTerm} onChange={(e) => {
                    setShowResult(false)
                    setSearchTerm(e.currentTarget.value)
                }} placeholder="Type to search" />
                {
                    searchTerm.length? 
                    <span className="clear" onClick={() => {
                        setShowResult(false)
                        setSearchTerm("")
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </span> : ''
                }
                
                <span className="search-btn" onClick={async () => {
                    if(searchTerm.length) {
                        setIsLoading(true)
                        setShowResult(true);
                        try {
                            const res = await  axios.post("/api/search-place", {searchTerm});
                            console.log(res.data)
                            setResult(res.data.result)
                        }
                        catch(err) {
                            console.log(err)
                        }
                        finally {
                            setIsLoading(false)
                        }
                    }
                    
                }}>Search</span>
            </div>
            {
                showResult? 
                <div className="search-result">
                    {
                        isLoading? <Spinner /> : 
                        <>
                            <strong>Result: {result.length}</strong>
                            {
                                result.map(item => {
                                    return (
                                        <div key={item.uid} className="item" onClick={() => {
                                            router.push(`/destinations/${item.uid}`)
                                        }}>
                                            <h3>{item.title}</h3>
                                            <img src={`${RESOURCES_SERVER_URL}/images/gallery/${item.coverPhoto}`} alt="preview" />
                                        </div>
                                    )
                                })
                            }
                        </>
                    }
                    
                </div> : ""
            }
        </div>
    )
}

const SearchBar = styled(SearchBarFC)`
    display: flex;
    flex: 0 1 90%;
    flex-wrap: wrap;
    margin-top: 40px;

    && > .search-bar {
        display: flex;
        flex: 0 1 100%;
        height: 70px;
        padding: 5px;
        border-radius: 50px;
        border: 1px solid gray;
        align-items: center;

        > .clear {
            width: fit-content;
            height: fit-content;
            cursor: pointer;
            margin-right: 10px;

            > svg {
                width: 20px;
                height: 20px;
            }
        }

        > input, && > input:active, && > input:focus {
            display: flex;
            flex: 0 1 100%;
            height: 100%;
            border: 0;
            font-size: 20px;
            border-radius: 50px;
            padding: 0 10px;
            outline: 0;
        }
        
        > .search-btn {
            display: flex;
            padding: 0 15px;
            height: 100%;
            width: 120px;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            border-radius: 50px;
            background-color: #56667d;
            cursor: pointer;
            margin-left: auto;
        }
    
        > .search-btn:hover {
            background-color:rgb(66, 80, 100);
            transition: background-color 300ms;
        }
    
        > .search-btn:active {
            opacity: 0.5;
            transition: opacity 300ms;
        }
    }

    && > .search-result {
        display: flex;
        flex: 0 1 100%;
        padding: 20px;
        /* height: 300px; */
        background-color: #f3f3f3;
        margin-top: 20px;
        flex-wrap: wrap;
        gap: 10px;

        > strong {
            font-size: 15px;
            flex: 0 1 100%;
            margin-bottom: 10px;
        }

        > .item {
            display: flex;
            flex: 0 1 100%;
            padding: 10px;
            border-left: 3px solid #bcebdd;
            cursor: pointer;
            align-items: center;

            > img {
                margin-left: auto;
                /* margin-right: 10px; */
                height: 30px;
            }

            > h3 {
                font-size: 12px;
            }
        }

        > .item:hover {
            background-color: #dbdbdb8b;
            transition: background-color 400ms;
        }

    }


`

export default SearchBar;