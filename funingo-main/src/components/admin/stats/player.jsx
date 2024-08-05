import { Box, Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { backgroundColors, options } from '.';
import { Bar, Pie } from 'react-chartjs-2';
import {
  getPlayerAddedFreebies,
  getPlayerAgeDetails,
  getPlayerGenderDetails
} from '../../../actions/admin';
import { capitalizeFirstLetter } from '../../../utils';

const PlayerBase = () => {
  const dispatch = useDispatch();
  const { ageData, genderData, freebiesData } = useSelector(
    state => state.adminSlice.playerBase
  );

  const [isPremium, setIsPremium] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date().setFullYear(new Date().getFullYear() - 1)).format(
      'YYYY-MM-DD'
    )
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );

  const playerAgeData = useMemo(() => {
    let labels = ageData
      .map(data => data.ageGroup)
      .sort((a, b) => parseInt(a) - parseInt(b));

    let datasets = [];

    const dataset = {
      data: ageData.map(data => ({
        value: data.count,
        key: data.ageGroup
      })),
      label: `Player Age Distribution`,
      backgroundColor: backgroundColors.slice(0, labels.length),
      parsing: {
        yAxisKey: 'value',
        xAxisKey: 'key'
      }
    };

    datasets.push(dataset);

    return {
      labels,
      datasets
    };
  }, [ageData]);

  const playerGenderData = useMemo(() => {
    let labels = genderData.map(data =>
      capitalizeFirstLetter(`${data.gender}`)
    );

    let datasets = [];

    const dataset = {
      data: genderData.map(data => ({
        value: data.count,
        key: capitalizeFirstLetter(`${data.gender}`)
      })),
      label: `Player Gender Distribution`,
      backgroundColor: backgroundColors.slice(0, labels.length),
      parsing: {
        yAxisKey: 'value',
        xAxisKey: 'key'
      }
    };

    datasets.push(dataset);

    return {
      labels,
      datasets
    };
  }, [genderData]);

  const playerFreebiesData = useMemo(() => {
    let labels = ['red', 'green', 'yellow', 'golden'];

    let datasets = [];

    const dataset = {
      data: labels.map(label => freebiesData[label]),
      label: `Freebies Collected Data`,
      // backgroundColor: ['red', 'green', 'yellow', 'gold'],
      backgroundColor: backgroundColors.slice(0, labels.length)
    };

    datasets.push(dataset);

    return {
      labels,
      datasets
    };
  }, [freebiesData]);

  const playerFreebiesAvgData = useMemo(() => {
    let labels = ['red', 'green', 'yellow', 'golden'];

    let datasets = [];

    const dataset = {
      data: labels.map(
        label => freebiesData[label] / freebiesData.totalTickets
      ),
      label: `Avg. Freebies Collected Data`,
      // backgroundColor: ['red', 'green', 'yellow', 'gold'],
      backgroundColor: backgroundColors.slice(0, labels.length)
    };

    datasets.push(dataset);

    return {
      labels,
      datasets
    };
  }, [freebiesData]);

  useEffect(() => {
    dispatch(
      getPlayerAgeDetails({ startDate, endDate, is_premium: isPremium })
    );
    dispatch(
      getPlayerGenderDetails({ startDate, endDate, is_premium: isPremium })
    );
    dispatch(
      getPlayerAddedFreebies({ startDate, endDate, is_premium: isPremium })
    );
  }, [startDate, endDate, isPremium]);

  return (
    <Grid>
      <Grid
        sx={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          component={'input'}
          type='date'
          onChange={e => setStartDate(e.target.value)}
          value={startDate}
          max={endDate}
        />
        <Box
          component={'input'}
          type='date'
          onChange={e => setEndDate(e.target.value)}
          value={endDate}
          min={startDate}
        />
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '5px',
              alignItems: 'center'
            }}
          >
            <input
              type='checkbox'
              checked={isPremium}
              onChange={e => setIsPremium(e.target.checked)}
            />
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              Premium
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid
        my='30px'
        sx={{
          display: 'flex',
          gap: '50px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <Box
          width='600px'
          maxHeight='500px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Age Distribution</Typography>
          <Bar options={options} data={playerAgeData} />
        </Box>
        <Box
          width='300px'
          maxHeight='500px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Age Distribution</Typography>
          <Pie options={options} data={playerAgeData} />
        </Box>
        <Box
          width='600px'
          maxHeight='500px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Gender Distribution</Typography>
          <Bar options={options} data={playerGenderData} />
        </Box>
        <Box
          width='300px'
          maxHeight='500px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Gender Distribution</Typography>
          <Pie options={options} data={playerGenderData} />
        </Box>
        <Box
          width='600px'
          maxHeight='500px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Total Freebies Collected</Typography>
          <Bar options={options} data={playerFreebiesData} />
        </Box>
        <Box
          width='300px'
          maxHeight='500px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Avg. Freebies Collected</Typography>
          <Pie options={options} data={playerFreebiesAvgData} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default PlayerBase;
