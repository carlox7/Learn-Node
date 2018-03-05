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
    }
});

storeSchema.pre('save', function(next){
    //check if name is modified before generating slug
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);
    next();

    //TODO makemore resiliat so slugs are unique
});

module.exports = mongoose.model('Store', storeSchema);