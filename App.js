import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import {
  ShoppingCart, X, Plus, Minus, CheckCircle, Package, Info, Mail, ArrowLeft, Send,
  Star, Search, ChevronLeft, ChevronRight, Eye, Grid, Globe
} from 'lucide-react';

// 1. Create a Context for the Cart State
const CartContext = createContext();

// Helper to get or set local storage items
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

// Mock Product Data
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
    id: 'tshirt-002',
    name: 'Night Rider Graphic',
    description: 'Limited edition graphic print on premium black, oversized fit. Features a reflective "Night Rider" print across the back and a subtle brand tag on the sleeve. This oversized fit tee is a statement piece for the nocturnal urban explorer.',
    price: 49.99,
    imageUrl: 'https://placehold.co/400x400/151515/E0E0E0?text=XApparel+Black',
    additionalImageUrls: [
      'https://placehold.co/400x400/202020/CCCCCC?text=Night+Back',
      'https://placehold.co/400x400/2B2B2B/DDDDDD?text=Night+Detail'
    ],
    availableSizes: ['M', 'L', 'XL'],
    availableColors: ['Black', 'Dark Navy'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [
      { id: 'r3', rating: 5, author: 'GraffitiKid', comment: 'The graphic is insane! Super comfy too.' },
      { id: 'r4', rating: 5, author: 'NightOwl', comment: 'Reflective print is a game changer at night. Must-have!' }
    ],
    averageRating: 5.0,
    ratingCount: 2
  },
  {
    id: 'tshirt-003',
    name: 'Asphalt Stripe',
    description: 'Subtle grey stripes on a dark base. Crafted from a unique blend of cotton and recycled polyester, offering both comfort and sustainability. Minimalist design with a focus on clean lines and a modern silhouette, perfect for layering.',
    price: 38.50,
    imageUrl: 'https://placehold.co/400x400/202020/E0E0E0?text=XApparel+Stripe',
    additionalImageUrls: [
      'https://placehold.co/400x400/303030/BBBBBB?text=Stripe+Side',
      'https://placehold.co/400x400/404040/AAAAAA?text=Stripe+Texture'
    ],
    availableSizes: ['S', 'M', 'L'],
    availableColors: ['Charcoal', 'Ash Grey'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [
      { id: 'r5', rating: 4, author: 'MinimalistFan', comment: 'Clean design, good fit. Solid everyday tee.' }
    ],
    averageRating: 4.0,
    ratingCount: 1
  },
  {
    id: 'tshirt-004',
    name: 'District Bloom Tee',
    description: 'Vibrant, street-art inspired design on a soft-washed tee. Each piece features a unique abstract "bloom" graphic on the chest, a nod to urban art culture. Pre-shrunk cotton for a consistent fit, wash after wash.',
    price: 42.99,
    imageUrl: 'https://placehold.co/400x400/400080/E0E0E0?text=XApparel+Print',
    additionalImageUrls: [
      'https://placehold.co/400x400/501090/B0B0B0?text=Bloom+Detail',
      'https://placehold.co/400x400/6020A0/C0C0C0?text=Bloom+Side'
    ],
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    availableColors: ['Deep Purple', 'Forest Green'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [],
    averageRating: 0,
    ratingCount: 0
  },
  {
    id: 'tshirt-005',
    name: 'Concrete Camo Crew',
    description: 'Heavyweight crewneck tee with a subtle concrete camouflage print. Durable and designed for longevity, this piece is ideal for those who value both style and resilience. Ribbed collar and cuffs for a secure fit.',
    price: 45.00,
    imageUrl: 'https://placehold.co/400x400/454545/A0A0A0?text=XApparel+Camo',
    additionalImageUrls: [
      'https://placehold.co/400x400/555555/BBBBBB?text=Camo+Texture',
      'https://placehold.co/400x400/656565/CCCCCC?text=Camo+Angles'
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Grey Camo', 'Green Camo'],
    isNewDrop: false,
    releaseDate: null,
    reviews: [],
    averageRating: 0,
    ratingCount: 0
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

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// --- New Components & Enhancements ---

// Star Rating Display Component
const StarRating = ({ rating, count, onRatingClick = null }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={16} fill="currentColor" stroke="currentColor" className={onRatingClick ? 'cursor-pointer' : ''} onClick={() => onRatingClick && onRatingClick(i + 1)} />
      ))}
      {halfStar && <Star key="half" size={16} fill="currentColor" stroke="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }} className={onRatingClick ? 'cursor-pointer' : ''} onClick={() => onRatingClick && onRatingClick(fullStars + 1)} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={16} fill="none" stroke="currentColor" className={onRatingClick ? 'cursor-pointer' : ''} onClick={() => onRatingClick && onRatingClick(fullStars + (halfStar ? 1 : 0) + i + 1)} />
      ))}
      {count !== undefined && (
        <span className="text-gray-400 text-sm ml-2">({count} reviews)</span>
      )}
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ onNavigate }) => {
  return (
    <section className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-white overflow-hidden rounded-2xl shadow-2xl mx-4 mb-16 animate-fade-in-scale"
      style={{ backgroundImage: `url('https://placehold.co/1400x600/101010/E0E0E0?text=XApparel+New+Drop+Hero')` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black to-zinc-900 opacity-80"></div>
      <div className="relative z-10 text-center p-4">
        <h2 className="text-6xl md:text-8xl font-extrabold uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl animate-slide-in-up-1">
          Unleash Your <span className="text-teal-400">X</span> Edge
        </h2>
        <p className="text-xl md:text-3xl font-medium text-gray-300 drop-shadow animate-slide-in-up-2">
          Exclusive Drops. Unmatched Style.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-10 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-5 rounded-full text-xl font-bold uppercase tracking-wide hover:from-teal-600 hover:to-cyan-700 transition duration-300 transform hover:scale-105 shadow-xl animate-slide-in-up-3 custom-button-glow"
        >
          Shop New Arrivals
        </button>
      </div>
    </section>
  );
};

// Countdown Timer Component for New Drops
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
      <span key={interval} className="flex flex-col items-center">
        <span className="text-4xl md:text-6xl font-extrabold text-teal-400">{String(timeLeft[interval]).padStart(2, '0')}</span>
        <span className="text-base md:text-xl text-gray-400 uppercase">{interval}</span>
      </span>
    );
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl p-8 md:p-12 text-center mb-16 mx-4 border border-gray-700 animate-fade-in">
      <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-8 uppercase tracking-tighter">Next Drop In:</h3>
      {timerComponents.length ? (
        <div className="flex justify-center items-center space-x-6 md:space-x-12">
          {timerComponents}
        </div>
      ) : (
        <p className="text-2xl text-teal-400 font-bold">The Drop Has Landed!</p>
      )}
      <p className="text-gray-400 text-base mt-6">Sign up for early access below!</p>
    </div>
  );
};

