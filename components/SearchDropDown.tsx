

interface Props {
    handleSelect: Function
}

export function SearchDropDown({ handleSelect }: Props) {
    return (
        <div className='mr-2'>
            <button type="button"
                className="btn btn-secondary dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                SearchBy
            </button>
            <div className="dropdown-menu">
                <div
                    className="dropdown-item cursor-pointer"
                    onClick={() => handleSelect('producer')}>Search by producer</div>
                <div className="dropdown-item cursor-pointer"
                    onClick={() => handleSelect('sku')}>Search by SKU</div>
                <div className="dropdown-item cursor-pointer"
                    onClick={() => handleSelect('countryAndRegion')} > Search by region</div>
                <div className="dropdown-item cursor-pointer"
                    onClick={() => handleSelect('recent')}>Find recent stickers</div>


            </div>
        </div>
    )
}