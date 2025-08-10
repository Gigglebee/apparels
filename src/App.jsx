import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import {
  ShoppingCart, X, Plus, Minus, CheckCircle, Package, Info, Mail, ArrowLeft, Send,
  Star, Search, ChevronLeft, ChevronRight, Eye, Grid, Globe
} from 'lucide-react';
import './App.css'; // Import the new CSS file

// --- Helper Functions ---
const getLocalStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// --- Mock Product Data ---
const PRODUCTS = [
  {
    id: 'tshirt-001',
    name: 'X-Core Tee',
    description: 'A robust tee built for the streets. Heavyweight 300 GSM cotton, oversized fit, raw-edge hemline, and reinforced stitching. Designed for maximum comfort and durability in any urban environment.',
    price: 34.99,
    imageUrl: 'https://placehold.co/400x400/2A2A2A/E0E0E0?text=XApparel+White',
    additionalImageUrls: [
      'https://placehold.co/400x400/3A3A3A/DDDDDD?text=XApparel+Back',
      'https://placehold.co/400x400/4A4A4A/EEEEEE?text=XApparel+Detail'
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['White', 'Black', 'Grey'],
    isNewDrop: true,
    releaseDate: '2025-08-15T10:00:00Z',
    reviews: [
      { id: 'r1', rating: 5, author: 'StreetStyler', comment: 'Absolutely love the fit and fabric! My new favorite tee.' },
      { id: 'r2', rating: 4, author: 'UrbanExplorer', comment: 'Great quality, a bit heavy for summer but perfect otherwise.' }
    ],
    averageRating: 4.5,
    ratingCount: 2
  },
  {
    id: 'hoodie-002',
    name: 'Ghost Hoodie',
    description: 'The Ghost Hoodie features a minimalist design with subtle reflective elements. Made from a soft, brushed fleece blend, it offers warmth without the bulk. Perfect for low-light city exploration.',
    price: 89.99,
    imageUrl: 'https://placehold.co/400x400/101010/EFEFEF?text=Ghost+Hoodie',
    additionalImageUrls: [
      'https://placehold.co/400x400/1A1A1A/E0E0E0?text=Ghost+Back',
      'https://placehold.co/400x400/2A2A2A/DDDDDD?text=Ghost+Detail'
    ],
    availableSizes: ['M', 'L', 'XL'],
    availableColors: ['Black', 'Grey'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [
      { id: 'r3', rating: 5, author: 'NightRider', comment: 'Super comfortable and the reflective details are a nice touch.' }
    ],
    averageRating: 5,
    ratingCount: 1
  },
  {
    id: 'tshirt-003',
    name: 'Cyberpunk Tee',
    description: 'A vibrant tee with a digital-glitch print on the back. Constructed from a lightweight, breathable cotton blend, it\'s designed for comfort and style in the futuristic urban landscape.',
    price: 49.99,
    imageUrl: 'https://placehold.co/400x400/000000/00FFFF?text=Cyberpunk+Tee',
    additionalImageUrls: [
      'https://placehold.co/400x400/101010/FF00FF?text=Cyberpunk+Back',
      'https://placehold.co/400x400/202020/FFFF00?text=Cyberpunk+Detail'
    ],
    availableSizes: ['S', 'M', 'L'],
    availableColors: ['Black', 'Navy'],
    isNewDrop: true,
    releaseDate: '2025-08-20T12:00:00Z',
    reviews: [],
    averageRating: 0,
    ratingCount: 0
  },
  {
    id: 'hoodie-004',
    name: 'Stealth Hoodie',
    description: 'A discreet, tactical hoodie with hidden pockets and a reinforced hood. The fabric is water-resistant and windproof, making it ideal for navigating unpredictable city weather. Features a subtle tonal logo.',
    price: 99.99,
    imageUrl: 'https://placehold.co/400x400/1A1A1A/AAAAAA?text=Stealth+Hoodie',
    additionalImageUrls: [],
    availableSizes: ['L', 'XL', 'XXL'],
    availableColors: ['Black'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [
      { id: 'r4', rating: 5, author: 'UrbanTactician', comment: 'Incredible quality. The hidden pockets are genius.' },
      { id: 'r5', rating: 5, author: 'CityCommuter', comment: 'Keeps me warm and dry on my commute. Highly recommend.' }
    ],
    averageRating: 5,
    ratingCount: 2
  },
  {
    id: 'tshirt-005',
    name: 'Raw Edge Oversized Tee',
    description: 'An oversized tee with a raw-cut hem and cuffs. Made from a breathable single-jersey cotton, this tee embodies a relaxed and rebellious aesthetic. A perfect layering piece.',
    price: 38.00,
    imageUrl: 'https://placehold.co/400x400/333333/999999?text=Raw+Edge',
    additionalImageUrls: [
      'https://placehold.co/400x400/444444/AAAAAA?text=Raw+Edge+Detail'
    ],
    availableSizes: ['M', 'L', 'XL'],
    availableColors: ['White', 'Black'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [
      { id: 'r8', rating: 4, author: 'RelaxedFitFan', comment: 'Great fit, very comfortable. The raw edges are a cool detail.' }
    ],
    averageRating: 4,
    ratingCount: 1
  },
  {
    id: 'tshirt-006',
    name: 'Neon Grid Oversized',
    description: 'Bold oversized tee featuring an electric neon grid pattern. Made from breathable, lightweight cotton, it’s perfect for making a statement without sacrificing comfort. Drop shoulder design for an extra relaxed fit.',
    price: 47.50,
    imageUrl: 'https://placehold.co/400x400/050505/00FFFF?text=XApparel+Neon',
    additionalImageUrls: [
      'https://placehold.co/400x400/101010/00EFEF?text=Neon+Back',
      'https://placehold.co/400x400/1B1B1B/00DFDF?text=Neon+Side'
    ],
    availableSizes: ['M', 'L', 'XL'],
    availableColors: ['Black', 'Navy'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [
      { id: 'r6', rating: 5, author: 'CyberPunker', comment: 'This tee glows! Perfect for night outs.' },
      { id: 'r7', rating: 4, author: 'UrbanArtist', comment: 'Eye-catching design, a bit brighter than expected but cool.' }
    ],
    averageRating: 4.5,
    ratingCount: 2
  }
];

// --- Cart Context ---
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getLocalStorageItem('cartItems', []));

  useEffect(() => {
    setLocalStorageItem('cartItems', cartItems);
  }, [cartItems]);

  const addToCart = (product) => {
    const itemKey = `${product.id}-${product.selectedSize || 'nosize'}-${product.selectedColor || 'nocolor'}`;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => `${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}` === itemKey
      );
      if (existingItem) {
        return prevItems.map(item =>
          item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, key: itemKey }];
      }
    });
  };

  const removeFromCart = (itemKeyToRemove) => {
    setCartItems(prevItems => prevItems.filter(item => item.key !== itemKeyToRemove));
  };

  const updateQuantity = (itemKeyToUpdate, newQty) => {
    if (newQty < 1) {
      removeFromCart(itemKeyToUpdate);
    } else {
      setCartItems(prevItems => prevItems.map(item =>
        item.key === itemKeyToUpdate ? { ...item, quantity: newQty } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

const useToast = () => {
  const showToast = ({ title, description, status, duration = 3000 }) => {
    const toastId = `toast-${Date.now()}`;
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      console.warn("Toast container not found. Create a div with id 'toast-container' in your root HTML.");
      return;
    }

    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    toastElement.className = `toast`;
    let bgColor = 'toast-bg-default';
    if (status === 'success') bgColor = 'toast-bg-success';
    if (status === 'error') bgColor = 'toast-bg-error';
    if (status === 'warning') bgColor = 'toast-bg-warning';

    toastElement.innerHTML = `
      <div class="${bgColor} toast-content">
        ${status === 'success' ? `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` : ''}
        ${status === 'error' ? `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 1112 1a9 9 0 017 7z" /></svg>` : ''}
        ${status === 'warning' ? `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" /></svg>` : ''}
        <div>
          <h3 class="toast-title">${title}</h3>
          <p class="toast-description">${description}</p>
        </div>
      </div>
    `;

    toastContainer.appendChild(toastElement);

    setTimeout(() => {
      toastElement.classList.remove('translate-y-full', 'opacity-0');
      toastElement.classList.add('translate-y-0', 'opacity-100');
    }, 100);

    setTimeout(() => {
      toastElement.classList.remove('translate-y-0', 'opacity-100');
      toastElement.classList.add('translate-y-full', 'opacity-0');
      toastElement.addEventListener('transitionend', () => {
        toastElement.remove();
      });
    }, duration);
  };
  return { toast: showToast };
};


const StarRating = ({ rating, count, onRatingClick = null }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating-container">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="star-icon star-filled" onClick={() => onRatingClick && onRatingClick(i + 1)} style={{ cursor: onRatingClick ? 'pointer' : 'default' }} />
      ))}
      {halfStar && <Star key="half" className="star-icon star-filled star-half" style={{ clipPath: 'inset(0 50% 0 0)', cursor: onRatingClick ? 'pointer' : 'default' }} onClick={() => onRatingClick && onRatingClick(fullStars + 1)} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="star-icon star-empty" onClick={() => onRatingClick && onRatingClick(fullStars + (halfStar ? 1 : 0) + i + 1)} style={{ cursor: onRatingClick ? 'pointer' : 'default' }} />
      ))}
      {count !== undefined && (
        <span className="review-count">({count} reviews)</span>
      )}
    </div>
  );
};

const Header = ({ onNavigate }) => {
  const { cartCount } = useCart();
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-left">
          <button onClick={() => onNavigate('home')} className="logo">
            X<span className="logo-highlight">Apparel</span>
          </button>
          <ul className="nav-links">
            <li><button onClick={() => onNavigate('home')} className="nav-link">New Drops</button></li>
            <li><button onClick={() => onNavigate('home')} className="nav-link">Tees</button></li>
            <li><button onClick={() => onNavigate('home')} className="nav-link">Hoodies</button></li>
            <li><button onClick={() => onNavigate('home')} className="nav-link">Accessories</button></li>
          </ul>
        </div>
        <div className="header-right">
          <button
            aria-label="My Orders"
            onClick={() => onNavigate('home')}
            className="header-icon-button"
          >
            <Package className="icon-large" />
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className="cart-button"
          >
            <ShoppingCart className="icon-large" />
            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

const HeroSection = ({ onNavigate }) => {
  return (
    <section className="hero-section animate-fade-in-scale">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title animate-slide-in-up-1">
          Unleash Your <span className="logo-highlight">X</span> Edge
        </h1>
        <p className="hero-subtitle animate-slide-in-up-2">
          Exclusive Drops. Unmatched Style.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="hero-button custom-button-glow animate-slide-in-up-3"
        >
          Shop New Arrivals
        </button>
      </div>
    </section>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="countdown-time-unit">
        <span className="countdown-number">{String(timeLeft[interval]).padStart(2, '0')}</span>
        <span className="countdown-label">{interval}</span>
      </div>
    );
  });

  return (
    <div className="countdown-timer-container animate-fade-in">
      <h2 className="countdown-title">Next Drop In:</h2>
      {timerComponents.length ? (
        <div className="countdown-timer-content">
          {timerComponents}
        </div>
      ) : (
        <p className="countdown-completed">The Drop Has Landed!</p>
      )}
      <p className="countdown-subtitle">Sign up for early access below!</p>
    </div>
  );
};

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      console.log('Newsletter signup email for XApparel:', email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setEmail('');
      toast({
        title: "Subscribed!",
        description: "You're now on the list for exclusive drops.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      setStatus('error');
      toast({
        title: "Subscription failed.",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div className="newsletter-container animate-fade-in">
      <h2 className="newsletter-title">Stay Ahead of the Drop</h2>
      <p className="newsletter-subtitle">Get exclusive early access and updates from XApparel straight to your inbox.</p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="newsletter-input"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="newsletter-button custom-button-glow"
        >
          {status === 'submitting' ? (
            <>
              <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="loading-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="loading-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Mail className="icon-large" />
              <span>Subscribe Now</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const RecentlyViewed = ({ onSelectProduct }) => {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    const ids = getLocalStorageItem('recentlyViewed', []);
    const uniqueProducts = [];
    const seenIds = new Set();
    ids.forEach(id => {
      if (!seenIds.has(id)) {
        const product = PRODUCTS.find(p => p.id === id);
        if (product) {
          uniqueProducts.push(product);
          seenIds.add(id);
        }
      }
    });
    setViewedProducts(uniqueProducts);
  }, []);

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="recently-viewed-section animate-fade-in">
      <h2 className="section-title">Recently Eyed</h2>
      <div className="product-grid">
        {viewedProducts.slice(0, 4).map(product => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product.id)}
            className="product-card recently-viewed-card animate-fade-in-item custom-border-glow"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-card-image"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/555555/999999?text=Img`; }}
            />
            <div className="product-card-info">
              <p className="product-card-name">{product.name}</p>
              <p className="product-card-price">{formatCurrency(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const isFutureDrop = product.releaseDate && new Date(product.releaseDate) > new Date();

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!isFutureDrop) {
      addToCart({ ...product, selectedSize: product.availableSizes[0] || '', selectedColor: product.availableColors[0] || '' });
      toast({
        title: "Added to Drop List!",
        description: `${product.name} has been added to your cart.`,
        status: "success",
        duration: 2000,
      });
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product.id)}
      className="product-card animate-fade-in-item custom-border-glow"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-card-image-lg"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/400x400/555555/999999?text=Image+Error`;
        }}
      />
      <div className="product-card-info-lg">
        <p className="product-card-name-lg">{product.name}</p>
        {product.averageRating > 0 && (
          <div className="product-card-rating">
            <StarRating rating={product.averageRating} count={product.ratingCount} />
          </div>
        )}
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-actions">
          <p className="product-card-price-lg">{formatCurrency(product.price)}</p>
          {isFutureDrop ? (
            <span className="product-status-tag">Coming Soon</span>
          ) : (
            <button
              onClick={handleAddClick}
              className="add-to-cart-button custom-button-glow"
            >
              <ShoppingCart className="icon-small" />
              <span>Add to Drop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductList = ({ onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    } else if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'rating') {
      return b.averageRating - a.averageRating;
    }
    return 0;
  });

  const nextDropProduct = PRODUCTS.find(p => p.releaseDate && new Date(p.releaseDate) > new Date());

  return (
    <div className="product-list-container">
      <HeroSection onNavigate={onSelectProduct} />
      {nextDropProduct && <CountdownTimer targetDate={nextDropProduct.releaseDate} />}
      <h2 className="section-title animate-slide-in-up-1">Our Latest Drops</h2>
      <div className="product-list-controls animate-fade-in">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search drops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Search className="search-icon" />
        </div>
        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
      <div className="product-grid">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))
        ) : (
          <p className="no-products-message">No drops found matching your criteria.</p>
        )}
      </div>
      <NewsletterSignup />
      <RecentlyViewed onSelectProduct={onSelectProduct} />
    </div>
  );
};

