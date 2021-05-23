import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatDuration, getCostByType, getTimeSpend, getTypeAmount, makeItemsUniq} from '../utils/statistics.js';
import {StatisticsSettings} from '../const.js';

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, events) => {
  const eventsTypes = events.map((event) => event.type);
  const uniqTypes = makeItemsUniq(eventsTypes);
  const uniqPrices = uniqTypes.map((type) => getCostByType(events, type));

  moneyCtx.height = BAR_HEIGHT * 5;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: StatisticsSettings.TYPE,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: uniqPrices,
        backgroundColor: StatisticsSettings.BACKGROUND_COLOR,
        hoverBackgroundColor: StatisticsSettings.HOVER_BACKGROUND_COLOR,
        anchor: StatisticsSettings.ANCHOR.START,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: StatisticsSettings.FONT_SIZE,
          },
          color: StatisticsSettings.COLOR,
          anchor: StatisticsSettings.ANCHOR.END,
          align: StatisticsSettings.ALIGN.START,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: StatisticsSettings.HEADING.MONEY,
        fontColor: StatisticsSettings.FONT_COLOR,
        fontSize: StatisticsSettings.TITLE_FONT_SIZE,
        position: StatisticsSettings.POSITION.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: StatisticsSettings.FONT_COLOR,
            padding: StatisticsSettings.PADDING,
            fontSize: StatisticsSettings.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: StatisticsSettings.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: StatisticsSettings.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, events) => {
  const eventsTypes = events.map((event) => event.type);
  const uniqTypes = makeItemsUniq(eventsTypes);
  const typesAmount = uniqTypes.map((type) => getTypeAmount(events, type));


  typeCtx.height = BAR_HEIGHT * 5;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: StatisticsSettings.TYPE,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: typesAmount,
        backgroundColor: StatisticsSettings.BACKGROUND_COLOR,
        hoverBackgroundColor: StatisticsSettings.HOVER_BACKGROUND_COLOR,
        anchor: StatisticsSettings.ANCHOR,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: StatisticsSettings.FONT_SIZE,
          },
          color: StatisticsSettings.COLOR,
          anchor: StatisticsSettings.ANCHOR.END,
          align: StatisticsSettings.ALIGN.START,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: StatisticsSettings.HEADING.TYPE,
        fontColor: StatisticsSettings.FONT_COLOR,
        fontSize: StatisticsSettings.TITLE_FONT_SIZE,
        position: StatisticsSettings.POSITION.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: StatisticsSettings.FONT_COLOR,
            padding: StatisticsSettings.PADDING,
            fontSize: StatisticsSettings.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: StatisticsSettings.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: StatisticsSettings.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTmeChart = (timeCtx, events) => {
  const eventsTypes = events.map((event) => event.type);
  const uniqTypes = makeItemsUniq(eventsTypes);
  const timeSpend = uniqTypes.map((type) => getTimeSpend(events, type));

  timeCtx.height = BAR_HEIGHT * 5;

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: StatisticsSettings.TYPE,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: timeSpend,
        backgroundColor: StatisticsSettings.BACKGROUND_COLOR,
        hoverBackgroundColor: StatisticsSettings.HOVER_BACKGROUND_COLOR,
        anchor: StatisticsSettings.ANCHOR,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: StatisticsSettings.FONT_SIZE,
          },
          color: StatisticsSettings.COLOR,
          anchor: StatisticsSettings.ANCHOR.END,
          align: StatisticsSettings.ALIGN.START,
          formatter: (val) => `${formatDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: StatisticsSettings.HEADING.TYPE,
        fontColor: StatisticsSettings.FONT_COLOR,
        fontSize: StatisticsSettings.TITLE_FONT_SIZE,
        position: StatisticsSettings.POSITION.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: StatisticsSettings.FONT_COLOR,
            padding: StatisticsSettings.PADDING,
            fontSize: StatisticsSettings.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: StatisticsSettings.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: StatisticsSettings.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createStatisticsTemplate = () => {
  return `<section class="statistics">
            <h2 class="visually-hidden">Trip statistics</h2>

            <div class="statistics__item statistics__item--money">
              <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--transport">
              <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--time-spend">
              <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
            </div>
          </section>`;
};

export default class Statistics extends SmartView {
  constructor(events) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._typeChart = renderTypeChart(typeCtx, this._events);
    this._timeChart = renderTmeChart(timeCtx, this._events);
  }
}
