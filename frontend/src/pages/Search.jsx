import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

export default function Search() {
    const navigate = useNavigate();
    const [searchFilters, setSearchFilters] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSearchFilters({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true',
                furnished: furnishedFromUrl === 'true',
                offer: offerFromUrl === 'true',
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();

            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }

            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'all'  || e.target.id === 'rent' || e.target.id === 'sale') {
            setSearchFilters({...searchFilters, type: e.target.id});
        }

        if (e.target.id === 'searchTerm') {
            setSearchFilters({...searchFilters, searchTerm: e.target.value});
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSearchFilters({
                ...searchFilters,
                [e.target.id]: !!(e.target.checked || e.target.checked === 'true')
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';

            setSearchFilters({...searchFilters, sort, order});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', searchFilters.searchTerm);
        urlParams.set('type', searchFilters.type);
        urlParams.set('parking', searchFilters.parking);
        urlParams.set('furnished', searchFilters.furnished);
        urlParams.set('offer', searchFilters.offer);
        urlParams.set('sort', searchFilters.sort);
        urlParams.set('order', searchFilters.order);
        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const startIndex = listings.length;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();

        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };
    
    return (
        <div className={'flex flex-col md:flex-row'}>
            <div className={'p-7 border-b-2 md:border-r-2 md:min-h-screen'}>
                <form onSubmit={handleSubmit} className={'flex flex-col gap-7'}>
                    <div className={'flex items-center gap-2'}>
                        <label className={'whitespace-nowrap font-semibold'}>Search Term:</label>
                        <input
                            id={'searchTerm'}
                            className={'border rounded-lg p-3 w-full'}
                            type={'text'}
                            placeholder={'Search...'}
                            value={searchFilters.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={'gap-2 flex flex-wrap items-center'}>
                        <label className={'font-semibold'}>Type:</label>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'all'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={searchFilters.type === 'all'}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'rent'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={searchFilters.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'sale'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={searchFilters.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'offer'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={searchFilters.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className={'gap-2 flex flex-wrap items-center'}>
                        <label className={'font-semibold'}>Amenities:</label>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'parking'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={searchFilters.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'furnished'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={searchFilters.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className={'gap-2 flex items-center'}>
                        <label className={'font-semibold'}>Sort: </label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id={'sort_order'}
                            className={'p-2 border rounded-lg'}
                        >
                            <option value={'createdAt_desc'}>Latest</option>
                            <option value={'createdAt_asc'}>Oldest</option>
                            <option value={searchFilters.offer ? 'discountPrice_desc' : 'regularPrice_desc'}>Price high to low</option>
                            <option value={searchFilters.offer ? 'discountPrice_asc' : 'regularPrice_asc'}>Price low to high</option>
                        </select>
                    </div>

                    <button className={'uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'}>
                        Search
                    </button>
                </form>
            </div>

            <div className={'flex-1'}>
                <h1 className={'text-3xl text-slate-700 mt-5 border-b p-3 font-semibold'}>
                    Listing results:
                </h1>
                <div className={'p-7 gap-4 flex flex-wrap'}>
                    {loading && <p className={'text-slate-700 text-center w-full text-2xl'}>Loading...</p>}
                    {!loading && listings.length === 0 &&
                        (<p className={'text-slate-700 text-2xl'}>No listings found. Modify your search!</p>)
                    }
                    {!loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)}

                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className={'text-green-700 hover:underline p-7 text-center w-full'}
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
