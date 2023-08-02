const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const Campground=require('./models/Campground');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');


const db=mongoose.connection;

db.on("error",console.error.bind(console,"connection error: "));
db.once("open",()=>{
    console.log('Database Connected');
});


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate)


app.get('/',(req,res)=>{
    res.render("home")
})

app.get('/campgrounds',async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id',async (req,res)=>{
    const {id}=req.params;
    const foundCamp=await Campground.findById(id);
    res.render('campgrounds/show',{foundCamp});
})

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const {id}=req.params;
    const foundCamp=await Campground.findById(id);
    res.render('campgrounds/edit',{foundCamp});
})

app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params
    const updatedCamp=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${updatedCamp._id}`);
})

app.post('/campgrounds',async (req,res)=>{
    const campData=req.body.campground;
    const addedCamp= new Campground(campData);
    await addedCamp.save();
    res.redirect(`campgrounds/${addedCamp._id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    const deletedCamp=await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000,()=>{
    console.log("Serving on Port 3000");
})