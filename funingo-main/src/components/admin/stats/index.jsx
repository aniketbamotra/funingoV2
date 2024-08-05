import React, { useEffect, useMemo, useState } from 'react';
import './style.css'
import { apiUrl } from '../../../constants';
import {
  getAddedFreebies,
  getMonthlyStats,
  getStatistics,
  getWeekdayData,
  getWeekendData
} from '../../../actions/admin';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Switch } from './style';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Box, Grid, Typography } from '@mui/material';
import UserBase from './user';
import PlayerBase from './player';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        title: function (tooltipItem) {
          const dataset = tooltipItem[0].dataset;
          const total = dataset.data.reduce(
            (previousValue, currentValue) =>
              previousValue + (currentValue.value ?? currentValue),
            0
          );
          const currentValue = tooltipItem[0].parsed.y ?? tooltipItem[0].parsed;
          const percentage = ((currentValue / total) * 100).toFixed(2);
          const location = tooltipItem[0].label ?? 'Null';
          return `Label- ${location}: ${currentValue} (${percentage}%)`;
        }
      }
    },
    legend: {
      position: 'top'
    },
    title: {
      display: !true
    }
  }
};

const selectStyles = {
  container: styles => ({
    ...styles
  })
};

export const backgroundColors = [
  '#cdb4db',
  '#ffc8dd',
  '#ffafcc',
  '#bde0fe',
  '#a2d2ffs',
  '#cda7db'
];

const startYear = 2023;
const yearOptions = [
  ...Array(new Date().getFullYear() - startYear + 1).keys()
].map(i => ({
  label: `${startYear + i}`,
  value: `${startYear + i}`
}));

const monthOptions = [
  { label: 'All', value: 'all' },
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' }
];

const quarterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Quarter 1', value: 'Q1' },
  { label: 'Quarter 2', value: 'Q2' },
  { label: 'Quarter 3', value: 'Q3' },
  { label: 'Quarter 4', value: 'Q4' }
];

