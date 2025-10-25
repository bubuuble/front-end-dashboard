// src/app/products/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Input, Button, Pagination, Spin, message, Modal, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDebounce } from './useDebounce';
import ProductForm from './ProductForm';

interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_category?: string;
  product_image?: string;
}

const { Search } = Input;

const ProductsPage = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async (page: number, limit: number, search: string) => {
    setLoading(true);
    try {
      const params = { page: page.toString(), limit: limit.toString(), search };
      const response = await axios.get('/api/products', { params });
      
      setProducts(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
      });
    } catch (error) {
      message.error('Gagal mengambil data produk.');
      console.error('Fetch Products Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchProducts(pagination.page, pagination.limit, debouncedSearchTerm);
  }, [debouncedSearchTerm, pagination.page, pagination.limit, fetchProducts]);

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, page, limit: pageSize }));
  };
  

  
  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record); 
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
  
        await axios.put('/api/product', { ...values, product_id: editingProduct.product_id });
        message.success('Produk berhasil diperbarui.');
      } else {
   
        await axios.post('/api/product', values);
        message.success('Produk baru berhasil dibuat.');
      }
      setIsModalVisible(false);
      fetchProducts(pagination.page, pagination.limit, debouncedSearchTerm); 
    } catch (error) {
      message.error('Terjadi kesalahan saat menyimpan produk.');
      console.error('Submit Form Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (productId: string) => {
    Modal.confirm({
      title: 'Anda yakin ingin menghapus produk ini?',
      content: 'Tindakan ini tidak dapat dibatalkan.',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          await axios.delete(`/api/product?product_id=${productId}`);
          message.success('Produk berhasil dihapus.');
          fetchProducts(pagination.page, pagination.limit, debouncedSearchTerm);
        } catch (error) {
          message.error('Gagal menghapus produk.');
          console.error('Delete Product Error:', error);
        }
      },
    });
  };

  const columns: ColumnsType<Product> = [
    { title: 'Product Title', dataIndex: 'product_title' },
    { 
      title: 'Price', 
      dataIndex: 'product_price',
      render: (price) => `$${Number(price).toFixed(2)}` 
    },
    { title: 'Category', dataIndex: 'product_category' },
    { title: 'Description', dataIndex: 'product_description', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">

          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.product_id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manajemen Produk</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Search
          placeholder="Cari berdasarkan judul, kategori, deskripsi..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 400 }}
          allowClear
        />

        <Button type="primary" onClick={handleCreate}>
          Buat Produk
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="product_id"
          pagination={false}
        />
      </Spin>
      <Pagination
        style={{ marginTop: '1rem', textAlign: 'right' }}
        current={pagination.page}
        pageSize={pagination.limit}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
      />

      <ProductForm
        visible={isModalVisible}
        loading={isSubmitting}
        initialData={editingProduct}
        onOk={handleFormSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProductsPage;