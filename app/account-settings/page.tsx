import StyledAccountSettings from "./StyledAccountSettingsTab";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import ChangePasswordForm from "./changePasswordForm";

export default async function AccountSettingsPage() {
  const session = await getServerSession(options);
  return <>
    {
      session? 
      <StyledAccountSettings>
        <h1>Account Settings</h1>
        <div className="admin-info">
          <div className="avatar"></div>
          <h2>{session.user?.name}</h2>
          <h3>{session.user?.email}</h3>
        </div>
        <ChangePasswordForm email={session.user?.email as string} />
      </StyledAccountSettings> : ""
    }
  </>
}
