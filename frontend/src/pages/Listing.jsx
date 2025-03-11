import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css/bundle";
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from "react-icons/fa";
import {useSelector} from "react-redux";
import ContactLandlord from "../components/ContactLandlord.jsx";

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(true);
    const {currentUser} = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/getListing/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <p className={'my-7 text-center text-2xl'}>Loading...</p>}
            {error &&
                <p className={'my-7 text-center text-2xl'}>
                    Something went wrong! Return to <Link to={'/'} className={'text-blue-800 hover:underline'}>home page</Link>
                </p>
            }
            {listing && !error && !loading && (
                <>
                    <Swiper navigation>
                        {listing.imageURLs.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className={'h-[550px]'}
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover'
                                    }}
                                >
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className={'fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'}>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                    }, 2000);
                            }}
                        />
                    </div>
                    {copied && (<p className={'fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'}>Link copied!</p>)}

                    <div className={'flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'}>
                        <p className={'text-2xl font-semibold'}>
                            {listing.title} - {' '}
                            {listing.offer ? (
                                <>
                                    <span className={'line-through'}>${listing.regularPrice.toLocaleString('en-US')}</span>{' '}
                                    <span className={'text-red-500'}>${listing.discountPrice.toLocaleString('en-US')}</span>
                                </>
                            ) :
                                (<span>${listing.regularPrice.toLocaleString('en-US')}</span>)
                            }
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className={'flex items-center gap-2 text-slate-600 text-sm'}>
                            <FaMapMarkerAlt className={'text-green-700'}/>
                            {listing.address}
                        </p>
                        <div className={'flex gap-4'}>
                            <p className={'bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md gap-4'}>
                                {listing.type === 'rent' ? 'For rent' : 'For sale'}
                            </p>
                            {listing.offer && (
                                <p className={'bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'}>
                                    ${+listing.regularPrice - +listing.discountPrice} discount
                                </p>
                            )}
                        </div>
                        <p className={'text-slate-800'}>
                            <span className={'font-semibold text-black'}>Description - </span>
                            {listing.description}
                        </p>
                        <ul className={'flex flex-wrap items-center text-sm font-semibold text-green-900 gap-4 sm:gap-6'}>
                            <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                <FaBed className={'text-lg'} />
                                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                            </li>
                            <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                <FaBath className={'text-lg'} />
                                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                            </li>
                            <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                <FaParking className={'text-lg'} />
                                {listing.parking ? 'Parking' : 'No parking'}
                            </li>
                            <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                <FaChair className={'text-lg'} />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>

                        {listing.userRef !== currentUser?._id && contactLandlord &&
                            (<button
                                onClick={() => {
                                    if (!currentUser) return navigate('/sign-in');
                                        setContactLandlord(false);
                                }}
                                className={'uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'}>
                                Contact landlord
                            </button>)
                        }
                        {!contactLandlord && <ContactLandlord listing={listing} />}
                    </div>
                </>
            )}
        </main>
    )
}
