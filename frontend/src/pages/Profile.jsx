import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {app} from "../firebase.js";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart, signOutFailure, signOutSuccess
} from "../redux/user/userSlice.js";
import {Link} from "react-router-dom";

export default function Profile() {
    const {currentUser, loading, error} = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePercentage(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
                    setFormData({...formData, avatar: downloadURL})
                );
            }
        );
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutFailure(data.message));
                return;
            }
            dispatch(signOutSuccess(data));
        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    };

    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }
            setUserListings(data);
        } catch (error) {
            setShowListingsError(true);
        }
    };

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message)
                return;
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className={'p-3 max-w-lg mx-auto'}>
            <h1 className={'text-3xl font-semibold text-center my-7 text-slate-700'}>Profile</h1>
            <form onSubmit={handleSubmit} className={'flex flex-col gap-4'}>
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type={'file'}
                    ref={fileRef}
                    hidden
                    accept={'image/*'}
                />
                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt={'picture'}
                    className={'rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'}
                />
                <p className={'text-sm self-center'}>
                    {
                        fileUploadError ?
                            (<span className={'text-red-700'}>Image upload error(image must be less than 2MB)</span>) :
                            filePercentage > 0 && filePercentage < 100 ?
                                (<span className={'text-slate-700'}>{`Uploading ${filePercentage}%`}</span>) :
                                filePercentage === 100 ?
                                    (<span className={'text-green-700'}>Image successfully uploaded!</span>) :
                                    ""
                    }
                </p>
                <input
                    type={'text'}
                    placeholder={'username'}
                    defaultValue={currentUser.username}
                    id={'username'}
                    className={'border p-3 rounded-lg'}
                    onChange={handleChange}
                />
                <input
                    type={'email'}
                    placeholder={'email'}
                    defaultValue={currentUser.email}
                    id={'email'}
                    className={'border p-3 rounded-lg'}
                    onChange={handleChange}
                />
                <input
                    type={'password'}
                    placeholder={'password'}
                    id={'password'}
                    className={'border p-3 rounded-lg'}
                    onChange={handleChange}
                />
                <button disabled={loading}
                        className={'bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80'}>
                    {loading ? 'Loading...' : 'Update'}
                </button>
                <Link className={'bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95'}
                      to={'/create-listing'}>
                    Create Listing
                </Link>

            </form>
            <div className={'flex justify-between mt-5'}>
                <span onClick={handleDeleteUser} className={'text-red-700 cursor-pointer hover:opacity-80'}>Delete account</span>
                <span onClick={handleSignOut} className={'text-red-700 cursor-pointer hover:opacity-80'}>Sign out</span>
            </div>
            <p className={'text-red-700 mt-5'}>{error ? error : ''}</p>
            <p className={'text-green-700 mt-5'}>{updateSuccess ? 'User successfully updated!' : ''}</p>
            <button onClick={handleShowListings} className={'text-green-700 w-full hover:opacity-85'}>Show listings</button>
            <p className={'text-red-700 mt-5'}>{showListingsError ? 'Error showing listings' : ''}</p>

            {
                userListings && userListings.length > 0 &&
                <div className={'flex flex-col gap-4'}>
                    <h1 className={'text-center mt-7 text-xl font-semibold text-slate-700'}>Your Listings</h1>
                    {userListings.map((listing) =>
                        <div key={listing._id} className={'border rounded-lg p-3 flex justify-between items-center gap-4'}>
                            <Link to={`/listing/${listing._id}`}>
                                <img src={listing.imageURLs[0]} alt={'listing image'} className={'h-16 w-16 object-contain'}/>
                            </Link>
                            <Link to={`/listing/${listing._id}`} className={'text-slate-700 font-semibold hover:underline truncate flex-1'}>
                                <p>{listing.title}</p>
                            </Link>

                            <div className={'flex flex-col'}>
                                <button onClick={()=>handleListingDelete(listing._id)} className={'text-red-700 uppercase'}>Delete</button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className={'text-green-700 uppercase'}>Edit</button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}
