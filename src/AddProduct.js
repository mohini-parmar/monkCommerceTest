import React from 'react'

const AddProduct = ({handleOpenModal}) => {
  return (
    <div>
        <div className='container d-flex mt-5'>
            <div className='col-md-3'/>
            <div className='col-md'>
                <button className='add-prd' onClick={handleOpenModal}>Add Product</button>
            </div>
        </div>
    </div>
  )
}

export default AddProduct
