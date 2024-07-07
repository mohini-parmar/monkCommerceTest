import React, { useState } from 'react'
import AddProduct from './AddProduct'
import ProductList from './ProductList';

const MainPage = () => {

  const [isModalOpen , setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
        <ProductList isModalOpen={isModalOpen} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} />
        <AddProduct handleOpenModal={handleOpenModal} />
    </div>
  )
}

export default MainPage
