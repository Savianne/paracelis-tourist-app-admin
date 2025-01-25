"use client"
import React from "react";
import Loading from "../components/Loading";

function isStrongPassword(password: string) {
    const minLength = 8;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return password.length >= minLength && regex.test(password);
}

const ChangePasswordForm: React.FC<{email: string}> = ({email}) => {
    const [oldPass, setOldPass] = React.useState("");
    const [newPass, setNewPass] = React.useState('');
    const [confirm, setConfirm] = React.useState("");
    const [passwordStrength, setPasswordStrength] = React.useState(false);
    const [passwordConfirmed, setPasswordConfired] = React.useState(false)
    const [error, setError] = React.useState<null | string>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    React.useEffect(() => {
        setPasswordStrength(isStrongPassword(newPass))
    }, [newPass]);

    React.useEffect(() => {
        passwordStrength && newPass === confirm? setPasswordConfired(true) : setPasswordConfired(false)
    }, [newPass, confirm])

    return(
        <>
            <form>
                <h3>Change Password</h3>
                {
                    success? 
                    <div className="success-message">
                        <p>Your password has been changed successfully.</p>
                    </div> : ''
                }
                {
                    !passwordStrength?  
                    <div className="alert-message">
                        <p>A strong password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character (such as @$!%*?&).</p>
                    </div> : ''
                }
                {
                    error?
                    <div className="error-message">
                        <p>{error}</p>
                    </div> : ''
                }
            
                <input value={oldPass} placeholder="Enter old password" type="password" onChange={(e) => {
                    setOldPass(e.target.value)
                }}/>
                <input value={newPass} placeholder="Enter new password" type="password" onChange={(e) => {
                    setNewPass(e.target.value)
                }}/>
                <input disabled={!passwordStrength} value={confirm} placeholder="Confirm new password" type="password" onChange={(e) => {
                    setConfirm(e.target.value)
                }}/>
                <span className={passwordConfirmed && oldPass.length != 0? "submit-btn" : "submit-btn disabled-btn"} onClick={async (e) => {
                    setIsLoading(true);
                    try {
                        const req = await fetch('/api/handle-change-password', {
                            method: "POST",
                            body: JSON.stringify({email, oldPass, newPass, confirm})
                        });

                        const data = await req.json();
                       
                        if(data.status === "error") {
                            setError(data.error);
                            setSuccess(false);
                        } else {
                            setError(null);
                            setOldPass("");
                            setNewPass("");
                            setConfirm('');
                            setPasswordConfired(false);
                            setPasswordStrength(false);
                            setSuccess(true);
                        }
                    }
                    catch(err)  {
                        console.log(err)
                        setError('Error')
                    }    
                    finally {
                       setIsLoading(false) 
                    }          
                }}>
                    Change
                </span>
            </form>
            {
                isLoading? <Loading /> : ""
            }
        </>
    )
}

export default ChangePasswordForm