// Newsletter Signup Component
const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'idle', 'submitting', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      console.log('Newsletter signup email for XApparel:', email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl p-8 md:p-12 text-center mt-16 mb-16 mx-4 border border-gray-700 animate-fade-in">
      <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-8 uppercase tracking-tighter">Stay Ahead of the Drop</h3>
      <p className="text-gray-400 text-xl mb-10">Get exclusive early access and updates from XApparel straight to your inbox.</p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center items-center space-y-5 md:space-y-0 md:space-x-6 max-w-xl mx-auto">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full md:flex-grow py-4 px-6 bg-gray-800 text-gray-100 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-lg"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 custom-button-glow"
        >
          {status === 'submitting' ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Send size={24} />
              <span>Subscribe Now</span>
            </>
          )}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-teal-400 mt-6 text-base font-semibold">Thanks for subscribing!</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 mt-6 text-base font-semibold">Something went wrong. Please try again.</p>
      )}
    </div>
  );
};

// Recently Viewed Products Component
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
    <div className="container mx-auto px-4 py-8 mt-16 mb-16 animate-fade-in">
      <h3 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-10 uppercase tracking-tighter">Recently Eyed</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {viewedProducts.slice(0, 4).map(product => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product.id)}
            className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer custom-border-glow animate-fade-in-item"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover object-center"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/555555/999999?text=Img`; }}
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-100 line-clamp-1">{product.name}</h4>
              <span className="text-xl font-bold text-teal-400">{formatCurrency(product.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// 2. Product Card Component
const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useContext(CartContext);

  const isFutureDrop = product.releaseDate && new Date(product.releaseDate) > new Date();

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!isFutureDrop) {
      addToCart({ ...product, selectedSize: product.availableSizes[0] || '', selectedColor: product.availableColors[0] || '' });
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer custom-border-glow animate-fade-in-item">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-56 object-cover object-center"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/400x400/555555/999999?text=Image+Error`;
        }}
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-100 mb-2">{product.name}</h3>
        {product.averageRating > 0 && (
          <div className="mb-3">
            <StarRating rating={product.averageRating} count={product.ratingCount} />
          </div>
        )}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-6">
          <span className="text-3xl font-extrabold text-teal-400">{formatCurrency(product.price)}</span>
          {isFutureDrop ? (
            <span className="text-base font-semibold text-gray-400 bg-gray-700 px-4 py-2 rounded-full">Coming Soon</span>
          ) : (
            <button
              onClick={handleAddClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition duration-300 transform hover:scale-105 shadow-md custom-button-glow"
            >
              <ShoppingCart size={20} />
              <span>Add to Drop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Product List Component (Home Page - now with search and sort controls)
const ProductList = ({ onSelectProduct, searchTerm, sortBy, onSearchChange, onSortChange }) => {
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
    <div className="container mx-auto px-4 py-8">
      <HeroSection onNavigate={onSelectProduct} />

      {nextDropProduct && <CountdownTimer targetDate={nextDropProduct.releaseDate} />}

      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16 uppercase tracking-tighter animate-slide-in-up-1">Our Latest Drops</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 space-y-5 sm:space-y-0 sm:space-x-6 animate-fade-in">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search drops..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-3.5 px-6 pr-12 bg-gray-800 text-gray-100 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-lg"
          />
          <Search size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="w-full sm:w-1/3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full py-3.5 px-5 border border-gray-700 bg-gray-800 rounded-full text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-lg"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))
        ) : (
          <p className="text-gray-400 text-xl text-center col-span-full">No drops found matching your criteria.</p>
        )}
      </div>

      <NewsletterSignup />
      <RecentlyViewed onSelectProduct={onSelectProduct} />
    </div>
  );
};

