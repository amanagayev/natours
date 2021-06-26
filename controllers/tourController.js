const multer = require('multer');
const sharp = require('sharp');
// const { query } = require('express');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

// upload.single('image'); req.file
// upload.array('image', 5); req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if(!req.files.imageCover || !req.files.images) return next();

    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    // 2) Images
    req.body.images = [];
    
    await Promise.all(req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`);
        req.body.images.push(filename);
    }));

    next();
});

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);
//     if(req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
    
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if(!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }

//     next();
// };

// exports.getAllTours = catchAsync(async (req, res, next) => {
//     // try {
//         // console.log(req.requestTime);
//         // console.log(req.query);

//         // BUILD QUERY
//         // 1A) Filtering
//         // const queryObj = { ...req.query };
//         // const excludeFields = ['page', 'sort', 'limit', 'fields'];
//         // excludeFields.forEach(el => delete queryObj[el]);

//         // // 1B) Advanced Filtering
//         // let queryStr = JSON.stringify(queryObj);
//         // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//         // // console.log(JSON.parse(queryStr));
        
//         // // { difficulty: 'easy', duration: { $gte: 5 } }
//         // // { difficulty: 'easy', duration: { gte: '5' } }
        
//         // let query = Tour.find(JSON.parse(queryStr));
        
//         // 2) Sorting
//         // if(req.query.sort) {
//         //     const sortBy = req.query.sort.split(',').join(' ');
//         //     // console.log(sortBy);
//         //     query = query.sort(sortBy);
//         //     // sort('price ratingsAverage')
//         // } else {
//         //     query = query.sort('-ratingsAverage');
//         // }

//         // 3) Field Limiting
//         // if(req.query.fields) {
//         //     const fields = req.query.fields.split(',').join(' ');
//         //     query = query.select(fields);
//         // } else {
//         //     query = query.select('-__v');
//         // }

//         // 4) Pagination
//         // const page = req.query.page * 1 || 1;
//         // const limit = req.query.limit * 1 || 100;
//         // const skip = (page - 1 ) * limit;
//         // // page=2&limit=10, 1-10, page 1; 11-20, page 2; 21-30, page 3;
//         // query = query.skip(skip).limit(limit);

//         // if(req.query.page) {
//         //     const numTours = await Tour.countDocuments();
//         //     if(skip >= numTours || skip < 0) throw new Error ('This page is not exist!');
//         // }

//         // EXECUTE QUERY
//         const features = new APIFeatures(Tour.find(), req.query)
//             .filter()
//             .sort()
//             .limitFields()
//             .paginate();
//         const tours = await features.query.populate('reviews');
//         // query.find().sort().select().skip().limit()

//         // below does not work!
//         // tours.map(tour => (tour.reviews = tour.reviews.length));
        
//         // const query = Tour.find()
//         //     .where('duration')
//         //     .equals(5)
//         //     .where('difficulty')
//         //     .equals('easy');

//         // const tours = await Tour.find({
//         //     duration: 5,
//         //     difficulty: 'easy'
//         // });  

//         res.status(200).json({
//             status: 'success',
//             results: tours.length,
//             // requestedAt: req.requestTime,
//             data: {
//                 tours
//             }
//         });
//     // } catch (err) {
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//     // console.log(req.params);

//     // try {
//         // Tour.findOne({ _id: req.params.id })
//     const tour = await Tour.findById(req.params.id).populate('reviews');
    
//     if(!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }

    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id === id)
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });

    // try { 
    //     // console.log(req.body);

    //     // const newTour = new Tour({});
    //     // newTour.save();

        
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);

    // tours.push(newTour);

    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     });
    // });

    // res.send('Done');
// });

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, 'reviews');
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if(!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
//     // } catch (err) {
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
    // try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: -1 }
            }
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    // } catch(err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    // } catch(err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.040173,-118.549449/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if(!lat || !lng) next(new AppError('Please provide latitude and longtitude in the lat,lng.', 400));

    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.00062137 : .001;
    
    if(!lat || !lng) next(new AppError('Please provide latitude and longtitude in the lat,lng.', 400));

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);
    
    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});
