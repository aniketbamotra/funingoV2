import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import { apiUrl, razorpayKey } from '../../constants';
import { Typography, Button } from '@mui/material';

const addScript = src => {
  const script = document.createElement('script');
  script.src = src;
  document.querySelector('body').appendChild(script);
};

const PurchaseBtn = ({
  counters,
  setCounter,
  total_amount,
  id,
  name = '',
  email = '',
  contact = ''
}) => {
  const handlePayment = async () => {
    try {
      const requestData = {
        total_amount,
        ...counters,
        short_id: id
      };

      addScript('https://checkout.razorpay.com/v1/checkout.js');
      let response = await axios.post(`${apiUrl}/qr/create-order`, requestData);
      response = response.data;
      const options = {
        key: razorpayKey,
        name: 'Funingo Adventure Park',
        amount: total_amount,
        currency: 'INR',
        description: 'Test Transaction',
        order_id: response.id,
        handler: async res => {
          try {
            let resp = await axios.post(`${apiUrl}/qr/verify-payment`, {
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              order_id: response.id,
              short_id: id,
              ...counters
            });
            console.log("id printing",id);
            alert(resp ? 'Payment is successful' : 'Payment is unsuccessful');
            if (resp) {
              setCounter({
                red: 0,
                green: 0,
                yellow: 0
              });
            }
          } catch (error) {
            console.error(error.message, error);
          }
        },
        theme: {
          color: '#3399cc'
        },
        prefill: {
          name,
          email,
          contact
        }
      };
      const razorpay = window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment Error!!', error.message, error);
    }
  };
  return (
    <>
      <Button
        endIcon={<SendIcon />}
        variant='contained'
        sx={{
          background: '#2CC248',
          boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
          borderRadius: '50px',
          padding: '10px 30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          '&:hover': {
            background: '#1e8e33'
          }
        }}
        onClick={() => {
          handlePayment();
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Luckiest Guy',
            fontSize: '24px',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          Buy Now
        </Typography>
      </Button>
    </>
  );
};

export default PurchaseBtn;