const Stats = () => {
  const navigate = useNavigate();

  const handleGetDetailsClick = () => {
    navigate(`/admin/showdetails`);
    scrollToTop();
  }
  const dispatch = useDispatch();
  const [years, setYear] = useState(new Date().getFullYear().toString());
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  ); // For Weekends and weekdays
  const [months, setMonth] = useState(monthOptions[0].value);
  const [quarters, setQuarter] = useState(quarterOptions[0].value);
  const [monthsRevenues, setMonthsRevenues] = useState([]); // Average - Array for years
  const [quartersRevenues, setQuartersRevenues] = useState([]); // Average - Array for years
  const [weekends, setWeekends] = useState(false);
  const [weekdays, setWeekdays] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [page, setPage] = useState(0); // 0»stats | 1»user | 2»player

  const { monthlyStats, weekdayStats, weekendStats, addedFreebies } =
    useSelector(state => state.adminSlice);

  const onChangeHandler = (values, setFunc) => {
    if (values.length) {
      if (values[values.length - 1].value === 'all') {
        setFunc(values[values.length - 1].value);
        return;
      } else if (values[0].value === 'all' && values.length > 1) {
        setFunc(
          values
            .slice(1)
            .map(val => val.value)
            .join(',')
        );
        return;
      }
    }
    setFunc(values.map(val => val.value).join(','));
  };

  const monthlyStatsData = useMemo(() => {
    let requiredMonths = months.split(',');

    if (requiredMonths[0] === 'all') {
      requiredMonths = [...Array(12).keys()].map(i => (i + 1).toString());
    }

    let labels = monthOptions
      .slice(1)
      .filter(month => requiredMonths.includes(month.value))
      .map(month => month.label); // We don't need the 'all' option here

    let datasets = [];
    Object.keys(monthlyStats).forEach((year, ind) => {
      let data = [...Array(12)].map(() => 0);
      monthlyStats[year].forEach(entry => {
        data[entry.month - 1] = entry.total_revenue;
      });

      const dataset = {
        data: data.filter((_, ind) =>
          requiredMonths.includes((ind + 1).toString())
        ),
        label: `Year ${year}`,
        backgroundColor: backgroundColors[ind]
      };

      datasets.push(dataset);
    });

    setMonthsRevenues(() => {
      let data = [];
      for (let dataset of datasets) {
        data.push({
          year: dataset.label,
          amount:
            dataset.data.reduce((total, curr) => total + curr, 0) /
            dataset.data.length
        });
      }
      return data;
    });

    return {
      labels,
      datasets
    };
  }, [monthlyStats, months]);

  const quarterlyStatsData = useMemo(() => {
    let requiredQuarters = quarters.split(',');

    if (requiredQuarters[0] === 'all') {
      requiredQuarters = quarterOptions.slice(1).map(quarter => quarter.value);
    }

    let labels = quarterOptions
      .slice(1)
      .filter(quarter => requiredQuarters.includes(quarter.value))
      .map(quarter => quarter.label); // We don't need the 'all' option here
    let datasets = [];

    Object.keys(monthlyStats).forEach((year, ind) => {
      let data = [...Array(4)].map(() => 0);
      monthlyStats[year].forEach(entry => {
        data[Math.floor((entry.month - 1) / 3)] += entry.total_revenue;
      });
      let finalData = [];
      if (requiredQuarters.includes('Q1')) finalData.push(data[0]);
      if (requiredQuarters.includes('Q2')) finalData.push(data[1]);
      if (requiredQuarters.includes('Q3')) finalData.push(data[2]);
      if (requiredQuarters.includes('Q4')) finalData.push(data[3]);

      datasets.push({
        data: finalData,
        label: `Year ${year}`,
        backgroundColor: backgroundColors[ind]
      });
    });

    setQuartersRevenues(() => {
      let data = [];
      for (let dataset of datasets) {
        data.push({
          year: dataset.label,
          amount:
            dataset.data.reduce((total, curr) => total + curr, 0) /
            dataset.data.length
        });
      }
      return data;
    });

    return {
      labels,
      datasets
    };
  }, [addedFreebies, quarters]);

  const monthlyAddedFreebiesData = useMemo(() => {
    let requiredMonths = months.split(',');

    if (requiredMonths[0] === 'all') {
      requiredMonths = [...Array(12).keys()].map(i => (i + 1).toString());
    }

    let labels = monthOptions
      .slice(1) // We don't need the 'all' option here
      .filter(month => requiredMonths.includes(month.value))
      .map(month => month.label);

    let datasets = [];
    Object.keys(addedFreebies).forEach((year, ind) => {
      let red_data = [...Array(12)].map(() => 0);
      let green_data = [...Array(12)].map(() => 0);
      let yellow_data = [...Array(12)].map(() => 0);
      let golden_data = [...Array(12)].map(() => 0);
      addedFreebies[year].forEach(entry => {
        red_data[entry.month - 1] = entry.red;
        green_data[entry.month - 1] = entry.green;
        yellow_data[entry.month - 1] = entry.yellow;
        golden_data[entry.month - 1] = entry.golden;
      });

      datasets.push(
        {
          data: red_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Red`,
          backgroundColor: '#fa1942'
        },
        {
          data: green_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Green`,
          backgroundColor: '#76de9a'
        },
        {
          data: yellow_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Yellow`,
          backgroundColor: '#e7e710'
        },
        {
          data: golden_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Golden`,
          backgroundColor: '#FFD700'
        }
      );
    });

    return {
      labels,
      datasets
    };
  }, [addedFreebies, months]);

  const monthlyAvgAddedFreebiesData = useMemo(() => {
    let requiredMonths = months.split(',');

    if (requiredMonths[0] === 'all') {
      requiredMonths = [...Array(12).keys()].map(i => (i + 1).toString());
    }

    let labels = monthOptions
      .slice(1) // We don't need the 'all' option here
      .filter(month => requiredMonths.includes(month.value))
      .map(month => month.label);

    let datasets = [];
    Object.keys(addedFreebies).forEach((year, ind) => {
      let red_data = [...Array(12)].map(() => 0);
      let green_data = [...Array(12)].map(() => 0);
      let yellow_data = [...Array(12)].map(() => 0);
      let golden_data = [...Array(12)].map(() => 0);
      addedFreebies[year].forEach(entry => {
        red_data[entry.month - 1] = entry.red / (entry.total_tickets || 1);
        green_data[entry.month - 1] = entry.green / (entry.total_tickets || 1);
        yellow_data[entry.month - 1] =
          entry.yellow / (entry.total_tickets || 1);
        golden_data[entry.month - 1] =
          entry.golden / (entry.total_tickets || 1);
      });

      datasets.push(
        {
          data: red_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Red`,
          backgroundColor: '#fa1942'
        },
        {
          data: green_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Green`,
          backgroundColor: '#76de9a'
        },
        {
          data: yellow_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Yellow`,
          backgroundColor: '#e7e710'
        },
        {
          data: golden_data.filter((_, ind) =>
            requiredMonths.includes((ind + 1).toString())
          ),
          label: `Year ${year} - Golden`,
          backgroundColor: '#FFD700'
        }
      );
    });

    return {
      labels,
      datasets
    };
  }, [addedFreebies, months]);

  const quarterlyAddedFreebiesData = useMemo(() => {
    let requiredQuarters = quarters.split(',');

    if (requiredQuarters[0] === 'all') {
      requiredQuarters = quarterOptions.slice(1).map(quarter => quarter.value);
    }

    let labels = quarterOptions
      .slice(1) // We don't need the 'all' option here
      .filter(quarter => requiredQuarters.includes(quarter.value))
      .map(quarter => quarter.label);
    let datasets = [];

    Object.keys(addedFreebies).forEach((year, ind) => {
      let red_data = [...Array(4)].map(() => 0);
      let green_data = [...Array(4)].map(() => 0);
      let yellow_data = [...Array(4)].map(() => 0);
      let golden_data = [...Array(4)].map(() => 0);
      addedFreebies[year].forEach(entry => {
        red_data[Math.floor((entry.month - 1) / 3)] += entry.red;
        green_data[Math.floor((entry.month - 1) / 3)] += entry.green;
        yellow_data[Math.floor((entry.month - 1) / 3)] += entry.yellow;
        golden_data[Math.floor((entry.month - 1) / 3)] += entry.golden;
      });

      let redFinalData = [],
        greenFinalData = [],
        yellowFinalData = [],
        goldenFinalData = [];
      if (requiredQuarters.includes('Q1')) {
        redFinalData.push(red_data[0]);
        greenFinalData.push(green_data[0]);
        yellowFinalData.push(yellow_data[0]);
        goldenFinalData.push(golden_data[0]);
      }
      if (requiredQuarters.includes('Q2')) {
        redFinalData.push(red_data[1]);
        greenFinalData.push(green_data[1]);
        yellowFinalData.push(yellow_data[1]);
        goldenFinalData.push(golden_data[1]);
      }
      if (requiredQuarters.includes('Q3')) {
        redFinalData.push(red_data[2]);
        greenFinalData.push(green_data[2]);
        yellowFinalData.push(yellow_data[2]);
        goldenFinalData.push(golden_data[2]);
      }
      if (requiredQuarters.includes('Q4')) {
        redFinalData.push(red_data[3]);
        greenFinalData.push(green_data[3]);
        yellowFinalData.push(yellow_data[3]);
        goldenFinalData.push(golden_data[3]);
      }

      datasets.push(
        {
          data: redFinalData,
          label: `Year ${year} - Red`,
          backgroundColor: '#fa1942'
        },
        {
          data: greenFinalData,
          label: `Year ${year} - Green`,
          backgroundColor: '#76de9a'
        },
        {
          data: yellowFinalData,
          label: `Year ${year} - Yellow`,
          backgroundColor: '#e7e710'
        },
        {
          data: goldenFinalData,
          label: `Year ${year} - Golden`,
          backgroundColor: '#FFD700'
        }
      );
    });

    return {
      labels,
      datasets
    };
  }, [addedFreebies, quarters]);

  const cumulativeWeekData = useMemo(() => {
    // Cumulative of all months
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];

    let datasets = [];

    if (weekends) {
      const dataset = {
        label: `Weekends of Year ${selectedYear}`,
        data: Object.values(weekendStats).reduce(
          (weekendData, curr) => {
            curr.forEach((val, ind) => {
              weekendData[ind] += val;
            });
            return weekendData;
          },
          [0, 0, 0, 0, 0, 0]
        ),
        backgroundColor: backgroundColors[0]
      };
      datasets.push(dataset);
    }

    if (weekdays) {
      const dataset = {
        label: `Weekdays of Year ${selectedYear}`,
        data: Object.values(weekdayStats).reduce(
          (weekdayData, curr) => {
            curr.forEach((val, ind) => {
              weekdayData[ind] += val;
            });
            return weekdayData;
          },
          [0, 0, 0, 0, 0]
        ),
        backgroundColor: backgroundColors[1]
      };
      datasets.push(dataset);
    }

    return {
      labels,
      datasets
    };
  }, [weekdayStats, weekendStats, weekends, weekdays]);

  const weekwiseData = useMemo(() => {
    let requiredMonths = months.split(',');

    if (requiredMonths[0] === 'all') {
      requiredMonths = [...Array(12).keys()].map(i => (i + 1).toString());
    }

    let datasets = [];
    let labelCount = 0;

    if (weekends) {
      const dataset = {
        label: `Weekends of Year ${selectedYear}`,
        data: Object.values(weekendStats).flatMap((data, ind) => {
          if (!requiredMonths.includes((ind + 1).toString())) return [];
          return data;
        }),
        backgroundColor: backgroundColors[0],
        borderColor: backgroundColors[0]
      };
      labelCount = Math.max(labelCount, dataset.data.length);
      datasets.push(dataset);
    }

    if (weekdays) {
      const dataset = {
        label: `Weekdays of Year ${selectedYear}`,
        data: Object.values(weekdayStats).flatMap((data, ind) => {
          if (!requiredMonths.includes((ind + 1).toString())) return [];
          return data;
        }),
        backgroundColor: backgroundColors[1],
        borderColor: backgroundColors[1]
      };
      labelCount = Math.max(labelCount, dataset.data.length);
      datasets.push(dataset);
    }

    return {
      datasets,
      labels: [...Array(labelCount).keys()].map(i => `W${i + 1}`)
    };
  }, [weekdayStats, weekendStats, months, weekends, weekdays]);

  const quarterWiseData = useMemo(() => {
    let requiredQuarters = quarters.split(',');

    if (requiredQuarters[0] === 'all') {
      requiredQuarters = quarterOptions.slice(1).map(quarter => quarter.value);
    }
    let labels = quarterOptions
      .slice(1)
      .filter(quarter => requiredQuarters.includes(quarter.value))
      .map(quarter => quarter.label); // We don't need the 'all' option here

    let datasets = [];

    if (weekends) {
      let data = [0, 0, 0, 0];
      Object.values(weekendStats).forEach((stat, ind) => {
        const sum = stat.reduce((sum, curr) => sum + curr, 0);
        data[Math.floor(ind / 3)] += sum;
      });

      let finalData = [];
      if (requiredQuarters.includes('Q1')) finalData.push(data[0]);
      if (requiredQuarters.includes('Q2')) finalData.push(data[1]);
      if (requiredQuarters.includes('Q3')) finalData.push(data[2]);
      if (requiredQuarters.includes('Q4')) finalData.push(data[3]);

      const dataset = {
        label: `Cumulative weekends of Year ${selectedYear}`,
        data: finalData,
        backgroundColor: backgroundColors[0]
      };
      datasets.push(dataset);
    }

    if (weekdays) {
      let data = [0, 0, 0, 0];
      Object.values(weekdayStats).forEach((stat, ind) => {
        const sum = stat.reduce((sum, curr) => sum + curr, 0);
        data[Math.floor(ind / 3)] += sum;
      });

      let finalData = [];
      if (requiredQuarters.includes('Q1')) finalData.push(data[0]);
      if (requiredQuarters.includes('Q2')) finalData.push(data[1]);
      if (requiredQuarters.includes('Q3')) finalData.push(data[2]);
      if (requiredQuarters.includes('Q4')) finalData.push(data[3]);

      const dataset = {
        label: `Cumulative weekdays of Year ${selectedYear}`,
        data: finalData,
        backgroundColor: backgroundColors[1]
      };
      datasets.push(dataset);
    }

    return {
      labels,
      datasets
    };
  }, [weekdayStats, weekendStats, quarters, weekends, weekdays]);

  useEffect(() => {
    if (page === 0) {
      if (!weekdays && !weekends) {
        dispatch(getMonthlyStats({ years: years, is_premium: isPremium }));
        dispatch(getAddedFreebies({ years, is_premium: isPremium }));
      }
    }
  }, [years, weekdays, weekends, isPremium, page]);

  useEffect(() => {
    if (page === 0) {
      let mon = monthOptions
        .slice(1)
        .map(month => month.value)
        .join(',');

      if (weekdays === true)
        dispatch(
          getWeekdayData({
            year: selectedYear,
            months: mon,
            is_premium: isPremium
          })
        );
      if (weekends === true)
        dispatch(
          getWeekendData({
            year: selectedYear,
            months: mon,
            is_premium: isPremium
          })
        );
    }
  }, [weekdays, weekends, selectedYear, isPremium, page]);

  return (
    <Grid>
      <Grid
        sx={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          justifyContent: 'center',
          mb: ' 20px'
        }}
      >
        {/* <Switch
          checked={!isStatsPage}
          onChange={e => toggleStatsPage(!e.target.checked)}
        /> */}
        <Typography
          onClick={() => setPage(0)}
          sx={{
            fontSize: '18px',
            fontWeight: page === 0 ? '600' : '500',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Statistics Portal
        </Typography>
        <Typography
          onClick={() => setPage(1)}
          sx={{
            fontSize: '18px',
            fontWeight: page === 1 ? '600' : '500',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          User Base
        </Typography>
        <Typography
          onClick={() => setPage(2)}
          sx={{
            fontSize: '18px',
            fontWeight: page === 2 ? '600' : '500',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Player Base
        </Typography>
      </Grid>
      {page === 0 ? (
        <>
          <Grid
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'center',
              mb: '50px'
            }}
          >
            <Box flexBasis={'200px'}>
              <Typography>Year</Typography>
              {!weekdays && !weekends ? (
                <Select
                  options={yearOptions}
                  onChange={values => onChangeHandler(values, setYear)}
                  placeholder='Select Year'
                  value={
                    yearOptions.filter(year =>
                      years?.split(',').includes(year.value)
                    ) || null
                  }
                  styles={selectStyles}
                  isMulti
                  isClearable={false}
                />
              ) : (
                <Select
                  options={yearOptions}
                  onChange={value => setSelectedYear(value.value)}
                  placeholder='Select Year'
                  value={
                    yearOptions.filter(year => year.value === selectedYear) ||
                    null
                  }
                  styles={selectStyles}
                  isClearable={false}
                />
              )}
            </Box>
            <Box flexBasis={'200px'}>
              <Typography>Quarters</Typography>
              <Select
                options={quarterOptions}
                onChange={values => onChangeHandler(values, setQuarter)}
                placeholder='Select Quarter'
                value={
                  quarterOptions.filter(quart =>
                    quarters?.split(',').includes(quart.value)
                  ) || null
                }
                styles={selectStyles}
                isMulti
                isClearable
              />
            </Box>
            <Box flexBasis={'200px'}>
              <Typography>Months</Typography>
              <Select
                options={monthOptions}
                onChange={values => onChangeHandler(values, setMonth)}
                placeholder='Select Month'
                value={
                  monthOptions.filter(mon =>
                    months?.split(',').includes(mon.value)
                  ) || null
                }
                styles={selectStyles}
                isMulti
                isClearable
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
              }}
            >
              <input
                type='checkbox'
                checked={weekends}
                onChange={e => setWeekends(e.target.checked)}
              />
              <Typography
                sx={{
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Weekends
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
              }}
            >
              <input
                type='checkbox'
                checked={weekdays}
                onChange={e => setWeekdays(e.target.checked)}
              />
              <Typography
                sx={{
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Weekdays
              </Typography>
            </Box>
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
          </Grid>

          <Grid
            sx={{
              display: 'flex',
              gap: '50px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {!weekdays && !weekends && (
              <>
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
                  <Typography>Month wise statistics</Typography>
                  <Bar options={options} data={monthlyStatsData} />
                  <Box>
                    <Typography mb='5px'>Average year wise revenues</Typography>
                    <Grid
                      sx={{
                        border: '1px solid black',
                        width: 'fit-content',
                        padding: '10px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                      }}
                    >
                      {monthsRevenues.map(data => (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <Typography>{data.year}:</Typography>
                          <Typography>
                            {Math.round(data.amount * 100) / 100}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  </Box>
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
                  <Typography>Quarter wise statistics</Typography>
                  <Bar options={options} data={quarterlyStatsData} />
                  <Box>
                    <Typography mb='5px'>Average year wise revenues</Typography>
                    <Grid
                      sx={{
                        border: '1px solid black',
                        width: 'fit-content',
                        padding: '10px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                      }}
                    >
                      {quartersRevenues.map(data => (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <Typography>{data.year}:</Typography>
                          <Typography>
                            {Math.round(data.amount * 100) / 100}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  </Box>
                </Box>
                <Box
                  minWidth='600px'
                  maxHeight='500px'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <div><button className="btn-get-details" onClick={handleGetDetailsClick}>GET DETAILS</button></div>
                </Box>
                {/* <Box
                  minWidth='600px'
                  maxHeight='500px'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <Typography>Quarterly Freebies Added</Typography>
                  <Bar options={options} data={quarterlyAddedFreebiesData} />
                </Box> */}
                {/* <Box
                  minWidth='600px'
                  maxHeight='500px'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <Typography>Monthly Average Freebies Added</Typography>
                  <Bar options={options} data={monthlyAvgAddedFreebiesData} />
                </Box> */}
              </>
            )}
            {(weekdays || weekends) && (
              <>
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
                  <Typography>Cumulative of all months</Typography>
                  <Bar options={options} data={cumulativeWeekData} />
                </Box>
                {months && (
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
                    <Typography>Weekwise statistics</Typography>
                    <Line options={options} data={weekwiseData} />
                  </Box>
                )}
                {quarters && (
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
                    <Typography>Quarter wise statistics</Typography>
                    <Bar options={options} data={quarterWiseData} />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </>
      ) : page === 1 ? (
        <UserBase />
      ) : (
        // <CustomerBase />
        <PlayerBase />
      )}
    </Grid>
  );
  
};

export default Stats;
