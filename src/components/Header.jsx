import { Link } from 'react-router-dom'

function Header() {
    return (
        <header>
            <div className='logo'>
                <h1>HollyCrapr</h1>
            </div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <button>Login</button>
            </nav>
        </header>
    )
}

export default Header