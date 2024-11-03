
import axios from 'axios';
import Cookies from 'js-cookie';

export const orderService = {
  async getOrders() {
    const response = await fetch(`${BASE_URL}/protected/orders`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return {
      ...data,
      orders: data.orders.map(order => ({
        id: order.order_id,
        date: new Date(order.order_date).toLocaleDateString(),
        total: order.total_amount,
        status: order.status,
        items: order.items.map(item => ({
          id: item.product_id,
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price,
          image: item.thumbnail_url || '/api/placeholder/100/100',
          review: {
            rating: item.rating || 0,
            comment: item.review_comment || ''
          }
        })),
        timeline: this.getOrderTimeline(order.status)
      }))
    };
  },

  getOrderTimeline(status) {
    const statuses = ['pending', 'packed', 'shipped', 'delivered'];
    return statuses.map((stat, index) => ({
      status: stat,
      completed: index <= statuses.indexOf(status),
      date: index <= statuses.indexOf(status) ? new Date().toISOString() : null
    }));
  },

  async createOrder(orderData) {
    const response = await fetch(`${BASE_URL}/protected/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return response.json();
  },

  async submitReview(reviewData) {
    const response = await fetch(`${BASE_URL}/protected/product/review`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit review');
    }
    return response.json();
  }
};