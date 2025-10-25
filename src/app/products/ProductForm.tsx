// src/app/products/ProductForm.tsx
'use client';

import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';

// Definisikan tipe untuk data produk yang bisa diedit
interface ProductData {
  product_id?: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_category?: string;
  product_image?: string;
}

// Definisikan tipe untuk props komponen ini
interface ProductFormProps {
  visible: boolean;
  loading: boolean;
  initialData: Partial<ProductData> | null; 
  onOk: (values: ProductData) => void;
  onCancel: () => void;
}

const { TextArea } = Input;

const ProductForm: React.FC<ProductFormProps> = ({ visible, loading, initialData, onOk, onCancel }) => {
  const [form] = Form.useForm();
  
  const isEditing = !!initialData;
  const modalTitle = isEditing ? "Edit Produk" : "Buat Produk Baru";


  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk({ ...initialData, ...values }); 
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      visible={visible}
      title={modalTitle}
      okText="Simpan"
      cancelText="Batal"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose 
    >
      <Form form={form} layout="vertical" name="product_form">
        <Form.Item
          name="product_title"
          label="Product Title"
          rules={[{ required: true, message: 'Mohon masukkan judul produk!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="product_price"
          label="Price"
          rules={[{ required: true, message: 'Mohon masukkan harga produk!' }]}
        >
          <InputNumber style={{ width: '100%' }} prefix="$" />
        </Form.Item>

        <Form.Item
          name="product_category"
          label="Category"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="product_description"
          label="Description"
        >
          <TextArea rows={4} />
        </Form.Item>
        
        <Form.Item
          name="product_image"
          label="Image URL (Optional)"
        >
          <Input placeholder="https://example.com/image.png" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;