// 4. Product Detail Component
const ProductDetail = ({ productId, onBackToList }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mainImage, setMainImage] = useState(product?.imageUrl);
  const [reviewFormData, setReviewFormData] = useState({ rating: 0, comment: '', author: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmissionStatus, setReviewSubmissionStatus] = useState(null);

  const productIdRef = useRef(productId);

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
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-gray-100 animate-fade-in">
        <p className="text-xl">Product not found.</p>
        <button
          onClick={onBackToList}
          className="mt-8 bg-gray-700 text-white px-7 py-3.5 rounded-full hover:bg-gray-600 transition duration-300 text-lg flex items-center justify-center mx-auto space-x-2"
        >
          <ArrowLeft size={20} /> <span>Back to Drops</span>
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
      return;
    }
    console.log('New review submitted:', reviewFormData);
    setReviewSubmissionStatus('success');
    setShowReviewForm(false);
    setReviewFormData({ rating: 0, comment: '', author: '' });
    setTimeout(() => setReviewSubmissionStatus(null), 3000);
  };

  const allImages = [product.imageUrl, ...(product.additionalImageUrls || [])];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-gray-100 animate-fade-in">
      <button
        onClick={onBackToList}
        className="flex items-center space-x-2 text-teal-400 hover:text-teal-300 transition duration-300 font-semibold mb-8 text-lg"
      >
        <ArrowLeft size={22} />
        <span>Back to All Drops</span>
      </button>

      <div className="md:flex md:space-x-12">
        <div className="md:w-1/2">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-auto rounded-xl object-cover object-center shadow-lg mb-6 animate-fade-in-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/600x600/555555/999999?text=Image+Error`;
            }}
          />
          {allImages.length > 1 && (
            <div className="flex space-x-3 justify-center">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${mainImage === img ? 'border-teal-400 shadow-md' : 'border-transparent'} hover:border-teal-400 transition-all duration-200 transform hover:scale-105`}
                  onClick={() => setMainImage(img)}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/555555/999999?text=Thumb`; }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex flex-col justify-between">
          <div>
            <h2 className="text-5xl font-extrabold text-white mb-5 uppercase tracking-tighter animate-slide-in-up-1">{product.name}</h2>
            {product.averageRating > 0 && (
              <div className="mb-5">
                <StarRating rating={product.averageRating} count={product.ratingCount} />
              </div>
            )}
            <p className="text-gray-400 text-lg mb-8 leading-relaxed animate-slide-in-up-2">{product.description}</p>
            <span className="text-5xl font-extrabold text-teal-400 mb-8 block animate-slide-in-up-3">{formatCurrency(product.price)}</span>

            {!isFutureDrop ? (
              <>
                <div className="mb-7 animate-slide-in-up-4">
                  <label htmlFor="size-select" className="block text-gray-300 text-base font-bold mb-2">Select Size:</label>
                  <select
                    id="size-select"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="block w-full py-3 px-4 border border-gray-700 bg-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-base"
                  >
                    {product.availableSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-7 animate-slide-in-up-5">
                  <label htmlFor="color-select" className="block text-gray-300 text-base font-bold mb-2">Select Color:</label>
                  <select
                    id="color-select"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="block w-full py-3 px-4 border border-gray-700 bg-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-base"
                  >
                    {product.availableColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {errorMessage && (
                  <p className="text-red-400 text-sm mb-5 animate-fade-in">{errorMessage}</p>
                )}
              </>
            ) : (
              <p className="text-lg text-gray-400 mb-8 animate-fade-in">This item is part of a future drop. Stay tuned for release!</p>
            )}
          </div>
          {!isFutureDrop ? (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-teal-600 hover:to-cyan-700 transition duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wider mt-8 custom-button-glow animate-bounce-in"
            >
              <ShoppingCart size={28} />
              <span>Add to Drop</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-center space-x-3 bg-gray-700 text-gray-400 px-10 py-5 rounded-full text-xl font-bold opacity-50 cursor-not-allowed uppercase tracking-wider mt-8"
            >
              <ShoppingCart size={28} />
              <span>Drop Coming Soon</span>
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-10 border-t border-gray-700 animate-fade-in">
        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-8 uppercase tracking-tighter">Customer Reviews ({product.ratingCount})</h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-8">
            {product.reviews.map(review => (
              <div key={review.id} className="bg-gray-700 p-7 rounded-lg shadow-md custom-border-glow-subtle animate-fade-in-item">
                <StarRating rating={review.rating} />
                <p className="text-gray-200 mt-3 text-base">{review.comment}</p>
                <p className="text-gray-400 text-sm mt-4">- {review.author}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">No reviews yet. Be the first to share your thoughts!</p>
        )}

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mt-10 bg-gray-700 text-white px-7 py-3.5 rounded-full hover:bg-gray-600 transition duration-300 flex items-center space-x-2 text-lg"
        >
          {showReviewForm ? 'Cancel Review' : 'Write a Review'}
        </button>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mt-8 bg-gray-700 p-7 rounded-lg shadow-md space-y-5 animate-fade-in">
            <h4 className="text-2xl font-semibold text-white">Share Your Experience</h4>
            <div>
              <label className="block text-gray-300 text-base font-bold mb-3">Your Rating:</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={`cursor-pointer ${star <= reviewFormData.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                    onClick={() => handleReviewRatingChange(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="review-comment" className="block text-gray-300 text-base font-bold mb-3">Your Comment:</label>
              <textarea
                id="review-comment"
                name="comment"
                value={reviewFormData.comment}
                onChange={handleReviewChange}
                required
                rows="5"
                className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-800 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
              ></textarea>
            </div>
            <div>
              <label htmlFor="review-author" className="block text-gray-300 text-base font-bold mb-3">Your Name/Alias:</label>
              <input
                type="text"
                id="review-author"
                name="author"
                value={reviewFormData.author}
                onChange={handleReviewChange}
                required
                className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-800 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
              />
            </div>
            {reviewSubmissionStatus === 'success' && <p className="text-teal-400 text-center font-semibold mt-4">Review submitted successfully!</p>}
            {reviewSubmissionStatus && reviewSubmissionStatus.startsWith('error') && <p className="text-red-400 text-center font-semibold mt-4">{reviewSubmissionStatus}</p>}
            <button
              type="submit"
              className="bg-teal-500 text-white px-7 py-3.5 rounded-full hover:bg-teal-600 transition duration-300 text-lg custom-button-glow"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


// 5. Cart Item Component
const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  const itemKey = `${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}`;

  const handleRemove = () => {
    removeFromCart(itemKey);
  };

  const handleUpdateQuantity = (newQty) => {
    updateQuantity(itemKey, newQty);
  };

  return (
    <div className="flex items-center bg-gray-800 rounded-xl shadow-md p-5 mb-4 border border-gray-700 animate-fade-in-item">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-24 h-24 object-cover object-center rounded-lg mr-5"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/80x80/555555/999999?text=Img`;
        }}
      />
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-100">{item.name}</h3>
        {item.selectedSize && <p className="text-gray-400 text-sm">Size: {item.selectedSize}</p>}
        {item.selectedColor && <p className="text-gray-400 text-sm">Color: {item.selectedColor}</p>}
        <p className="text-gray-400 text-base">{formatCurrency(item.price)} each</p>
      </div>
      <div className="flex items-center space-x-3 mr-5">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="bg-gray-700 text-gray-200 p-2.5 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-110"
        >
          <Minus size={18} />
        </button>
        <span className="font-bold text-xl text-white">{item.quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          className="bg-gray-700 text-gray-200 p-2.5 rounded-full hover:bg-gray-600 transition duration-200 transform hover:scale-110"
        >
          <Plus size={18} />
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="text-red-400 hover:text-red-300 p-2.5 rounded-full hover:bg-gray-700 transition duration-200 transform hover:scale-110"
        aria-label="Remove item from cart"
      >
        <X size={22} />
      </button>
    </div>
  );
};

// 6. Cart Component
const Cart = ({ onProceedToCheckout, onBackToList }) => {
  const { cartItems, getTotalPrice } = useContext(CartContext);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 uppercase tracking-tighter">Your Drop List</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">Your drop list is empty. Time to collect some heat from XApparel!</p>
      ) : (
        <>
          <div className="mb-8">
            {cartItems.map((item, index) => {
              const uniqueCartItemKey = `${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}`;
              return <CartItem key={uniqueCartItemKey} item={item} />;
            })}
          </div>
          <div className="flex justify-between items-center bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-inner border border-gray-700 animate-fade-in-item">
            <span className="text-3xl font-bold text-gray-100">Total:</span>
            <span className="text-4xl font-extrabold text-teal-400">{formatCurrency(getTotalPrice())}</span>
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={onProceedToCheckout}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-teal-600 hover:to-cyan-700 transition duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wider custom-button-glow"
            >
              Secure the Drop
            </button>
          </div>
        </>
      )}
      <div className="mt-10 text-center">
        <button
          onClick={onBackToList}
          className="flex items-center justify-center mx-auto space-x-2 text-gray-400 hover:text-gray-300 transition duration-300 font-semibold text-lg"
        >
          <ArrowLeft size={22} />
          <span>Continue Browsing Drops</span>
        </button>
      </div>
    </div>
  );
};

