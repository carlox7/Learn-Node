const mongoose = require('mongoose');
//set mongoose promise to es6 global promise
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name'
    },
    slug: String,
    description:{
        type: String,
        trim: true
    },
    tags:[String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must suppy coordinates.'
        }],
        address: {
            type: String,
            required: 'You must supply an address.'
        }
    },
    photo: String
});

storeSchema.pre('save', async function(next){
    //check if name is modified before generating slug
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);
    //find other stores with same slug
    const slugRegEx = new Regex(`^($this.slug}((-[0-9]*$)$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({slug: slugRegEx});
    if(storeWithSlug.length){
        this.slug = `${this.slug}-3${storesWithSlug.length + 1}`;
    }
    next();

});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags'},
        { $group: { _id: '$tags', count: { $sum: 1} }},
        { $sort: { count: -1 }}
    ]);
}

module.exports = mongoose.model('Store', storeSchema);