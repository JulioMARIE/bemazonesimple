import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('a123456'),
      isAdmin: true,
    },
    {
      name: 'Basir',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Nike Slim-pant',
      slug: 'nike-slim-pant',
      category: 'Shirts',
      image:
        'https://raw.githubusercontent.com/basir/amazona/4cbcb37631b276d74388289142bcddad2a5e312a/frontend/public/images/p1.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      name: 'Adidas Fit-pant',
      slug: 'adidas-fit-pant adidas',
      category: 'Shirts',
      image:
        'https://raw.githubusercontent.com/basir/amazona/4cbcb37631b276d74388289142bcddad2a5e312a/frontend/public/images/p2.jpg',
      price: 250,
      countInStock: 20,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      name: 'Nike Slim-pant2',
      slug: 'nike-slim-pant2',
      category: 'Shirts',
      image:
        'https://raw.githubusercontent.com/basir/amazona/4cbcb37631b276d74388289142bcddad2a5e312a/frontend/public/images/p3.jpg',
      price: 25,
      countInStock: 15,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 14,
      description: 'high quality shirt',
    },
    {
      name: 'Adidas Fit-pant puma',
      slug: 'adidas-fit-pant puma',
      category: 'Shirts',
      image:
        'https://raw.githubusercontent.com/basir/amazona/4cbcb37631b276d74388289142bcddad2a5e312a/frontend/public/images/p4.jpg',
      price: 65,
      countInStock: 0,
      brand: 'Puma',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
  ],
};
export default data;
