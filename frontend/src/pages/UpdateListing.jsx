import {useEffect, useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {app} from "../firebase.js";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";


export default function UpdateListing() {
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState({});
    const [formData, setFormData] = useState({
        imageURLs: [],
        title: '',
        description: '',
        address: '',
        regularPrice: 50,
        discountPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false
    });
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/getListing/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        }
        fetchListing();
    }, [params.listingId]);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
            setImageUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageURLs: formData.imageURLs.concat(urls) });
                setImageUploadError(false);
                setImageUploading(false);
            }).catch((err) => {
                setImageUploadError('Image upload failed (2 mb max per image)');
                setImageUploading(false);
            });
        } else {
            setImageUploadError('You can only upload 6 images per listing!');
            setImageUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageURLs: formData.imageURLs.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        if (e.target.id === 'furnished' || e.target.id === 'parking' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageURLs.length < 1) return setSubmitError('You must upload at least 1 image');
            if (+formData.regularPrice <= +formData.discountPrice) return setSubmitError('Discounted price must be lower than regular price');
            setSubmitError(false);
            setFormLoading(true);

            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setFormLoading(false);
            if (data.success === false) {
                setSubmitError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setSubmitError(error.message);
            setFormLoading(false);
        }
    };

    return (
        <main className={'p-3 max-w-4xl mx-auto mb-10'}>
            <h1 className={'text-center font-semibold text-3xl my-7 text-slate-700'}>Update a Listing</h1>
            <form onSubmit={handleSubmit} className={'flex flex-col sm:flex-row gap-4'}>
                <div className={'flex flex-col gap-4 flex-1'}>
                    <input
                        type={'text'}
                        placeholder={'Title'}
                        className={'border p-3 rounded-lg'}
                        id={'title'}
                        maxLength={62}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.title}
                    />
                    <textarea
                        placeholder={'Description'}
                        className={'border p-3 rounded-lg'}
                        id={'description'}
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type={'text'}
                        placeholder={'Address'}
                        className={'border p-3 rounded-lg'}
                        id={'address'}
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <div className={'flex gap-6 flex-wrap'}>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'sale'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'rent'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'parking'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'furnished'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input
                                type={'checkbox'}
                                id={'offer'}
                                className={'w-5'}
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className={'flex flex-wrap gap-6'}>
                        <div className={'flex items-center gap-2'}>
                            <input
                                type={'number'}
                                id={'bedrooms'}
                                min={1}
                                max={10}
                                required
                                className={'border border-gray-300 rounded-lg p-2'}
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className={'flex items-center gap-2'}>
                            <input
                                type={'number'}
                                id={'bathrooms'}
                                min={1}
                                max={10}
                                required
                                className={'border border-gray-300 rounded-lg p-2'}
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className={'flex items-center gap-2'}>
                            <input
                                type={'number'}
                                id={'regularPrice'}
                                min={50}
                                max={10000000}
                                required
                                className={'border border-gray-300 rounded-lg p-2'}
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className={'flex flex-col items-center'}>
                                <p>Regular price</p>
                                {formData.type === 'rent' ? (<span className={'text-sm'}>($ / month)</span>) : <span className={'text-sm'}>($)</span>}
                            </div>
                        </div>
                        {formData.offer && (
                            <div className={'flex items-center gap-2'}>
                                <input
                                    type={'number'}
                                    id={'discountPrice'}
                                    min={0}
                                    max={10000000}
                                    required
                                    className={'border border-gray-300 rounded-lg p-2'}
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className={'flex flex-col items-center'}>
                                    <p>Discounted price</p>
                                    {formData.type === 'rent' ? (<span className={'text-sm'}>($ / month)</span>) : <span className={'text-sm'}>($)</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={'flex flex-col flex-1 gap-4'}>
                    <p className={'font-semibold'}>
                        Images:
                        <span
                            className={'font-normal text-gray-600 ml-2'}>The first image will be the cover (max 6)</span>
                    </p>
                    <div className={'flex gap-4'}>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            type={'file'}
                            id={'images'}
                            accept={'image/*'}
                            multiple
                            className={'border border-gray-300 p-3 rounded w-full'}
                        />
                        <button
                            type={'button'}
                            disabled={imageUploading}
                            onClick={handleImageSubmit}
                            className={'text-green-700 border border-green-700 p-3 rounded uppercase hover:shadow-lg disabled:opacity-80'}
                        >
                            {imageUploading? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className={'text-red-700 text-sm'}>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
                            <div key={url} className={'flex justify-between p-3 border items-center'}>
                                <img src={url} alt={'listing image'} className={'w-20 h-20 object-contain rounded-lg'}/>
                                <button
                                    type={'button'}
                                    onClick={() => handleRemoveImage(index)}
                                    className={'p-3 text-red-700 rounded-lg uppercase hover:opacity-75 text-sm'}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    }

                    <button disabled={formLoading || imageUploading} className={'uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'}>
                        {formLoading ? 'Updating...' : 'Update Listing'}
                    </button>
                    {submitError && <p className={'text-red-700 text-sm'}>{submitError}</p>}
                </div>
            </form>
        </main>
    )
}
