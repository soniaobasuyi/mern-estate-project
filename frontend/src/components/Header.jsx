import {FaBars, FaSearch} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);
    

    return (
        <header className={'bg-slate-200 drop-shadow-md'}>
            <div className={'flex justify-between items-center max-w-6xl mx-auto p-3'}>
                <Link to={'/'}>
                    <h1 className={'font-bold text-sm sm:text-xl flex flex-wrap'}>
                        <span className={'text-slate-500'}>Sonia</span>
                        <span className={'text-slate-700'}>Estate</span>
                    </h1>
                </Link>

                <form onSubmit={handleSubmit} className={'flex items-center bg-slate-100 p-3 rounded-lg'}>
                    <input
                        type={'text'}
                        placeholder={'Search...'}
                        className={'bg-transparent focus:outline-none w-24 sm:w-64'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className={'text-slate-600'}/>
                    </button>
                </form>

                <ul className={'hidden sm:flex gap-4'}>
                    <Link to={'/'}>
                        <li className={'text-slate-700 hover:underline'}>Home</li>
                    </Link>
                    <Link to={'/about'}>
                        <li className={'text-slate-700 hover:underline'}>About</li>
                    </Link>
                    <Link to={'/profile'}>
                        {currentUser ? (
                            <li className={'text-slate-700 hover:underline'}>Profile</li>
                        ) : (
                            <li className={'text-slate-700 hover:underline'}>Sign in</li>
                        )}
                    </Link>
                </ul>

                <div className={'sm:hidden relative'}>
                    <div
                        className={'relative inline-block'}
                        onMouseEnter={() => setHamburgerOpen(true)}
                        onMouseLeave={() => setHamburgerOpen(false)}
                        onClick={() => setHamburgerOpen(!hamburgerOpen)}
                    >
                        <button className={'text-slate-700'}>
                            <FaBars size={24}/>
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-40 bg-gray-100 shadow-lg rounded-lg transition-all duration-300 origin-top ${
                                hamburgerOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                            }`}
                        >
                            <ul className={'flex flex-col text-gray-800 p-3 space-y-2'}>
                                <Link to={'/'} onClick={() => setHamburgerOpen(false)}>
                                    <li className={'text-slate-700 hover:bg-slate-200 p-2 rounded'}>Home</li>
                                </Link>
                                <Link to={'/about'} onClick={() => setHamburgerOpen(false)}>
                                    <li className={'text-slate-700 hover:bg-slate-200 p-2 rounded'}>About</li>
                                </Link>
                                <Link to={'/profile'}>
                                    {currentUser ? (
                                        <li className={'text-slate-700 p-2 hover:bg-slate-200 rounded'}>Profile</li>
                                    ) : (
                                        <li className={'text-slate-700 p-2 hover:bg-slate-200 rounded'}>Sign in</li>
                                    )}
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
