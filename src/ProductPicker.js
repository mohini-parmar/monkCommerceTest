import React, { useEffect, useState } from 'react'
import axios from "axios"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'
import Button from 'react-bootstrap/esm/Button'

const ProductPicker = ({onAddProducts, selectedProduct, selectedVariantIds }) => {

    const [data, setData] = useState([])
    const [selectedProducts, setSelectedProducts] = useState(selectedProduct || [])
    const [selectedVariants, setSelectedVariants] = useState(selectedVariantIds ||[])
    const [searchPrd , setSearchPrd] = useState('')

    const products = [
        {
            "id": 77,
            "title": "Fog Linen Chambray Towel - Beige Stripe",
            "variants": [
                {
                    "id": 1,
                    "product_id": 77,
                    "title": "XS / Silver",
                    "price": "49"
                },
                {
                    "id": 2,
                    "product_id": 77,
                    "title": "S / Silver",
                    "price": "49"
                },
                {
                    "id": 3,
                    "product_id": 77,
                    "title": "M / Silver",
                    "price": "49"
                }
            ],
            "image": {
                "id": 266,
                "product_id": 77,
                "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1"
            }
        },
        {
            "id": 80,
            "title": "Orbit Terrarium",
            "variants": [
                {
                    "id": 64,
                    "product_id": 80,
                    "title": "Large / Black",
                    "price": "109"
                }
            ],
            "image": {
                "id": 272,
                "product_id": 80,
                "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1"
            }
        }
    ];

    const getProducts = async () => {
        try {
            const res = await axios.get("https://cors-anywhere.herokuapp.com/http://stageapi.monkcommerce.app/task/products/search", {
                headers: {
                    'x-api-key': "72njgfa948d9aS7gs5",
                    'Access-Control-Allow-Headers': '*'
                },
                params: {
                    search: "Hat",
                    page: 2,
                    limit: 1
                }
            });
            console.log(res.data)
            setData(res.data)
        } catch (e) {
            console.log(e)
        }
    };

    const setProductdata = () => {
        setData(products)
    };

    const handleAddProduct = () =>{
        onAddProducts(selectedProducts , selectedVariants , products)
    }

    const handleInputChange = (e) => {
        setSearchPrd(e.target.value || '');
    }

    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes((searchPrd || '').toLowerCase())
    );

    const toggleProduct = (pid) => {
        setSelectedProducts((prev) => prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid])

        //when parent isselected all the variant are selected
        const varientData = products.filter((p) => p.id === pid)
        const isSelected = selectedProducts.includes(pid);

        for (let i = 0; i < varientData.length; i++) {
            varientData[i].variants.map((variant) => {
                if (!isSelected) {
                    setSelectedVariants((prev) => [...new Set([...prev, variant.id])]);
                } else {
                    setSelectedVariants((prev) => prev.filter((id) => id !== variant.id))
                }
            })
        }
    }

    const toggleVarient = (vid, pid) => {
        setSelectedVariants((prev) => {
            const newSelectedVarients = prev.includes(vid)
                ? prev.filter((id) => id !== vid)
                : [...prev, vid];

            // get all the variant of the product and check if any is selected
            const productVariants = products.find((product) => product.id === pid).variants;
            const isAnyVariantSelected = productVariants.some((variant) =>
                newSelectedVarients.includes(variant.id)
            );

            // if any product is selected add it in the state or visa versa
            if (!isAnyVariantSelected) {
                setSelectedProducts((prevSelectedProduct) =>
                    prevSelectedProduct.filter((id) => id !== pid)
                );
            } else {
                setSelectedProducts((prevSelectedProduct) =>
                    !prevSelectedProduct.includes(pid) ? [...prevSelectedProduct, pid] : prevSelectedProduct
                );
            }

            return newSelectedVarients;
        })
    }

    useEffect(() => {
        // getProducts()
        setProductdata()
    }, [])

    useEffect(() => {
        setSelectedProducts(selectedProduct);
    }, [selectedProduct]);

    useEffect(() => {
        setSelectedVariants(selectedVariantIds);
    }, [selectedVariantIds]);

    return (
        <>
            <div className='container d-flex'>
                <div className='col-md-12'>
                    <input className="searchBar" type='text' placeholder='Search Products' value={searchPrd} onChange={handleInputChange}></input>
                </div>
            </div>
            <div className='container d-flex mt-3'>
                <div className='w-100'>
                    {
                        (searchPrd ? filteredProducts : products).map((product) => {
                            return (
                                <div key={product.id}>
                                    <ListGroup className='mt-1'>
                                        <ListGroupItem>
                                            <div className='d-flex'>
                                                <div className='col-md-1'>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={() => toggleProduct(product.id)}
                                                    />
                                                </div>
                                                <div className='col-md-1'>
                                                    <img src={product.image.src} height={"25px"} width={"25px"} />
                                                </div>
                                                <div className='col-md-10'>
                                                    <span>{product.title}</span>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                        {product.variants.map((variant) => {
                                            return (
                                                <ListGroupItem key={variant.id}>
                                                    <div className='constainer d-flex'>
                                                        <div className='col-md-2'></div>
                                                        <div className='col-md-1'>
                                                            <input
                                                                type='checkbox'
                                                                checked={selectedVariants.includes(variant.id)}
                                                                onChange={() => toggleVarient(variant.id, product.id)}
                                                            />
                                                        </div>
                                                        <div className='col-md-3'>
                                                            <span>{variant.title}</span>
                                                        </div>
                                                        <div className='col-md-3'>
                                                            <span>{"99 available"}</span>
                                                        </div>
                                                        <div className='col-md-3'>
                                                            <span>{variant.price}</span>
                                                        </div>
                                                    </div>
                                                </ListGroupItem>
                                            )
                                        })}
                                    </ListGroup>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='d-flex mt-3 px-3 py-1'>
                <div className='col-md-6'>
                    <label>{selectedProducts.length} product selected</label>
                </div>
                <div className='col-md-6 d-flex justify-content-end'>
                    <Button variant='outline-secondary' onClick={()=>onAddProducts([], [] , products)}>Cancel</Button>
                    <Button className='ms-2' variant='success' onClick={()=>handleAddProduct()}>Add</Button>
                </div>
            </div>
        </>
    )
}

export default ProductPicker
