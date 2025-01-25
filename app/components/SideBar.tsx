"use client"
import styled from "styled-components"
import React from "react"
import { redirect, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

const SideBarFC: React.FC<{className?: string}> = ({className}) => {
    const router = useRouter();
    const path = usePathname();
    const { data: session } =  useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/')
        }
    })

    return (
        <div className={className}>
            {
                session?.user? <>
                    <span id="avatar"></span>
                    <h3>{session?.user?.name}</h3>
                    <h5>{session?.user?.email}</h5>
                    <span className="acc-setting-link" onClick={(e) => {
                        router.push('/account-settings')
                    }}>Account settings</span>
                    <span id="divider"></span>
                    <div className="links">
                        <span className={path === "/" || path === "/destinations"? "link" : "link link-inactive"}
                        onClick={(e) => {
                            router.push('/destinations')
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 0c-69.6 0-126 56.4-126 126 0 56.3 82.4 158.8 113.9 196 6.4 7.5 17.8 7.5 24.2 0C331.7 284.8 414 182.3 414 126 414 56.4 357.6 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.1 216A32 32 0 0 0 0 245.7v250.3c0 11.3 11.4 19.1 21.9 14.9L160 448V214.9c-8.8-16-16.1-31.5-21.3-46.4L20.1 216zM288 359.7c-14.1 0-27.4-6.2-36.5-17-19.7-23.2-40.6-49.6-59.5-76.7v182l192 64V266c-18.9 27.1-39.8 53.5-59.5 76.7-9.1 10.8-22.4 17-36.5 17zm266.1-198.5L416 224v288l139.9-56A32 32 0 0 0 576 426.3V176c0-11.3-11.4-19.1-21.9-14.9z"/></svg>
                            Destinations
                        </span>
                        <span className={path === "/add-destination"? "link" : "link link-inactive"}
                        onClick={(e) => {
                            router.push('/add-destination')
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 208H272V64c0-17.7-14.3-32-32-32h-32c-17.7 0-32 14.3-32 32v144H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h144v144c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V304h144c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"/></svg>
                            Add Place
                        </span>
                    </div>
                    <span className="sign-out" onClick={(e) => {
                        signOut()
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"/></svg>
                        Sign Out
                    </span>
                </> : <div className="loader"></div>
            }
        </div>
    )

}

const SideBar = styled(SideBarFC)`
    display: flex;
    position: fixed;
    justify-content: center;
    align-content: flex-start;
    flex-wrap: wrap;
    width: 300px;
    height: 100vh;
    background-color: #252235;

    && > #avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        margin: 30px 0 10px 0;
        border-radius: 50%;
        background-image: url('/user-icon.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        font-size: 30px;
        color: white;

    }

    && > h3, && > h5 {
        flex: 0 1 100%;
        text-align: center;
        color: white;
        font-size: 15px;
    }

    && > h5 {
        font-size: 11px;
        font-weight: 100;
        color: #c5c5c5;
        margin-top: 5px;
    }

    && > .acc-setting-link {
        margin: 15px 0 5px 0;
        color:rgb(0, 89, 255);
        font-size: 11px;
        font-weight: 100;
        cursor: pointer;
    }

    && > .acc-setting-link:hover {
        text-decoration: underline;
    }

    && > .sign-out {
        display: flex;
        padding: 10px 15px;
        position: absolute;
        bottom: 30px;
        // flex-direction: column;
        align-items: center;
        justify-content: center;
        // border: 1px solid white;
        color: white;
        font-size: 13px;
        border-radius: 5px;
        background-color: rgb(0, 89, 255);
        cursor: pointer;

        > svg {
            width: 25px;
            height: 25px; 
            fill: white;
            margin-bottom: 5px;
            margin-right: 10px;
        }
    }

    && > .sign-out:hover {
        background-color: rgb(4, 55, 149);
        transition: background-color 300ms;
    }

    && > .sign-out:active {
        opacity: 0.5;
        transition: opacity 300ms;
    }


    && > #divider {
        flex: 0 1 100%;
        margin: 20px 30px;
        border-top: 0.5px solid white;
    }

    && > .links {
        display: flex;
        flex: 0 1 100%;
        margin: 10px 30px;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        justify-content: center;

        > .link {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 120px;
            height: 100px;
            padding: 0 10px;
            text-align: center;
            // border: 1px solid white;
            color: white;
            border-radius: 5px;
            background-color: #56667d;
            cursor: pointer;

            > svg {
                width: 35px;
                height: 35px; 
                fill: white;
                margin-bottom: 5px;
            }
        }

        > .link:hover {
            background-color:rgb(81, 98, 122);
            transition: background-color 300ms;
        }

        > .link:active {
            opacity: 0.5;
            transition: opacity 300ms;
        }

        > .link-inactive {
            background-color: transparent;
            color: white;
            border: 1px solid white;
             
            > svg {
                fill: white;
            }
        }
    }
    
    && > .loader {
        margin-top: 150px;
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

export default SideBar;