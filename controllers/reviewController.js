const Review = require('../models/reviewModel');
const factory = require('../controllers/handlerFactory');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');


// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if(req.params.tourId) filter = { tour: req.params.tourId };

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

// exports.getReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findById(req.params.id);

//     if(!review) {
//         return next(new AppError('No review found with that ID.', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             review
//         }
//     });
// });

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//     // Allow nested routes
//     if(!req.body.tour) req.body.tour = req.params.tourId;
//     if(!req.body.user) req.body.user = req.user.id;

//     const newReview = await Review.create({
//         review: req.body.review,
//         rating: req.body.rating,
//         tour: req.body.tour,
//         user: req.body.user
//     });

//     if(!req.body.user) {
//         return next(new AppError('There must be a user!', 400));
//     } else if(!req.body.tour) {
//         return next(new AppError('There must be a tour!', 404));
//     }

//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// exports.deleteReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findByIdAndDelete(req.params.id);

//     if(!review) {
//         return next(new AppError('No review found with that ID.', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });
