import {PeerRPCClient} from 'grenache-nodejs-http';
import Link from "grenache-nodejs-link";
import { servers } from "./config.js";

const hostname = servers?.[0].bn?.[0].split(':')[0]
if(!hostname) {
    console.log('Cannot find servers setup')
    process.exit(1)
}
const grapeUrl = 'http://' + hostname + ':' + servers?.[Math.floor(Math.random() * servers.length)].aph
const link = new Link({grape: grapeUrl})
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

function submitOrder(order) {
    return new Promise((resolve, reject) => {
        peer.request(
            'add_order', 
            { type: 'add', order }, 
            { timeout: 10000 }, 
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }
    );
}

(async () => {
    await submitOrder({ type: 'buy', price: 50, quantity: 10 });
    await submitOrder({ type: 'sell', price: 50, quantity: 5 });
})();