const ProductDetail = ({ productId, onBackToList }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mainImage, setMainImage] = useState(product?.imageUrl);
  const [reviewFormData, setReviewFormData] = useState({ rating: 0, comment: '', author: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmissionStatus, setReviewSubmissionStatus] = useState(null);
  const { toast } = useToast();

  const productIdRef = useRef(productId);
  useEffect(() => {
    productIdRef.current = productId;
  }, [productId]);

  useEffect(() => {
    if (productIdRef.current) {
      const ids = getLocalStorageItem('recentlyViewed', []);
      const newIds = [productIdRef.current, ...ids.filter(id => id !== productIdRef.current)].slice(0, 5);
      setLocalStorageItem('recentlyViewed', newIds);
    }
  }, [productIdRef.current]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes[0] || '');
      setSelectedColor(product.availableColors[0] || '');
      setMainImage(product.imageUrl);
      setReviewSubmissionStatus(null);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="product-detail-error-container animate-fade-in">
        <p className="product-detail-error-message">Product not found.</p>
        <button
          onClick={onBackToList}
          className="back-button"
        >
          <ArrowLeft className="icon-large" />
          <span>Back to Drops</span>
        </button>
      </div>
    );
  }

  const isFutureDrop = product.releaseDate && new Date(product.releaseDate) > new Date();

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setErrorMessage('Please select a size and color.');
      return;
    }
    setErrorMessage('');
    addToCart({ ...product, selectedSize, selectedColor });
    toast({
      title: "Added to Drop List!",
      description: `${product.name} (${selectedSize}, ${selectedColor}) has been added to your cart.`,
      status: "success",
      duration: 2000,
    });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewRatingChange = (rating) => {
    setReviewFormData((prev) => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewFormData.rating === 0) {
      setReviewSubmissionStatus('error: Please select a rating.');
      toast({
        title: "Review Error",
        description: "Please select a rating.",
        status: "error",
        duration: 3000,
      });
      return;
    }
    console.log('New review submitted:', reviewFormData);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setReviewSubmissionStatus('success');
    setShowReviewForm(false);
    setReviewFormData({ rating: 0, comment: '', author: '' });
    toast({
      title: "Review Submitted!",
      description: "Thanks for sharing your experience.",
      status: "success",
      duration: 3000,
    });
    setTimeout(() => setReviewSubmissionStatus(null), 3000);
  };

  const allImages = [product.imageUrl, ...(product.additionalImageUrls || [])];

  return (
    <div className="product-detail-container animate-fade-in">
      <button
        onClick={onBackToList}
        className="back-link"
      >
        <ArrowLeft className="icon-large" />
        <span>Back to All Drops</span>
      </button>

      <div className="product-detail-content">
        <div className="product-detail-images">
          <img
            src={mainImage}
            alt={product.name}
            className="main-product-image animate-fade-in-image"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x600/555555/999999?text=Image+Error`; }}
          />
          {allImages.length > 1 && (
            <div className="thumbnail-gallery">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`thumbnail-image ${mainImage === img ? 'thumbnail-active' : ''}`}
                  onClick={() => setMainImage(img)}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/555555/999999?text=Thumb`; }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <div>
            <h1 className="product-title animate-slide-in-up-1">{product.name}</h1>
            {product.averageRating > 0 && (
              <div className="product-rating-detail">
                <StarRating rating={product.averageRating} count={product.ratingCount} />
              </div>
            )}
            <p className="product-description">{product.description}</p>
            <p className="product-price">{formatCurrency(product.price)}</p>

            {!isFutureDrop ? (
              <>
                <div className="product-option-group animate-slide-in-up-4">
                  <label htmlFor="size-select" className="product-option-label">Select Size:</label>
                  <select
                    id="size-select"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="product-option-select"
                  >
                    {product.availableSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="product-option-group animate-slide-in-up-5">
                  <label htmlFor="color-select" className="product-option-label">Select Color:</label>
                  <select
                    id="color-select"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="product-option-select"
                  >
                    {product.availableColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {errorMessage && (
                  <p className="product-error-message animate-fade-in">{errorMessage}</p>
                )}
              </>
            ) : (
              <p className="product-status-message animate-fade-in">This item is part of a future drop. Stay tuned for release!</p>
            )}
          </div>
          {!isFutureDrop ? (
            <button
              onClick={handleAddToCart}
              className="add-to-cart-cta-button custom-button-glow animate-bounce-in"
            >
              <ShoppingCart className="icon-large" />
              <span>Add to Drop</span>
            </button>
          ) : (
            <button
              disabled
              className="add-to-cart-cta-button-disabled"
            >
              <ShoppingCart className="icon-large" />
              <span>Drop Coming Soon</span>
            </button>
          )}
        </div>
      </div>

      <div className="review-section animate-fade-in">
        <h2 className="review-title">Customer Reviews ({product.ratingCount})</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="review-list">
            {product.reviews.map(review => (
              <div key={review.id} className="review-item custom-border-glow-subtle animate-fade-in-item">
                <StarRating rating={review.rating} />
                <p className="review-comment">{review.comment}</p>
                <p className="review-author">- {review.author}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews-message">No reviews yet. Be the first to share your thoughts!</p>
        )}

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="write-review-button"
        >
          {showReviewForm ? <X className="icon-large" /> : <Star className="icon-large" />}
          <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
        </button>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="review-form animate-fade-in">
            <h3 className="review-form-title">Share Your Experience</h3>
            <div className="review-form-field">
              <label htmlFor="review-rating" className="review-form-label">Your Rating:</label>
              <div className="review-form-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`star-form-icon ${star <= reviewFormData.rating ? 'star-form-filled' : 'star-form-empty'}`}
                    onClick={() => handleReviewRatingChange(star)}
                  />
                ))}
              </div>
            </div>
            <div className="review-form-field">
              <label htmlFor="review-comment" className="review-form-label">Your Comment:</label>
              <textarea
                id="review-comment"
                name="comment"
                value={reviewFormData.comment}
                onChange={handleReviewChange}
                required
                rows="5"
                className="review-form-textarea"
              ></textarea>
            </div>
            <div className="review-form-field">
              <label htmlFor="review-author" className="review-form-label">Your Name/Alias:</label>
              <input
                type="text"
                id="review-author"
                name="author"
                value={reviewFormData.author}
                onChange={handleReviewChange}
                required
                className="review-form-input"
              />
            </div>
            {reviewSubmissionStatus === 'success' && <p className="review-form-success">Review submitted successfully!</p>}
            {reviewSubmissionStatus && reviewSubmissionStatus.startsWith('error') && <p className="review-form-error">{reviewSubmissionStatus.replace('error: ', '')}</p>}
            <button
              type="submit"
              className="review-form-submit-button custom-button-glow"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleRemove = () => {
    removeFromCart(item.key);
  };

  const handleUpdateQuantity = (newQty) => {
    updateQuantity(item.key, newQty);
  };

  return (
    <div className="cart-item animate-fade-in-item">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="cart-item-image"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/555555/999999?text=Img`; }}
      />
      <div className="cart-item-info">
        <p className="cart-item-name">{item.name}</p>
        {item.selectedSize && <p className="cart-item-details">Size: {item.selectedSize}</p>}
        {item.selectedColor && <p className="cart-item-details">Color: {item.selectedColor}</p>}
        <p className="cart-item-price-each">{formatCurrency(item.price)} each</p>
      </div>
      <div className="cart-item-quantity-controls">
        <button
          aria-label="Decrease quantity"
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="quantity-button"
        >
          <Minus className="icon-small-custom" />
        </button>
        <span className="quantity-count">{item.quantity}</span>
        <button
          aria-label="Increase quantity"
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          className="quantity-button"
        >
          <Plus className="icon-small-custom" />
        </button>
      </div>
      <button
        aria-label="Remove item"
        onClick={handleRemove}
        className="remove-item-button"
      >
        <X className="icon-small-custom" />
      </button>
    </div>
  );
};

const Cart = ({ onProceedToCheckout, onBackToList }) => {
  const { cartItems, getTotalPrice } = useCart();

  return (
    <div className="cart-container animate-fade-in">
      <h2 className="cart-title">Your Drop List</h2>
      {cartItems.length === 0 ? (
        <p className="cart-empty-message">Your drop list is empty. Time to collect some heat from XApparel!</p>
      ) : (
        <>
          <div className="cart-item-list">
            {cartItems.map((item) => (
              <CartItem key={item.key} item={item} />
            ))}
          </div>
          <div className="cart-summary animate-fade-in-item">
            <p className="cart-total-label">Total:</p>
            <p className="cart-total-price">{formatCurrency(getTotalPrice())}</p>
          </div>
          <div className="cart-actions">
            <button
              onClick={onProceedToCheckout}
              className="checkout-button custom-button-glow"
            >
              Secure the Drop
            </button>
          </div>
        </>
      )}
      <div className="cart-continue-Browse">
        <button
          onClick={onBackToList}
          className="back-link"
        >
          <ArrowLeft className="icon-large" />
          <span>Continue Browse Drops</span>
        </button>
      </div>
    </div>
  );
};

const Checkout = ({ onBackToCart, onOrderPlaced }) => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (cartItems.length === 0) {
        setSubmissionError("Your cart is empty. Please add items before checking out.");
        toast({
          title: "Cart Empty",
          description: "Please add items to your cart before checking out.",
          status: "warning",
          duration: 3000,
        });
        return;
      }
      console.log('Order submitted for XApparel:', { formData, cartItems, total: getTotalPrice() });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      clearCart();
      onOrderPlaced();
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      setSubmissionError(error.message || "Failed to place order. Please try again.");
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container animate-fade-in">
      <h2 className="checkout-title">Finalize Your Drop</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-field">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                 className="form-input" />
        </div>
        <div className="form-field">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                 className="form-input" />
        </div>
        <div className="form-field">
          <label htmlFor="address" className="form-label">Street Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required
                 className="form-input" />
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="city" className="form-label">City / District</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required
                   className="form-input" />
          </div>
          <div className="form-field">
            <label htmlFor="zip" className="form-label">Zip Code</label>
            <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required
                   className="form-input" />
          </div>
        </div>

        {submissionError && (
          <p className="checkout-error-message animate-fade-in">{submissionError}</p>
        )}

        <div className="checkout-actions">
          <button
            type="button"
            onClick={onBackToCart}
            className="back-link"
          >
            <ArrowLeft className="icon-large" />
            <span>Back to Drop List</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="checkout-submit-button custom-button-glow"
          >
            {isSubmitting ? (
              <>
                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="loading-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="loading-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Securing...</span>
              </>
            ) : (
              <span>Pay {formatCurrency(getTotalPrice())}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const OrderConfirmation = ({ onGoHome }) => {
  return (
    <div className="confirmation-container animate-fade-in">
      <CheckCircle className="confirmation-icon animate-bounce-in-icon" />
      <h2 className="confirmation-title animate-slide-in-up-1">Drop Secured!</h2>
      <p className="confirmation-message animate-slide-in-up-2">Thanks for choosing XApparel. Your order is confirmed and on its way to you.</p>
      <button
        onClick={onGoHome}
        className="confirmation-button custom-button-glow animate-slide-in-up-3"
      >
        Explore More Drops
      </button>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigateTo = (page, productId = null) => {
    setCurrentPage(page);
    setSelectedProductId(productId);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <ProductList onSelectProduct={(id) => navigateTo('product', id)} />;
      case 'product':
        return <ProductDetail productId={selectedProductId} onBackToList={() => navigateTo('home')} />;
      case 'cart':
        return <Cart onProceedToCheckout={() => navigateTo('checkout')} onBackToList={() => navigateTo('home')} />;
      case 'checkout':
        return <Checkout onBackToCart={() => navigateTo('cart')} onOrderPlaced={() => navigateTo('confirmation')} />;
      case 'confirmation':
        return <OrderConfirmation onGoHome={() => navigateTo('home')} />;
      default:
        return <ProductList onSelectProduct={(id) => navigateTo('product', id)} />;
    }
  };

  return (
    <div className="app-container">
      <CartProvider>
        <Header onNavigate={navigateTo} />
        <main className="app-main">
          {renderPage()}
        </main>
      </CartProvider>
      <footer className="app-footer">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} XApparel. All rights reserved.</p>
        <div className="footer-social-links">
          <a href="#" className="footer-social-link" aria-label="XApparel on Instagram">
            <Globe className="icon-large" />
          </a>
          <a href="#" className="footer-social-link" aria-label="XApparel on X (Twitter)">
            <X className="icon-large" />
          </a>
          <a href="#" className="footer-social-link" aria-label="XApparel on TikTok">
            <Send className="icon-large" />
          </a>
          <a href="#" className="footer-social-link" aria-label="XApparel on Global Network">
            <Grid className="icon-large" />
          </a>
        </div>
      </footer>
      <div id="toast-container"></div>
    </div>
  );
}

export default App;