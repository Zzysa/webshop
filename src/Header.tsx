import SearchBar from "./SearchBar";
import { useLocation } from "react-router-dom"; 
import { UserContext } from './App';
import { useContext } from 'react';
import Button from "./Button";

function Header() {
    const location = useLocation(); 
    const showSearchField = location.pathname === "/";
    const { setUser, user } = useContext(UserContext)

    function logoutUser() {
        setUser(null)
    }

    return(
        <header id="header">
            <h1 id="webSiteLogo">Web Shop</h1>
            {showSearchField && <SearchBar />}
            <nav>
                <ul>
                    {user ? (
                    <>
                        <Button buttonId="profileButton" buttonPath="/profile" buttonText="Profile" />
                        <Button buttonId="cartButton" buttonPath="/cart" buttonText="Cart" />
                        <Button onClick={logoutUser} buttonId="logoutButton" buttonPath="/" buttonText="Logout" />
                    </>) : (
                    <>
                        <Button buttonId="loginButton" buttonPath="/login" buttonText="Log in" />
                        <Button buttonId="signInButton" buttonPath="/signIn" buttonText="Sign in" />
                    </>)}
                </ul>
            </nav>
        </header>
    );
}

export default Header