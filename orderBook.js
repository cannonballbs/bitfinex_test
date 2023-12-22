class Order {
  constructor(id, type, price, quantity) {
    this.id = id;
    this.type = type; // "buy" or "sell"
    this.price = price;
    this.quantity = quantity;
  }
}

class OrderBook {
  constructor() {
    this.buyOrders = [];  // Buy orders sorted in descending order by price
    this.sellOrders = []; // Sell orders sorted in ascending order by price
  }

  // Add an order to the order book
  addOrder(order) {
    if (order.type === "buy") {
      this.buyOrders.push(order);
      this.buyOrders.sort((a, b) => b.price - a.price);
    } else if (order.type === "sell") {
      this.sellOrders.push(order);
      this.sellOrders.sort((a, b) => a.price - b.price);
    }
    this.matchOrders();
  }

  // Match buy and sell orders
  matchOrders() {
    while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
      const bestBuyOrder = this.buyOrders[0];
      const bestSellOrder = this.sellOrders[0];

      if (bestBuyOrder.price >= bestSellOrder.price) {
        const matchedQuantity = Math.min(bestBuyOrder.quantity, bestSellOrder.quantity);

        console.log(`Matched order ${bestBuyOrder.id} with ${bestSellOrder.id} for ${matchedQuantity} shares at ${bestSellOrder.price}`);

        // Update order quantities
        bestBuyOrder.quantity -= matchedQuantity;
        bestSellOrder.quantity -= matchedQuantity;

        // Remove fully filled orders
        if (bestBuyOrder.quantity === 0) {
          this.buyOrders.shift();
        }
        if (bestSellOrder.quantity === 0) {
          this.sellOrders.shift();
        }
      } else {
        // No more matching orders
        break;
      }
    }
  }
}

export default OrderBook;