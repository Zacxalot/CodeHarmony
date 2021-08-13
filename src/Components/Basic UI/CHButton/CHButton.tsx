import "./CHButton.scss";

interface ButtonProps {
    text: string;
    colour?: string;
}

function CHButton({text,colour = "#65dd44"}:ButtonProps) {


    return (
        <button className="ch-button" style={{ backgroundColor: colour }}>{text}</button>
    );
}

export default CHButton;
