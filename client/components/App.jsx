
import React, { Component } from 'react';
import axios from 'axios';
import LeftBox from './LeftBox.jsx';
import RightBox from './RightBox.jsx';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            SS: 0,
            itemNumber: 0,
            modelNumber: "",
            name: "",
            ratings: 0,
            avgRating: 0,
            percentRecommended: 0,

            images: [],
            price: 0,
            summary: [],
            quantity: 0,
            items: [],
            total: 0,
            clickedItems: new Array(100).fill(0),
            loggedIn: false
            }

        this.plusOne = this.plusOne.bind(this);
        this.minusOne = this.minusOne.bind(this);
        this.typeQuantity = this.typeQuantity.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.getItems = this.getItems.bind(this);
        this.getRatings = this.getRatings.bind(this);
        this.cartListener = this.cartListener.bind(this);
        this.sendSaveInfo = this.sendSaveInfo.bind(this);

    };

    plusOne(event) {
        this.setState({quantity: this.state.quantity + 1})
    };

    minusOne(event) {
        this.setState({quantity: this.state.quantity - 1})
    };

    typeQuantity (event) {
        let input = event.target.value
        this.setState({quantity: input})
    };

    addToCart (input) {
        let newItems = [];
        let count = this.state.quantity;
        while (count >=0) {
            newItems.push(this.state.name);
            count--;
        }
        this.setState(prevState => (
            {
            items: [...prevState.items, newItems.join(',')], total: this.state.quantity * this.state.price
            }
        ))

    };

    cartListener (event) {
        window.dispatchEvent(new CustomEvent('cart', {detail:{
            name: this.state.name,
            id: this.state.SS,
            amount: this.state.quantity,
            price: Number(this.state.price.replace(/[^0-9.-]+/g, ''))
        }}))

    };

    sendSaveInfo () {

        if (this.state.clickedItems[this.state.SS]) {
            let clickedItems = this.state.clickedItems;
            clickedItems[this.state.SS] = 0;
            this.setState({clickedItems})

        } else {
            let clickedItems = this.state.clickedItems;
            clickedItems[this.state.SS] = this.state.SS;
            this.setState({clickedItems})
        }

        window.dispatchEvent(
            new CustomEvent('favorite', {detail: {product_id: this.state.SS, price: this.state.price, name: this.state.name, saved: this.state.clickedItems[this.state.SS]}})
        )

    }


    componentDidMount () {

        window.addEventListener('product', e => {
            const SS = e.detail.product_id;
            this.setState({ SS }, () => {
//                this.getRatings()
                this.getItems()
                })
       })

        window.addEventListener('stars', (e) => {
            const SS = e.detail.id

            this.setState({SS}, () => {
  //              this.getRatings();
                this.getItems();
            })
        })
       window.addEventListener('loggedIn', (e) => {
        const clickedItems = e.detail.favoriteList;
        const loggedIn = e.detail.loggedIn

        //if the id of the item is in the userFavorites
        if (clickedItems.includes(this.state.SS)) {
            this.setState({clickedItems, loggedIn})
        }

            //keep the button as if it were clicked once
        if (!this.state.clickedItems[this.state.SS]) {
            this.setState({clickedItems, loggedIn})

        }
        });

        window.addEventListener('loggedOut', (e) => {
            console.log(e.detail)
            const clickedItems = new Array(100).fill(0);
            const loggedIn = e.detail.loggedIn

            this.setState({ clickedItems, loggedIn })
        });
   };

   getRatings () {

    //   axios.get(`http://ec2-18-225-6-113.us-east-2.compute.amazonaws.com/api/stats/${this.state.SS}`)
    //    .then(results =>

   //         this.setState({
     //           ratings: results.data.reviewStats.reviewCount,
     //           avgRating: results.data.reviewStats.averageStars,
     //           percentRecommended: results.data.reviewStats.percentRecommended
     //       })
     //   )
     //   .catch(err => console.log(err))
   };

   getItems () {
       const SS = this.state.SS;
	console.log(SS)
       axios.get(`http://ec2-52-14-209-114.us-east-2.compute.amazonaws.com:3000/${SS}`)
       .then(results => {
            // const editedURLs = results.data.largeImages.filter(url => url.slice(-3) === 'jpg')
            // const items = editedURLs.map((file) =>{

            //    return `https://binkardfecimages.s3.us-east-2.amazonaws.com/FECPhotos/${results.data.SS}/${file}`
            // })

            this.setState({
                SS: results.data.id,
                itemNumber: results.data.modelnumber,
                modelNumber: results.data.modelnumber,
                name: results.data.name,
                //    ratings: 'chris API',
                //    avgRating: 'chris API',
                //    percentRecommended: 'chrisAPI',
                // images: items,
                price: results.data.price,
                summary: ['no data yet', 'no data yet', 'no data yet'],
                quantity: 1,
                items: [],
                total: 0,

            })
        }).catch(err => console.log(err))
   };

    render() {

        return (

            <div className="row no-gutters">

                <LeftBox itemNumber={this.state.itemNumber} modelNumber ={this.state.modelNumber} name={this.state.name} ratings={this.state.ratings}
                avgRating={this.state.avgRating} percentRecommended={this.state.percentRecommended}
                images={this.state.images}/>
                <RightBox loggedIn={this.state.loggedIn} price={this.state.price} sendSaveInfo={this.sendSaveInfo} clickedItems={this.state.clickedItems} name={this.state.name} id={this.state.SS} summary={this.state.summary} quantity={this.state.quantity}
                plusOne={this.plusOne} minusOne={this.minusOne} typeQuantity={this.typeQuantity}
                addToCart={this.addToCart} cartListener={this.cartListener}/>
            </div>

        )
    };
};

export default App;
