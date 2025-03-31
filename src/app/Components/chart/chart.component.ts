import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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
  displayArray: any[] = [];

  ngOnInit(): void {
    this.wsService.connect(environment.wsUrl);
    this.wsService.onMessage().subscribe((data) => {
      this.displayArray.push(data);
      this.updateChart(); // Update chart whenever new data is received
    });
    this.initChart();
  }

  constructor(private wsService: WebSocketService, private http: HttpClient) {}

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

  updateChart(): void {
    const maxDataPoints = 20; // Limit the number of data points displayed
    const now = new Date();
    const timeLabel = now.toLocaleTimeString().slice(0, 8);

    this.labels.push(timeLabel);
    this.data.push(this.displayArray[this.displayArray.length - 1]);

    if (this.labels.length > maxDataPoints) {
      this.labels.shift();
      this.data.shift();
    }
    console.log(this.labels, this.data);
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
    this.http
      .get<{ status: string; data: { timestamp: string; value: number }[] }>(
        `${environment.apiUrl}/bpm-data/days`
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.dayData = response.data.map((item) => ({
              time: new Date(item.timestamp).toLocaleTimeString(),
              value: item.value,
            }));
            this.initDayChart();
          } else {
            console.error('Unexpected response status:', response.status);
          }
        },
        error: (err) => {
          console.error('Failed to load day data', err);
        },
      });
  }

  loadMonthData(): void {
    this.http
      .get<{ status: string; data: { timestamp: string; value: number }[] }>(
        `${environment.apiUrl}/bpm-data/month`
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.monthData = response.data.map((item) => ({
              date: new Date(item.timestamp).toLocaleDateString(),
              value: item.value,
            }));
            this.initMonthChart();
          } else {
            console.error('Unexpected response status:', response.status);
          }
        },
        error: (err) => {
          console.error('Failed to load month data', err);
        },
      });
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
