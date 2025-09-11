import './Pop.css';  // Ensure this path is correct based on your project structure
import PropTypes from 'prop-types';
import { useState } from 'react';

const Pop_up = ({ products = [] }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    setNotification(`${product.name} added to cart`);
    setTimeout(() => setNotification(''), 2000); // Clear notification after 2 seconds
  };

  // Remove product from cart by index
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, product) => total + product.price, 0);

  return (
    <div>
      <button onClick={toggleCart} className="toggle-cart-button">
        {isCartOpen ? 'Close Cart' : 'Open Cart'}
      </button>

      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li 
              key={product.id} 
              onClick={() => addToCart(product)} 
              className="cursor-pointer"
            >
              {product.name} - ${product.price}
            </li>
          ))
        ) : (
          <li>No products available</li>
        )}
      </ul>

      {/* Notification for adding to cart */}
      {notification && <div className="notification">{notification}</div>}

      {/* Cart Popup */}
      {isCartOpen && (
        <div 
          className="cart-popup" 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: '-150px',  // Shift the popup to the left side
            backgroundColor: 'white', 
            border: '1px solid #ccc', 
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            width: '200px',
            color: 'black'  // Change text color to black
          }}
        >
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((product, index) => (
                <li key={index}>
                  {product.name} - ${product.price}
                  <button 
                    onClick={() => removeFromCart(index)} 
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <h3>Total: ₹{totalPrice}</h3>
          <button className="fake-checkout-button">Checkout</button>
        </div>
      )}
    </div>
  );
};
Pop_up.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ),
};

export default Pop_up;
