import '../App.css'
import warriorsLogo from '../assets/warriors.png';

const Header = () => {
  return (
    <header>
      <div className="header-content">
        <img src={warriorsLogo} alt="Logo" className="logo-image" />
      </div>
    </header>
  );
};

export default Header;
