import React, { useState } from 'react'
import Model from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import ProductPicker from './ProductPicker';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { DndContext, closestCenter, useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableProductItem = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
            {children}
        </div>
    );
};


const ProductList = ({ isModalOpen, handleOpenModal, handleCloseModal }) => {

    const [selectedProductsIds, setSelectedProductsIds] = useState([])
    const [selectedVariantIds, setSelectedVariantIds] = useState([])
    const [products, setProducts] = useState([])
    const [discountState, setDiscountState] = useState({})
    const [showVariants, setShowVariants] = useState({});

    const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 10 } }), useSensor(TouchSensor));



    const handleAddproducts = (products, variants, productData) => {
        setSelectedProductsIds(products);
        setSelectedVariantIds(variants);
        setProducts(productData)
        handleCloseModal();
    }

    const handleDiscountRate = (e, productId) => {
        const rate = e.target.value;
        setDiscountState(prevState => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                discountRate: rate,
            },
        }));
    };

    const setDiscountType = (type, productId) => {
        setDiscountState(prevState => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                discountType: type,
            },
        }));
    };

    const toggleDiscount = (productId) => {
        setDiscountState(prevState => ({
            ...prevState,
            [productId]: {
                ...prevState[productId],
                isEnableDiscount: !prevState[productId]?.isEnableDiscount,
                discountRate: prevState[productId]?.discountRate || 0,
                discountType: prevState[productId]?.discountType || '% off',
            },
        }));
    };

    const toggleVariants = (productId) => {
        console.log('show variant clicked:', productId);
        setShowVariants(prevState => ({
            ...prevState,
            [productId]: !prevState[productId],
        }));
    };

    const removeVariant = (variantId) => {
        setSelectedVariantIds(prevState => prevState.filter(id => id !== variantId));
        setProducts(prevState => {
            return prevState.reduce((acc, product) => {
                const updatedVariants = product.variants.filter(variant => variant.id !== variantId);
                if (updatedVariants.length > 0) {
                    acc.push({ ...product, variants: updatedVariants });
                } else {
                    setSelectedProductsIds(selectedProductsIds.filter(id => id !== product.id));
                }
                return acc;
            }, []);
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        console.log('Active ID:', active.id);
        console.log('Over ID:', over.id);
        if (!over) return;
    
        if (active.id.startsWith('product-') && over.id.startsWith('product-')) {
            const oldIndex = products.findIndex(p => `product-${p.id}` === active.id);
            const newIndex = products.findIndex(p => `product-${p.id}` === over.id);
    
            if (oldIndex !== -1 && newIndex !== -1) {
                setProducts((items) => arrayMove(items, oldIndex, newIndex));
            }
        } 
        else if (active.id.startsWith('variant-') && over.id.startsWith('variant-')) {
            const [ activeVariantId, productId] = active.id.split('-').slice(1);
            const [, overVariantId] = over.id.split('-');
        
            const productIndex = products.findIndex(p => p.id === Number(productId));
            console.log('productIndex ', productIndex);
            if (productIndex !== -1) {
        
                const oldIndex = products[productIndex].variants.findIndex(v => v.id === Number(activeVariantId));
                const newIndex = products[productIndex].variants.findIndex(v => v.id === Number(overVariantId));
        
                if (oldIndex !== -1 && newIndex !== -1) {
                    setProducts(prevProducts => {
                        const updatedProducts = [...prevProducts];
                        const variants = [...updatedProducts[productIndex].variants];
                        const [movedItem] = variants.splice(oldIndex, 1);
                        variants.splice(newIndex, 0, movedItem);
                        updatedProducts[productIndex] = { ...updatedProducts[productIndex], variants };
                        return updatedProducts;
                    });
                }
            }
        }
        
    };
    


    const selectedProducts = products && products.filter(product => selectedProductsIds.includes(product.id)) || []
    const selectedVariants = products && products.flatMap(product => product.variants).filter(variant => selectedVariantIds.includes(variant.id)) || []


    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <label className='p-title'>Add Product</label>
            <div className='container d-flex mt-4'>
                <div className='col-md-3 ms-2 table-title'>
                    Product
                </div>
                <div className='col-md table-title'>
                    Discount
                </div>
            </div>
            {selectedProducts.length > 0 ?
                (<SortableContext
                    items={selectedProducts.map(product => `product-${product.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {selectedProducts.map((prd, index) => {
                        const productVariants = prd.variants.filter(variant => selectedVariantIds.includes(variant.id));
                        return (
                            <SortableProductItem key={`product-${prd.id}`} id={`product-${prd.id}`}>
                                <div>
                                    <div className='container d-flex mt-4'>
                                        <div className='col-md-3 ms-2'>
                                            <input
                                                className='input-box'
                                                type='text'
                                                placeholder={"Select Product"}
                                                value={prd.title ? prd.title : ''}
                                                onClick={handleOpenModal}
                                            />
                                        </div>
                                        {discountState[prd.id]?.isEnableDiscount ?
                                            <div className='d-flex col-md-3'>
                                                <input
                                                    type='text'
                                                    className='dis-rate'
                                                    placeholder='0'
                                                    onChange={(e) => handleDiscountRate(e, prd.id)}
                                                    value={discountState[prd.id]?.discountRate || 0}
                                                />
                                                <DropdownButton className='ms-2 dis-drop' variant='success' title={discountState[prd.id]?.discountType || '% off'}>
                                                    <DropdownItem onClick={() => setDiscountType('% off', prd.id)}>% off</DropdownItem>
                                                    <DropdownItem onClick={() => setDiscountType('flat off', prd.id)}>flat off</DropdownItem>
                                                </DropdownButton>
                                                <div className='variant-toggle-container mt-2'>
                                                    <a className='link-style' href='#' onClick={() => toggleVariants(prd.id)}>
                                                        {showVariants[prd.id] ? 'Hide variants ↑' : 'Show variants ↓'}
                                                    </a>
                                                </div>
                                            </div>
                                            :
                                            <div className='col-md-2'>
                                                <button className='disc-btn' onClick={() => toggleDiscount(prd.id)}>Add Discount</button>
                                                <a className='link-style' href='#' onClick={() => toggleVariants(prd.id)}>
                                                    {showVariants[prd.id] ? 'Hide variants ↑' : 'Show variants ↓'}
                                                </a>
                                            </div>
                                        }
                                    </div>
                                    {showVariants[prd.id] &&
                                        <SortableContext items={productVariants.map(variant => `variant-${variant.id}-${prd.id}`)} strategy={verticalListSortingStrategy}>
                                            <div className='variant-container'>
                                                {productVariants.map(variant => (
                                                    <SortableProductItem key={`variant-${variant.id}`} id={`variant-${variant.id}-${prd.id}`}>
                                                        <div className='variant-item mt-2' key={variant.id}>
                                                            <span className='me-auto'>{variant.title}</span>
                                                            <button className='btn btn-sm ms-2' onClick={() => removeVariant(variant.id)}>×</button>
                                                        </div>
                                                    </SortableProductItem>
                                                ))}
                                            </div>
                                        </SortableContext>
                                    }
                                </div>
                            </SortableProductItem>
                        )
                    })}
                </SortableContext>)
                :
                (<div>
                    <div className='container d-flex mt-4'>
                        <div className='col-md-3 ms-2'>
                            <input
                                className='input-box'
                                type='text'
                                placeholder={"Select Product"}
                                onClick={handleOpenModal}
                            />
                        </div>
                        <div className='d-flex col-md-6'>
                            <button className='disc-btn'>Add Discount</button>
                        </div>
                    </div>
                </div>)
            }
            <Model
                show={isModalOpen}
                onHide={handleCloseModal}
            >
                <Model.Header closeButton>
                    <Model.Title>
                        Select Products
                    </Model.Title>
                </Model.Header>
                <Model.Body>
                    <ProductPicker onAddProducts={handleAddproducts} selectedProduct={selectedProductsIds} selectedVariantIds={selectedVariantIds} />
                </Model.Body>
            </Model>
        </DndContext>
    )
}

export default ProductList
