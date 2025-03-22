import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  imports: [IonContent, NgxEchartsModule, CommonModule],
})
export class ChartComponent implements OnInit {
  chartOption: EChartsOption = {};
  intervalId: any;
  data: number[] = [];
  labels: string[] = [];
  activeTab: 'live' | 'day' | 'month' = 'live';
  dayData: any[] = []; // Placeholder for day data
  monthData: any[] = []; // Placeholder for month data
  dayChartOption: EChartsOption = {};
  monthChartOption: EChartsOption = {};

  ngOnInit(): void {
    this.initChart();
    this.startSimulation();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  initChart(): void {
    this.chartOption = {
      title: {
        text: 'Real-Time Heart Rate',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: this.labels,
        name: 'Time',
      },
      yAxis: {
        type: 'value',
        name: 'BPM',
        min: 0, // Adjusted to fit ECG pattern
        max: 30, // Adjusted to fit ECG pattern
      },
      series: [
        {
          name: 'Heart Rate',
          type: 'line',
          data: this.data,
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#ff4d4f',
          },
          showSymbol: false,
        },
      ],
      animation: false,
    };
  }

  startSimulation(): void {
    const ecgPattern = [10, 25, 10, 5, 10, 20, 10, 15, 10]; // Adjusted to fit yAxis range
    let patternIndex = 0;

    this.intervalId = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString().slice(0, 8);
      const newBPM = ecgPattern[patternIndex];

      this.labels.push(timeLabel);
      this.data.push(newBPM);

      if (this.labels.length > 20) {
        this.labels.shift();
        this.data.shift();
      }

      this.chartOption = {
        ...this.chartOption,
        xAxis: {
          ...(this.chartOption.xAxis as any),
          data: this.labels,
        },
        series: [
          {
            name: 'Heart Rate',
            type: 'line',
            data: this.data,
            smooth: true, // Disable smoothing for sharp peaks
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              color: '#ff4d4f',
            },
            showSymbol: false,
          },
        ],
      };

      patternIndex = (patternIndex + 1) % ecgPattern.length; // Loop through the pattern
    }, 200); // Faster interval for ECG-like animation
  }

  switchTab(tab: 'live' | 'day' | 'month'): void {
    this.activeTab = tab;
    if (tab === 'day') {
      this.loadDayData();
      this.initDayChart();
    } else if (tab === 'month') {
      this.loadMonthData();
      this.initMonthChart();
    }
  }

  loadDayData(): void {
    this.dayData = [
      { time: '08:00', value: 72 },
      { time: '09:00', value: 74 },
      { time: '10:00', value: 76 },
      { time: '11:00', value: 50 },
      { time: '12:00', value: 75 },
      { time: '13:00', value: 73 },
      { time: '14:00', value: 72 },
      { time: '15:00', value: 71 },
      { time: '16:00', value: 80 },
      { time: '17:00', value: 72 },
    ];
  }

  loadMonthData(): void {
    this.monthData = [
      { date: '2023-10-01', value: 72 },
      { date: '2023-10-02', value: 74 },
      { date: '2023-10-03', value: 73 },
      { date: '2023-10-04', value: 85 },
      { date: '2023-10-05', value: 76 },
      { date: '2023-10-06', value: 74 },
      { date: '2023-10-07', value: 42 },
      { date: '2023-10-08', value: 71 },
      { date: '2023-10-09', value: 73 },
      { date: '2023-10-10', value: 74 },
    ];
  }

  getStatus(value: number): string {
    if (value < 70) {
      return 'Low';
    } else if (value >= 70 && value <= 75) {
      return 'Normal';
    } else {
      return 'High';
    }
  }

  getStatusBgColor(status: string): string {
    switch (status) {
      case 'Low':
        return 'bg-red-500 text-white';
      case 'Normal':
        return 'bg-green-500 text-white';
      case 'High':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  }

  initDayChart(): void {
    const dayLabels = this.dayData.map((item) => item.time);
    const dayValues = this.dayData.map((item) => item.value);
    this.dayChartOption = {
      title: {
        text: 'Day Heart Rate',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: dayLabels,
        name: 'Time',
      },
      yAxis: {
        type: 'value',
        name: 'BPM',
        min: 0,
        max: 100,
      },
      series: [
        {
          name: 'Heart Rate',
          type: 'line',
          data: dayValues,
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#ff4d4f',
          },
          showSymbol: false,
        },
      ],
    };
  }

  initMonthChart(): void {
    const monthLabels = this.monthData.map((item) => item.date);
    const monthValues = this.monthData.map((item) => item.value);
    this.monthChartOption = {
      title: {
        text: 'Month Heart Rate',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: monthLabels,
        name: 'Date',
      },
      yAxis: {
        type: 'value',
        name: 'BPM',
        min: 0,
        max: 100,
      },
      series: [
        {
          name: 'Heart Rate',
          type: 'line',
          data: monthValues,
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#ff4d4f',
          },
          showSymbol: false,
        },
      ],
    };
  }
}
