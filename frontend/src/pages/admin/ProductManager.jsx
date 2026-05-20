import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, PackageSearch } from 'lucide-react';
import api from '../../services/api';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Product Inventory CMS</h2>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="card glass-panel">
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <PackageSearch size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No products in inventory. Start by adding your first product.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>SKU</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Price</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Stock</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{product.sku}</td>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '1rem 0', textTransform: 'capitalize' }}>{product.category}</td>
                  <td style={{ padding: '1rem 0' }}>${product.price?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ color: product.stock < 10 ? 'var(--error)' : 'inherit' }}>
                      {product.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}><Edit2 size={16} /></button>
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductManager;
