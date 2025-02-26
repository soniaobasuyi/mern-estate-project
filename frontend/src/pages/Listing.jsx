import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css/bundle";

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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
            {listing && !error && !loading &&
                (
                    <>
                        <Swiper navigation>
                            {listing.imageURLs.map((url) => (
                                <SwiperSlide key={url}>
                                    <div className={'h-[550px]'} style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </>
                )
            }
        </main>
    )
}
