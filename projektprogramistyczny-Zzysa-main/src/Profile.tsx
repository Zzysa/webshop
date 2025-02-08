import { UserContext } from "./App";
import { useContext } from "react";

function Profile() {
    const { user } = useContext(UserContext)

    if (!user) {
        return (
            <p>Error, user is not login</p>
        );
    }

    return (
        <div className="profileInformation">
            <h2>Hello, <span className="userName">{user.name}</span>! There is some information about you</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Surname:</strong> {user.surname}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
}

export default Profile