// 7. Checkout Component
const Checkout = ({ onBackToCart, onOrderPlaced }) => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

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
        throw new Error("Your cart is empty. Please add items before checking out.");
      }
      console.log('Order submitted for XApparel:', { formData, cartItems, total: getTotalPrice() });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      clearCart();
      onOrderPlaced();
    } catch (error) {
      setSubmissionError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 uppercase tracking-tighter">Finalize Your Drop</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-300 text-base font-bold mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-300 text-base font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-gray-300 text-base font-bold mb-2">Street Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-gray-300 text-base font-bold mb-2">City / District</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
            />
          </div>
          <div>
            <label htmlFor="zip" className="block text-gray-300 text-base font-bold mb-2">Zip Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
            />
          </div>
        </div>

        {submissionError && (
          <p className="text-red-400 text-center font-semibold mt-4 animate-fade-in">{submissionError}</p>
        )}

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={onBackToCart}
            className="flex items-center space-x-2 text-teal-400 hover:text-teal-300 transition duration-300 font-semibold text-lg"
          >
            <Package size={22} />
            <span>Back to Drop List</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-teal-600 hover:to-cyan-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-wider custom-button-glow"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Securing...
              </span>
            ) : (
              `Pay ${formatCurrency(getTotalPrice())}`
            )}
          </button>
        </div>
      </form>
    </div>
  );a
};

