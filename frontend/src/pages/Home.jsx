import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem.jsx";

export default function Home() {
    const [offerListings, setOfferListings] = useState({});
    const [saleListings, setSaleListings] = useState({});
    const [rentListings, setRentListings] = useState({});
    SwiperCore.use([Navigation]);

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                await fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        }

        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                await fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=4');
                const data =await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchOfferListings();
    }, []);

    return (
        <div>
            <div className={'flex flex-col gap-6 py-20 px-3 max-w-6xl mx-auto'}>
                <h1 className={'text-slate-700 font-bold text-3xl lg:text-6xl'}>
                    Find your next <span className={'text-slate-500'}>perfect</span> <br/> place with ease
                </h1>
                <div className={'text-gray-400 text-xs sm:text-sm'}>
                    At Sonia Estate, we make finding your dream home fast, effortless, and exciting. Move in with confidence! <br/>
                    Our experts have handpicked top-tier properties designed to match your lifestyle.
                </div>
                <div className={'text-gray-400 text-xs sm:text-sm'}>
                    Your dream home awaits! {' '}
                    <Link to={'/search'} className={'text-blue-800 font-bold hover:underline'}>
                        Shall we...
                    </Link>
                </div>
            </div>

            <Swiper navigation>
                {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                        <div
                            style={{
                                background: `url(${listing.imageURLs[0]}) center no-repeat`,
                                backgroundSize: 'cover',
                            }}
                            className={'h-[500px]'}
                        >
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className={'max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'}>
                {offerListings && offerListings.length > 0 && (
                    <div>
                        <div className={'my-3'}>
                            <h2 className={'text-2xl font-semibold text-slate-600'}>Recent offers</h2>
                            <Link to={'/search?offer=true'} className={'text-sm text-blue-800 hover:underline'}>Show more...
                            </Link>
                        </div>

                        <div className={'flex flex-wrap gap-4'}>
                            {offerListings.map((listing) => (
                                <ListingItem key={listing._id} listing={listing}/>
                            ))}
                        </div>
                    </div>
                )}

                {rentListings && rentListings.length > 0 && (
                    <div>
                        <div className={'my-3'}>
                            <h2 className={'text-2xl font-semibold text-slate-600'}>Recent places for rent</h2>
                            <Link to={'/search?type=rent'} className={'text-sm text-blue-800 hover:underline'}>Show more...
                            </Link>
                        </div>

                        <div className={'flex flex-wrap gap-4'}>
                            {rentListings.map((listing) => (
                                <ListingItem key={listing._id} listing={listing}/>
                            ))}
                        </div>
                    </div>
                )}
                {saleListings && saleListings.length > 0 && (
                    <div>
                        <div className={'my-3'}>
                            <h2 className={'text-2xl font-semibold text-slate-600'}>Recent places for sale</h2>
                            <Link to={'/search?type=sale'} className={'text-sm text-blue-800 hover:underline'}>Show more...
                            </Link>
                        </div>

                        <div className={'flex flex-wrap gap-4'}>
                            {saleListings.map((listing) => (
                                <ListingItem key={listing._id} listing={listing}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <footer className={'mb-4 ml-3 text-gray-300 hover:underline text-xs'}>
                <Link to={'https://github.com/soniaobasuyi/mern-estate-project'} target={'_blank'}>
                    © Sonia Obasuyi 2025 || MERN Stack Project with Sahand
                </Link>
            </footer>
        </div>
    )
}
