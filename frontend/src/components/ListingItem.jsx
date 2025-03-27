import {Link} from "react-router-dom";
import {MdLocationOn} from "react-icons/md";


export default function ListingItem( {listing} ) {
    return (
        <div className={'bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[400px]'}>
            <Link to={`/listing/${listing._id}`}>
                <img
                    alt={'cover-image'}
                    src={listing.imageURLs[0]}
                    className={'h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'}
                />

                <div className={'p-3 flex flex-col gap-2 w-full mt-5'}>
                    <p className={'truncate text-lg font-semibold text-slate-700'}>{listing.title}</p>

                    <div className={'flex items-center gap-1'}>
                        <MdLocationOn className={'h-4 w-4 text-green-700'}/>
                        <p className={'truncate text-gray-600 text-sm w-full'}>{listing.address}</p>
                    </div>

                    <p className={'text-sm text-gray-600 line-clamp-2'}>{listing.description}</p>

                    <p className={'text-green-700 mt-2 font-bold'}>
                        ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>

                    <div className={'flex text-xs gap-4 font-bold text-slate-700'}>
                        <div>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>

                        <div>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
