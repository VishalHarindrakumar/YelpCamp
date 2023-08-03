const mongoose=require('mongoose');
const Campground=require('../models/Campground')
const cities=require('./cities.js')
const {descriptors,places}=require('./seedHelpers.js');
const axios = require('axios');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');


const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error: "));
db.once("open",()=>{
    console.log('Database Connected');
});


const sample=(array)=>array[Math.floor(Math.random()*array.length)];


async function randomImg(){

    try{
        const res=await axios.get('https://api.unsplash.com/photos/random?client_id=LYRxtjU3QmaVmSMmJx6R2L9k9B39EHQTimqTTvB_9xY&collections=483251')
        return res.data.urls.small;
    }
    catch(err){
        console.log(err);
    }
}



const seedDB=async()=>{
    await Campground.deleteMany({});

    for(let i=0;i<20;i++){
        const randomCityIdx=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomCityIdx].city},${cities[randomCityIdx].state}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, quod iure saepe itaque, maxime tempora fugiat cumque ipsa cupiditate mollitia magnam eos! Cumque dolorum sint, quod deserunt inventore officiis non.',
            price:price,
            img: await randomImg()
        })
        await camp.save();

    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})