// 8. Order Confirmation Component
const OrderConfirmation = ({ onGoHome }) => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center bg-gray-800 rounded-2xl shadow-xl animate-fade-in border border-gray-700">
      <CheckCircle size={90} className="text-teal-400 mx-auto mb-8 animate-bounce-in-icon" />
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 animate-slide-in-up-1">Drop Secured!</h2>
      <p className="text-gray-400 text-lg mb-10 animate-slide-in-up-2">Thanks for choosing XApparel. Your order is confirmed and on its way to you.</p>
      <button
        onClick={onGoHome}
        className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition duration-300 shadow-md uppercase tracking-wider custom-button-glow animate-slide-in-up-3"
      >
        Explore More Drops
      </button>
    </div>
  );
};

// 9. About Us Component
const AboutUs = ({ onGoHome }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-gray-100 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 uppercase tracking-tighter">About XApparel</h2>
      <p className="text-gray-400 text-lg mb-6 leading-relaxed">
        XApparel was born from the concrete jungle, forged in the spirit of raw individuality and authentic self-expression. We're not just selling clothes; we're crafting a lifestyle. Each piece in our collection is meticulously designed to reflect the pulse of the streets – bold, uncompromising, and always pushing boundaries.
      </p>
      <p className="text-gray-400 text-lg mb-6 leading-relaxed">
        We believe in quality that lasts, fabrics that feel good, and designs that speak volumes without saying a word. From the darkest alleyways to the brightest city lights, XApparel is your uniform for navigating the urban landscape. Join the crew. Wear your story.
      </p>
      <div className="mt-10 text-center">
        <button
          onClick={onGoHome}
          className="flex items-center justify-center mx-auto space-x-2 text-gray-400 hover:text-gray-300 transition duration-300 font-semibold text-lg"
        >
          <ArrowLeft size={22} />
          <span>Back to Drops</span>
        </button>
      </div>
    </div>
  );
};

