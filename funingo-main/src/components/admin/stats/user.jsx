import { Box, Divider, Grid, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBookingFrequency,
  getUserGenderDetails,
  getUserLocationDetails,
  getUserSpendingLimit,
  getUsersWRTFM,
  getUsersWRTFreebies,
  getUsersWRTPremium
} from '../../../actions/admin';
import { backgroundColors } from '.';
import moment from 'moment';
import { Bar, Pie } from 'react-chartjs-2';

import { options } from '.';
import { capitalizeFirstLetter, downloadInExcel } from '../../../utils';

const UserBase = () => {
  const dispatch = useDispatch();
  const {
    premiumUserData,
    genderData,
    locationData,
    funingoMoneyData,
    freebiesData,
    spendingPerVisitData,
    bookingFreqData
  } = useSelector(state => state.adminSlice.userBase);

  const [isPremium, setIsPremium] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date().setFullYear(new Date().getFullYear() - 1)).format(
      'YYYY-MM-DD'
    )
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );

  const repeatData = useMemo(() => {
    let labels;
    let datasets = [];

    if (!isPremium && bookingFreqData['no_premium']) {
      labels = bookingFreqData['no_premium']?.map(data => data.repeatCount);
      const dataset = {
        data: bookingFreqData['no_premium']?.map(data => ({
          value: data.userCount,
          key: data.repeatCount,
          usersData: data.populatedUsers
        })),
        label: `Repeat rate from ${startDate} to ${endDate}`,
        backgroundColor: backgroundColors[0],
        parsing: {
          yAxisKey: 'value',
          xAxisKey: 'key'
        }
      };
      datasets.push(dataset);
    } else if (bookingFreqData['50%-6_months']) {
      labels = [
        ...bookingFreqData['50%-6_months'],
        ...bookingFreqData['50%-1_year'],
        ...bookingFreqData['50%-100_years'],
        ...bookingFreqData['100%-6_months'],
        ...bookingFreqData['100%-1_year'],
        ...bookingFreqData['100%-100_years']
      ]
        ?.map(data => data.repeatCount)
        .sort((a, b) => a - b);

      labels = [...new Set(labels)];

      const dataset_50_6_months = {
        data: bookingFreqData['50%-6_months']?.map(data => ({
          value: data.userCount,
          key: data.repeatCount,
          usersData: data.populatedUsers
        })),
        label: `50% - 6 months Premium Repeat rate`,
        backgroundColor: backgroundColors[0],
        parsing: {
          yAxisKey: 'value',
          xAxisKey: 'key'
        }
      };
      datasets.push(dataset_50_6_months);
      const dataset_50_1_year = {
        data: bookingFreqData['50%-1_year']?.map(data => ({
          value: data.userCount,
          key: data.repeatCount,
          usersData: data.populatedUsers
        })),
        label: `50% - 1 year Premium Repeat rate`,
        backgroundColor: backgroundColors[1],
        parsing: {
          yAxisKey: 'value',
          xAxisKey: 'key'
        }
      };
      datasets.push(dataset_50_1_year);
      const dataset_50_100_years = {
        data: bookingFreqData['50%-100_years']?.map(data => ({
          value: data.userCount,
          key: data.repeatCount,
          usersData: data.populatedUsers
        })),
        label: `50% - Life Long Premium Repeat rate`,
        backgroundColor: backgroundColors[2],
        parsing: {
          yAxisKey: 'value',
          xAxisKey: 'key'
        }
      };
      datasets.push(dataset_50_100_years);
      const dataset_100_6_months = {
        data: bookingFreqData['100%-6_months']?.map(data => ({
          value: data.userCount,
          key: data.repeatCount,
          usersData: data.populatedUsers
        })),
        label: `100% - 6 months Premium Repeat rate`,
        backgroundColor: backgroundColors[3],
        parsing: {
          yAxisKey: 'value',
          xAxisKey: 'key'
        }
      };
      datasets.push(dataset_100_6_months);
      const dataset_100_1_year = {
        data: bookingFreqData['100%-1_year']?.map(data => ({
          value: data.userCount,
          key: data.repeatCount,
          usersData: data.populatedUsers
        })),
        label: `100% - 1 year Premium Repeat rate`,
        backgroundColor: backgroundColors[4],
        parsing: {
          yAxisKey: 'value',
          xAxisKey: 'key'
        }
      };
      datasets.push(dataset_100_1_year);
      const dataset_100_100_years = {
        data: bookingFreqData['100%-100_years']?.map(data => ({
          value: data.userCount,
          key: data.repeatCount,
          usersData: data.populatedUsers
        })),
        label: `100% - Life Long Premium Repeat rate`,
        backgroundColor: backgroundColors[5],
        parsing: {
          yAxisKey: 'value',
          xAxisKey: 'key'
        }
      };
      datasets.push(dataset_100_100_years);
    }

    return {
      labels,
      datasets
    };
  }, [bookingFreqData]);

  const spendingData = useMemo(() => {
    let labels = spendingPerVisitData
      .map(data => data.group)
      .sort((a, b) => parseInt(a) - parseInt(b));

    let datasets = [];

    const dataset = {
      data: spendingPerVisitData.map(data => ({
        value: data.totalUsers,
        key: data.group,
        usersData: data.users
      })),
      label: `Spending Per Visit`,
      backgroundColor: backgroundColors[1],
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
  }, [spendingPerVisitData]);

  const userFreebiesData = useMemo(() => {
    let labels = freebiesData
      .map(data => data.group)
      .sort((a, b) => parseInt(a) - parseInt(b));

    let datasets = [];

    const dataset = {
      data: freebiesData.map(data => ({
        value: data.totalUsers,
        key: data.group,
        usersData: data.users
      })),
      label: `Users Grouped by current Freebies`,
      backgroundColor: backgroundColors.slice(0, labels?.length),
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
  }, [freebiesData]);

  const userFuningoMoneyData = useMemo(() => {
    let labels = funingoMoneyData
      .map(data => data.group)
      .sort((a, b) => parseInt(a) - parseInt(b));

    let datasets = [];

    const dataset = {
      data: funingoMoneyData.map(data => ({
        value: data.totalUsers,
        key: data.group,
        usersData: data.users
      })),
      label: `Users Grouped by current Funingo Money`,
      backgroundColor: backgroundColors.slice(0, labels?.length),
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
  }, [freebiesData]);

  const userPremiumData = useMemo(() => {
    let labels = premiumUserData
      .map(data =>
        data.premium_type === 'no_premium'
          ? 'No Premium'
          : data.premium_type + '-' + data.premium_duration
      )
      .sort((a, b) => parseInt(a) - parseInt(b));

    let datasets = [];

    const dataset = {
      data: premiumUserData.map(data => ({
        value: data.totalUsers,
        key:
          data.premium_type === 'no_premium'
            ? 'No Premium'
            : data.premium_type + '-' + data.premium_duration,
        usersData: data.users
      })),
      label: `Users Grouped by Premium Plans`,
      backgroundColor: backgroundColors.slice(0, labels?.length),
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
  }, [premiumUserData]);

  const userGenderData = useMemo(() => {
    let labels = genderData.map(data =>
      capitalizeFirstLetter(data.gender ?? 'null')
    );

    let datasets = [];

    const dataset = {
      data: genderData.map(data => ({
        value: data.totalUsers,
        key: data.gender,
        usersData: data.users
      })),
      label: `User Gender Distribution`,
      backgroundColor: backgroundColors.slice(0, labels?.length),
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

  const userLocationData = useMemo(() => {
    let labels = locationData.map(data =>
      capitalizeFirstLetter(data.location ?? 'null')
    );

    let datasets = [];

    const totalValues = locationData.reduce(
      (total, curr) => total + parseInt(curr.totalUsers),
      0
    );

    const dataset = {
      data: locationData.map(data => ({
        value: data.totalUsers,
        key: data.location,
        usersData: data.users
      })),
      label: `User Location Distribution`,
      backgroundColor: backgroundColors.slice(0, labels?.length),
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
  }, [locationData]);

  const RepeatRateBarOptions = {
    ...options,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;
        // // Accessing custom data from the dataset
        const clickedData =
          repeatData.datasets[clickedDatasetIndex].data[clickedIndex];

        downloadInExcel({
          data: clickedData.usersData,
          fileName: `repeat-rate-data-${
            repeatData.labels[elements[0].element['$context'].parsed.x]
          }`
        });
      }
    }
  };
  const SpendingLimitBarOptions = {
    ...options,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;
        // // Accessing custom data from the dataset
        const clickedData =
          spendingData.datasets[clickedDatasetIndex].data[clickedIndex];

        downloadInExcel({
          data: clickedData.usersData,
          fileName: `spending-limit-data-${
            spendingData.labels[elements[0].element['$context'].parsed.x]
          }`
        });
      }
    }
  };
  const FreebiesBarOptions = {
    ...options,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;
        // // Accessing custom data from the dataset
        const clickedData =
          userFreebiesData.datasets[clickedDatasetIndex].data[clickedIndex];

        downloadInExcel({
          data: clickedData.usersData,
          fileName: `current-freebies-grp-${elements[0].element['$context'].raw.key}`
        });
      }
    }
  };
  const FuningoMoneyBarOptions = {
    ...options,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;
        // // Accessing custom data from the dataset
        const clickedData =
          userFuningoMoneyData.datasets[clickedDatasetIndex].data[clickedIndex];

        downloadInExcel({
          data: clickedData.usersData,
          fileName: `current-funingo-money-grp-${elements[0].element['$context'].raw.key}`
        });
      }
    }
  };
  const GenderBarOptions = {
    ...options,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;
        // // Accessing custom data from the dataset
        const clickedData =
          userGenderData.datasets[clickedDatasetIndex].data[clickedIndex];

        downloadInExcel({
          data: clickedData.usersData,
          fileName: `gender-${elements[0].element['$context'].raw.key}`
        });
      }
    }
  };
  const LocationBarOptions = {
    ...options,
    tooltip: {
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const total = dataset.data.reduce(
            (previousValue, currentValue) => previousValue + currentValue
          );
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = ((currentValue / total) * 100).toFixed(2);
          const location = data.labels[tooltipItem.index];
          return `${location}: ${currentValue} (${percentage}%)`;
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;
        // // Accessing custom data from the dataset
        const clickedData =
          userLocationData.datasets[clickedDatasetIndex].data[clickedIndex];

        downloadInExcel({
          data: clickedData.usersData,
          fileName: `location-${elements[0].element['$context'].raw.key}`
        });
      }
    }
  };
  const PremiumBarOptions = {
    ...options,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedDatasetIndex = elements[0].datasetIndex;
        // // Accessing custom data from the dataset
        const clickedData =
          userPremiumData.datasets[clickedDatasetIndex].data[clickedIndex];

        downloadInExcel({
          data: clickedData.usersData,
          fileName: `premium-${elements[0].element['$context'].raw.key}`
        });
      }
    }
  };

  useEffect(() => {
    dispatch(getUsersWRTFM());
    dispatch(getUsersWRTFreebies());
    dispatch(getUsersWRTPremium());
    dispatch(getUserGenderDetails());
    dispatch(getUserLocationDetails());
  }, []);

  useEffect(() => {
    dispatch(
      getUserSpendingLimit({ startDate, endDate, is_premium: isPremium })
    );
    dispatch(
      getBookingFrequency({ startDate, endDate, is_premium: isPremium })
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

      {/* Stats */}
      <Grid
        my='30px'
        sx={{
          display: 'grid',
          gap: '50px',
          flexWrap: 'wrap',
          justifyItems: 'center',
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }
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
          <Typography>Repeat Rate</Typography>
          <Bar options={RepeatRateBarOptions} data={repeatData} />
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
          <Typography>Spending Per Visit</Typography>
          <Bar options={SpendingLimitBarOptions} data={spendingData} />
        </Box>
      </Grid>
      <Divider />
      <Grid
        mt='30px'
        sx={{
          display: 'grid',
          gap: '50px',
          flexWrap: 'wrap',
          justifyItems: 'center',
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }
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
          <Typography>Users Grouped by current freebies</Typography>
          <Bar options={FreebiesBarOptions} data={userFreebiesData} />
        </Box>
        <Box
          width='280px'
          maxHeight='350px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Users Grouped by current freebies</Typography>
          <Pie options={FreebiesBarOptions} data={userFreebiesData} />
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
          <Typography>Users Grouped by current funingo money</Typography>
          <Bar options={FuningoMoneyBarOptions} data={userFuningoMoneyData} />
        </Box>
        <Box
          width='280px'
          maxHeight='350px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Users Grouped by current funingo money</Typography>
          <Pie options={FuningoMoneyBarOptions} data={userFuningoMoneyData} />
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
          <Typography>Users Grouped by Premium</Typography>
          <Bar options={PremiumBarOptions} data={userPremiumData} />
        </Box>
        <Box
          width='300px'
          maxHeight='350px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>Users Grouped by Premium</Typography>
          <Pie options={PremiumBarOptions} data={userPremiumData} />
        </Box>
        <Box
          width='280px'
          maxHeight='350px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>User Gender Distribution</Typography>
          <Pie options={GenderBarOptions} data={userGenderData} />
        </Box>
        <Box
          width='350px'
          maxHeight='400px'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <Typography>User Location Distribution</Typography>
          <Pie options={LocationBarOptions} data={userLocationData} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserBase;
