const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.aliasTopTours = (req, res, next) => {
    this.querySring.limit = '5';
    this.querySring.sort = '-ratingsAverage,price';
    this.querySring.fields='name,price,ratingsAverage,summary,difficulty';
    next();
} 

exports.getAllTours = catchAsync( async (req, res)=>{
    //try{
        // const queryObj = {...req.query};
        // const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // excludedFields.forEach(el=>delete queryObj[el]);
        // // const query = Tour.find(queryObj);

        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // let query = Tour.find(JSON.parse(queryStr));

        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // } else{
        //     query = query.sort('-createdAt');
        // }

        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // }else{
        //     query = query.select('-__v');
        // }

        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;
        // query = query.skip(skip).limit(limit);

        // if(req.query.page){
        //     const numTours = await Tour.countDocuments();
        //     if(skip > numTours) new Error('This page does not exist');
        // }
        
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

        const tours = await features.query;
        res.status(201).json({
            status: 'success',
            results: tours.length,
            data:{
                tours
            }
        })
     //} catch (err){
    //     console.log(err);
    //     res.status(404).json({
    //         status:'fail',
    //         message:err
    //     })
    // }
})

exports.getTour = catchAsync( async (req,res)=>{
    // //try{
        // const tour = await Tour.findById(req.params.id).populate({
        //     path: 'guides',
        //     select: '-__v -passwordChangedAt'
        // });
        const tour = await Tour.findById(req.params.id).populate('reviews')
        if(!tour){
            next(new AppError('No tour found with that id', 404));
        }

        res.status(201).json({
            status: 'success',
            data:{
                tour
            }
        })
    // } catch (err){
    //     res.status(404).json({
    //         status:'fail',
    //         message:err
    //     })
    // }
})

exports.createTour = catchAsync( async (req,res)=>{
    //try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data:{
                tour: newTour
            }
        })
    // } catch (err){ 
    //     console.log(err);
    //     res.status(404).json({
    //         status:'fail',
    //         message:err
    //     })
    // }
})

exports.updateTour = catchAsync( async (req,res)=>{
    //try{
        const tour = await Tour.findByIdAndUpdate(req.param.id, req.body,{
            new: true,
            runValidators: true
        });

        if(!tour){
            next(new AppError('No tour found with that id', 404));
        }

        res.status(201).json({
            status: 'success',
            data:{
                tour
            }
        })
    // } catch (err){
    //     res.status(404).json({
    //         status:'fail',
    //         message:'Invalid data sent !'
    //     })
    // }  
})

exports.deleteTour =catchAsync( async (req,res)=>{
    //try{
        const tour = await Tour.findByIdAndDelete(req.param.id);
        if(!tour){
            next(new AppError('No tour found with that id', 404));
        }
        res.status(200).json({
            status: 'success',
            data:null
        })
    // } catch (err){
    //     res.status(404).json({
    //         status:'fail',
    //         message:'Invalid data sent !'
    //     })
    // }
})

exports.getTourStats =catchAsync( async (req, res) => {
    //try{
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage : {$gte : 4.5} }
            },
            {
                $group:{
                    _id: null,
                    numTours: { $sum: 1},
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ])
        res.status(200).json({
            status: 'success',
            data:stats
        })
    // } catch (err){
    //     console.log(err);
    //     res.status(404).json({
    //         status:'fail',
    //         message:err
    //     })
    // }
})

exports.getMonthlyPlan = catchAsync( async (req, res) => {
    //try{
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
               }
            },
            {
                $group:{
                    _id:{ $month: '$startDates'},
                    numTourStats:{ $sum: 1 },
                    tours: { $push: '$name'}
                }
            },
            {
                $addFields:{ month: '$_id'}
            },
            {
                $project:{ _id: 0 }
            },
            {
                $sort: { numTourStarts: -1}
            },
            {
                $limit: 6
            }
        ])
        res.status(200).json({
            status: 'success',
            data:plan
        })
    // } catch(err) {
    //     console.log(err);
    //     res.status(404).json({
    //         status:'fail',
    //         message:err
    //     })
    // }
})
