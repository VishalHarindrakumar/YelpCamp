const mongoose=require('mongoose');
const Campground=require('../models/Campground')
const cities=require('./cities.js')
const {descriptors,places}=require('./seedHelpers.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');


const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error: "));
db.once("open",()=>{
    console.log('Database Connected');
});


const sample=(array)=>array[Math.floor(Math.random()*array.length)];




const seedDB=async()=>{
    await Campground.deleteMany({});

    for(let i=0;i<50;i++){
        const randomCityIdx=Math.floor(Math.random()*1000);
        const camp=new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomCityIdx].city},${cities[randomCityIdx].state}`

        })
        await camp.save();

    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})