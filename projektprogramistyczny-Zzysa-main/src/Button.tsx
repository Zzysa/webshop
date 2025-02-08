import { Link } from "react-router-dom";

interface ButtonProps {
    buttonId: string;
    buttonPath: string;
    buttonText: string;
    onClick?: () => void;
}

function Button({ buttonId, buttonPath, buttonText, onClick }: ButtonProps) {
    return (
        <li id={buttonId}>
            <Link to={buttonPath} onClick={onClick}>
                {buttonText}
            </Link>
        </li>
    );
}

export default Button