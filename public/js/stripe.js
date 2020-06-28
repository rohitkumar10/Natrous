const stripe = Stripe('pk_test_51GysFXIysilLgg6ePLPEehKgnBeMnTz2QbY0iHiubT26Rx3ekqdHCDbIsfKbQIxwob6808pV4noSl5kqlIVOHlvN00MZ6tVnZU')
const bookBtn = document.getElementById('book-tour')

const bookTour = async tourId => {
    try {
      // 1) Get checkout session from API
      const session = await axios(
        `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
      );
      console.log(session);
  
      // 2) Create checkout form + chanre credit card
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id
      });
    } catch (err) {
      console.log(err);
      showAlert('error', err);
    }
}

if (bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    })
}
  