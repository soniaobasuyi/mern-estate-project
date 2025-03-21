
export default function Search() {
    return (
        <div className={'flex flex-col md:flex-row'}>
            <div className={'p-7 border-b-2 md:border-r-2 md:min-h-screen'}>
                <form className={'flex flex-col gap-7'}>
                    <div className={'flex items-center gap-2'}>
                        <label className={'whitespace-nowrap font-semibold'}>Search Term:</label>
                        <input
                            id={'searchTerm'}
                            className={'border rounded-lg p-3 w-full'}
                            type={'text'}
                            placeholder={'Search...'}
                        />
                    </div>

                    <div className={'gap-2 flex flex-wrap items-center'}>
                        <label className={'font-semibold'}>Type:</label>
                        <div className={'flex gap-2'}>
                            <input type={'checkbox'} id={'all'} className={'w-5'}/>
                            <span>Rent & Sale</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type={'checkbox'} id={'Rent'} className={'w-5'}/>
                            <span>Rent</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type={'checkbox'} id={'Sale'} className={'w-5'}/>
                            <span>Sale</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type={'checkbox'} id={'Offer'} className={'w-5'}/>
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className={'gap-2 flex flex-wrap items-center'}>
                        <label className={'font-semibold'}>Amenities:</label>
                        <div className={'flex gap-2'}>
                            <input type={'checkbox'} id={'parking'} className={'w-5'}/>
                            <span>Parking</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type={'checkbox'} id={'furnished'} className={'w-5'}/>
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className={'gap-2 flex items-center'}>
                        <label className={'font-semibold'}>Sort: </label>
                        <select id={'sort_order'} className={'p-2 border rounded-lg'}>
                            <option>Latest</option>
                            <option>Oldest</option>
                            <option>Price high to low</option>
                            <option>Price low to high</option>
                        </select>
                    </div>

                    <button className={'uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'}>
                        Search
                    </button>
                </form>
            </div>

            <div>
                <h1 className={'text-3xl text-slate-700 mt-5 border-b p-3 font-semibold'}>
                    Listing results:
                </h1>
            </div>
        </div>
    )
}
