import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function ContactLandlord({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    }, [listing.userRef]);

    return (
        <>
            {landlord && (
                <div className={'flex flex-col gap-2'}>
                    <p>
                        Contact {' '}
                        <span className={'font-semibold'}>{landlord.username}</span> {' '}
                        for {' '}
                        <span className={'font-semibold'}>{listing.title.toLowerCase()}</span>
                    </p>
                    <textarea
                        className={'border p-3 rounded-lg'}
                        name={'message'}
                        id={'message'}
                        rows={2}
                        value={message}
                        placeholder={'Enter your message here...'}
                        onChange={handleChange}
                    />
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
                        className={'uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 text-center'}
                    >
                        Send Message
                    </Link>
                </div>
            )}

        </>
    )
}
