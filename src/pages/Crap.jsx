import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Crap.module.css';
import crapImage from '../assets/crap.svg'

// Mock data for testing
const mockItems = [
  {
    id: '1',
    title: 'Vintage Sofa',
    description: 'Well-loved vintage sofa. Some wear but still comfortable and stylish.',
    image: crapImage,
    status: 'AVAILABLE',
    owner: 'user123'
  },
  {
    id: '2',
    title: 'Coffee Table',
    description: 'Wooden coffee table, minor scratches but sturdy and functional.',
    image: crapImage,
    status: 'AVAILABLE',
    owner: 'user456'
  },
  {
    id: '3',
    title: 'Desk Chair',
    description: 'Ergonomic office chair with adjustable height. Very comfortable.',
    image: crapImage,
    status: 'AVAILABLE',
    owner: 'user123'
  },
  {
    id: '4',
    title: 'Bookshelf',
    description: 'Wooden bookshelf with 5 shelves. Perfect for your book collection.',
    image: crapImage,
    status: 'AVAILABLE',
    owner: 'user789'
  },
  {
    id: '5',
    title: 'Floor Lamp',
    description: 'Standing lamp with adjustable brightness. Modern design.',
    image: crapImage,
    status: 'AVAILABLE',
    owner: 'user456'
  }
];

function Crap() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const keyword = searchParams.get('keyword') || '';
  const distance = searchParams.get('distance') || '10';

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filteredItems = [...mockItems];
      
      // Filter by keyword if provided
      if (keyword) {
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(keyword.toLowerCase()) || 
          item.description.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      
      setItems(filteredItems);
      setLoading(false);
    }, 500); // Simulate loading delay
  }, [keyword, distance]);

  return (
    <div className={styles.crapPage}>
      <h1 className={styles.pageTitle}>Available Items</h1>
      
      <div className={styles.searchSummary}>
        <p>
          Showing results for: {keyword ? `"${keyword}"` : 'All items'} 
          within {distance} km
        </p>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading items...</div>
      ) : items.length > 0 ? (
        <div className={styles.itemsGrid}>
          {items.map(item => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.title} />
              </div>
              <div className={styles.itemContent}>
                <h2 className={styles.itemTitle}>{item.title}</h2>
                <p className={styles.itemDescription}>{item.description}</p>
                <a href={`/crap/${item.id}`} className={styles.viewButton}>
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>No items found matching your search criteria.</p>
          <p>Try adjusting your search terms or increasing the distance.</p>
        </div>
      )}
    </div>
  );
}

export default Crap;