// 10. Contact Us Component
const ContactUs = ({ onGoHome }) => {
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSubmissionStatus, setContactSubmissionStatus] = useState(null);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsContactSubmitting(true);
    setContactSubmissionStatus(null);

    try {
      console.log('Contact form submitted for XApparel:', contactFormData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setContactSubmissionStatus('success');
      setContactFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setContactSubmissionStatus('error');
    } finally {
      setIsContactSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 uppercase tracking-tighter">Connect with the XApparel Crew</h2>
      <form onSubmit={handleContactSubmit} className="space-y-6">
        <div>
          <label htmlFor="contact-name" className="block text-gray-300 text-base font-bold mb-2">Name</label>
          <input
            type="text"
            id="contact-name"
            name="name"
            value={contactFormData.name}
            onChange={handleContactChange}
            required
            className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-gray-300 text-base font-bold mb-2">Email</label>
          <input
            type="email"
            id="contact-email"
            name="email"
            value={contactFormData.email}
            onChange={handleContactChange}
            required
            className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-gray-300 text-base font-bold mb-2">Message</label>
          <textarea
            id="contact-message"
            name="message"
            value={contactFormData.message}
            onChange={handleContactChange}
            required
            rows="5"
            className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3.5 px-4 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          ></textarea>
        </div>

        {contactSubmissionStatus === 'success' && (
          <p className="text-teal-400 text-center font-semibold mt-4">Thanks for reaching out! We'll get back to you soon.</p>
        )}
        {contactSubmissionStatus === 'error' && (
          <p className="text-red-400 text-center font-semibold mt-4">Failed to send message. Please try again later.</p>
        )}

        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={isContactSubmitting}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center mx-auto custom-button-glow"
          >
            {isContactSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              `Send Message`
            )}
          </button>
        </div>
      </form>
      <div className="mt-10 text-center">
        <button
          onClick={onGoHome}
          className="flex items-center justify-center mx-auto space-x-2 text-gray-400 hover:text-gray-300 transition duration-300 font-semibold text-lg"
        >
          <ArrowLeft size={22} />
          <span>Back to Drops</span>
        </button>
      </div>
    </div>
  );
};

