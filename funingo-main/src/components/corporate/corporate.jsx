import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import bg3Light from './images/bg3Light.png';
import bg3 from './images/bg3.png';
import './styles.scss';
import { useNavigate } from 'react-router';
import { scrollToBottom } from '../../utils';
import { bookNow, profile1, profile2, profile3, profile4, profileHeading1, profileHeading2, profileHeading3, profileHeading4 } from '../../assets';

const corporateData = [
  {
    name: 'meeting',
    heading: profileHeading1,
    main: profile1,
    text: "Funingo Adventure Arena offers and ideal setting for corporate off-sites. Enjoy professional amenities and adventure activities, blending productivity with team bonding in a serene enviroment"
  },
  {
    name: 'incentives',
    heading: profileHeading2,
    main: profile2,
    text: "Reward your team with exciting adventures at Funingo. Our activites and serene enviroment promote positive reinforcement, motivating and recognizing your employees effectively"
  },
  {
    name: 'corporategame',
    heading: profileHeading3,
    main: profile3,
    text: "Enhance team spirit with our team building retreats. Engage in activities that boost collaboration, communication, and leadership, creating a stronger, more cohesive team"
  },
  {
    name: 'corporategame',
    heading: profileHeading4,
    main: profile4,
    text: "Celebrate retirement in style at Funingo Adventure Arena! Enjoy customizable event planning, thrilling activities, and delicious catering options, all set in our unique venue. Make this milestone unforgettable-contact us to plan a retirement party to remember!"
  }
];

const Corporate = () => {
  const navigate = useNavigate();
  return (
    <Grid className='corporate'>
      {/* {First Box} */}
      <Grid height='70vh' className='top'>
        <Typography height='60vh' className='heading'>
          CORPORATE
        </Typography>
      </Grid>

      {corporateData.map((data, i) => (
        <Grid
          key={data.name}
          className='top2'
          mt='70px'
          flexDirection={i % 2 === 0 ? 'row' : 'row-reverse'}
        >
          <img
            src={i % 2 === 0 ? bg3 : bg3Light}
            alt='background-img'
            className='background-corp'
          />
          <Grid className='first'>
            <Box
              component={'img'}
              sx={{ borderRadius: '1px' }}
              className='main-img'
              src={data.main}
              alt={'Corporate Event'}
            />
          </Grid>
          <Grid
            className='second'
            width={{ xs: '95%', md: '40vw' }}
            marginRight={{ md: i % 2 ? '100px' : '0px' }}
          >
            <Grid className='top-box'>
              <img className='heading-img' src={data.heading} alt={'Heading'} />
            </Grid>
            <Grid className='content-box'>
              {data.text}
            </Grid>
            <img className='lg:mt-5' onClick={() => {
                scrollToBottom();
              }} src={bookNow} alt="" />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default Corporate;
