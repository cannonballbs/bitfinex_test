import {PeerRPCServer} from 'grenache-nodejs-http';
import Link from 'grenache-nodejs-link';
import OrderBook from './orderBook.js';
import {servers} from './config.js';

servers.forEach(server => {
    const link = new Link({grape: `http://127.0.0.1:${server.aph}`})
    link.start()

    const peer = new PeerRPCServer(link, {timeout: 300000})
    peer.init();

    const orderBook = new OrderBook();

    const port = 1024 + Math.floor(Math.random() * 1000)
    const service = peer.transport('server')
    service.listen(port)

    setInterval(function() {
        link.announce('add_order', service.port, {})
    }, 1000)

    service.on('request', (rid, key, payload, handler) => {
        if (payload && payload.type === 'add') {
            orderBook.addOrder(payload.order)
            orderBook.matchOrders(payload.order)
            handler.reply(null, { success: true })
        } else {
            handler.reply(null, {success: false})
        }
    })

    console.log('server running at ', server.aph);
})