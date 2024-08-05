import React, { useState, useEffect } from 'react';
import { Grid, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './icon.css';

const SocialMediaIcons = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const containerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    display: isVisible ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000
  };

  const iconContainerStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px'
  };

  return (
    <Grid style={containerStyle}>
      <div style={iconContainerStyle} className='icon-container'>
        <IconButton aria-label='Phone'>
          <a href="">
            <PhoneIcon className='icon' />
          </a>
        </IconButton>
      </div>
      <div style={iconContainerStyle} className='icon-container'>
        <IconButton aria-label='WhatsApp'>
          <a href="https://wa.me/919755716305?text=Hey%20Get%20In! %20Touch%20=%20">
          <WhatsAppIcon className='icon' variant='filled' />
          </a>
        </IconButton>
      </div>
    </Grid>
  );
};

export default SocialMediaIcons;
