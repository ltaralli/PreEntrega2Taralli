import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import ItemList from '../itemList';
import styles from './itemListContainer.modules.scss';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const ItemListContainer = () => {

  const { categoryid } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try{
      const consultadb = getFirestore();
      const consultaCollection = collection(consultadb, 'products');
      let res;
      if (categoryid) {
        const consultaFiltrada = query(consultaCollection, where ('category', '==', categoryid));
        res = await getDocs(consultaFiltrada);
      } else {
        res = await getDocs(consultaCollection);
      }
      const productosData = res.docs.map(product => ({id: product.id, ...product.data()}));
      setProductos(productosData);
      setLoading(false)
    } catch {
      setProductos(null)
    }
  }

  useEffect(() => {
    fetchData();
  }, [categoryid]);


  if (!productos) {
    return <Navigate to = "/404" />;
  }

  if (loading){
    return <h2>Cargando...</h2>
  }

  return (
    <section className='product'>
      <h2 className='product__title'>Nuestros productos</h2>
        <ItemList productos={productos}/>
    </section>
  )
}

export default ItemListContainer