// 11. Lookbook / Style Gallery Component
const Lookbook = ({ onGoHome }) => {
  // Mock Lookbook images - could reference XApparel style
  const lookbookImages = [
    { src: 'https://placehold.co/800x600/2A2A2A/BBBBBB?text=XApparel+StreetStyle+1', alt: 'XApparel Street Style 1' },
    { src: 'https://placehold.co/800x600/3A3A3A/CCCCCC?text=XApparel+StreetStyle+2', alt: 'XApparel Street Style 2' },
    { src: 'https://placehold.co/800x600/4A4A4A/DDDDDD?text=XApparel+StreetStyle+3', alt: 'XApparel Street Style 3' },
    { src: 'https://placehold.co/800x600/5A5A5A/EEEEEE?text=XApparel+StreetStyle+4', alt: 'XApparel Street Style 4' },
    { src: 'https://placehold.co/800x600/6A6A6A/FFFFFF?text=XApparel+StreetStyle+5', alt: 'XApparel Street Style 5' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-gray-100 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 uppercase tracking-tighter">XApparel Lookbook</h2>
      <p className="text-gray-400 text-lg mb-12 text-center">
        Dive into the XApparel aesthetic. See how our drops hit the streets.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lookbookImages.map((image, index) => (
          <div key={index} className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 custom-border-glow animate-fade-in-item">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-72 object-cover object-center"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x600/555555/999999?text=Image+Error`; }}
            />
            <div className="p-5 bg-gray-700 text-gray-200 text-center font-semibold text-lg">
              {image.alt}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <button
          onClick={onGoHome}
          className="flex items-center justify-center mx-auto space-x-2 text-gray-400 hover:text-gray-300 transition duration-300 font-semibold text-lg"
        >
          <ArrowLeft size={22} />
          <span>Back to Drops</span>
        </button>
      </div>
    </div>
  );
};


// 12. Header Component
const Header = ({ onNavigate, cartItemCount, searchTerm, onSearchChange }) => {
  return (
    <header className="bg-gradient-to-r from-zinc-950 to-black text-white shadow-2xl py-6 px-6 border-b border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-5 md:space-y-0">
        <h1
          className="text-6xl font-extrabold tracking-tighter uppercase cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 transition duration-300 text-center animate-pulse-once"
          onClick={() => onNavigate('home')}
        >
          XApparel
        </h1>
        <div className="relative w-full md:w-auto md:flex-grow max-w-md mx-auto md:mx-0 animate-fade-in">
          <input
            type="text"
            placeholder="Search all drops..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-3 px-5 pr-12 bg-gray-800 text-gray-100 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-base"
          />
          <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <nav className="flex items-center space-x-5 sm:space-x-7 mt-5 md:mt-0 animate-fade-in">
          <button
            onClick={() => onNavigate('lookbook')}
            className="text-gray-300 hover:text-teal-400 transition duration-300 text-lg font-semibold flex items-center space-x-2 transform hover:scale-105"
          >
            <Grid size={22} />
            <span>Lookbook</span>
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="text-gray-300 hover:text-teal-400 transition duration-300 text-lg font-semibold flex items-center space-x-2 transform hover:scale-105"
          >
            <Info size={22} />
            <span>About</span>
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="text-gray-300 hover:text-teal-400 transition duration-300 text-lg font-semibold flex items-center space-x-2 transform hover:scale-105"
          >
            <Mail size={22} />
            <span>Contact</span>
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-3.5 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-300 transform hover:scale-105 shadow-lg"
            aria-label={`View cart with ${cartItemCount} items`}
          >
            <ShoppingCart size={30} className="text-gray-100"/>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center -mt-2.5 -mr-2.5 animate-bounce-in-cart-count">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};


// 13. Main App Component
function App() {
  const [cartItems, setCartItems] = useState(getLocalStorageItem('cartItems', []));
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Persist cart items to local storage
  useEffect(() => {
    setLocalStorageItem('cartItems', cartItems);
  }, [cartItems]);

  // Cart Management Functions
  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const itemKey = `${productToAdd.id}-${productToAdd.selectedSize || 'nosize'}-${productToAdd.selectedColor || 'nocolor'}`;

      const existingItemIndex = prevItems.findIndex((item) =>
        `${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}` === itemKey
      );

      if (existingItemIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (uniqueItemKeyToRemove) => {
    setCartItems((prevItems) => prevItems.filter(item => {
      const currentItemKey = `${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}`;
      return currentItemKey !== uniqueItemKeyToRemove;
    }));
  };

  const updateQuantity = (uniqueItemKeyToUpdate, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        const currentItemKey = `${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}`;
        return currentItemKey === uniqueItemKeyToUpdate ? { ...item, quantity: newQuantity } : item;
      });
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in the cart for header display
  const totalCartItems = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Function to navigate between pages
  const handleNavigate = (page, productId = null) => {
    setCurrentPage(page);
    setSelectedProductId(productId);
    if (page !== 'home') {
      setSearchTerm('');
      setSortBy('default');
    }
  };

  // Handle successful order placement
  const handleOrderPlaced = () => {
    setCurrentPage('orderConfirmation');
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, clearCart }}
    >
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black font-sans text-gray-100">
        <style>
          {`
          /* Base Fade-in animation for overall sections */
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }

          /* Fade-in with scale for Hero Section */
          @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 1s ease-out forwards;
          }

          /* Bounce-in animation for confirmation icon */
          @keyframes bounce-in-icon {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            75% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          .animate-bounce-in-icon {
            animation: bounce-in-icon 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }

          /* Bounce-in for the Add to Drop button */
          @keyframes bounce-in {
            0% { transform: translateY(20px); opacity: 0; }
            60% { transform: translateY(-5px); opacity: 1; }
            80% { transform: translateY(2px); }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-bounce-in {
            animation: bounce-in 0.7s ease-out forwards;
            animation-delay: 0.5s; /* Delay to appear after other elements */
            opacity: 0; /* Start hidden */
          }

          /* Slide-in from bottom with staggered delays */
          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in-up-1 { animation: slide-in-up 0.6s ease-out forwards; animation-delay: 0.2s; opacity: 0; }
          .animate-slide-in-up-2 { animation: slide-in-up 0.6s ease-out forwards; animation-delay: 0.4s; opacity: 0; }
          .animate-slide-in-up-3 { animation: slide-in-up 0.6s ease-out forwards; animation-delay: 0.6s; opacity: 0; }
          .animate-slide-in-up-4 { animation: slide-in-up 0.6s ease-out forwards; animation-delay: 0.8s; opacity: 0; }
          .animate-slide-in-up-5 { animation: slide-in-up 0.6s ease-out forwards; animation-delay: 1.0s; opacity: 0; }

          /* Fade-in for individual items in lists (e.g., cart, reviews, lookbook) */
          @keyframes fade-in-item {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-item {
            animation: fade-in-item 0.5s ease-out forwards;
            opacity: 0; /* Start hidden */
          }
          .animate-fade-in-item:nth-child(1) { animation-delay: 0.1s; }
          .animate-fade-in-item:nth-child(2) { animation-delay: 0.2s; }
          .animate-fade-in-item:nth-child(3) { animation-delay: 0.3s; }
          .animate-fade-in-item:nth-child(4) { animation-delay: 0.4s; }
          .animate-fade-in-item:nth-child(5) { animation-delay: 0.5s; }
          .animate-fade-in-item:nth-child(6) { animation-delay: 0.6s; }
          .animate-fade-in-item:nth-child(7) { animation-delay: 0.7s; }
          .animate-fade-in-item:nth-child(8) { animation-delay: 0.8s; }
          .animate-fade-in-item:nth-child(9) { animation-delay: 0.9s; }
          .animate-fade-in-item:nth-child(10) { animation-delay: 1.0s; }


          /* Pulse animation for the XApparel logo (one time on load) */
          @keyframes pulse-once {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
          .animate-pulse-once {
            animation: pulse-once 1s ease-out 1;
          }

          /* Specific bounce-in for cart count */
          @keyframes bounce-in-cart-count {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-8px);
            }
            60% {
              transform: translateY(-4px);
            }
          }
          .animate-bounce-in-cart-count {
            animation: bounce-in-cart-count 0.8s ease-out;
          }

          /* Custom button glow on hover */
          .custom-button-glow {
            position: relative;
            overflow: hidden;
          }

          .custom-button-glow::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(0, 255, 255, 0.4); /* Cyan glow */
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: width 0.4s ease-out, height 0.4s ease-out, opacity 0.4s ease-out;
            z-index: 0;
          }

          .custom-button-glow:hover::before {
            width: 200%;
            height: 200%;
            opacity: 1;
          }

          .custom-button-glow span, .custom-button-glow svg {
            position: relative;
            z-index: 1;
          }

          /* Custom border glow for cards */
          .custom-border-glow {
            border: 2px solid transparent;
            position: relative;
            background-clip: padding-box;
          }

          .custom-border-glow::before {
            content: '';
            position: absolute;
            inset: 0;
            border: 2px solid transparent;
            border-radius: 1rem; /* Adjust based on parent rounded-xl */
            background: linear-gradient(45deg, #00BCD4, #00E5FF, #00BCD4); /* Teal to Cyan */
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.3s ease-out;
          }

          .custom-border-glow:hover::before {
            opacity: 1;
          }

          /* Subtle border glow for review items etc. */
          .custom-border-glow-subtle {
              border: 1px solid transparent;
              position: relative;
              background-clip: padding-box;
          }
          .custom-border-glow-subtle::before {
              content: '';
              position: absolute;
              inset: 0;
              border: 1px solid transparent;
              border-radius: 0.5rem; /* Adjust based on parent rounded-lg */
              background: linear-gradient(45deg, rgba(0, 188, 212, 0.5), rgba(0, 229, 255, 0.5)); /* Teal to Cyan with transparency */
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              opacity: 0;
              transition: opacity 0.3s ease-out;
          }
          .custom-border-glow-subtle:hover::before {
              opacity: 1;
          }

          /* Image fade-in */
          @keyframes fade-in-image {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-image {
            animation: fade-in-image 0.6s ease-out forwards;
          }

          /* Custom scrollbar for dark theme */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #222;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #666;
          }
          /* Style for select dropdown arrow */
          select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3 3 3-3m0 6l-3-3-3 3' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3c/path%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1.5em 1.5em;
          }
          `}
        </style>

        <Header
          onNavigate={handleNavigate}
          cartItemCount={totalCartItems}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <main className="py-12">
          {(() => {
            switch (currentPage) {
              case 'home':
                return (
                  <ProductList
                    onSelectProduct={(id) => handleNavigate('productDetail', id)}
                    searchTerm={searchTerm}
                    sortBy={sortBy}
                    onSearchChange={setSearchTerm}
                    onSortChange={setSortBy}
                  />
                );
              case 'productDetail':
                return <ProductDetail productId={selectedProductId} onBackToList={() => handleNavigate('home')} />;
              case 'cart':
                return <Cart onProceedToCheckout={() => handleNavigate('checkout')} onBackToList={() => handleNavigate('home')} />;
              case 'checkout':
                return <Checkout onBackToCart={() => handleNavigate('cart')} onOrderPlaced={handleOrderPlaced} />;
              case 'orderConfirmation':
                return <OrderConfirmation onGoHome={() => handleNavigate('home')} />;
              case 'about':
                return <AboutUs onGoHome={() => handleNavigate('home')} />;
              case 'contact':
                return <ContactUs onGoHome={() => handleNavigate('home')} />;
              case 'lookbook':
                return <Lookbook onGoHome={() => handleNavigate('home')} />;
              default:
                return (
                  <ProductList
                    onSelectProduct={(id) => handleNavigate('productDetail', id)}
                    searchTerm={searchTerm}
                    sortBy={sortBy}
                    onSearchChange={setSearchTerm}
                    onSortChange={setSortBy}
                  />
                );
            }
          })()}
        </main>

        <footer className="bg-gradient-to-r from-black to-zinc-950 text-gray-400 text-center py-8 mt-20 shadow-inner border-t border-gray-800">
          <p className="text-base">&copy; {new Date().getFullYear()} XApparel. All rights reserved.</p>
          <div className="flex justify-center space-x-7 mt-5">
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300 transform hover:scale-110" aria-label="XApparel on Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300 transform hover:scale-110" aria-label="XApparel on X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300 transform hover:scale-110" aria-label="XApparel on TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tiktok"><path d="M9 12H4.77a2 2 0 0 0-1.74 1l.01 0a2 2 0 0 0-.25 2.18L8 22V12a4 4 0 0 1 4-4h2.44a2 2 0 0 1 2 2.45v3.52l3.47 2a2 2 0 0 0 2.53-2.19V6.37a5 5 0 0 0-4.7-5.32c-.05 0-.17 0-.24.03l-.01.01A5 5 0 0 0 12.72 1.9h-.13A5 5 0 0 0 9 6.27V12Z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300 transform hover:scale-110" aria-label="XApparel on Global Network">
              <Globe size={26} /> {/* Added a globe icon for general presence */}
            </a>
          </div>
        </footer>
      </div>
    </CartContext.Provider>
  );
}

export default App;
