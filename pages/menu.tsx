// import './Design.css';
import Button from './components/button';

const Menu: React.FC = () => {
    const handleClick = () => {
        console.log('Button clicked!');
    };

    return (
        <div className="Menu">
            <header className="page-header">
                <h1>Welcome User</h1>
            </header>
            <div className="menu-Button1">
                <Button className="menu-Buttontext" label="Play Game" onClick={handleClick} />
            </div>
            <div className="menu-Button2">
                <Button className="menu-Buttontext" label="My Stats" onClick={handleClick} />
            </div>
            <div className="menu-Button3">
                <Button className="menu-Buttontext" label="My Profile" onClick={handleClick} />
            </div>
            <div className="menu-Button4">
                <Button className="menu-Buttontext" label="About Us" onClick={() => handleClick()} />
            </div>
            <div className="menu-logout">
                <Button className="menu-Buttontext" label="Logout" onClick={handleClick} />
            </div>
        </div>
    );
};

export default Menu;
