// console.log("hello wrold i am backend")

require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5501"
}))
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


const storeItems = new Map([
    [1, { priceInRuppe: 10000, name: 'Magic book by Parth' }],
    [2, { priceInRuppe: 20000, name: 'Imagine a World where u are God by Parth' }],
])

app.post("/create-checkout-session",async (req,res)=>{
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types :['card'],
            mode:'payment',
            line_items: req.body.items.map(item =>{
                const storeItem = storeItems.get(item.id);
                return {
                    price_data:{
                        currency:'usd',
                        product_data:{
                            name:storeItem.name
                        },
                        unit_amount:storeItem.priceInRuppe
                    },
                    quantity:item.quantity
                }
            }),
            success_url:`${process.env.CLIENT_URL}/success.html`,
            cancel_url:`${process.env.CLIENT_URL}/cancel.html`,
        })


        res.json({url:session.url})

    }catch(e){
        res.send(500).json({error:e.message});  
    }

})

app.listen(5000, () => {
    console.log(`API IS RUNNING ON PORT NO:5000`);
})